import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { TableCell, TableRow } from '@/components/ui/table'
import { capitalize } from '@/lib/utils'
import { useParticipantForm } from '@/providers/participantProvider'
import { Participant } from '@/types/participants'
import { MoreHorizontal, Pencil, PlusCircle, Trash } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import EditImgModal from '../../../../-components/edit-img-modal'
import { ParticipantFormValues } from '../../../../-components/participant-forms/form-utils'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Player } from '@/types/players'

interface TeamTableBodyProps {
    participant: Participant
    idx: number
}

const TeamTableBody = ({ participant, idx }: TeamTableBodyProps) => {
    const { editingParticipant, debouncedSearchTerm, editForm, handleDeleteParticipant, handleEditParticipant, handleAddOrUpdateParticipant, handleEditPlayer, handleRemovePlayer, handleSavePlayerEdit, searchTerm, setSearchTerm, editingPlayerInfo, playerSuggestions, participantsState, activeTeamForPlayer, setActiveTeamForPlayer, setEditingPlayerInfo } = useParticipantForm()
    const { t } = useTranslation()
    const [isInput, setIsInput] = useState(false);

    const [popoverOpen, setPopoverOpen] = useState(false);

    useEffect(() => {
        if (debouncedSearchTerm) {
            const timeout = setTimeout(() => setPopoverOpen(true), 50);
            return () => clearTimeout(timeout);
        } else {
            setPopoverOpen(false);
        }
    }, [debouncedSearchTerm]);

    return (
        <React.Fragment>
            <TableRow>
                <TableCell>{idx + 1}</TableCell>
                <TableCell>
                    {editingParticipant && editingParticipant.id === participant.id ? (
                        <Input
                            {...editForm.register("order", { valueAsNumber: true })}
                            type="number"
                            onChange={(e) => {
                                editForm.setValue("order", Number(e.target.value))
                            }}
                            defaultValue={participant.order}
                            className="w-20"
                            min="1"
                        />
                    ) : (
                        participant.order
                    )}
                </TableCell>
                <TableCell className="font-medium">
                    {editingParticipant?.id === participant.id ? (
                        <Input
                            {...editForm.register("name")}
                            defaultValue={capitalize(participant.name)}
                        />
                    ) : (
                        participant.name
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
                            {editingParticipant?.id === participant.id ? (
                                <DropdownMenuItem
                                    onClick={() => {
                                        handleAddOrUpdateParticipant(
                                            editForm.getValues(),
                                            participant.id)
                                            console.log(participant)
                                    }}
                                >
                                    <Pencil className="w-4 h-4 mr-2" />
                                    {t(
                                        "admin.tournaments.groups.participants.actions.save"
                                    )}
                                </DropdownMenuItem>
                            )
                                :
                                <DropdownMenuItem
                                    onClick={() => {
                                        handleEditParticipant(editForm, participant)
                                        console.log(participant)

                                    }
                                    }
                                >
                                    <Pencil className="w-4 h-4 mr-2" />
                                    {t(
                                        "admin.tournaments.groups.participants.actions.edit_team"
                                    )}
                                </DropdownMenuItem>

                            }
                            <DropdownMenuItem
                                onClick={() =>
                                    handleDeleteParticipant(participant.id)
                                }
                            >
                                <Trash className="w-4 h-4 mr-2" />
                                {t(
                                    "admin.tournaments.groups.participants.actions.delete_team"
                                )}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </TableCell>
            </TableRow>

            {
                participant.players &&
                participant.players.length > 0 &&
                participant.players.map((player, playerIdx) => (
                    <TableRow
                        key={`${participant.id}-${playerIdx}`}
                        className="bg-muted/50"
                    >
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell>
                            <EditImgModal
                                playerId={player.id}
                                playerName={`${player.first_name} ${player.last_name}`}
                                playerImg={player.extra_data.image_url}
                            />
                        </TableCell>
                        <Popover
                            open={popoverOpen}
                            onOpenChange={(open) => {
                                setPopoverOpen(open)
                            }}
                        >
                            <PopoverTrigger asChild>
                                <TableCell className="pl-8">
                                    {editingPlayerInfo &&
                                        editingPlayerInfo.teamId === participant.id &&
                                        editingPlayerInfo.playerIndex ===
                                        playerIdx ? (
                                        <div className="flex gap-2">
                                            <Input
                                                defaultValue={`${player.first_name} ${player.last_name}`}
                                                onChange={(e) => {
                                                    setSearchTerm(e.target.value)
                                                    player.first_name = e.target.value
                                                }
                                                }
                                                onFocus={() => {
                                                    setActiveTeamForPlayer(participant.id)
                                                }}
                                                placeholder="First name"
                                                className="w-36"
                                            />
                                        </div>
                                    ) : (
                                        `${player.first_name} ${player.last_name}`
                                    )}
                                </TableCell>

                            </PopoverTrigger>
                            {playerSuggestions && playerSuggestions.data && activeTeamForPlayer == participant.id && editingPlayerInfo && editingPlayerInfo.playerIndex === playerIdx && !isInput &&
                                <PopoverContent
                                    className="p-0 w-[200px] max-h-[400px] overflow-y-auto suggestion-dropdown"
                                    align="start"
                                    sideOffset={5}
                                    onInteractOutside={(e) => {
                                        if ((e.target as HTMLElement).closest('input')) {
                                            e.preventDefault()
                                        } else {
                                            setPopoverOpen(false)
                                        }
                                    }}
                                    onOpenAutoFocus={(e) => {
                                        e.preventDefault()
                                    }}
                                >
                                    {playerSuggestions.data.map((user, i) => (
                                        <div
                                            key={i}
                                            className="px-3 py-2 cursor-pointer hover:bg-accent"
                                            onClick={() => {
                                                const newPlayer: Player = {
                                                    id: participant.players[playerIdx].id,
                                                    first_name: user.first_name,
                                                    last_name: user.last_name,
                                                    sport_type: "tabletennis",
                                                    user_id: user.id,
                                                    name: `${user.first_name} ${user.last_name}`,
                                                    number: 0,
                                                    rank: user.rate_pl_points,
                                                    sex: user.sex,
                                                    extra_data: {
                                                        rate_order: user.rate_order,
                                                        club: user.club_name,
                                                        rate_points: user.rate_points,
                                                        eltl_id: user.eltl_id,
                                                        class: "",
                                                        image_url: "",
                                                    },
                                                    created_at: "",
                                                    updated_at: "",
                                                    deleted_at: "",
                                                }
                                                participant.players[playerIdx] = newPlayer
                                                handleSavePlayerEdit(participant.id, playerIdx, newPlayer)
                                                setPopoverOpen(false)
                                            }}
                                        >
                                            {capitalize(user.first_name)}{" "}
                                            {capitalize(user.last_name)}{" "}
                                            {user.eltl_id}
                                        </div>
                                    ))}
                                </PopoverContent>
                            }
                        </Popover>

                        <TableCell>
                            {editingPlayerInfo &&
                                editingPlayerInfo.teamId === participant.id &&
                                editingPlayerInfo.playerIndex ===
                                playerIdx ? (
                                <Input
                                    type="number"
                                    defaultValue={
                                        player.extra_data.rate_points
                                    }
                                    onChange={(e) =>
                                    (player.extra_data.rate_points = Number(
                                        e.target.value
                                    ))
                                    }
                                    className="w-20"
                                />
                            ) : (
                                player.extra_data.rate_points
                            )}
                        </TableCell>
                        <TableCell>
                            {editingPlayerInfo &&
                                editingPlayerInfo.teamId === participant.id &&
                                editingPlayerInfo.playerIndex ===
                                playerIdx ? (
                                <Input
                                    defaultValue={player.sex}
                                    onChange={(e) =>
                                        (player.sex = e.target.value)
                                    }
                                    className="w-16"
                                />
                            ) : (
                                player.sex
                            )}
                        </TableCell>
                        <TableCell>
                            {editingPlayerInfo &&
                                editingPlayerInfo.teamId === participant.id &&
                                editingPlayerInfo.playerIndex ===
                                playerIdx ? (
                                <Input
                                    defaultValue={player.extra_data.club}
                                    onChange={(e) =>
                                    (player.extra_data.club =
                                        e.target.value)
                                    }
                                    className="w-24"
                                />
                            ) : (
                                player.extra_data.club
                            )}
                        </TableCell>
                        <TableCell>
                            {editingPlayerInfo &&
                                editingPlayerInfo.teamId === participant.id &&
                                editingPlayerInfo.playerIndex ===
                                playerIdx ? (
                                <Input
                                    type="number"
                                    defaultValue={player.extra_data.eltl_id}
                                    onChange={(e) =>
                                    (player.extra_data.eltl_id = Number(
                                        e.target.value
                                    ))
                                    }
                                    className="w-20"
                                />
                            ) : (
                                player.extra_data.eltl_id
                            )}
                        </TableCell>
                        <TableCell>
                            {editingPlayerInfo &&
                                editingPlayerInfo.teamId === participant.id &&
                                editingPlayerInfo.playerIndex ===
                                playerIdx ? (
                                <Input
                                    type="number"
                                    defaultValue={
                                        player.extra_data.rate_order
                                    }
                                    onChange={(e) =>
                                    (player.extra_data.rate_order = Number(
                                        e.target.value
                                    ))
                                    }
                                    className="w-20"
                                />
                            ) : (
                                player.extra_data.rate_order
                            )}
                        </TableCell>
                        <TableCell>
                            {editingPlayerInfo &&
                                editingPlayerInfo.teamId === participant.id &&
                                editingPlayerInfo.playerIndex ===
                                playerIdx ? (
                                <div className="flex gap-1">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            handleSavePlayerEdit(
                                                participant.id,
                                                playerIdx,
                                                player
                                            )
                                            setSearchTerm("")
                                        }
                                        }
                                    >
                                        <Pencil className="w-4 h-4 text-green-600" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            setEditingPlayerInfo(null)
                                            setSearchTerm("")
                                        }
                                        }
                                    >
                                        {t(
                                            "admin.tournaments.groups.participants.actions.cancel"
                                        )}
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex gap-1">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            handleEditPlayer(
                                                participant.id,
                                                playerIdx
                                            )
                                            setIsInput(false)
                                        }
                                        }
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                            handleRemovePlayer(
                                                participant.id,
                                                playerIdx
                                            )
                                        }
                                    >
                                        <Trash className="w-4 h-4" />
                                    </Button>
                                </div>
                            )}
                        </TableCell>
                    </TableRow>
                ))
            }
            < TableRow className="bg-muted/30" >
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell className="pl-8">
                    <div className="">
                        <Popover
                            open={popoverOpen}
                            onOpenChange={(open) => {
                                setPopoverOpen(open)
                            }}
                        >
                            <PopoverTrigger asChild>
                                <div className="flex relative">
                                    <Input
                                        type="text"
                                        value={
                                            activeTeamForPlayer == participant.id && isInput
                                                ? searchTerm
                                                : ""
                                        }
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                        disabled={editingPlayerInfo !== null}
                                        className="min-w-[200px] mr-2"
                                        placeholder="Lisa mängija"
                                        autoComplete="off"
                                        onFocus={() => {
                                            setActiveTeamForPlayer(participant.id);
                                            setIsInput(true)
                                        }}
                                    />
                                    <Button
                                        disabled={
                                            (playerSuggestions &&
                                                playerSuggestions.data &&
                                                playerSuggestions.data.length !== 0) ||
                                            searchTerm == "" ||
                                            (activeTeamForPlayer !== participant.id)

                                        }
                                        onClick={() => {
                                            const lastSpaceIndex =
                                                searchTerm.lastIndexOf(" ");

                                            let first_name = searchTerm;
                                            let last_name = "";

                                            if (lastSpaceIndex !== -1) {
                                                first_name = searchTerm.substring(
                                                    0,
                                                    lastSpaceIndex
                                                );
                                                last_name = searchTerm.substring(
                                                    lastSpaceIndex + 1
                                                );
                                            }

                                            const existingPlayers =
                                                participant.players ?? [];
                                            const updatedTeam: ParticipantFormValues = {
                                                name: participant.name,
                                                tournament_id: participant.tournament_id,
                                                sport_type:
                                                    participant.sport_type || "tabletennis",
                                                class: participant.extra_data?.class,
                                                players: [
                                                    ...existingPlayers,
                                                    {
                                                        name: searchTerm,
                                                        first_name: first_name,
                                                        last_name: last_name,
                                                        sport_type: "tabletennis",
                                                        extra_data: { rate_points: 0 },
                                                    },
                                                ],
                                            };

                                            handleAddOrUpdateParticipant(
                                                updatedTeam,
                                                participant.id
                                            );
                                            setSearchTerm("")
                                        }}
                                    >
                                        {t(
                                            "admin.tournaments.groups.participants.actions.submit"
                                        )}{" "}
                                        <PlusCircle />
                                    </Button>

                                </div>


                            </PopoverTrigger>
                            {activeTeamForPlayer == participant.id && isInput &&
                                < PopoverContent
                                    className="p-0 w-[200px] max-h-[400px] overflow-y-auto suggestion-dropdown"
                                    align="start"
                                    sideOffset={5}
                                    onInteractOutside={(e) => {
                                        if ((e.target as HTMLElement).closest('input')) {
                                            e.preventDefault()
                                        } else {
                                            setPopoverOpen(false)
                                        }
                                    }}
                                    onOpenAutoFocus={(e) => {
                                        e.preventDefault()
                                    }}
                                >
                                    {playerSuggestions?.data.map((user, i) => (
                                        <div
                                            key={i}
                                            className="px-3 py-2 cursor-pointer hover:bg-accent"
                                            onClick={() => {
                                                const team = participantsState?.find(
                                                    (p) => p.id === participant.id
                                                );
                                                if (!team) return;
                                                const players = team.players || [];
                                                const updatedTeam: ParticipantFormValues =
                                                {
                                                    name: team.name,
                                                    tournament_id:
                                                        team.tournament_id,
                                                    sport_type:
                                                        team.sport_type ||
                                                        "tabletennis",
                                                    class: team.extra_data?.class,
                                                    players: [
                                                        ...players.map((player) => ({
                                                            id: player.id,
                                                            name: `${player.first_name} ${player.last_name}`,
                                                            sport_type:
                                                                player.sport_type ||
                                                                "tabletennis",
                                                            first_name:
                                                                player.first_name,
                                                            last_name: player.last_name,
                                                            user_id: player.user_id,
                                                            sex: player.sex,
                                                            extra_data: {
                                                                rate_order:
                                                                    player.extra_data
                                                                        .rate_order,
                                                                club: player.extra_data
                                                                    .club,
                                                                rate_points:
                                                                    player.extra_data
                                                                        .rate_points,
                                                                eltl_id:
                                                                    player.extra_data
                                                                        .eltl_id,
                                                                class:
                                                                    player.extra_data.class,
                                                            },
                                                        })),
                                                        {
                                                            name: `${user.first_name} ${user.last_name}`,
                                                            sport_type: "tabletennis",
                                                            first_name: user.first_name,
                                                            last_name: user.last_name,
                                                            user_id: user.id || 0,
                                                            sex: user.sex || "",
                                                            extra_data: {
                                                                rate_points:
                                                                    user.rate_points || 0,
                                                                rate_order:
                                                                    user.rate_order,
                                                                club: user.club_name,
                                                                eltl_id: user.eltl_id,
                                                                class: "",
                                                            },
                                                        },
                                                    ],
                                                };

                                                handleAddOrUpdateParticipant(
                                                    updatedTeam,
                                                    participant.id
                                                );
                                                setActiveTeamForPlayer(null);
                                                setSearchTerm("");
                                            }}
                                        >
                                            {capitalize(user.first_name)}{" "}
                                            {capitalize(user.last_name)}{" "}
                                            {user.eltl_id}
                                        </div>
                                    ))}

                                </PopoverContent>}
                        </Popover>
                    </div>
                </TableCell>
                <TableCell></TableCell>
                <TableCell colSpan={6}></TableCell>
            </TableRow>
        </React.Fragment >
    )
}

export default TeamTableBody