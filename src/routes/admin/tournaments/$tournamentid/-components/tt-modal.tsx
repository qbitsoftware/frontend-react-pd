import { useToastNotification } from "@/components/toast-notification"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { UseGetChildMatchesQuery, UsePatchMatch, UseStartMatch } from "@/queries/match"
import { Match, MatchWrapper, Player, TableTennisExtraData } from "@/types/types"
import { useRouter } from "@tanstack/react-router"
import { X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { MatchSets } from "./match-sets"
import Forfeit from "./forfeit"

interface ProtocolModalProps {
    isOpen: boolean
    onClose: () => void
    match: MatchWrapper
    tournament_id: number
}

export const TableTennisProtocolModal: React.FC<ProtocolModalProps> = ({ isOpen, onClose, match, tournament_id }) => {
    const toast = useToast()
    const { successToast, errorToast } = useToastNotification(toast)
    const router = useRouter()

    const { data: childMathes, isLoading } = UseGetChildMatchesQuery(tournament_id, match.match.tournament_table_id, match.match.id)
    const useStartMatchMutation = UseStartMatch(tournament_id, match.match.tournament_table_id, match.match.id)

    const [notes, setNotes] = useState<string>('')
    const [table_referee, setTableReferee] = useState<string>("")
    const [head_referee, setMainReferee] = useState<string>("")
    const [captainTeam1, setCaptainTeam1] = useState<string>("")
    const [captainTeam2, setCaptainTeam2] = useState<string>("")
    const [table, setTableNumber] = useState<number>(0)
    const [isForfeitOpen, setIsForfeitOpen] = useState(false)
    const [forfeitMatch, setForfeitMatch] = useState<MatchWrapper | null>(null)

    const prevValuesRef = useRef({
        captainTeam1: match.match.extra_data.captain_a || "",
        captainTeam2: match.match.extra_data.captain_b || "",
        table_referee: match.match.extra_data.table_referee || "",
        head_referee: match.match.extra_data.head_referee || "",
        notes: match.match.extra_data.notes || "",
        table: match.match.extra_data.table || 0,
    });


    useEffect(() => {
        const hasChanges = {
            captain_a: captainTeam1 !== prevValuesRef.current.captainTeam1 ? captainTeam1 : undefined,
            captain_b: captainTeam2 !== prevValuesRef.current.captainTeam2 ? captainTeam2 : undefined,
            table_referee: table_referee !== prevValuesRef.current.table_referee ? table_referee : undefined,
            head_referee: head_referee !== prevValuesRef.current.head_referee ? head_referee : undefined,
            notes: notes !== prevValuesRef.current.notes ? notes : undefined,
            table: table !== prevValuesRef.current.table ? table : undefined,
        };

        const sendData = async (extra_data: TableTennisExtraData) => {
            await sendExtraData(extra_data)
        }

        if (Object.values(hasChanges).some(value => value !== undefined)) {
            const handler = setTimeout(() => {

                const updatedExtraData: TableTennisExtraData = {
                    ...match.match.extra_data,
                    ...Object.fromEntries(
                        Object.entries(hasChanges)
                            .filter(([, value]) => value !== undefined)
                    ),
                };

                sendData(updatedExtraData)

                prevValuesRef.current = {
                    captainTeam1,
                    captainTeam2,
                    table_referee,
                    head_referee,
                    notes,
                    table,
                };
            }, 500);

            return () => clearTimeout(handler);
        }
    }, [captainTeam1, captainTeam2, table_referee, head_referee, notes, table, match.match.extra_data]);



    const EMPTY_PLAYER: Player = {
        id: '',
        name: '',
        user_id: 0,
        first_name: 'Mängija',
        last_name: '',
        sport_type: '',
        number: 0,
        rank: 0,
        sex: '',
        extra_data: {
            image_url: '',
            club: '',
            rate_points: 0,
            rate_order: 0,
            eltl_id: 0,
            class: '',
        },
        created_at: '',
        deleted_at: null,
        updated_at: '',
    };

    const createEmptyPlayers = (count: number, team_number: number, extraData: TableTennisExtraData) => {
        const playerFields1: (keyof TableTennisExtraData)[] = [
            'player_a_id', 'player_b_id', 'player_c_id', 'player_d_id', 'player_e_id',
        ];
        const playerFields2: (keyof TableTennisExtraData)[] = [
            'player_x_id', 'player_y_id', 'player_z_id', 'player_v_id', 'player_w_id'
        ];

        return Array.from({ length: count }).map((_, index) => {
            let playerField
            if (team_number == 1) {
                playerField = playerFields1[index];
            } else {
                playerField = playerFields2[index];
            }

            const playerId = extraData[playerField];

            const selectedPlayer = playerId
                ? (team_number === 1 ? match.p1.players : match.p2.players).find(player => player.id === playerId)
                : null;
            return selectedPlayer || {
                ...EMPTY_PLAYER,
                last_name: team_number === 1 ? String.fromCharCode(65 + index) : String.fromCharCode(88 + index),
            };
        });
    };

    const [team1SelectedPlayers, setTeam1SelectedPlayers] = useState<Player[]>([])
    const [team2SelectedPlayers, setTeam2SelectedPlayers] = useState<Player[]>([])

    useEffect(() => {
        const me = match.match.extra_data
        setTeam1SelectedPlayers(createEmptyPlayers(5, 1, match.match.extra_data))
        setTeam2SelectedPlayers(createEmptyPlayers(5, 2, match.match.extra_data))
        if (isOpen) {
            prevValuesRef.current.table_referee = me.table_referee || ""
            prevValuesRef.current.head_referee = me.head_referee || ""
            prevValuesRef.current.captainTeam1 = me.captain_a || ""
            prevValuesRef.current.captainTeam2 = me.captain_b || ""
            prevValuesRef.current.notes = me.notes || ""
            prevValuesRef.current.table = me.table || 0
            setTableReferee(me.table_referee || "")
            setMainReferee(me.head_referee || "")
            setCaptainTeam1(me.captain_a || "")
            setCaptainTeam2(me.captain_b || "")
            setNotes(me.notes || "")
            setTableNumber(me.table || 0)
        }

    }, [isOpen, match.match.extra_data])

    const usePatchMatch = UsePatchMatch(tournament_id, match.match.tournament_table_id, match.match.id)

    const handleSubmit = async (match: Match) => {
        try {
            await usePatchMatch.mutateAsync(match)
            successToast("Successfully updated assigned player")
            router.navigate({
                to: location.pathname,
                replace: true,
            })
        } catch (error) {
            void error
            errorToast("Something went wrong")
        }
    }

    const sendExtraData = async (extra_data: TableTennisExtraData) => {
        console.log("sending extra data")
        const sendMatch: Match = {
            id: match.match.id,
            tournament_table_id: match.match.tournament_table_id,
            type: match.match.type,
            round: match.match.round,
            p1_id: match.match.p1_id,
            p2_id: match.match.p2_id,
            winner_id: match.match.winner_id,
            order: match.match.order,
            sport_type: match.match.sport_type,
            location: match.match.location,
            start_time: new Date(),
            bracket: match.match.bracket,
            forfeit: match.match.forfeit,
            extra_data,
            topCoord: 0,
            table_type: match.match.table_type,
        }
        await handleSubmit(sendMatch)
    }

    const handleMatchStart = async () => {
        try {
            await useStartMatchMutation.mutateAsync()
            successToast("Match started")
        } catch (error) {
            void error
            errorToast("Something went wrong")
        }
    }


    const handlePlayerChange = async (team: number, index: number, playerId: string) => {
        const selectedPlayer = (team === 1 ? match.p1.players : match.p2.players).find(player => player.id === playerId);
        if (!selectedPlayer) return;

        let extra_data: TableTennisExtraData = { ...match.match.extra_data }

        const newTeam1SelectedPlayers = [...team1SelectedPlayers]
        const newTeam2SelectedPlayers = [...team2SelectedPlayers]

        if (team == 1) {
            if (index <= 2) {
                const oldIndex = newTeam1SelectedPlayers.findIndex(player => player.id === playerId);
                if (oldIndex !== -1) {
                    const resetPlayer = { ...EMPTY_PLAYER, last_name: String.fromCharCode(65 + oldIndex) };
                    newTeam1SelectedPlayers[oldIndex] = resetPlayer;
                }
            } else {
                const oldIndex = newTeam1SelectedPlayers.slice(3).findIndex(player => player.id === playerId);
                if (oldIndex !== -1) {
                    const resetPlayer = { ...EMPTY_PLAYER, last_name: String.fromCharCode(65 + oldIndex + 3) };
                    newTeam1SelectedPlayers[oldIndex + 3] = resetPlayer;
                }
            }
            newTeam1SelectedPlayers[index] = selectedPlayer;
            setTeam1SelectedPlayers(newTeam1SelectedPlayers);
        } else if (team == 2) {
            if (index <= 2) {
                const oldIndex = newTeam2SelectedPlayers.findIndex(player => player.id === playerId);
                if (oldIndex !== -1) {
                    const resetPlayer = { ...EMPTY_PLAYER, last_name: String.fromCharCode(83 + oldIndex) };
                    newTeam2SelectedPlayers[oldIndex] = resetPlayer;
                }
            } else {
                const oldIndex = newTeam2SelectedPlayers.slice(3).findIndex(player => player.id === playerId);
                if (oldIndex !== -1) {
                    const resetPlayer = { ...EMPTY_PLAYER, last_name: String.fromCharCode(83 + oldIndex + 3) };
                    newTeam2SelectedPlayers[oldIndex + 3] = resetPlayer;
                }
            }
            newTeam2SelectedPlayers[index] = selectedPlayer;
            setTeam2SelectedPlayers(newTeam2SelectedPlayers);
        }

        extra_data = {
            ...extra_data,
            table: match.match.extra_data.table,
            parent_match_id: "",
            player_a_id: newTeam1SelectedPlayers[0].id,
            player_b_id: newTeam1SelectedPlayers[1].id,
            player_c_id: newTeam1SelectedPlayers[2].id,
            player_d_id: newTeam1SelectedPlayers[3].id,
            player_e_id: newTeam1SelectedPlayers[4].id,
            player_x_id: newTeam2SelectedPlayers[0].id,
            player_y_id: newTeam2SelectedPlayers[1].id,
            player_z_id: newTeam2SelectedPlayers[2].id,
            player_v_id: newTeam2SelectedPlayers[3].id,
            player_w_id: newTeam2SelectedPlayers[4].id,
        }


        const sendMatch: Match = {
            id: match.match.id,
            tournament_table_id: match.match.tournament_table_id,
            type: match.match.type,
            round: match.match.round,
            p1_id: match.match.p1_id,
            p2_id: match.match.p2_id,
            winner_id: match.match.winner_id,
            order: match.match.order,
            sport_type: match.match.sport_type,
            location: match.match.location,
            start_time: new Date(),
            bracket: match.match.bracket,
            forfeit: match.match.forfeit,
            extra_data,
            topCoord: 0,
            table_type: match.match.table_type,
        }

        await handleSubmit(sendMatch)
    };

    const handleForfeitMatch = (match: MatchWrapper) => {
        setForfeitMatch(match)
        setIsForfeitOpen(true)
    }

    const handleForfeitMatchClose = () => {
        setIsForfeitOpen(false)
        setForfeitMatch(null)
    }

    const handleFinish = async () => {
        try {
            await usePatchMatch.mutateAsync({
                ...match.match,
                winner_id: "finished",
                extra_data: {
                    ...match.match.extra_data,
                    table_referee: table_referee,
                    head_referee: head_referee,
                    captain_a: captainTeam1,
                    captain_b: captainTeam2,
                    notes,
                    table,
                },
            })
        } catch (error) {
            void error
            errorToast("Something went wrong")
        }
    }


    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[350px] md:max-w-[720px] lg:max-w-4xl xl:max-w-6xl h-[80vh] flex flex-col p-0">
                <DialogHeader className="sticky top-0 z-10 bg-background p-6">
                    <div className="flex flex-col md:flex-row items-center justify-between">
                        <div className='flex items-center mb-6 md:mb-0 gap-[30px]'>
                            <DialogTitle className=''>Protokoll: {match.p1.name} vs {match.p2.name}</DialogTitle>
                            <Input type='number' min="0" className="w-[75px]" onChange={(e) => setTableNumber(Number(e.target.value))} value={!table ? "" : table}></Input>
                            <X className='md:hidden cursor-pointer' onClick={onClose} />
                        </div>
                    </div>
                </DialogHeader>
                <ScrollArea className="flex-grow px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 w-[300px] md:w-[660px] lg:w-[820px] mx-auto xl:w-[1100px] gap-4 mb-4">
                        {[1, 2].map((team) => (
                            <div key={team}>
                                <h3 className="font-bold mb-2">
                                    {team === 1 ? match.p1.name : match.p2.name} Mängijad
                                </h3>
                                {[0, 1, 2].map((index) => (
                                    <div key={index} className="flex items-center mb-2">
                                        <Select value={team === 1 ? team1SelectedPlayers[index]?.id.toString() : team2SelectedPlayers[index]?.id.toString()} onValueChange={(value) => handlePlayerChange(team, index, value)}>
                                            <SelectTrigger className="w-full mr-2">
                                                <SelectValue
                                                    placeholder={
                                                        team === 1 && team1SelectedPlayers[index]
                                                            ? `${team1SelectedPlayers[index].first_name} ${team1SelectedPlayers[index].last_name}`
                                                            : team === 2 && team2SelectedPlayers[index]
                                                                ? `${team2SelectedPlayers[index].first_name} ${team2SelectedPlayers[index].last_name}`
                                                                : `Mängija ${team === 1 ? String.fromCharCode(65 + index) : String.fromCharCode(88 + index)}`
                                                    }
                                                >
                                                    {team === 1 && team1SelectedPlayers[index]
                                                        ? `${team1SelectedPlayers[index].first_name} ${team1SelectedPlayers[index].last_name}`
                                                        : team === 2 && team2SelectedPlayers[index]
                                                            ? `${team2SelectedPlayers[index].first_name} ${team2SelectedPlayers[index].last_name}`
                                                            : ''}
                                                </SelectValue>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {(team === 1 ? match.p1.players : match.p2.players).map((player) => (
                                                    <SelectItem key={player.id} value={player.id.toString()}>
                                                        {(player.first_name + " " + player.last_name) || ''}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                ))}
                                <h4 className="font-semibold mt-4 mb-2">Paaris mäng</h4>
                                <div className='w-[300px] mb-[15px] md:w-full'>
                                    {[3, 4].map((index) => (
                                        <div key={index} className="flex items-center mb-2">
                                            <Select onValueChange={(value) => handlePlayerChange(team, index, value)}>
                                                <SelectTrigger className="w-full mr-2">
                                                    <SelectValue
                                                        placeholder={team === 1 && team1SelectedPlayers[index]
                                                            ? `${team1SelectedPlayers[index].first_name} ${team1SelectedPlayers[index].last_name}`
                                                            : team === 2 && team2SelectedPlayers[index]
                                                                ? `${team2SelectedPlayers[index].first_name} ${team2SelectedPlayers[index].last_name} `
                                                                : `Mängija ${team == 1 ? String.fromCharCode(65 + index) : String.fromCharCode(80 + index)}`}
                                                    >
                                                        {team === 1 && team1SelectedPlayers[index]
                                                            ? `${team1SelectedPlayers[index].first_name} ${team1SelectedPlayers[index].last_name}`
                                                            : team === 2 && team2SelectedPlayers[index]
                                                                ? `${team2SelectedPlayers[index].first_name} ${team2SelectedPlayers[index].last_name} `
                                                                : ''}
                                                    </SelectValue>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {(team === 1 ? match.p1.players : match.p2.players).map((player) => (
                                                        <SelectItem key={player.id} value={player.id.toString()}>{(player.first_name + " " + player.last_name) || ''}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    ))}
                                </div>
                                <div className='mb-[40px] mr-2'>
                                    <h4 className="font-semibold mt-4 mb-2">Kapten</h4>
                                    <Input
                                        type="text"
                                        value={team === 1 ? captainTeam1 : captainTeam2}
                                        onChange={(e) => team == 1 ? setCaptainTeam1(e.target.value) : setCaptainTeam2(e.target.value)}
                                        placeholder={team === 1 ? "Kapten ABC" : "Kapten XYZ"}
                                        className=""
                                    />

                                </div>
                            </div>
                        ))}
                    </div>
                    <div>
                        <Textarea
                            placeholder='Märkmed'
                            onChange={(e) => setNotes(e.target.value)}
                            value={notes}
                            className="w-full min-h-[140px] p-2 border-[1px] border-gray/20 rounded-md mb-4" />
                    </div>
                    <div className="mb-4 flex justify-between">
                        <Button onClick={handleMatchStart}>Alusta</Button>
                        {/* {teamMatch?.data && <Button onClick={deleteTeamMatch} variant={'destructive'}>{"Reseti Mäng"}</Button>} */}
                    </div>
                    <ScrollArea >
                        <div className='w-[300px] md:w-[660px] lg:w-[850px] xl:w-[1100px]'>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="text-center">Jarjekord</TableHead>
                                        <TableHead className="text-center">Sett 1</TableHead>
                                        <TableHead className="text-center">Sett 2</TableHead>
                                        <TableHead className="text-center">Sett 3</TableHead>
                                        <TableHead className="text-center">Sett 4</TableHead>
                                        <TableHead className="text-center">Sett 5</TableHead>
                                        <TableHead className="text-center">{match.p1.name} Skoor</TableHead>
                                        <TableHead className="text-center">{match.p2.name} Skoor</TableHead>
                                        <TableHead className='text-center'>Loobumisvõit</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {!isLoading && childMathes && childMathes.data && childMathes.data.map((player_match: MatchWrapper) => (
                                        <TableRow key={player_match.match.id}>
                                            <TableCell>{player_match.match.order == 1 ? "A-Y" : player_match.match.order == 2 ? "B-X" : player_match.match.order == 3 ? "C-Z" : player_match.match.order == 4 ? "DE-VW" : player_match.match.order == 5 ? "A-X" : player_match.match.order == 6 ? "C-Y" : "B-Z"}</TableCell>
                                            <MatchSets key={player_match.match.id} match={player_match} />
                                            <TableCell className='text-center'>
                                                {player_match.match.extra_data.team_1_total}
                                            </TableCell>
                                            <TableCell className='text-center'>
                                                {player_match.match.extra_data.team_2_total}
                                            </TableCell>
                                            <TableCell><Button onClick={() => { handleForfeitMatch(player_match) }} className='text-[12px] bg-[#f6f6f6] border-[1px] text-black hover:text-white'>Loobumisvõit</Button></TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <ScrollBar />
                        </div>
                    </ScrollArea>
                    <div className="w-full flex justify-center items-center gap-4 my-4">
                        <h4 className="font-bold">Võitja:</h4>
                        <div>
                            {match.match.winner_id !== ""
                                ? match.match.winner_id === match.p1.id
                                    ? match.p1.name
                                    : match.p2.name
                                : "Siia tuleb võitja"}
                            <Separator className="bg-black" />
                        </div>
                    </div>
                </ScrollArea>
                <div className="flex flex-col gap-4 bg-secondary p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <Input
                            className='flex-grow'
                            value={match.match.extra_data.table_referee ? match.match.extra_data.table_referee : table_referee}
                            placeholder={match.match.extra_data.table_referee ? match.match.extra_data.table_referee : 'Lauakohtunik'}
                            onChange={(e) => setTableReferee(e.target.value)}
                        />
                        <Input
                            className='flex-grow'
                            value={match.match.extra_data.head_referee ? match.match.extra_data.head_referee : head_referee}
                            placeholder={match.match.extra_data.head_referee ? match.match.extra_data.head_referee : 'Peakohtunik'}
                            onChange={(e) => setMainReferee(e.target.value)}
                        />
                    </div>
                    <Button disabled={match.match.winner_id !== ""} onClick={() => handleFinish()}>
                        Lõpeta Mängud
                    </Button>
                </div>

                {forfeitMatch &&
                    <Forfeit match={forfeitMatch} isOpen={isForfeitOpen} onClose={() => handleForfeitMatchClose()} tournament_id={tournament_id} />
                }

            </DialogContent>
        </Dialog>
    )
}