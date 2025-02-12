import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { UseGetMatches, UseGetTournamentMatches } from '@/queries/match'
import { createFileRoute } from '@tanstack/react-router'
import { useTournament } from '../-components/tournament-provider'
import { Skeleton } from '@/components/ui/skeleton'
import { useState } from 'react'
import { Schedule } from './-components/schedule-layout'
import { MatchWrapper, Match } from '@/types/types'

export const Route = createFileRoute('/voistlused/$tournamentid/ajakava/')({
  loader: async ({ context: { queryClient }, params }) => {
    const matchesData = await queryClient.ensureQueryData(
      UseGetTournamentMatches(Number(params.tournamentid)),
    )

    return { matchesData }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { matchesData } = Route.useLoaderData()
  const tournament = useTournament()

  console.log(matchesData)

  const start = tournament.start_date
  const end = tournament.end_date
  const days = Math.ceil(Number(new Date(end)) - Number(new Date(start))) / (1000 * 60 * 60 * 24);
  console.log(days)

  const [activeDay, setActiveDay] = useState<number>(0)

  

  if (matchesData.data && matchesData.data.length > 0) {
    return (
        <Schedule 
          matches={matchesData.data}
          days={days}
          activeDay={activeDay}
          setActiveDay={setActiveDay}
          startDate={start}
        />
    )}
  

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


}