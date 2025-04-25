import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { TableCell } from '@/components/ui/table';
import { capitalize } from '@/lib/utils';
import { useParticipantForm } from '@/providers/participantProvider';
import { TournamentTable } from '@/types/groups';
import { GroupType } from '@/types/matches';
import { PlusCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface SoloTableInputProps {
    table_data: TournamentTable
    groupId: number
}

const SoloTableInput = ({ table_data, groupId }: SoloTableInputProps) => {
    const { playerSuggestions, participantsState, debouncedSearchTerm, groupNames, form, setSearchTerm, handleAddOrUpdateParticipant, setFormValues, editingParticipant, selectedGroupInput, setSelectedGroupInput } = useParticipantForm()
    const { t } = useTranslation()
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [isPlayerChosen, setIsPlayerChosen] = useState(false);

    useEffect(() => {
        if (debouncedSearchTerm) {
            const timeout = setTimeout(() => setPopoverOpen(true), 50);
            return () => clearTimeout(timeout);
        } else {
            setPopoverOpen(false);
        }
    }, [debouncedSearchTerm]);

    console.log("TERE", form.getValues(), form.formState.errors)

    return (
        <>
            {((participantsState && table_data.size > participantsState.length) || (table_data.type == GroupType.ROUND_ROBIN || table_data.type == GroupType.ROUND_ROBIN_FULL_PLACEMENT)) && (
                <>
                    <TableCell>
                        {(participantsState && participantsState.length > 0
                            ? participantsState.length
                            : 0) + 1}
                    </TableCell>
                    <TableCell>
                        <Input
                            disabled
                            className=" border-none"
                            type="text"
                        />
                    </TableCell>
                    <TableCell className="min-w-[200px]">
                        <div className="relative">
                            <Popover
                                open={popoverOpen}
                                onOpenChange={(open) => {
                                    setPopoverOpen(open)
                                }}
                            >
                                <PopoverTrigger asChild>
                                    <Input
                                        type="text"
                                        value={groupId === selectedGroupInput ? (table_data.solo ? form.watch("name") ?? "" : form.watch("players.0.name") ?? "") : ""}
                                        onChange={(e) => {
                                            form.setValue(
                                                "players.0.name",
                                                e.target.value
                                            );
                                            setSearchTerm(e.target.value);
                                            if (table_data.solo) {
                                                form.setValue("name", e.target.value);
                                            }
                                            form.setValue("group", groupId)
                                            form.setValue("group_name", groupNames[groupId])
                                            if (isPlayerChosen) {
                                                setIsPlayerChosen(false);
                                                form.reset({
                                                    players: [{
                                                        name: e.target.value,
                                                        sex: "",
                                                        extra_data: {
                                                            rate_points: 0,
                                                            club: "",
                                                            eltl_id: 0,
                                                            rate_order: 0,
                                                            class: ""
                                                        }
                                                    }],
                                                    name: e.target.value,
                                                    group: groupId,
                                                    group_name: groupNames[groupId],
                                                    tournament_id: table_data.tournament_id,
                                                    sport_type: "tabletennis"
                                                })
                                            }
                                        }}
                                        onFocus={() => {
                                            console.log("resetting")
                                            if (selectedGroupInput !== groupId) {
                                                console.log("RESETING OFR USURE")
                                                form.reset({
                                                    players: [{
                                                        name: "",
                                                        sex: "",
                                                        extra_data: {
                                                            rate_points: 0,
                                                            club: "",
                                                            eltl_id: 0,
                                                            rate_order: 0,
                                                            class: ""
                                                        }
                                                    }],
                                                    name: "",
                                                    group: groupId,
                                                    group_name: groupNames[groupId],
                                                    tournament_id: table_data.tournament_id,
                                                    sport_type: "tabletennis"
                                                })

                                            }
                                            setSelectedGroupInput(groupId)
                                        }}
                                        onBlur={() => {
                                            setSearchTerm("")
                                            setPopoverOpen(false)
                                        }}
                                        className=" text-sm md:text-base"
                                        autoComplete="off"
                                        placeholder="Nimi"
                                    />

                                </PopoverTrigger>


                                {editingParticipant == null && groupId === selectedGroupInput &&
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
                                        <div
                                            className=""
                                        >
                                            {playerSuggestions && playerSuggestions.data.map((user, i) => (
                                                <div
                                                    key={i}
                                                    className="px-3 py-2 cursor-pointer hover:bg-accent"
                                                    onClick={() => {
                                                        setFormValues(user, form, table_data)
                                                        setPopoverOpen(false)
                                                        setIsPlayerChosen(true)
                                                    }
                                                    }
                                                >
                                                    {capitalize(user.first_name)}{" "}
                                                    {capitalize(user.last_name)}{" "}
                                                    {user.eltl_id}
                                                </div>
                                            ))}
                                        </div>
                                    </PopoverContent>
                                }
                            </Popover>
                        </div>
                    </TableCell>
                    <TableCell>
                        <Input
                            className="w-[100px]"
                            type="number"
                            value={groupId === selectedGroupInput ? (form.watch("players.0.number") ?? "") : ""}
                            onChange={(e) => {
                                form.setValue("players.0.number", Number(e.target.value))
                            }}
                            placeholder="Rank"
                        />
                    </TableCell>
                    <TableCell>
                        <Input
                            className="w-[100px]"
                            type="text"
                            value={groupId === selectedGroupInput ? (form.watch("players.0.sex") ?? "") : ""}
                            onChange={(e) => {
                                form.setValue("players.0.sex", e.target.value)

                            }}
                            placeholder="Sugu"
                        />
                    </TableCell>
                    <TableCell>
                        <Input
                            className="w-[100px]"
                            type="text"
                            value={groupId === selectedGroupInput ? (form.watch("players.0.extra_data.club") ?? "") : ""}
                            onChange={(e) => {
                                form.setValue("players.0.extra_data.club", e.target.value)
                            }}
                            placeholder="Klubi"
                        />
                    </TableCell>
                    <TableCell>
                        <Input
                            disabled
                            className="w-[100px] border-none"
                            type="number"
                            onChange={(e) => {
                                form.setValue("players.0.extra_data.eltl_id", Number(e.target.value))
                            }}
                            value={groupId === selectedGroupInput ? (form.watch("players.0.extra_data.eltl_id") ?? "") : ""}
                            placeholder="ELTL ID"
                        />
                    </TableCell>
                    <TableCell>
                        <Input
                            disabled
                            className=" border-none"
                            type="number"
                            onChange={(e) => {
                                form.setValue("players.0.extra_data.rate_order", Number(e.target.value))
                            }}
                            value={groupId === selectedGroupInput ? (form.watch("players.0.extra_data.rate_order") ?? "") : ""}
                            placeholder="Koht Reitingus"
                        />
                    </TableCell>
                    <TableCell>
                        <Input
                            className="min-w-[100px]"
                            type="text"
                            onChange={(e) => {
                                form.setValue("players.0.extra_data.class", e.target.value)
                            }}
                            value={groupId === selectedGroupInput ? (form.watch("players.0.extra_data.class") ?? "") : ""}
                            placeholder="Klass"
                        />
                    </TableCell>
                    <TableCell className="sticky right-0 p-3">
                        <div className="absolute inset-0 bg-slate-200 blur-md -z-10"></div>
                        <Button
                            disabled={
                                groupId != selectedGroupInput ||
                                (playerSuggestions &&
                                    playerSuggestions.data &&
                                    playerSuggestions.data.length > 0 &&
                                    !isPlayerChosen)
                            }
                            onClick={form.handleSubmit((values) => {
                                if (participantsState && participantsState.length > 0) {
                                    const lastParticipant = participantsState[participantsState.length - 1]
                                    values.order = lastParticipant.order + 1
                                } else {
                                    values.order = 0
                                }
                                handleAddOrUpdateParticipant(values)
                            }
                            )}
                        >
                            {t(
                                "admin.tournaments.groups.participants.actions.submit"
                            )}
                            <PlusCircle />
                        </Button>
                    </TableCell >
                </>
            )}
        </>
    )
}

export default SoloTableInput