import { useNavigate, useRouter } from "@tanstack/react-router"
import { MoreHorizontal, Pencil, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { useState, useEffect } from "react"
import type { Participant, Tournament, TournamentTable, UserNew } from "@/types/types"
import {
    UseDeleteParticipant,
    UseCreateParticipants,
    UseUpdateParticipant,
    UsePostOrder,
} from "@/queries/participants"
import ErrorPage from "@/components/error"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { useToastNotification } from "@/components/toast-notification"
import { capitalize, useDebounce } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { UseGetUsersDebounce } from "@/queries/users"
import { z } from "zod"
import { useForm, UseFormReturn } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ParticipantFormProps {
    participants: Participant[] | null
    tournament_data: Tournament
    table_data: TournamentTable
}

const participantSchema = z.object({
    name: z.string().min(1, "Participant name is required"),
    order: z.number().optional(),
    tournament_id: z.number().min(1),
    sport_type: z.string().default("tabletennis"),
    players: z
        .array(
            z.object({
                id: z.string().optional(),
                user_id: z.number().optional(),
                first_name: z.string().optional(),
                last_name: z.string().optional(),
                name: z.string(),
                sport_type: z.string().default("tabletennis"),
                extra_data: z.object({
                    rate_order: z.number().min(0, "Rating number is required").optional(),
                    club: z.string().optional(),
                    rate_points: z.number(),
                    eltl_id: z.number().min(0, "eltl id is required").optional(),
                    class: z.string().optional(),
                }),
                sex: z.string().optional(),
                number: z.number().optional(),
            }),
        ),
    class: z.string().optional(),
})

export type ParticipantFormValues = z.infer<typeof participantSchema>

export const ParticipanForm: React.FC<ParticipantFormProps> = ({ participants, tournament_data, table_data }) => {
    const [selectedOrderValue, setSelectedOrderValue] = useState<string | undefined>()
    const navigate = useNavigate()
    const router = useRouter()
    const toast = useToast()
    const { successToast, errorToast } = useToastNotification(toast)
    const deleteMutation = UseDeleteParticipant(tournament_data.id, table_data.id)
    const createParticipant = UseCreateParticipants(tournament_data.id, table_data.id)
    const updateParticipant = UseUpdateParticipant(tournament_data.id, table_data.id)
    const updateOrdering = UsePostOrder(tournament_data.id, table_data.id)

    const [searchTerm, setSearchTerm] = useState("")
    const debouncedSearchTerm = useDebounce(searchTerm, 300)

    const { data: playerSuggestions, refetch } = UseGetUsersDebounce(debouncedSearchTerm)
    const [focusedField, setFocusedField] = useState<string | null>(null)

    const form = useForm<ParticipantFormValues>({
        resolver: zodResolver(participantSchema),
        defaultValues: {
            name: "",
            tournament_id: Number(tournament_data.id),
            sport_type: "tabletennis",
            players: [],
        },
    })

    const editForm = useForm<ParticipantFormValues>({
        resolver: zodResolver(participantSchema),
    })

    const [editingParticipant, setEditingParticipant] = useState<Participant | null>(null)

    const handleOrder = async (order: string | undefined) => {
        if (!order) {
            return
        }
        try {
            const res = await updateOrdering.mutateAsync({ order })
            navigate({
                to: `/admin/tournaments/${tournament_data.id}/grupid/${table_data.id}/osalejad`,
                replace: true,
            })
            successToast(res.message)
        } catch (error) {
            console.log(error)
        }
    }


    useEffect(() => {
        if (debouncedSearchTerm) {
            refetch()
        }
    }, [debouncedSearchTerm, refetch])

    const handleDeleteParticipant = async (participantId: string) => {
        try {
            const res = await deleteMutation.mutateAsync(participantId)
            router.navigate({
                to: `/admin/tournaments/${tournament_data.id}/grupid/${table_data.id}/osalejad`,
            })
            successToast(res.message)
        } catch (error) {
            errorToast("Osaleja kustutamisel tekkis viga")
        }
    }

    const handleEditParticipant = (participant: Participant) => {
        setEditingParticipant(participant)
        editForm.reset({
            name: participant.name,
            order: participant.order,
            tournament_id: tournament_data.id,
            class: participant.extra_data.class,
            sport_type: participant.sport_type || "tabletennis",
            players: participant.players.map((player) => ({
                id: player.id,
                user_id: player.user_id,
                first_name: player.first_name,
                last_name: player.last_name,
                name: `${player.first_name} ${player.last_name}`,
                sport_type: player.sport_type || "tabletennis",
                sex: player.sex,
                number: player.number,
                extra_data: {
                    rate_order: player.extra_data.rate_order,
                    club: player.extra_data.club,
                    rate_points: player.extra_data.rate_points,
                    eltl_id: player.extra_data.eltl_id,
                    class: player.extra_data.class,
                },
            })),
        })
    }

    const handleAddOrUpdateParticipant = async (values: ParticipantFormValues, participantId?: string) => {
        console.log("Values", values)
        try {
            if (participantId) {
                await updateParticipant.mutateAsync({ formData: values, participantId })
                successToast("Participant updated successfully")
                setEditingParticipant(null)
            } else {
                await createParticipant.mutateAsync(values)
                successToast("Participant added successfully")
            }

            form.resetField("players")

            form.reset({
                name: "",
                tournament_id: Number(tournament_data.id),
                class: "",
                sport_type: "tabletennis",
                players: [{ name: "", user_id: 0, first_name: "", last_name: "", sport_type: "tabletennis", sex: "", extra_data: { rate_order: 0, club: "", rate_points: 0, eltl_id: 0, class: "" } }],
            }, { keepValues: false })

            console.log(form.getValues())

            router.navigate({
                to: `/admin/tournaments/${tournament_data.id}/grupid/${table_data.id}/osalejad`,
            })
        } catch (error) {
            errorToast(`Error ${participantId ? "updating" : "adding"} participant: ${error}`)
        }
    }


    const setFormValues = (user: UserNew, form: UseFormReturn<ParticipantFormValues>) => {
        form.setValue("players.0.name", `${capitalize(user.first_name)} ${capitalize(user.last_name)}`)
        form.setValue("players.0.first_name", user.first_name)
        form.setValue("players.0.last_name", user.last_name)
        form.setValue("players.0.user_id", user.id)
        form.setValue("players.0.extra_data.rate_order", user.rate_order)
        form.setValue("players.0.sex", user.sex)
        form.setValue("players.0.extra_data.club", user.club_name)
        form.setValue("players.0.extra_data.eltl_id", user.eltl_id)
        form.setValue("players.0.extra_data.rate_points", user.rate_points)
        if (table_data.solo) {
            form.setValue("name", `${user.first_name} ${user.last_name}`)
        }
    }

    const [activeTeamForPlayer, setActiveTeamForPlayer] = useState<string | null>(null);


    const handleRemovePlayer = async (teamId: string, playerIndex: number) => {
        const team = participants?.find(p => p.id === teamId);
        if (!team) return;

        const updatedTeam: ParticipantFormValues = {
            name: team.name,
            tournament_id: team.tournament_id,
            sport_type: team.sport_type || "tabletennis",
            class: team.extra_data?.class,
            players: team.players.map((player) => ({
                id: player.id,
                name: `${player.first_name} ${player.last_name}`,
                sport_type: player.sport_type || "tabletennis",
                first_name: player.first_name,
                last_name: player.last_name,
                user_id: player.user_id,
                sex: player.sex,
                extra_data: {
                    rate_order: player.extra_data.rate_order,
                    club: player.extra_data.club,
                    rate_points: player.extra_data.rate_points,
                    eltl_id: player.extra_data.eltl_id,
                    class: player.extra_data.class
                }
            })).filter((_, index) => index !== playerIndex)
        };

        await handleAddOrUpdateParticipant(updatedTeam, teamId);
    };

    // console.log(form.formState.errors)

    // console.log("Form", form.getValues())
    // console.log("EditForm", editForm.getValues())
    // console.log("FAWF", activeTeamForPlayer)

    if (tournament_data) {
        return (
            <div className="container mx-auto py-6 space-y-6 overflow-x-auto">
                <Card className="overflow-x-auto container">
                    <CardHeader className="">
                        <div className="flex w-[250px] gap-4">
                            <Select onValueChange={setSelectedOrderValue} defaultValue={selectedOrderValue}>
                                <SelectTrigger className="">
                                    <SelectValue placeholder="Järjestus" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="random">Suvaline</SelectItem>
                                    <SelectItem value="rating">Reitingu alusel</SelectItem>
                                    <SelectItem value="regular">Lihtsalt Orderi Jargi</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button disabled={!selectedOrderValue} onClick={() => handleOrder(selectedOrderValue)}>
                                Järjesta
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="overflow-y-scroll">
                        <Table className="overflow-y-scroll">
                            <TableHeader>
                                <TableRow>
                                    {table_data && table_data.solo ? (
                                        <>
                                            <TableHead>JKNR.</TableHead>
                                            <TableHead>Positsioon</TableHead>
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
                                            <TableHead>JKNR.</TableHead>
                                            <TableHead>Positsioon</TableHead>
                                            <TableHead>Meeskond</TableHead>
                                            <TableHead>Nimi</TableHead>
                                            <TableHead>Rank</TableHead>
                                            <TableHead>Sugu</TableHead>
                                            <TableHead>Klubi</TableHead>
                                            <TableHead>ELTL ID</TableHead>
                                            <TableHead>Koht Reitingus</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </>
                                    )}
                                </TableRow>
                            </TableHeader>
                            <TableBody className="">
                                {participants?.map((participant, idx) =>
                                    table_data.solo ? (
                                        <TableRow key={participant.id}>
                                            <TableCell>{idx + 1}</TableCell>
                                            <TableCell>{participant.order}</TableCell>
                                            <TableCell>
                                                {editingParticipant?.id === participant.id ? <div className="">
                                                    <Input
                                                        type="text"
                                                        {...editForm.register("players.0.name")}
                                                        onChange={(e) => {
                                                            editForm.setValue("players.0.name", e.target.value)
                                                            setSearchTerm(e.target.value)
                                                            if (table_data.solo) {
                                                                editForm.setValue("name", e.target.value)
                                                            }
                                                        }}
                                                        className="min-w-[100px] text-sm md:text-base"
                                                        autoComplete="off"
                                                        onFocus={() => setFocusedField("name")}
                                                        onBlur={() => setTimeout(() => setFocusedField(null), 200)}
                                                        placeholder="Nimi"
                                                    />
                                                    {focusedField === "name" &&
                                                        playerSuggestions &&
                                                        playerSuggestions.data &&
                                                        playerSuggestions.data.length > 0 && (
                                                            <div className="absolute w-[200px] h-full max-h-[400px] overflow-x-auto overflow-y-auto mt-1 py-1 bg-background border rounded-md shadow-lg z-10">
                                                                {playerSuggestions.data.map((user, i) => (
                                                                    <div
                                                                        key={i}
                                                                        className="px-3 py-2 cursor-pointer hover:bg-accent"
                                                                        onClick={() => setFormValues(user, editForm)}
                                                                    >
                                                                        {capitalize(user.first_name)} {capitalize(user.last_name)}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                </div>
                                                    : (participant.name)
                                                }
                                            </TableCell>
                                            <TableCell>
                                                {editingParticipant?.id === participant.id ? (
                                                    <Input
                                                        {...editForm.register("players.0.extra_data.rate_points", { valueAsNumber: true })}
                                                        defaultValue={participant.players[0].extra_data.rate_points}
                                                    />
                                                ) : (
                                                    participant.players[0].extra_data.rate_points
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {editingParticipant?.id === participant.id ? (
                                                    <Input
                                                        {...editForm.register("players.0.sex")}
                                                        defaultValue={participant.players[0].sex}
                                                    />
                                                ) : (
                                                    participant.players[0].sex
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {editingParticipant?.id === participant.id ? (
                                                    <Input
                                                        {...editForm.register("players.0.extra_data.club")}
                                                        defaultValue={participant.players[0].extra_data.club}
                                                    />
                                                ) : (
                                                    participant.players[0].extra_data.club
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {editingParticipant?.id === participant.id ? (
                                                    <Input
                                                        {...editForm.register("players.0.extra_data.eltl_id", { valueAsNumber: true })}
                                                        defaultValue={participant.players[0].extra_data.eltl_id}
                                                    />
                                                ) : (
                                                    participant.players[0].extra_data.eltl_id
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {editingParticipant?.id === participant.id ? (
                                                    <Input
                                                        {...editForm.register("players.0.extra_data.rate_order", { valueAsNumber: true })}
                                                        defaultValue={participant.players[0].extra_data.rate_order}
                                                    />
                                                ) : (
                                                    participant.players[0].extra_data.rate_order
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {editingParticipant?.id === participant.id ? (
                                                    <Input
                                                        {...editForm.register("players.0.extra_data.class", { valueAsNumber: false })}
                                                        defaultValue={participant.players[0].extra_data.class}
                                                    />
                                                ) : (
                                                    participant.players[0].extra_data.class
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="sm">
                                                            <MoreHorizontal className="w-4 h-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent>
                                                        {editingParticipant?.id === participant.id ? (
                                                            <DropdownMenuItem onClick={() => handleAddOrUpdateParticipant(editForm.getValues(), participant.id)}>
                                                                <Pencil className="w-4 h-4 mr-2" />
                                                                Save
                                                            </DropdownMenuItem>
                                                        ) : (
                                                            <DropdownMenuItem onClick={() => handleEditParticipant(participant)}>
                                                                <Pencil className="w-4 h-4 mr-2" />
                                                                Edit
                                                            </DropdownMenuItem>
                                                        )}
                                                        <DropdownMenuItem onClick={() => handleDeleteParticipant(participant.id)}>
                                                            <Trash className="w-4 h-4 mr-2" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        <>
                                            <TableRow key={participant.id}>
                                                <TableCell>{idx + 1}</TableCell>
                                                <TableCell>{participant.order}</TableCell>
                                                <TableCell className="font-medium">
                                                    {editingParticipant?.id === participant.id ? (
                                                        <Input {...editForm.register("name")} defaultValue={capitalize(participant.name)} />
                                                    ) : (
                                                        (participant.name)
                                                    )}
                                                </TableCell>
                                                <TableCell colSpan={6}></TableCell>
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
                                                                Edit Team
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleDeleteParticipant(participant.id)}>
                                                                <Trash className="w-4 h-4 mr-2" />
                                                                Delete Team
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>

                                            {participant.players && participant.players.length > 0 && participant.players.map((player, playerIdx) => (
                                                <TableRow key={`${participant.id}-${playerIdx}`} className="bg-muted/50">
                                                    <TableCell></TableCell>
                                                    <TableCell></TableCell>
                                                    <TableCell></TableCell>
                                                    <TableCell className="pl-8">
                                                        {player.first_name} {player.last_name}
                                                    </TableCell>
                                                    <TableCell>{player.extra_data.rate_points}</TableCell>
                                                    <TableCell>{player.sex}</TableCell>
                                                    <TableCell>{player.extra_data.club}</TableCell>
                                                    <TableCell>{player.extra_data.eltl_id}</TableCell>
                                                    <TableCell>{player.extra_data.rate_order}</TableCell>
                                                    <TableCell>
                                                        <Button variant="ghost" size="sm" onClick={() => handleRemovePlayer(participant.id, playerIdx)}>
                                                            <Trash className="w-4 h-4 cursor-pointer" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                            <TableRow className="bg-muted/30">
                                                <TableCell></TableCell>
                                                <TableCell></TableCell>
                                                <TableCell></TableCell>
                                                <TableCell className="pl-8">
                                                    <div className="relative">
                                                        <Input
                                                            type="text"
                                                            value={activeTeamForPlayer == participant.id ? searchTerm : ""}
                                                            onChange={(e) => setSearchTerm(e.target.value)}
                                                            className="min-w-[200px]"
                                                            placeholder="Lisa mängija"
                                                            autoComplete="off"
                                                            onFocus={() => { setFocusedField("name"); setActiveTeamForPlayer(participant.id) }}
                                                            onBlur={() => setTimeout(() => setFocusedField(null), 200)}
                                                        />
                                                        {focusedField === "name" && playerSuggestions && activeTeamForPlayer == participant.id && playerSuggestions.data.length > 0 && (
                                                            <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg">
                                                                {playerSuggestions.data.map((user, i) => (
                                                                    <div
                                                                        key={i}
                                                                        className="px-3 py-2 cursor-pointer hover:bg-accent"
                                                                        onClick={() => {
                                                                            const team = participants.find(p => p.id === participant.id);
                                                                            if (!team) return;
                                                                            const players = team.players || [];
                                                                            form.setValue("players", [
                                                                                ...players,
                                                                                {
                                                                                    name: `${user.first_name} ${user.last_name}`,
                                                                                    sport_type: "tabletennis",
                                                                                    first_name: user.first_name,
                                                                                    last_name: user.last_name,
                                                                                    user_id: user.id || 0,
                                                                                    number: 0,
                                                                                    sex: user.sex || undefined,
                                                                                    extra_data: {
                                                                                        rate_points: user.rate_points || 0,
                                                                                        rate_order: user.rate_order,
                                                                                        club: user.club_name,
                                                                                        eltl_id: user.eltl_id,
                                                                                        class: undefined
                                                                                    }
                                                                                }
                                                                            ]);
                                                                            handleAddOrUpdateParticipant(form.getValues(), participant.id);
                                                                            setActiveTeamForPlayer(null);
                                                                            setSearchTerm("");
                                                                        }}
                                                                    >
                                                                        {capitalize(user.first_name)} {capitalize(user.last_name)}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell></TableCell>
                                                <TableCell colSpan={6}></TableCell>
                                            </TableRow>
                                        </>
                                    )
                                )}
                                <TableRow>
                                    {table_data && table_data.solo ? (
                                        <>
                                            <TableCell>{(participants && participants.length > 0 ? participants.length : 0) + 1}</TableCell>
                                            <TableCell>
                                                <Input disabled className="min-w-[100px] border-none" type="text" />
                                            </TableCell>
                                            <TableCell>
                                                <div className="">
                                                    <Input
                                                        type="text"
                                                        {...form.register("players.0.name")}
                                                        onChange={(e) => {
                                                            form.setValue("players.0.name", e.target.value)
                                                            setSearchTerm(e.target.value)
                                                            if (table_data.solo) {
                                                                form.setValue("name", e.target.value)
                                                            }
                                                        }}
                                                        className="min-w-[100px] text-sm md:text-base"
                                                        autoComplete="off"
                                                        onFocus={() => setFocusedField("name")}
                                                        onBlur={() => setTimeout(() => setFocusedField(null), 200)}
                                                        placeholder="Nimi"
                                                    />
                                                    {focusedField === "name" &&
                                                        playerSuggestions &&
                                                        !editingParticipant &&
                                                        playerSuggestions.data &&
                                                        playerSuggestions.data.length > 0 && (
                                                            <div className="absolute w-[200px] h-full max-h-[400px] overflow-x-auto overflow-y-auto mt-1 py-1 bg-background border rounded-md shadow-lg z-10">
                                                                {playerSuggestions.data.map((user, i) => (
                                                                    <div
                                                                        key={i}
                                                                        className="px-3 py-2 cursor-pointer hover:bg-accent"
                                                                        onClick={() => setFormValues(user, form)}
                                                                    >
                                                                        {capitalize(user.first_name)} {capitalize(user.last_name)}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    className="min-w-[100px]"
                                                    type="number"
                                                    {...form.register("players.0.extra_data.rate_points", { valueAsNumber: true })}
                                                    placeholder="Rank"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    className="min-w-[100px]"
                                                    type="text"
                                                    {...form.register("players.0.sex")}
                                                    placeholder="Sugu"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    className="min-w-[100px]"
                                                    type="text"
                                                    {...form.register("players.0.extra_data.club")}
                                                    placeholder="Klubi"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    disabled
                                                    className="min-w-[100px] border-none"
                                                    type="number"
                                                    {...form.register("players.0.extra_data.eltl_id", { valueAsNumber: true })}
                                                    placeholder="ELTL ID"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    disabled
                                                    className="border-none"
                                                    type="number"
                                                    {...form.register("players.0.extra_data.rate_order", { valueAsNumber: true })}
                                                    placeholder="Koht Reitingus"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    className="min-w-[100px]"
                                                    type="text"
                                                    {...form.register("players.0.extra_data.class")}
                                                    placeholder="Klass"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Button onClick={form.handleSubmit((values) => handleAddOrUpdateParticipant(values))}>
                                                    Add Participant
                                                </Button>
                                            </TableCell>
                                        </>
                                    ) : (
                                        <>
                                            <TableCell>{(participants && participants.length > 0 ? participants.length : 0) + 1}</TableCell>
                                            <TableCell>
                                                <Input disabled className="min-w-[100px] border-none" type="text" />
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    type="text"
                                                    {...form.register("name", {
                                                        onChange: (e) => {
                                                            form.setValue("name", e.target.value);
                                                        }
                                                    })}
                                                    placeholder="Team name"
                                                />
                                            </TableCell>
                                            <TableCell colSpan={6}></TableCell>
                                            <TableCell>
                                                <Button onClick={form.handleSubmit((values) => handleAddOrUpdateParticipant(values))} >
                                                    Add Team
                                                </Button>
                                            </TableCell>
                                        </>
                                    )}
                                </TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div >
        )
    } else {
        return <ErrorPage error={new Error("Tournament not found")} reset={() => { }} />
    }
}

