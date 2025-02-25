import { UseGetTournamentMatches } from '@/queries/match'
import { createFileRoute } from '@tanstack/react-router'
import { useTournament } from '../-components/tournament-provider'
import { useState } from 'react'
import { Schedule } from './-components/schedule-layout'
import { UseGetTournamentTables } from '@/queries/tables'

export const Route = createFileRoute('/voistlused/$tournamentid/ajakava/')({
  loader: async ({ context: { queryClient }, params }) => {
    const matchesData = await queryClient.ensureQueryData(
      UseGetTournamentMatches(Number(params.tournamentid)),
    )
    const tournament_tables = await queryClient.ensureQueryData(
      UseGetTournamentTables(Number(params.tournamentid))
    )

    return { matchesData, tournament_tables }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { matchesData } = Route.useLoaderData()
  const tournament = useTournament()

  const start = tournament.start_date

  

  // if (matchesData.data.match.)

  const [activeDay, setActiveDay] = useState<number>(0)

  
  

  if (matchesData.data && matchesData.data.length > 0) {
    return (
        <Schedule 
          matches={matchesData.data}
          days={6}
          activeDay={activeDay}
          setActiveDay={setActiveDay}
          startDate={start}
        />
    )}
  

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

// const NoMatches = () => (
//   <Card className="w-full">
//     <CardContent className="p-6">
//       <p className="text-center">Mängud pole ajakavas</p>
//     </CardContent>
//   </Card>
// )


}