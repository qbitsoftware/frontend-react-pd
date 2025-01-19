import { createFileRoute, useRouter } from '@tanstack/react-router'
import { MoreHorizontal, Pencil, Trash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useState, useEffect } from 'react'
import { ErrorResponse, Participant, UserNew } from '@/types/types'
import { UseDeleteParticipant, UseGetParticipants, UseCreateParticipants, UseUpdateParticipant } from '@/queries/participants'
import { UseGetTournament } from '@/queries/tournaments'
import ErrorPage from '@/components/error'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useToast } from '@/hooks/use-toast'
import { useToastNotification } from '@/components/toast-notification'
import { capitalize, useDebounce } from '@/lib/utils'
import { Input } from "@/components/ui/input"
import { UseGetUsersDebounce, fetchUserByName } from '@/queries/users'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

export const Route = createFileRoute(
    '/admin/tournaments/$tournamentid/participants/',
)({
    component: RouteComponent,
    loader: async ({ context: { queryClient }, params }) => {
        let participants;
        let tournamentData;
        try {
            participants = await queryClient.ensureQueryData(
                UseGetParticipants(Number(params.tournamentid)),
            )
        } catch (error) {
            const err = error as ErrorResponse
            if (err.response.status !== 404) {
                console.log("JOu meil on error")
                throw error
            }
        }
        try {
            tournamentData = await queryClient.ensureQueryData(
                UseGetTournament(Number(params.tournamentid)),
            )
        } catch (error) {
            const err = error as ErrorResponse
            if (err.response.status !== 404) {
                console.log("JOu meil on error")
                throw error
            }
        }
        return { participants, tournamentData }
    },
})

const participantSchema = z.object({
    name: z.string().min(1, 'Participant name is required'),
    tournament_id: z.number().min(1),
    sport_type: z.string().default('tabletennis'),
    players: z.array(z.object({
        id: z.string().optional(),
        user_id: z.number().optional(),
        first_name: z.string().optional(),
        last_name: z.string().optional(),
        name: z.string().min(1, 'Player name is required'),
        sport_type: z.string().default('tabletennis'),
        extra_data: z.object({
            rate_order: z.number().min(0, 'Rating number is required'),
            club: z.string().optional(),
            rate_points: z.number().min(1, 'placement is required'),
            eltl_id: z.number().min(0, 'eltl id is required'),
        }),
        sex: z.string().optional(),
        number: z.number().optional(),
    })).min(1, "Participant must have at least one player"),
})

type ParticipantFormValues = z.infer<typeof participantSchema>

