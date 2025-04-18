import { useToastNotification } from '@/components/toast-notification';
import { useToast } from '@/hooks/use-toast';
import { UseCreateParticipants, UseDeleteParticipant, UseGetParticipantsQuery, UseUpdateParticipant } from '@/queries/participants';
import { ParticipantFormValues, participantSchema } from '@/routes/admin/tournaments/$tournamentid/-components/participant-forms/form-utils';
import { Participant } from '@/types/participants';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { createContext, useContext, useEffect, useState } from 'react'
import { useForm, UseFormReturn } from 'react-hook-form';
import { UseGetUsersDebounce, UsersResponse } from '@/queries/users';
import { capitalize, useDebounce } from '@/lib/utils';
import { User } from '@/types/users';
import { TournamentTable } from '@/types/groups';
import { UseChangeSubgroupName } from '@/queries/participants';

interface ParticipantContextType {
    handleAddOrUpdateParticipant: (
        values: ParticipantFormValues,
        participantId?: string
    ) => Promise<void>;
    form: UseFormReturn<ParticipantFormValues>;
    editForm: UseFormReturn<ParticipantFormValues>;
    editingParticipant: Participant | null;
    setEditingParticipant(team: Participant | null): void;
    handleEditParticipant: (editForm: UseFormReturn<ParticipantFormValues>, participant: Participant) => void
    participantsState: Participant[] | null
    playerSuggestions: UsersResponse | undefined
    debouncedSearchTerm: string,
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>
    handleDeleteParticipant: (participantId: string) => Promise<void>
    handleRemovePlayer: (teamId: string, playerIndex: number) => Promise<void>
    handleEditPlayer: (teamId: string, playerIndex: number) => void
    handleSavePlayerEdit: (teamId: string, playerIndex: number, updatedPlayer: any) => Promise<void>
    editingPlayerInfo: { teamId: string; playerIndex: number } | null
    setEditingPlayerInfo: React.Dispatch<React.SetStateAction<{ teamId: string; playerIndex: number } | null>>
    searchTerm: string,
    activeTeamForPlayer: string | null
    setActiveTeamForPlayer: React.Dispatch<React.SetStateAction<string | null>>
    setFormValues: (user: User, form: UseFormReturn<ParticipantFormValues>, table_data: TournamentTable) => void

    // Round robin form specific

    teamName: string;
    setTeamName: (name: string) => void
    groupId: string;
    setGroupId: (id: string) => void;
    editingTeamId: string | null;
    setEditingTeamId: (id: string | null) => void;
    editingTeamName: string;
    setEditingTeamName: (name: string) => void;
    selectedTeamId: string | null;
    setSelectedTeamId: (id: string | null) => void;

    groupIds: number[];
    groupedTeams: Record<number, Participant[] | null>;
    handleAddNewGroup: (table_data: TournamentTable) => Promise<void>;

    getSubGroupName: (groupIndex: number) => string
    handleNameChange: (groupName: string, groupIndex: number) => Promise<void>

    selectedGroupInput: number | null
    setSelectedGroupInput: React.Dispatch<React.SetStateAction<number | null>>
}

const ParticipantContext = createContext<ParticipantContextType | undefined>(undefined);


interface ParticipantProviderProps {
    children: React.ReactNode;
    tournament_id: number;
    tournament_table_id: number;
}

