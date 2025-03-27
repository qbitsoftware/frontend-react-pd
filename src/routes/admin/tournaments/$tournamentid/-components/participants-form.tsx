import { useNavigate, useRouter } from "@tanstack/react-router"
import { MoreHorizontal, Pencil, PlusCircle, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { useState, useEffect, useCallback } from "react"
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
import { useTranslation } from "react-i18next"

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

    const { t } = useTranslation()


    // const [dropdownPositions, setDropdownPositions] = useState<{ [key: string]: { top: number, left: number, position: 'top' | 'bottom' } }>({});
    const [dropdownPositions, setDropdownPositions] = useState<{
        [key: string]: {
            top: number,
            left: number,
            position: 'top' | 'bottom',
            width: number
        }
    }>({});

    const updateDropdownPosition = useCallback((e: React.FocusEvent<HTMLInputElement>, id: string) => {
        const rect = e.target.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const inputMiddleY = rect.top + rect.height / 2;
        const position = inputMiddleY > viewportHeight / 2 ? 'top' : 'bottom';

        setDropdownPositions(prev => ({
            ...prev,
            [id]: {
                // If positioned above, align to top of input; if below, align to bottom
                top: position === 'top' ? rect.top : rect.bottom,
                left: rect.left,
                position: position,
                width: rect.width
            }
        }));
    }, []);

    useEffect(() => {
        const handleScroll = (e: Event) => {
            if (focusedField) {
                const target = e.target as HTMLElement
                const isSuggestionDropdown = target.classList.contains('suggestion-dropdown') || target.closest('.suggestion-dropdown');
                if (!isSuggestionDropdown) {
                    setFocusedField(null);
                    setActiveTeamForPlayer(null);
                    setSearchTerm("");
                    const activeElement = document.activeElement;
                    const isInputFocused = activeElement instanceof HTMLInputElement &&
                        (activeElement.getAttribute('placeholder') === 'Lisa mängija' ||
                            activeElement.getAttribute('placeholder') === 'Nimi');

                    if (!isInputFocused) {
                        setSearchTerm("");
                    }

                    if (isInputFocused) {
                        (activeElement as HTMLElement).blur();
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll, true);
        document.addEventListener('touchmove', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll, true);
            document.removeEventListener('touchmove', handleScroll);
        };
    }, [focusedField]);


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
            void error
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
            void error
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

    if (tournament_data) {
        return (
            <div className=" mx-auto py-6 space-y-6  w-full">
                <Card className=" border-[#F0F3F3]">
                    <CardHeader className="">
                        <div className="flex w-[250px] gap-4">
                            <Select onValueChange={setSelectedOrderValue} defaultValue={selectedOrderValue}>
                                <SelectTrigger className="">
                                    <SelectValue placeholder={t('admin.tournaments.groups.order.placeholder')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="random">{t('admin.tournaments.groups.order.random')}</SelectItem>
                                    <SelectItem value="rating">{t('admin.tournaments.groups.order.by_rating')}</SelectItem>
                                    <SelectItem value="regular">{t('admin.tournaments.groups.order.by_order')}</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button disabled={!selectedOrderValue} onClick={() => handleOrder(selectedOrderValue)}>
                                {t('admin.tournaments.groups.order.title')}
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="">
                        <div className="min-h-[60vh] flex flex-col">
                            <div className="overflow-x-auto w-full">
                                <Table className="w-full">
                                    <TableHeader>
                                        <TableRow>
                                            {table_data && table_data.solo ? (
                                                <>
                                                    <TableHead className="">{t("admin.tournaments.groups.participants.table.serial_number")}</TableHead>
                                                    <TableHead className="">{t("admin.tournaments.groups.participants.table.position")}</TableHead>
                                                    <TableHead className="">{t("admin.tournaments.groups.participants.table.name")}</TableHead>
                                                    <TableHead className="">{t("admin.tournaments.groups.participants.table.rank")}</TableHead>
                                                    <TableHead className="">{t("admin.tournaments.groups.participants.table.sex")}</TableHead>
                                                    <TableHead className="">{t("admin.tournaments.groups.participants.table.club")}</TableHead>
                                                    <TableHead className="">{t("admin.tournaments.groups.participants.table.eltl_id")}</TableHead>
                                                    <TableHead className="">{t("admin.tournaments.groups.participants.table.rating")}</TableHead>
                                                    <TableHead className="">{t("admin.tournaments.groups.participants.table.class")}</TableHead>
                                                    <TableHead className="">{t("admin.tournaments.groups.participants.table.actions")}</TableHead>
                                                </>
                                            ) : (
                                                <>
                                                    <TableHead className="">{t("admin.tournaments.groups.participants.table.serial_number")}</TableHead>
                                                    <TableHead className="">{t("admin.tournaments.groups.participants.table.position")}</TableHead>
                                                    <TableHead className="">{t("admin.tournaments.groups.participants.table.team")}</TableHead>
                                                    <TableHead className="">{t("admin.tournaments.groups.participants.table.name")}</TableHead>
                                                    <TableHead className="">{t("admin.tournaments.groups.participants.table.rank")}</TableHead>
                                                    <TableHead className="">{t("admin.tournaments.groups.participants.table.sex")}</TableHead>
                                                    <TableHead className="">{t("admin.tournaments.groups.participants.table.club")}</TableHead>
                                                    <TableHead className="">{t("admin.tournaments.groups.participants.table.eltl_id")}</TableHead>
                                                    <TableHead className="">{t("admin.tournaments.groups.participants.table.rating")}</TableHead>
                                                    <TableHead className="">{t("admin.tournaments.groups.participants.table.actions")}</TableHead>
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
                                                    <TableCell className="">
                                                        {editingParticipant?.id === participant.id ?
                                                            <div >
                                                                <Input
                                                                    type="text"
                                                                    value={activeTeamForPlayer == participant.id ? searchTerm : ""}
                                                                    onChange={(e) => setSearchTerm(e.target.value)}

                                                                    placeholder="Lisa mängija"
                                                                    autoComplete="off"
                                                                    onFocus={(e) => {
                                                                        setFocusedField("name");
                                                                        setActiveTeamForPlayer(participant.id);
                                                                        updateDropdownPosition(e, participant.id);
                                                                    }}
                                                                    onBlur={(e) => {
                                                                        const relatedTarget = e.relatedTarget as HTMLElement;
                                                                        const isRelatedToDropdown = relatedTarget &&
                                                                            (relatedTarget.classList.contains('suggestion-dropdown') ||
                                                                                !!relatedTarget.closest('.suggestion-dropdown'));

                                                                        if (!isRelatedToDropdown) {
                                                                            setTimeout(() => {
                                                                                setFocusedField(null);
                                                                                setActiveTeamForPlayer(null);
                                                                                setSearchTerm("");
                                                                            }, 200);
                                                                        }
                                                                    }}
                                                                />
                                                                {focusedField === "name" && playerSuggestions && activeTeamForPlayer == participant.id && playerSuggestions.data.length > 0 && (
                                                                    <div className="fixed max-h-[200px] w-[200px] overflow-y-auto py-1 bg-background border rounded-md shadow-lg z-50 suggestion-dropdown"
                                                                        style={{
                                                                            left: dropdownPositions[participant.id]?.left || 0,
                                                                            width: dropdownPositions[participant.id]?.width || 200,
                                                                            ...(dropdownPositions[participant.id]?.position === 'top'
                                                                                ? {
                                                                                    bottom: window.innerHeight - dropdownPositions[participant.id]?.top,
                                                                                    maxHeight: dropdownPositions[participant.id]?.top - 10
                                                                                }
                                                                                : {
                                                                                    top: dropdownPositions[participant.id]?.top,
                                                                                    maxHeight: window.innerHeight - dropdownPositions[participant.id]?.top - 10
                                                                                })
                                                                        }}>
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
                                                                        {t("admin.tournaments.groups.participants.actions.save")}
                                                                    </DropdownMenuItem>
                                                                ) : (
                                                                    <DropdownMenuItem onClick={() => handleEditParticipant(participant)}>
                                                                        <Pencil className="w-4 h-4 mr-2" />
                                                                        {t("admin.tournaments.groups.participants.actions.edit")}
                                                                    </DropdownMenuItem>
                                                                )}
                                                                <DropdownMenuItem onClick={() => handleDeleteParticipant(participant.id)}>
                                                                    <Trash className="w-4 h-4 mr-2" />
                                                                    {t("admin.tournaments.groups.participants.actions.delete")}
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
                                                                        {t("admin.tournaments.groups.participants.actions.edit_team")}
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem onClick={() => handleDeleteParticipant(participant.id)}>
                                                                        <Trash className="w-4 h-4 mr-2" />
                                                                        {t("admin.tournaments.groups.participants.actions.delete_team")}
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
                                                            <div className="flex relative">
                                                                <Input
                                                                    type="text"
                                                                    value={activeTeamForPlayer == participant.id ? searchTerm : ""}
                                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                                    className="min-w-[200px]"
                                                                    placeholder="Lisa mängija"
                                                                    autoComplete="off"
                                                                    onFocus={(e) => {
                                                                        setFocusedField("name");
                                                                        setActiveTeamForPlayer(participant.id);
                                                                        updateDropdownPosition(e, participant.id);
                                                                    }}
                                                                    onBlur={(e) => {
                                                                        const relatedTarget = e.relatedTarget as HTMLElement;
                                                                        const isRelatedToDropdown = relatedTarget &&
                                                                            (relatedTarget.classList.contains('suggestion-dropdown') ||
                                                                                !!relatedTarget.closest('.suggestion-dropdown'));

                                                                        if (!isRelatedToDropdown) {
                                                                            setTimeout(() => {
                                                                                setFocusedField(null);
                                                                                setActiveTeamForPlayer(null);
                                                                                setSearchTerm("");
                                                                            }, 200);
                                                                        }
                                                                    }}
                                                                />
                                                                <Button
                                                                    disabled={(playerSuggestions && playerSuggestions.data && playerSuggestions.data.length !== 0) || searchTerm == ''}
                                                                    onClick={() => {
                                                                        const first_name = searchTerm.split(" ")[0];
                                                                        let last_name = ""
                                                                        if (searchTerm.split(" ").length >= 2) {
                                                                            last_name = searchTerm.split(" ")[1]
                                                                        }
                                                                        const updatedTeam: ParticipantFormValues = {
                                                                            name: participant.name,
                                                                            tournament_id: participant.tournament_id,
                                                                            sport_type: participant.sport_type || "tabletennis",
                                                                            class: participant.extra_data?.class,
                                                                            players: [
                                                                                ...participant.players,
                                                                                { name: searchTerm, first_name: first_name, last_name: last_name, sport_type: "tabletennis", extra_data: { rate_points: 0 } }
                                                                            ]
                                                                        }

                                                                        handleAddOrUpdateParticipant(updatedTeam, participant.id)
                                                                    }}>
                                                                    {t("admin.tournaments.groups.participants.actions.submit")} <PlusCircle />
                                                                </Button>
                                                                {focusedField === "name" && playerSuggestions && activeTeamForPlayer == participant.id && playerSuggestions.data.length > 0 && (
                                                                    <div className="fixed max-h-[200px] overflow-y-auto py-1 bg-background border rounded-md shadow-lg z-50 suggestion-dropdown"
                                                                        style={{
                                                                            left: dropdownPositions[participant.id]?.left || 0,
                                                                            width: dropdownPositions[participant.id]?.width || 200,
                                                                            ...(dropdownPositions[participant.id]?.position === 'top'
                                                                                ? {
                                                                                    bottom: window.innerHeight - dropdownPositions[participant.id]?.top,
                                                                                    maxHeight: dropdownPositions[participant.id]?.top - 10
                                                                                }
                                                                                : {
                                                                                    top: dropdownPositions[participant.id]?.top,
                                                                                    maxHeight: window.innerHeight - dropdownPositions[participant.id]?.top - 10
                                                                                })
                                                                        }}>
                                                                        {playerSuggestions.data.map((user, i) => (
                                                                            <div
                                                                                key={i}
                                                                                className="px-3 py-2 cursor-pointer hover:bg-accent"
                                                                                onClick={() => {
                                                                                    const team = participants?.find(p => p.id === participant.id);
                                                                                    if (!team) return;
                                                                                    const players = team.players || [];
                                                                                    const updatedTeam: ParticipantFormValues = {
                                                                                        name: team.name,
                                                                                        tournament_id: team.tournament_id,
                                                                                        sport_type: team.sport_type || "tabletennis",
                                                                                        class: team.extra_data?.class,
                                                                                        players: [
                                                                                            ...players.map(player => ({
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
                                                                                            })),
                                                                                            {
                                                                                                name: `${user.first_name} ${user.last_name}`,
                                                                                                sport_type: "tabletennis",
                                                                                                first_name: user.first_name,
                                                                                                last_name: user.last_name,
                                                                                                user_id: user.id || 0,
                                                                                                sex: user.sex || "",
                                                                                                extra_data: {
                                                                                                    rate_points: user.rate_points || 0,
                                                                                                    rate_order: user.rate_order,
                                                                                                    club: user.club_name,
                                                                                                    eltl_id: user.eltl_id,
                                                                                                    class: ""
                                                                                                }
                                                                                            }
                                                                                        ]
                                                                                    };

                                                                                    handleAddOrUpdateParticipant(updatedTeam, participant.id);
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
                                        <TableRow className="relative">
                                            {table_data && table_data.solo ? (
                                                <>
                                                    <TableCell>{(participants && participants.length > 0 ? participants.length : 0) + 1}</TableCell>
                                                    <TableCell>
                                                        <Input disabled className=" border-none" type="text" />
                                                    </TableCell>
                                                    <TableCell className="min-w-[200px]">
                                                        <div className="relative">
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
                                                                className=" text-sm md:text-base"
                                                                autoComplete="off"
                                                                onFocus={(e) => {
                                                                    setFocusedField("name");
                                                                    updateDropdownPosition(e, "soloInput");
                                                                }}
                                                                onBlur={(e) => {
                                                                    const relatedTarget = e.relatedTarget as HTMLElement;
                                                                    const isRelatedToDropdown = relatedTarget &&
                                                                        (relatedTarget.classList.contains('suggestion-dropdown') ||
                                                                            !!relatedTarget.closest('.suggestion-dropdown'));

                                                                    if (!isRelatedToDropdown) {
                                                                        setTimeout(() => {
                                                                            setFocusedField(null);
                                                                            setActiveTeamForPlayer(null);
                                                                            setSearchTerm("");
                                                                        }, 200);
                                                                    }
                                                                }}
                                                                placeholder="Nimi"
                                                            />
                                                            {focusedField === "name" &&
                                                                playerSuggestions &&
                                                                !editingParticipant &&
                                                                playerSuggestions.data &&
                                                                playerSuggestions.data.length > 0 && (
                                                                    <div
                                                                        className="fixed max-h-[200px] w-[200px] overflow-y-auto py-1 bg-background border rounded-md shadow-lg z-50 suggestion-dropdown"
                                                                        style={{
                                                                            left: dropdownPositions["soloInput"]?.left || 0,
                                                                            width: dropdownPositions["soloInput"]?.width || 200,
                                                                            ...(dropdownPositions["soloInput"]?.position === 'top'
                                                                                ? {
                                                                                    bottom: window.innerHeight - dropdownPositions["soloInput"]?.top,
                                                                                    maxHeight: dropdownPositions["soloInput"]?.top - 10
                                                                                }
                                                                                : {
                                                                                    top: dropdownPositions["soloInput"]?.top,
                                                                                    maxHeight: window.innerHeight - dropdownPositions["soloInput"]?.top - 10
                                                                                })
                                                                        }}
                                                                    >
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
                                                                )
                                                            }
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Input
                                                            className="w-[100px]"
                                                            type="number"
                                                            {...form.register("players.0.extra_data.rate_points", { valueAsNumber: true })}
                                                            placeholder="Rank"
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Input
                                                            className="w-[100px]"
                                                            type="text"
                                                            {...form.register("players.0.sex")}
                                                            placeholder="Sugu"
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Input
                                                            className="w-[100px]"
                                                            type="text"
                                                            {...form.register("players.0.extra_data.club")}
                                                            placeholder="Klubi"
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Input
                                                            disabled
                                                            className="w-[100px] border-none"
                                                            type="number"
                                                            {...form.register("players.0.extra_data.eltl_id", { valueAsNumber: true })}
                                                            placeholder="ELTL ID"
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Input
                                                            disabled
                                                            className=" border-none"
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
                                                    <TableCell className="sticky right-0 p-3">
                                                        <div className="absolute inset-0 bg-slate-200 blur-md -z-10"></div>
                                                        <Button onClick={form.handleSubmit((values) => handleAddOrUpdateParticipant(values))}>
                                                            {t("admin.tournaments.groups.participants.actions.submit")}
                                                            <PlusCircle />
                                                        </Button>
                                                    </TableCell>
                                                </>
                                            ) : (
                                                <>
                                                    <TableCell>{(participants && participants.length > 0 ? participants.length : 0) + 1}</TableCell>
                                                    <TableCell>
                                                        <Input disabled className=" border-none" type="text" />
                                                    </TableCell>
                                                    <TableCell className="min-w-[200px]">
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
                                                    <TableCell className="sticky right-0 p-3">
                                                        <div className="absolute inset-0 bg-slate-200 blur-md -z-10"></div>
                                                        <Button onClick={form.handleSubmit((values) => handleAddOrUpdateParticipant(values))}>
                                                            {t("admin.tournaments.groups.participants.actions.submit")} <PlusCircle />
                                                        </Button>
                                                    </TableCell>
                                                </>
                                            )}
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div >
        )
    } else {
        return <ErrorPage />
    }
}

