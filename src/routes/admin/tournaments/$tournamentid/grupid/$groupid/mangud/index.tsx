import { createFileRoute } from '@tanstack/react-router'
import { MatchesResponse, UseGetMatchesQuery } from '@/queries/match'
import { MatchesTable } from '../../../-components/matches-table'
import { UseGetTournamentTable } from '@/queries/tables'
import { ErrorResponse } from '@/types/types'

export const Route = createFileRoute(
  '/admin/tournaments/$tournamentid/grupid/$groupid/mangud/',
)({
  loader: async ({ context: { queryClient }, params }) => {
    let matches: MatchesResponse | undefined = undefined
    let table_data;
    try {
      table_data = await queryClient.ensureQueryData(
        UseGetTournamentTable(
          Number(params.tournamentid),
          Number(params.groupid),
        ),
      )
    } catch (error) {
      const err = error as ErrorResponse
      if (err.response.status !== 404) {
        throw error
      }
    }
    return { matches, params, table_data }
  },
  component: RouteComponent,
})

function RouteComponent() {

  const { tournamentid, groupid } = Route.useParams()
  const {data: matches} = UseGetMatchesQuery(Number(tournamentid), Number(groupid))


  const { table_data } = Route.useLoaderData()
  if (matches && matches.data && table_data && table_data.data) {
    return (
      <div className='pb-12'>
        <MatchesTable table_data={table_data.data} tournament_id={Number(tournamentid)} data={matches.data || []} />
      </div>
    )
  } else {
    return (
      <div>Ero hereee</div>
    )
  }
}