export const ParticipantProvider = ({ children, tournament_id, tournament_table_id }: ParticipantProviderProps) => {
    const toast = useToast();
    const { successToast, errorToast } = useToastNotification(toast);

    const { data: participant_data } = UseGetParticipantsQuery(tournament_id, tournament_table_id, false)
    const [participantsState, setParticipantsState] = useState<Participant[] | null>(null);

    const [editingParticipant, setEditingParticipant] =
        useState<Participant | null>(null);
    const [editingPlayerInfo, setEditingPlayerInfo] = useState<{
        teamId: string;
        playerIndex: number;
    } | null>(null);
    const [activeTeamForPlayer, setActiveTeamForPlayer] = useState<string | null>(
        null
    );
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    const { data: playerSuggestions } =
        UseGetUsersDebounce(debouncedSearchTerm);


    // Round Robin specific states:  
    const [teamName, setTeamName] = useState<string>("");
    const [groupId, setGroupId] = useState<string>("1");
    const [editingTeamId, setEditingTeamId] = useState<string | null>(null);
    const [editingTeamName, setEditingTeamName] = useState<string>("");
    const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);

    const [selectedGroupInput, setSelectedGroupInput] = useState<number | null>(null);

    //Loading the data in
    useEffect(() => {
        if (participant_data) {
            setParticipantsState(participant_data.data);
        }
    }, [participant_data])



    const form = useForm<ParticipantFormValues>({
        resolver: zodResolver(participantSchema),
        defaultValues: {
            name: "",
            tournament_id: tournament_id,
            sport_type: "tabletennis",
            players: [],
        },
    });
    const editForm = useForm<ParticipantFormValues>({
        resolver: zodResolver(participantSchema),
    });

    const createParticipant = UseCreateParticipants(
        tournament_id,
        tournament_table_id
    );
    const updateParticipant = UseUpdateParticipant(
        tournament_id,
        tournament_table_id
    );
    const deleteMutation = UseDeleteParticipant(
        tournament_id,
        tournament_table_id,
    );
    const useChangeSubgroupNameMutation = UseChangeSubgroupName(
        tournament_id,
        tournament_table_id
    );

    const handleEditParticipant = (editForm: UseFormReturn<ParticipantFormValues>, participant: Participant) => {
        setEditingParticipant(participant);
        editForm.reset({
            name: participant.name,
            order: participant.order,
            tournament_id: 30,
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
        });
    };

    const handleAddOrUpdateParticipant = async (
        values: ParticipantFormValues,
        participantId?: string
    ) => {
        try {
            if (participantId) {
                await updateParticipant.mutateAsync({
                    formData: values,
                    participantId,
                });

                successToast("Participant updated successfully");
                setEditingParticipant(null);
            } else {
                await createParticipant.mutateAsync(values);
                successToast("Participant added successfully");
            }
            form.resetField("players");
            form.reset(
                {
                    name: "",
                    tournament_id: Number(30),
                    class: "",
                    sport_type: "tabletennis",
                    players: [
                        {
                            name: "",
                            user_id: 0,
                            first_name: "",
                            last_name: "",
                            sport_type: "tabletennis",
                            sex: "",
                            extra_data: {
                                rate_order: 0,
                                club: "",
                                rate_points: 0,
                                eltl_id: 0,
                                class: "",
                            },
                        },
                    ],
                },
                { keepValues: false }
            );
        } catch (error) {
            errorToast(
                `Error ${participantId ? "updating" : "adding"} participant: ${error}`
            );
        }
    };

    const handleDeleteParticipant = async (participantId: string) => {
        try {
            const res = await deleteMutation.mutateAsync(participantId);
            successToast(res.message);
        } catch (error) {
            void error;
            errorToast("Osaleja kustutamisel tekkis viga");
        }
    };

    const handleRemovePlayer = async (teamId: string, playerIndex: number) => {
        const team = participantsState?.find((p) => p.id === teamId);
        if (!team) return;

        const updatedTeam: ParticipantFormValues = {
            name: team.name,
            tournament_id: team.tournament_id,
            sport_type: team.sport_type || "tabletennis",
            class: team.extra_data?.class,
            players: team.players
                .map((player) => ({
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
                        class: player.extra_data.class,
                    },
                }))
                .filter((_, index) => index !== playerIndex),
        };

        await handleAddOrUpdateParticipant(updatedTeam, teamId);
    };

    const handleEditPlayer = (teamId: string, playerIndex: number) => {
        setEditingPlayerInfo({ teamId, playerIndex });
    };

    const handleSavePlayerEdit = async (
        teamId: string,
        playerIndex: number,
        updatedPlayer: any
    ) => {
        const team = participantsState?.find((p) => p.id === teamId);
        if (!team) return;

        const updatedTeam: ParticipantFormValues = {
            name: team.name,
            tournament_id: team.tournament_id,
            sport_type: team.sport_type || "tabletennis",
            class: team.extra_data?.class,
            players: team.players.map((player, idx) => {
                if (idx === playerIndex) {
                    return {
                        ...player,
                        ...updatedPlayer,
                        name: `${updatedPlayer.first_name || player.first_name} ${updatedPlayer.last_name || player.last_name}`,
                        extra_data: {
                            ...player.extra_data,
                            ...updatedPlayer.extra_data,
                        },
                    };
                }
                return {
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
                        class: player.extra_data.class,
                    },
                };
            }),
        };

        await handleAddOrUpdateParticipant(updatedTeam, teamId);
        setEditingPlayerInfo(null);
    };

    const getSubGroupPlayers = (groupIndex: number) => {
        return participantsState && participantsState.filter(
            (participant) => participant.group === groupIndex
        );
    };

    const getSubGroupName = (groupIndex: number) => {
        const subGroupPlayers = getSubGroupPlayers(groupIndex);

        return subGroupPlayers && subGroupPlayers.length > 0
            ? subGroupPlayers[0].group_name
            : `Group ${groupIndex}`;
    };

    const handleNameChange = async (groupName: string, groupIndex: number) => {
        if (groupName == "") {
            return;
        }
        const name = groupName.trim();
        const subGroupPlayers = getSubGroupPlayers(groupIndex);
        const players_ids = subGroupPlayers && subGroupPlayers.map(
            (player) => player.id
        );

        try {
            if (players_ids) {
                await useChangeSubgroupNameMutation.mutateAsync({
                    participant_ids: players_ids,
                    group_name: name,
                });
            } else {
                console.log("mingi error kuskil majanduses")
            }
        } catch (error) {
            void error;
        }
    };



    const handleAddNewGroup = async (table_data: TournamentTable) => {
        let newGroupId;
        if (groupIds.length === 0) {
            newGroupId = 1;
        } else {
            newGroupId = Math.max(...groupIds) + 1;
        }

        if (table_data.solo) {
            await handleAddOrUpdateParticipant({
                name: `Change me`,
                tournament_id: tournament_id,
                group: newGroupId,
                sport_type: "tabletennis",
                players: [{
                    name: "empty",
                    sport_type: "tabletennis",
                    sex: "",
                    extra_data: {
                        rate_points: 0,
                        club: "",
                        eltl_id: 0,
                        rate_order: 0,
                        class: ""
                    }
                }],
            });
        } else {
            await handleAddOrUpdateParticipant({
                name: `Team ${newGroupId}`,
                tournament_id: tournament_id,
                group: newGroupId,
                sport_type: "tabletennis",
                players: [],
            });

        }

        setGroupId(newGroupId.toString());
    };

    // Get all unique group IDs
    const groupIds = participantsState
        ? [...new Set(participantsState.map((p) => p.group || 1))]
        : [1];

    const groupedTeams = groupIds.reduce(
        (acc, groupId) => {
            acc[groupId] =
                participantsState?.filter((p) => (p.group || 1) === groupId) || [];
            return acc;
        },
        {} as Record<number, typeof participantsState>
    );


    const setFormValues = (
        user: User,
        form: UseFormReturn<ParticipantFormValues>,
        table_data: TournamentTable,
    ) => {
        form.setValue(
            "players.0.name",
            `${capitalize(user.first_name)} ${capitalize(user.last_name)}`
        );
        form.setValue("players.0.first_name", user.first_name);
        form.setValue("players.0.last_name", user.last_name);
        form.setValue("players.0.user_id", user.id);
        form.setValue("players.0.extra_data.rate_order", user.rate_order);
        form.setValue("players.0.sex", user.sex);
        form.setValue("players.0.extra_data.club", user.club_name);
        form.setValue("players.0.extra_data.eltl_id", user.eltl_id);
        form.setValue("players.0.extra_data.rate_points", user.rate_points);
        if (table_data.solo) {
            form.setValue("name", `${capitalize(user.first_name)} ${capitalize(user.last_name)}`);
        }
    }

    return (
        <ParticipantContext.Provider value={{
            handleAddOrUpdateParticipant,
            form,
            editForm,
            editingParticipant,
            handleEditParticipant,
            participantsState,
            debouncedSearchTerm,
            playerSuggestions,
            setSearchTerm,
            handleDeleteParticipant,
            handleRemovePlayer,
            handleEditPlayer,
            handleSavePlayerEdit,
            editingPlayerInfo,
            setEditingPlayerInfo,
            searchTerm,
            activeTeamForPlayer,
            setActiveTeamForPlayer,
            setFormValues,

            // Round Robin specific
            teamName,
            setTeamName,
            groupId,
            setGroupId,
            editingTeamId,
            setEditingTeamId,
            editingTeamName,
            setEditingTeamName,
            selectedTeamId,
            setSelectedTeamId,

            setEditingParticipant,

            groupIds,
            groupedTeams,
            handleAddNewGroup,
            handleNameChange,
            getSubGroupName,

            setSelectedGroupInput,
            selectedGroupInput,
        }}>
            {children}
        </ParticipantContext.Provider>
    );
}

export const useParticipantForm = () => {
    const context = useContext(ParticipantContext);
    if (context === undefined) {
        throw new Error('useParticipantForm must be used within a ParticipantProvider');
    }
    return context;
};