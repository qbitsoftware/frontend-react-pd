import { createFileRoute, useNavigate, useRouter } from '@tanstack/react-router'
import { ArrowLeft, Eye, MoreHorizontal, Pencil, Trash, UserPlus, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useState } from 'react'
import { ErrorResponse, Participant } from '@/types/types'
import { UseDeleteParticipant, UseGetParticipants } from '@/queries/participants'
import { UseGetTournament } from '@/queries/tournaments'
import ErrorPage from '@/components/error'
import { Tournament } from '@/types/types'
import AddTeamDialog from '../-components/participant-form'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useToast } from '@/hooks/use-toast'
import { useToastNotification } from '@/components/toast-notification'
import { capitalize } from '@/lib/utils'


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

function RouteComponent() {
    const { tournamentid } = Route.useParams()
    const { participants, tournamentData } = Route.useLoaderData()

    const [isAddParticipantOpen, setIsAddParticipantOpen] = useState(false)

    const [editParticipantData, setEditParticipantData] = useState<Participant | undefined>()
    const deleteMutation = UseDeleteParticipant(Number(tournamentid))

    const toast = useToast()
    const router = useRouter()
    const { successToast, errorToast } = useToastNotification(toast)

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
        console.log(`Delete participant with ID: ${participantId}`)
    }


    const handleEditParticipant = (participant: Participant) => {
        setEditParticipantData(participant)
        setIsAddParticipantOpen(true)
    }


    const handleViewParticipant = (participantId: string) => {
        // Implement view functionality here
        console.log(`View participant with ID: ${participantId}`)
    }

    const handleAddNewTeam = () => {
        setEditParticipantData(undefined)
        setIsAddParticipantOpen(true)
    }

    if (participants && participants.data && tournamentData && tournamentData.data) {
        return (
            <div className="container py-6 space-y-6">
                <ParticipantHeader
                    tournamentData={tournamentData.data}
                    setIsAddParticipantOpen={handleAddNewTeam}
                />
                <Tabs defaultValue="participants">
                    <TabsList>
                        <TabsTrigger value="participants">
                            <Users className="w-4 h-4 mr-2" />
                            Participants
                        </TabsTrigger>
                    </TabsList>

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
                                                    <TableHead>First Name</TableHead>
                                                    <TableHead>Last Name</TableHead>
                                                    <TableHead>Rank</TableHead>
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
                                        {participants.data.map((participant) => (
                                            <TableRow key={participant.id}>
                                                {tournamentData.data && tournamentData.data.solo ? (
                                                    <>
                                                        <TableCell className="font-medium">{capitalize(participant.players[0].first_name)}</TableCell>
                                                        <TableCell className="font-medium">{capitalize(participant.players[0].last_name)}</TableCell>
                                                        <TableCell>{participant.rank}</TableCell>
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
                                                            {/* <DropdownMenuItem onClick={() => handleViewParticipant(participant.id)}>
                                                                <Eye className="w-4 h-4 mr-2" />
                                                                View
                                                            </DropdownMenuItem> */}
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                <AddTeamDialog
                    open={isAddParticipantOpen}
                    onOpenChange={setIsAddParticipantOpen}
                    tournament={tournamentData.data}
                    initialData={editParticipantData}
                />
            </div>
        )
    } else {
        if (tournamentData && tournamentData.data) {
            return (
                <div className="container py-6 space-y-6">
                    <ParticipantHeader
                        tournamentData={tournamentData.data}
                        setIsAddParticipantOpen={handleAddNewTeam}
                    />
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <Users className="w-12 h-12 text-gray-400 mb-4" />
                            <h2 className="text-xl font-semibold text-gray-600 mb-2">No Participants Yet</h2>
                            <p className="text-gray-500 text-center mb-4">No participants have registered for this tournament yet.</p>
                        </CardContent>
                    </Card>

                    <AddTeamDialog
                        initialData={editParticipantData}
                        open={isAddParticipantOpen}
                        onOpenChange={setIsAddParticipantOpen}
                        tournament={tournamentData.data}
                    />
                </div>
            )
        } else {
            return <ErrorPage error={new Error("Tournament not found")} reset={() => { }} />
        }
    }

}

function ParticipantHeader({ tournamentData, setIsAddParticipantOpen }: { tournamentData: Tournament, setIsAddParticipantOpen: (open: boolean) => void }) {
    const navigate = useNavigate()
    return (
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/admin/tournaments' })}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold">Manage Participants</h1>
                    <p className="text-sm text-gray-500">{tournamentData.name}</p>
                </div>
            </div>
            <Button onClick={
                () => { setIsAddParticipantOpen(true) }}>
                <UserPlus className="w-4 h-4 mr-2" />
                Add Participant
            </Button>
        </div>
    )
}