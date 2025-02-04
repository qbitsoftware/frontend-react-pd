import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { UseGetMatches } from '@/queries/match'
import { createFileRoute } from '@tanstack/react-router'
import { useTournament } from '../-components/tournament-provider'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { TableCell } from '@/components/ui/table'
import { useState } from 'react'
import TableContent from './-components/table-content'

export const Route = createFileRoute('/voistlused/$tournamentid/ajakava/')({
  loader: async ({ context: { queryClient }, params }) => {
    const matchesData = await queryClient.ensureQueryData(
      UseGetMatches(Number(params.tournamentid)),
    )

    return { matchesData }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { matchesData } = Route.useLoaderData()
  const tournament = useTournament()
  const [activeDay, setActiveDay] = useState<string>('')


  const filteredMatches = matchesData.data?.filter((match) => (match.match.p1_id !== "empty" && match.match.p2_id !== "empty"))

  if (filteredMatches && filteredMatches.length > 0) {
    return (
      <Card className="w-full mt-[20px] lg:mt-[60px] h-[90%] overflow-y-auto">
        <CardHeader className='flex flex-col sm:flex-row justify-between items-start sm:items-center pt-4 pb-0 sm:pb-2'>
          <CardTitle className="text-xl md:text-2xl mb-4 sm:mb-0">{tournament.name} Ajakava</CardTitle>
          <div className='w-full sm:w-auto flex gap-2 flex-col sm:flex-row'>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeDay} onValueChange={setActiveDay}>
            <ScrollArea className="w-full whitespace-nowrap">
              {/* <TabsList className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
                <TabsTrigger value={"Plussring"} className="text-sm md:text-base px-3">
                  Plussring
                </TabsTrigger>
              </TabsList> */}
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
            {/* <TabsContent key={"Plussring"} value={"Plussring"}> */}
              <ScrollArea className="w-full">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-2/6">Participant 1</TableHead>
                      <TableHead className="w-2/6">Participant 2</TableHead>
                      <TableHead className="w-1/6">Tulemus</TableHead>
                      <TableHead className="w-1/12">Laud</TableHead>
                      <TableHead className="w-1/6">Kell</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMatches.map((match) => {
                      return (
                        <TableContent key={match.match.id} match={match} />
                      )
                    })}
                  </TableBody>
                </Table>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            {/* </TabsContent> */}
          </Tabs>
        </CardContent>
        {/* <StatisticsDialog protocol={selectedProtocol} isOpen={isOpen} players={players.data} setIsOpen={setIsOpen} index={999} /> */}
      </Card>
    )
  } else if (filteredMatches && filteredMatches.length === 0) {
    return <NoMatches />
  }
}
const LoadingSkeleton = () => (
  <Card className="w-full">
    <CardHeader>
      <Skeleton className="h-8 w-3/4" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-10 w-full mb-4" />
      <Skeleton className="h-64 w-full" />
    </CardContent>
  </Card>
)

const ErrorMessage = ({ message }: { message: string }) => (
  <Card className="w-full">
    <CardContent className="p-6">
      <p className="text-red-500 text-center">Error: {message}</p>
    </CardContent>
  </Card>
)

const NoMatches = () => (
  <Card className="w-full">
    <CardContent className="p-6">
      <p className="text-center">Mängud pole ajakavas</p>
    </CardContent>
  </Card>
)

const PlaceholderContent = () => (
  <TableRow>
    <TableCell colSpan={5} className="text-center py-8">
      <p className="text-gray-500 mb-2">Selle päeva mängud luuakse varasemate tulemuste põhjal.</p>
      <Skeleton className="h-4 w-3/4 mx-auto mb-2" />
      <Skeleton className="h-4 w-1/2 mx-auto" />
    </TableCell>
  </TableRow>
)
