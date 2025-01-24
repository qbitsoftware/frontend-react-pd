import { createFileRoute } from '@tanstack/react-router'
import { MatchesResponse, UseGetMatches } from '@/queries/match'
import { MatchesTable } from './-components/matches-table'

export const Route = createFileRoute(
  '/admin/tournaments/$tournamentid/matches/',
)({
  loader: async ({ context: { queryClient }, params }) => {
    let matches: MatchesResponse | undefined = undefined
    try {
      matches = await queryClient.ensureQueryData(UseGetMatches(Number(params.tournamentid)))
    } catch(error) {
      console.error(error)
    }
    return { matches }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { matches } = Route.useLoaderData()
  return (
    <div>
      <MatchesTable data={matches?.data || []}/>
    </div>
  )
}
