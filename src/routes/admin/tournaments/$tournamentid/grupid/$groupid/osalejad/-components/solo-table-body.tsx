import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { TableCell, TableRow } from '@/components/ui/table';
import { capitalize } from '@/lib/utils';
import { Participant } from '@/types/participants';
import { MoreHorizontal, Pencil, Trash } from 'lucide-react';
import { Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ParticipantFormValues } from '../../../../-components/participant-forms/form-utils';
import { useEffect, useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { TournamentTable } from '@/types/groups';
import { useParticipantForm } from '@/providers/participantProvider';

interface FieldProps {
    path: string;
    valueAsNumber: boolean;
    getValue: (participant: Participant) => string | number
}

interface InputCellProps {
    field: FieldProps;
    participant: Participant
    editingParticipant: Participant | null;

}

interface SoloTableBodyProps {
    participant: Participant;
    tournament_table_data: TournamentTable,
    idx: number;
}

const SoloTableBody = ({ participant, idx, tournament_table_data }: SoloTableBodyProps) => {
    const { t } = useTranslation()
    const { editForm, handleAddOrUpdateParticipant, editingParticipant, handleEditParticipant, debouncedSearchTerm, playerSuggestions, setSearchTerm, handleDeleteParticipant, setFormValues } = useParticipantForm()
    const [popoverOpen, setPopoverOpen] = useState(false);

    useEffect(() => {
        if (debouncedSearchTerm) {
            const timeout = setTimeout(() => setPopoverOpen(true), 50);
            return () => clearTimeout(timeout);
        } else {
            setPopoverOpen(false);
        }
    }, [debouncedSearchTerm]);

    const fields: FieldProps[] = [
        {
            path: "players.0.extra_data.rate_points",
            valueAsNumber: true,
            getValue: (participant: Participant) => participant.players[0].extra_data.rate_points
        },
        {
            path: "players.0.sex",
            valueAsNumber: false,
            getValue: (participant: Participant) => participant.players[0].sex
        },
        {
            path: "players.0.extra_data.club",
            valueAsNumber: false,
            getValue: (participant: Participant) => participant.players[0].extra_data.club
        },
        {
            path: "players.0.extra_data.eltl_id",
            valueAsNumber: true,
            getValue: (participant: Participant) => participant.players[0].extra_data.eltl_id
        },
        {
            path: "players.0.extra_data.rate_order",
            valueAsNumber: true,
            getValue: (participant: Participant) => participant.players[0].extra_data.rate_order
        },
        {
            path: "players.0.extra_data.class",
            valueAsNumber: false,
            getValue: (participant: Participant) => participant.players[0].extra_data.class
        }
    ]


    const InputCell = ({ field, participant, editingParticipant }: InputCellProps) => {
        const isEditing = editingParticipant?.id === participant.id
        return (

            <>
                {participant.players &&
                    <TableCell>
                        {isEditing ? (<Input {...editForm.register(field.path as Path<ParticipantFormValues>, field.valueAsNumber ? { valueAsNumber: true } : { valueAsNumber: false })} />) : (field.getValue(participant))}
                    </TableCell>
                }
            </>
        )
    }

    return (
        <TableRow>
            <TableCell>{idx + 1}</TableCell>
            <TableCell>{editingParticipant && editingParticipant.id === participant.id ? (
                <Input
                    {...editForm.register("order", { valueAsNumber: true })}
                    onChange={(e) => {
                        editForm.setValue("order", Number(e.target.value))
                    }}
                    type="number"
                    defaultValue={participant.order}
                    className="w-20"
                    min="1"
                />
            ) : (
                participant.order
            )}</TableCell>
            <TableCell className="">
                {editingParticipant && editingParticipant.id === participant.id ? (
                    <div>
                        <Popover
                            open={popoverOpen}
                            onOpenChange={(open) => {
                                setPopoverOpen(open)
                            }}
                        >
                            <PopoverTrigger asChild>
                                <Input
                                    {...editForm.register("name")}
                                    type="text"
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value)
                                        editForm.setValue("name", e.target.value)
                                    }
                                    }
                                    onClick={(e) => { e.stopPropagation() }}
                                    onBlur={() => {
                                        setSearchTerm("")
                                        setPopoverOpen(false)
                                    }}
                                    defaultValue={participant.name}
                                    placeholder="Lisa mängija"
                                    autoComplete="off"
                                />
                            </PopoverTrigger>
                            {playerSuggestions && playerSuggestions.data &&
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
                                    {playerSuggestions?.data.map((user, i) => (
                                        <div
                                            key={i}
                                            className="px-3 py-2 cursor-pointer hover:bg-accent"
                                            onClick={() => {
                                                setFormValues(user, editForm, tournament_table_data)
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
                    </div>
                ) : (
                    participant.name
                )}
            </TableCell>

            {
                fields.map((field, index) => (
                    <InputCell key={index} field={field} participant={participant} editingParticipant={editingParticipant} />
                ))
            }

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
                                }}
                            >
                                <Pencil className="w-4 h-4 mr-2" />
                                {t(
                                    "admin.tournaments.groups.participants.actions.save"
                                )}
                            </DropdownMenuItem>
                        ) : (
                            <DropdownMenuItem
                                onClick={() => {
                                    handleEditParticipant(editForm, participant)
                                }
                                }
                            >
                                <Pencil className="w-4 h-4 mr-2" />
                                {t(
                                    "admin.tournaments.groups.participants.actions.edit"
                                )}
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                            onClick={() =>
                                handleDeleteParticipant(participant)
                            }
                        >
                            <Trash className="w-4 h-4 mr-2" />
                            {t(
                                "admin.tournaments.groups.participants.actions.delete"
                            )}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </TableCell>
        </TableRow >
    )
}

export default SoloTableBody