'use client'

import { useEffect, useState } from 'react'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  MatchWithSets,
  TournamentTable,
  TeamWithMatches,
  MatchWithTeamAndSets
} from "@/types/types"
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProtocolResponse } from '@/queries/protocols'
import { PlayerResponse } from '@/queries/players'

import { StatisticsDialog } from './statistics-dialog'

interface Props {
  teams?: TournamentTable
  statisticsData: ProtocolResponse | undefined
  players: PlayerResponse | undefined
}

export default function GroupBracket({ teams, statisticsData, players }: Props) {

  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [selectedProtocol, setSelectedProtocol] = useState<MatchWithTeamAndSets | null>(null)

  const displayTeams: TeamWithMatches[] = teams?.teams || Array(8).fill({ team: { ID: 0, name: "" }, matches: [], total_points: 0 });

  const findMatches = (team1Id: number, team2Id: number) => {
    const team1 = displayTeams.find(t => t.team.ID === team1Id);
    const team2 = displayTeams.find(t => t.team.ID === team2Id);

    if (!team1 || !team2 || !team1.matches) return [];

    return team1.matches.filter(m =>
      (m.match.p1_id === team1Id && m.match.p2_id === team2Id) ||
      (m.match.p1_id === team2Id && m.match.p2_id === team1Id)
    ).sort((a, b) => a.regrouped ? 1 : -1);
  };

  useEffect(() => {
    if (!isOpen) {
      setSelectedProtocol(null)
    }
  }, [isOpen])

  const handleClick = (match: MatchWithSets) => {
    setIsOpen(true)
    if (match) {
      const selected = statisticsData?.data.filter((protocol) => protocol.team_match.match_id == match.match.ID)
      if (selected) {
        setSelectedProtocol(selected[0])
      }
    }

  }

  const renderMatchCell = (team1Id: number, team2Id: number) => {
    const matches = findMatches(team1Id, team2Id)

    return (
      <div className="flex flex-col space-y-2">
        {[0, 1].map((_, index) => (
          <div onClick={() => handleClick(matches[index])
          } key={index} className="flex flex-col items-center justify-center cursor-pointer">
            {matches[index] ? (
              <>
                <span className="font-bold text-sm text-blue-600">
                  {matches[index].points_gained}
                </span>
                <div className="flex items-center space-x-1">
                  <p className="w-6 text-center font-medium">
                    {matches[index].match.p1_id === team1Id ? matches[index].player_1_score : matches[index].player_2_score}
                  </p>
                  <span className="text-gray-500">-</span>
                  <p className="w-6 text-center font-medium">
                    {matches[index].match.p1_id === team1Id ? matches[index].player_2_score : matches[index].player_1_score}
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
    <div className="container mx-auto p-0 md:p-4">
      <div className="md:hidden mb-4">
        <Select onValueChange={(value) => setSelectedTeam(value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Vali tiim" />
          </SelectTrigger>
          <SelectContent>
            {displayTeams.map((team, index) => (
              <SelectItem key={index} value={team.team.ID.toString()}>
                {team.team.name || `Team ${index + 1}`}
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
                    {displayTeams[index]?.team.name || <Skeleton className="h-6 w-20 mx-auto" />}
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
                    selectedTeam === displayTeams[rowIndex]?.team.ID.toString() ? 'bg-blue-100' : ''
                  )}
                >
                  <TableCell className="font-medium border text-center">
                    {displayTeams[rowIndex]?.team.name || <Skeleton className="h-6 w-20 mx-auto" />}
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
                        renderMatchCell(displayTeams[rowIndex]?.team.ID || 0, displayTeams[colIndex]?.team.ID || 0)
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
      {selectedProtocol && players &&
        <StatisticsDialog index={999} protocol={selectedProtocol} players={players.data} isOpen={isOpen} setIsOpen={setIsOpen} />
      }
    </div>
  )
}