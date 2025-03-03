"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
// import { formatDate } from '@/lib/utils'
import { MatchWrapper, Tournament } from '@/types/types'

interface TimeTableProps {
  tournament: Tournament
  matches: MatchWrapper[]
}

export const TimeTable: React.FC<TimeTableProps> = ({ tournament, matches }: TimeTableProps) => {
  const [activeDay, setActiveDay] = useState<string>('')
  // const [isOpen, setIsOpen] = useState<boolean>(false)

  //   const toast = useToast()
  //   const { successToast, errorToast } = useToastNotification(toast)

  // if (isLoading) return <LoadingSkeleton />
  // if (error) return <ErrorMessage message={error.message} />
  // if (!data || !data.data || data.data.length === 0) return <NoMatches />

  // const matchesByDay = data.data.reduce((acc, match) => {
  //   if (!acc[match.identifier]) {
  //     acc[match.identifier] = []
  //   }
  //   acc[match.identifier].push(match)
  //   return acc
  // }, {} as Record<number, MatchWrapper[]>)

  // for (let i = 4; i <= 6; i++) {
  //   if (!matchesByDay[i]) {
  //     matchesByDay[i] = []
  //   }
  // }

  // if (!activeDay && Object.keys(matchesByDay).length > 0) {
  //   setActiveDay(Object.keys(matchesByDay)[0])
  // }

  // const handleRowClick = (match: MatchWrapper) => {
    //todooooo
    // if (loginData?.data) {
    //   setSelectedMatch(match)
    //   setIsModalOpen(true)
    // } else if (!loginData?.data && match.winner_id != 0) {
    //   setIsOpen(true)
    //   if (match) {
    //     const selected = statisticsData?.data.filter((protocol) => protocol.team_match.match_id == match.id)
    //     if (selected) {
    //       setSelectedProtocol(selected[0])
    //     }
    //   }
    // }
  // }


  const renderTableContent = (match: MatchWrapper) => {
    // if (matches.length > 0) {
    //   return matches.map((match, index) => {
    //     const showRound = index === 0 || match.match.round !== matches[index - 1]?.match.round
        // const startDate = new Date(match.match.start_date);
        // const showDate = index === 0 || match.start_date !== matches[index - 1]?.start_date

        return (
          <TableRow key={match.match.id} className='cursor-pointer hover:bg-secondary/50' onClick={() => console.log("jeu")}>
            {/* <TableCell>{showRound ? match.match.round : ''}</TableCell> */}
            <TableCell>{match.p1.name}</TableCell>
            <TableCell>{match.p2.name}</TableCell>
            <TableCell>{match.match.extra_data.table}</TableCell>
            <TableCell>
              {/* {showDate ? `${String(startDate.getHours()).padStart(2, '0')}:${String(startDate.getMinutes()).padStart(2, '0')}` : ''} */}
              {/* {showDate ? `${String(startDate.getUTCHours()).padStart(2, '0')}:${String(startDate.getUTCMinutes()).padStart(2, '0')}` : ''} */}
              {/* {showDate ? new Date(match.start_date).toLocaleTimeString('et-EE', { hour: '2-digit', minute: '2-digit' }) : ''} */}

            </TableCell>
          </TableRow>
        )
      // })
    // } else {
      // return <PlaceholderContent />
    
  }

  return (
    <Card className="w-full">
      <CardHeader className='flex flex-col sm:flex-row justify-between items-start sm:items-center pt-4 pb-0 sm:pb-2'>
        <CardTitle className="text-xl md:text-2xl mb-4 sm:mb-0">{tournament.name} Ajakava</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className='pb-4'>
          {Number(activeDay) === 6
            ? "03. mai 2025"
            // : matchesByDay[Number(activeDay)] && matchesByDay[Number(activeDay)][0]
            // ? formatDate(matchesByDay[Number(activeDay)][0].start_date)
            : "Aega pole määratud"}
          {", "}
          {Number(activeDay) === 6
            ? "TTÜ Spordihoone"
            // : matchesByDay[Number(activeDay)] && matchesByDay[Number(activeDay)][0]
            // ? matchesByDay[Number(activeDay)][0].place
            : "Asukohta pole määratud"}

        </CardDescription>
        <Tabs value={activeDay} onValueChange={setActiveDay}>
          <ScrollArea className="w-full whitespace-nowrap">
            <TabsList className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
              {/* {Object.keys(matchesByDay).map((day) => (
                <TabsTrigger key={day} value={day} className="text-sm md:text-base px-3">
                  Päev {day}
                </TabsTrigger>
              ))} */}
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
          {matches ? matches.map((match, index) => {

return (
            <TabsContent key={index} value={"1"}>
              <ScrollArea className="w-full">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-1/12">Voor</TableHead>
                      <TableHead className="w-2/6">Tiim 1</TableHead>
                      <TableHead className="w-2/6">Tiim 2</TableHead>
                      <TableHead className="w-1/12">Laud</TableHead>
                      <TableHead className="w-1/6">Kell</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {renderTableContent(match)}
                  </TableBody>
                </Table>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </TabsContent>

)

          }): <NoMatches />}
        </Tabs>
      </CardContent>
    </Card>
  )
}

// const LoadingSkeleton = () => (
//   <Card className="w-full">
//     <CardHeader>
//       <Skeleton className="h-8 w-3/4" />
//     </CardHeader>
//     <CardContent>
//       <Skeleton className="h-10 w-full mb-4" />
//       <Skeleton className="h-64 w-full" />
//     </CardContent>
//   </Card>
// )

// const ErrorMessage = ({ message }: { message: string }) => (
//   <Card className="w-full">
//     <CardContent className="p-6">
//       <p className="text-red-500 text-center">Error: {message}</p>
//     </CardContent>
//   </Card>
// )

const NoMatches = () => (
  <Card className="w-full">
    <CardContent className="p-6">
      <p className="text-center">Mängud pole ajakavas</p>
    </CardContent>
  </Card>
)

// const PlaceholderContent = () => (
//   <TableRow>
//     <TableCell colSpan={5} className="text-center py-8">
//       <p className="text-gray-500 mb-2">Selle päeva mängud luuakse varasemate tulemuste põhjal.</p>
//       <Skeleton className="h-4 w-3/4 mx-auto mb-2" />
//       <Skeleton className="h-4 w-1/2 mx-auto" />
//     </TableCell>
//   </TableRow>
// )