function RouteComponent() {
    const { tournamentid } = Route.useParams()
    const { participants, tournamentData } = Route.useLoaderData()
    if (!tournamentData || !tournamentData.data) {
        return
    }

    const [isAddParticipantOpen, setIsAddParticipantOpen] = useState(false)
    const [editParticipantData, setEditParticipantData] = useState<Participant | undefined>()
    const deleteMutation = UseDeleteParticipant(Number(tournamentid))
    const createParticipant = UseCreateParticipants(Number(tournamentid))
    const updateParticipant = UseUpdateParticipant(Number(tournamentid), editParticipantData?.id!)

    const toast = useToast()
    const router = useRouter()
    const { successToast, errorToast } = useToastNotification(toast)

    const [searchTerm, setSearchTerm] = useState('')
    const debouncedSearchTerm = useDebounce(searchTerm, 300)

    const { data: playerSuggestions, refetch } = UseGetUsersDebounce(debouncedSearchTerm)
    const [focusedField, setFocusedField] = useState<string | null>(null)

    const form = useForm<ParticipantFormValues>({
        resolver: zodResolver(participantSchema),
        defaultValues: {
            name: '',
            tournament_id: Number(tournamentid),
            players: [{ name: '', first_name: '', last_name: '', user_id: 0, sport_type: 'tabletennis', sex: '', number: 0 }],
        }
    })

    useEffect(() => {
        if (debouncedSearchTerm) {
            refetch()
        }
    }, [debouncedSearchTerm, refetch])

    const handleDeleteParticipant = async (participantId: string) => {
        try {
            const res = await deleteMutation.mutateAsync(participantId)
            router.navigate({
                to: `/admin/tournaments/${tournamentid}/participants`
            })
            successToast(res.message)
        } catch (error) {
            errorToast("Osaleja kustutamisel tekkis viga")
        }
    }

    const handleEditParticipant = (participant: Participant) => {
        setEditParticipantData(participant)
        form.reset({
            name: participant.name,
            tournament_id: Number(tournamentid),
            sport_type: participant.sport_type || 'tabletennis',
            players: participant.players.map(player => ({
                id: player.id,
                user_id: player.user_id,
                first_name: player.first_name,
                last_name: player.last_name,
                name: `${player.first_name} ${player.last_name}`,
                sport_type: player.sport_type || 'tabletennis',
                sex: player.sex,
                number: player.number,
            }))
        })
        setIsAddParticipantOpen(true)
    }

    const handleAddParticipant = async (values: ParticipantFormValues) => {
        try {
            for (const player of values.players) {
                if (player.user_id === 0 || !player.user_id) {
                    const user = await fetchUserByName(player.name)
                    if (user) {
                        player.first_name = user.first_name
                        player.last_name = user.last_name
                        player.user_id = user.id
                    } else {
                        const names = player.name.split(" ")
                        player.first_name = names.slice(0, -1).join(" ")
                        player.last_name = names[names.length - 1]
                    }
                }
            }

            if (editParticipantData) {
                await updateParticipant.mutateAsync(values)
                successToast("Participant updated successfully")
            } else {
                await createParticipant.mutateAsync(values)
                successToast("Participant added successfully")
            }

            router.navigate({
                to: `/admin/tournaments/${tournamentid}/participants`
            })
            setIsAddParticipantOpen(false)
            form.reset()
        } catch (error) {
            errorToast(`Error ${editParticipantData ? 'updating' : 'adding'} participant: ${error}`)
        }
    }

    const setFormValues = (user: UserNew) => {
        form.setValue('players.0.name', `${capitalize(user.first_name)} ${capitalize(user.last_name)}`)
        form.setValue('players.0.first_name', user.first_name)
        form.setValue('players.0.last_name', user.last_name)
        form.setValue('players.0.user_id', user.id)
        form.setValue('players.0.extra_data.rate_order', user.rate_order)
        form.setValue('players.0.sex', user.sex)
        form.setValue('players.0.extra_data.club', user.club_name)
        form.setValue('players.0.extra_data.eltl_id', user.eltl_id)
        form.setValue('players.0.extra_data.rate_points', user.rate_points)
        if (tournamentData.data?.solo) {
            form.setValue('name', `${user.first_name} ${user.last_name}`)
        }
    }

    if (tournamentData && tournamentData.data) {
        return (
            <div className="container py-6 space-y-6">
                <Tabs defaultValue="participants">
                    <TabsContent value="participants">
                        <Card>
                            <CardHeader>
                                <CardTitle>Registered Participants</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            {tournamentData.data && tournamentData.data.solo ? (
                                                <>
                                                    <TableHead>JKNR.</TableHead>
                                                    <TableHead>Nimi</TableHead>
                                                    <TableHead>Rank</TableHead>
                                                    <TableHead>Sugu</TableHead>
                                                    <TableHead>Klubi</TableHead>
                                                    <TableHead>ELTL ID</TableHead>
                                                    <TableHead>Koht Reitingus</TableHead>
                                                    <TableHead>Klass</TableHead>
                                                    <TableHead>Actions</TableHead>
                                                </>
                                            ) : (
                                                <>
                                                    <TableHead>Name</TableHead>
                                                    <TableHead>Participants</TableHead>
                                                    <TableHead>Sport</TableHead>
                                                    <TableHead>Actions</TableHead>
                                                </>
                                            )}
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {participants && participants.data && participants.data.map((participant, idx) => (
                                            <TableRow key={participant.id} className='py-0'>
                                                {tournamentData.data && tournamentData.data.solo ? (
                                                    <>
                                                        <TableCell>{idx + 1}</TableCell>
                                                        <TableCell className="font-medium">{capitalize(participant.name)}</TableCell>
                                                        <TableCell>{participant.players[0].rate_points}</TableCell>
                                                        <TableCell>{participant.players[0].sex}</TableCell>
                                                        <TableCell>{participant.players[0].club}</TableCell>
                                                        <TableCell>{participant.players[0].eltl_id}</TableCell>
                                                        <TableCell>{participant.players[0].rate_order}</TableCell>
                                                        <TableCell>{"Vanus 20-24"}</TableCell>
                                                    </>
                                                ) : (
                                                    <>
                                                        <TableCell className="font-medium">{capitalize(participant.name)}</TableCell>
                                                        <TableCell>{participant.players.length}</TableCell>
                                                        <TableCell>{participant.sport_type}</TableCell>
                                                    </>
                                                )}
                                                <TableCell>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="sm">
                                                                <MoreHorizontal className="w-4 h-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent>
                                                            <DropdownMenuItem onClick={() => handleEditParticipant(participant)}>
                                                                <Pencil className="w-4 h-4 mr-2" />
                                                                Edit
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleDeleteParticipant(participant.id)}>
                                                                <Trash className="w-4 h-4 mr-2" />
                                                                Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        <TableRow>
                                            {tournamentData.data && tournamentData.data.solo ? (
                                                <>
                                                    <TableCell>{(participants && participants.data ? participants.data.length : 0) + 1}</TableCell>
                                                    <TableCell>
                                                        <Input
                                                            type="text"
                                                            {...form.register('players.0.name')}
                                                            onChange={(e) => {
                                                                form.setValue('players.0.name', e.target.value)
                                                                setSearchTerm(e.target.value)
                                                                if (tournamentData.data?.solo) {
                                                                    form.setValue('name', e.target.value)
                                                                }
                                                            }}
                                                            autoComplete='off'
                                                            onFocus={() => setFocusedField('name')}
                                                            onBlur={() => setTimeout(() => setFocusedField(null), 200)}
                                                            placeholder="New participant name"
                                                        />
                                                        {focusedField === 'name' && playerSuggestions && playerSuggestions.data && playerSuggestions.data.length > 0 && (
                                                            <div className="absolute w-full mt-1 py-1 bg-background border rounded-md shadow-lg z-10">
                                                                {playerSuggestions.data.map((user, i) => (
                                                                    <div
                                                                        key={i}
                                                                        className="px-3 py-2 cursor-pointer hover:bg-accent"
                                                                        onClick={() => setFormValues(user)}
                                                                    >
                                                                        {capitalize(user.first_name)} {capitalize(user.last_name)}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Input
                                                            type="text"
                                                            {...form.register('players.0.extra_data.rate_points')}
                                                            placeholder="Rank"
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Input
                                                            type="text"
                                                            {...form.register('players.0.sex')}
                                                            placeholder="Sugu"
                                                            disabled
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Input
                                                            type="text"
                                                            {...form.register('players.0.extra_data.club')}
                                                            placeholder="Klubi"
                                                            disabled
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Input
                                                            type="text"
                                                            {...form.register('players.0.extra_data.eltl_id')}
                                                            placeholder="ID"
                                                            disabled
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Input
                                                            type="text"
                                                            {...form.register('players.0.extra_data.rate_order')}
                                                            placeholder="Koht Reitingus"
                                                            disabled
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Input
                                                            type="text"
                                                            placeholder="Klass"
                                                            disabled
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Button onClick={form.handleSubmit(handleAddParticipant)}>Add Participant</Button>
                                                    </TableCell>
                                                </>
                                            ) : (
                                                <>
                                                    <TableCell className="relative">
                                                        <Input
                                                            type="text"
                                                            {...form.register('name')}
                                                            onChange={(e) => {
                                                                form.setValue('name', e.target.value)
                                                                setSearchTerm(e.target.value)
                                                            }}
                                                            onFocus={() => setFocusedField('name')}
                                                            onBlur={() => setTimeout(() => setFocusedField(null), 200)}
                                                            placeholder="New team name"
                                                        />
                                                        {focusedField === 'name' && playerSuggestions && playerSuggestions.data && playerSuggestions.data.length > 0 && (
                                                            <div className="absolute w-full mt-1 py-1 bg-background border rounded-md shadow-lg z-10">
                                                                {playerSuggestions.data.map((user, i) => (
                                                                    <div
                                                                        key={i}
                                                                        className="px-3 py-2 cursor-pointer hover:bg-accent"
                                                                        onClick={() => setFormValues(user)}
                                                                    >
                                                                        {capitalize(user.first_name)} {capitalize(user.last_name)}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Input
                                                            type="number"
                                                            {...form.register('players.0.number')}
                                                            placeholder="Number of participants"
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Input
                                                            type="text"
                                                            {...form.register('sport_type')}
                                                            placeholder="Sport type"
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Button onClick={form.handleSubmit(handleAddParticipant)}>Add Team</Button>
                                                    </TableCell>
                                                </>
                                            )}
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        )
    } else {
        return <ErrorPage error={new Error("Tournament not found")} reset={() => { }} />
    }
}

