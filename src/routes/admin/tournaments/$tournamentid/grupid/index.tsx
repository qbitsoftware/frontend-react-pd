import { createFileRoute } from '@tanstack/react-router'
import { TournamentTables } from './-components/tables'
import { UseGetTournamentTables } from '@/queries/tables'

export const Route = createFileRoute(
  '/admin/tournaments/$tournamentid/grupid/',
)({
  component: RouteComponent,
  loader: async ({ context: { queryClient }, params }) => {
    const tournament_tables = await queryClient.ensureQueryData(
      UseGetTournamentTables(Number(params.tournamentid)),
    )
    return { tournament_tables }
  },
})

function RouteComponent() {
  const { tournament_tables } = Route.useLoaderData()
  return (
    <div>
      {/* <TournamentTableForm initial_data={undefined} /> */}
      <TournamentTables tables={tournament_tables.data} />
    </div>
  )
}
