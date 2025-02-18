import { createFileRoute } from '@tanstack/react-router'
import { MatchesResponse, UseGetTournamentMatches } from '@/queries/match'
import { MatchesTable } from '../-components/matches-table'

export const Route = createFileRoute(
  '/admin/tournaments/$tournamentid/mangud/',
)({
  loader: async ({ context: { queryClient }, params }) => {
    let matches: MatchesResponse | undefined = undefined
    try {
      matches = await queryClient.ensureQueryData(
        UseGetTournamentMatches(Number(params.tournamentid)),
      )
    } catch (error) {
      console.error(error)
    }
    return { matches }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { matches } = Route.useLoaderData()
  const {tournamentid} = Route.useParams()
  return (
    <div className="pb-12">
      <MatchesTable  tournament_id={Number(tournamentid)} data={matches?.data || []} />
    </div>
  )
}
