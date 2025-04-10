import { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RoundRobins, RoundRobinBracket, MatchWrapper } from '@/types/types'
import { useTranslation } from 'react-i18next'

interface GroupStageBracketProps {
    brackets: RoundRobins;
    onMatchSelect?: (match: MatchWrapper) => void;
}

export default function GroupStageBracket({ brackets, onMatchSelect }: GroupStageBracketProps) {
    const { t } = useTranslation()
    const [selectedTeam, setSelectedTeam] = useState<string | null>(null);

    if (!brackets.round_robin || !brackets.round_robin.length) {
        return (
            <div className="flex items-center justify-center h-64 w-full">
                <p className="text-lg font-medium text-gray-500">{t("competitions.errors.no_table")}</p>
            </div>
        );
    }

    // Get all round robin brackets
    const roundRobins = brackets.round_robin;

    const findMatches = (roundRobinBracket: RoundRobinBracket[], participant_1_id: string, participant_2_id: string) => {
        const team1 = roundRobinBracket.find(t => t.participant.id === participant_1_id);
        const team2 = roundRobinBracket.find(t => t.participant.id === participant_2_id);

        if (!team1 || !team2 || !team1.matches) return [];

        return team1.matches.filter(m =>
            (m.match.p1_id === participant_1_id && m.match.p2_id === participant_2_id) ||
            (m.match.p1_id === participant_2_id && m.match.p2_id === participant_1_id)
        ).sort((a) => a.match.round >= roundRobinBracket.length ? 1 : -1);
    };

    const handleMatchClick = (match: MatchWrapper | null): void => {
        if (onMatchSelect && match) {
            onMatchSelect(match)
        }
    }

    const renderMatchCell = (roundRobinBracket: RoundRobinBracket[], p1_id: string, p2_id: string) => {
        const find_matches = findMatches(roundRobinBracket, p1_id, p2_id);

        return (
            <div className=" flex flex-col space-y-2">
                
                <h4>{ }</h4>
                {[0].map((_, index) => (
                    <div
                        onClick={() => find_matches[index] ? handleMatchClick(find_matches[index]) : null}
                        key={index}
                        className=" flex flex-col items-center justify-center cursor-pointer"
                    >
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
                    </div>
                ))}
            </div>
        )
    }

    // Function to render a single group table
    const renderGroupTable = (roundRobinBracket: RoundRobinBracket[], groupIndex: number) => {
        return (
            <div key={groupIndex} className="my-10 mx-auto flex-col max-w-3xl">
                <h3 className="font-bold mb-4">Grupp {groupIndex + 1}</h3>
                
                <div className="md:hidden mb-4">
                    <Select onValueChange={(value) => setSelectedTeam(value)}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Vali tiim" />
                        </SelectTrigger>
                        <SelectContent>
                            {roundRobinBracket.map((bracket, index) => (
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
                                    {roundRobinBracket.map((team, index) => (
                                        <TableHead key={index} className="w-[120px] text-center bg-primary text-primary-foreground">
                                            {team?.participant.name || <Skeleton className="h-6 w-20 mx-auto" />}
                                        </TableHead>
                                    ))}
                                    <TableHead className="w-[120px] text-center bg-primary text-primary-foreground">Punktid kokku</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {roundRobinBracket.map((team, rowIndex) => (
                                    <TableRow
                                        key={rowIndex}
                                        className={cn(
                                            rowIndex % 2 === 0 ? 'bg-secondary/20' : 'bg-background',
                                            selectedTeam === team?.participant.id ? 'bg-blue-100' : ''
                                        )}
                                    >
                                        <TableCell className="font-medium border text-center">
                                            {team?.participant.name || <Skeleton className="h-6 w-20 mx-auto" />}
                                        </TableCell>
                                        {roundRobinBracket.map((colTeam, colIndex) => (
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
                                                    renderMatchCell(roundRobinBracket, team.participant.id, colTeam.participant.id)
                                                )}
                                            </TableCell>
                                        ))}
                                        <TableCell className="font-bold border text-center bg-secondary/30">
                                            {team?.total_points !== undefined ?
                                                team.total_points :
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
            </div>
        );
    };

    return (
        <div className="container mx-auto">
            {roundRobins.map((roundRobinBracket, index) => 
                renderGroupTable(roundRobinBracket, index)
            )}
        </div>
    )
}