import { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RoundRobins, RoundRobinBracket, MatchWrapper } from '@/types/types'

interface GroupBracketProps {
    brackets: RoundRobins;
    onMatchSelect?: (match: MatchWrapper) => void;
}

export default function GroupBracket({ brackets, onMatchSelect }: GroupBracketProps) {

    const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
    // const [selectedProtocol, setSelectedProtocol] = useState<MatchWithTeamAndSets | null>(null)

    const displayTeams: RoundRobinBracket[] = brackets.round_robin || Array(8).fill({ team: { ID: 0, name: "" }, matches: [], total_points: 0 });

    const findMatches = (participant_1_id: string, participant_2_id: string) => {

        const team1 = displayTeams.find(t => t.participant.id === participant_1_id);
        const team2 = displayTeams.find(t => t.participant.id === participant_2_id);

        if (!team1 || !team2 || !team1.matches) return [];

        return team1.matches.filter(m =>
            (m.match.p1_id === participant_1_id && m.match.p2_id === participant_2_id) ||
            (m.match.p1_id === participant_2_id && m.match.p2_id === participant_1_id)
        ).sort((a) => a.match.round >= 8 ? 1 : -1);
    };

    const handleMatchClick = (match: MatchWrapper | null): void => {
        if (onMatchSelect && match) {
            onMatchSelect(match)
        }
    }

    // const handleClick = (match: MatchWithSets) => {
    //     setIsOpen(true)
    //     if (match && statisticsData && statisticsData.data) {
    //         const selected = statisticsData.data.filter((protocol) => protocol.team_match.match_id == match.match.ID)
    //         if (selected) {
    //             setSelectedProtocol(selected[0])
    //         }
    //     }
    // }

    const renderMatchCell = (p1_id: string, p2_id: string) => {
        const find_matches = findMatches(p1_id, p2_id);

        return (
            <div className="flex flex-col space-y-2">
                <h4>{ }</h4>
                {[0, 1].map((_, index) => (
                    <div
                        onClick={() => find_matches[index] ? handleMatchClick(find_matches[index]) : null}

                        key={index} className="flex flex-col items-center justify-center cursor-pointer">
                        {find_matches[index] ? (
                            <>
                                <span className="font-bold text-sm text-blue-600">
                                    {find_matches[index].match.winner_id === p1_id ? 2 : find_matches[index].match.winner_id !== "" ? 1 : 0}
                                </span>
                                <div className="flex items-center space-x-1">
                                    <p className="w-6 text-center font-medium">
                                        {find_matches[index].match.p1_id === p1_id ? find_matches[index].match.extra_data.team_1_total : find_matches[index].match.extra_data.team_2_total}
                                    </p>
                                    <span className="text-gray-500">-</span>
                                    <p className="w-6 text-center font-medium">
                                        {find_matches[index].match.p1_id === p1_id ? find_matches[index].match.extra_data.team_2_total : find_matches[index].match.extra_data.team_1_total}
                                    </p>
                                </div>
                            </>
                        ) : (
                            <>
                                <Skeleton className="h-4 w-8 mb-1" />
                                <div className="flex items-center space-x-1">
                                    <Skeleton className="h-4 w-6" />
                                    <span>-</span>
                                    <Skeleton className="h-4 w-6" />
                                </div>
                            </>
                        )}
                        {index === 0 && <Separator className="w-full my-1" />}
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className="container mx-auto">
            <div className="md:hidden mb-4">
                <Select onValueChange={(value) => setSelectedTeam(value)}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Vali tiim" />
                    </SelectTrigger>
                    <SelectContent>
                        {displayTeams.map((bracket, index) => (
                            <SelectItem key={index} value={bracket.participant.id}>
                                {bracket.participant.name || `Team ${index + 1}`}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <ScrollArea className="w-full">
                <div className="min-w-[640px]">
                    <Table className="w-full border-collapse">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[150px] text-center bg-primary text-primary-foreground">Meeskonnad</TableHead>
                                {Array(8).fill(0).map((_, index) => (
                                    <TableHead key={index} className="w-[120px] text-center bg-primary text-primary-foreground">
                                        {displayTeams[index]?.participant.name || <Skeleton className="h-6 w-20 mx-auto" />}
                                    </TableHead>
                                ))}
                                <TableHead className="w-[120px] text-center bg-primary text-primary-foreground">Punktid kokku</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {Array(8).fill(0).map((_, rowIndex) => (
                                <TableRow
                                    key={rowIndex}
                                    className={cn(
                                        rowIndex % 2 === 0 ? 'bg-secondary/20' : 'bg-background',
                                        selectedTeam === displayTeams[rowIndex]?.participant.id ? 'bg-blue-100' : ''
                                    )}
                                >
                                    <TableCell className="font-medium border text-center">
                                        {displayTeams[rowIndex]?.participant.name || <Skeleton className="h-6 w-20 mx-auto" />}
                                    </TableCell>
                                    {Array(8).fill(0).map((_, colIndex) => (
                                        <TableCell
                                            key={colIndex}
                                            className={cn(
                                                "p-2 border",
                                                rowIndex === colIndex ? "bg-gray-200" : ""
                                            )}
                                        >
                                            {rowIndex === colIndex ? (
                                                <div className="w-full h-full bg-gray-300"></div>
                                            ) : (
                                                renderMatchCell(displayTeams[rowIndex].participant.id, displayTeams[colIndex].participant.id)
                                            )}
                                        </TableCell>
                                    ))}
                                    <TableCell className="font-bold border text-center bg-secondary/30">
                                        {displayTeams[rowIndex]?.total_points !== undefined ?
                                            displayTeams[rowIndex].total_points :
                                            <Skeleton className="h-6 w-12 mx-auto" />
                                        }
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
            {/* {selectedProtocol && players &&
                <StatisticsDialog index={999} protocol={selectedProtocol} players={players.data} isOpen={isOpen} setIsOpen={setIsOpen} />
            } */}
        </div>
    )
}