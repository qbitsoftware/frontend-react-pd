import { createFileRoute } from '@tanstack/react-router'
import { TournamentTables } from './-components/tables'
import { UseGetTournamentTables } from '@/queries/tables'
import { UseGetTournament } from '@/queries/tournaments'
import { ErrorResponse } from '@/types/types'

export const Route = createFileRoute(
  '/admin/tournaments/$tournamentid/grupid/',
)({
  component: RouteComponent,
  loader: async ({ context: { queryClient }, params }) => {
    let tournament_tables
    try {
        tournament_tables = await queryClient.ensureQueryData(
        UseGetTournamentTables(Number(params.tournamentid)),
      )
    } catch (error) {
      const err = error as ErrorResponse
      if (err.response.status !== 404) {
        throw error
      }
    }
    const tournament = await queryClient.ensureQueryData(
      UseGetTournament(Number(params.tournamentid)),
    )
    return { tournament, tournament_tables }
  },
})

function RouteComponent() {
  const { tournament_tables, tournament } = Route.useLoaderData()

  if (!tournament || !tournament.data) {
    return <div></div>
  }

  return (
    <div>
      <TournamentTables tables={tournament_tables?.data} tournament={tournament.data} />
    </div>
  )
}
