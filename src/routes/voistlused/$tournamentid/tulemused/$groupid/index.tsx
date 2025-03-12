import GroupBracket from '@/components/group-bracket'
import { Window } from '@/components/window'
import { UseGetBracket } from '@/queries/brackets'
import { UseGetTournamentTable } from '@/queries/tables'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/voistlused/$tournamentid/tulemused/$groupid/',
)({
  loader: async ({ context: { queryClient }, params }) => {
    const table_data = await queryClient.ensureQueryData(UseGetTournamentTable(Number(params.tournamentid), Number(params.groupid)))
    const bracket_data = await queryClient.ensureQueryData(UseGetBracket(Number(params.tournamentid), Number(params.groupid)))

    return { table_data, bracket_data }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { bracket_data, table_data } = Route.useLoaderData()

  if (!bracket_data.data || !table_data.data) {
    return <div>0</div>
  }
  return (
    <div className='h-screen py-10'>
      <GroupBracket brackets={bracket_data.data.round_robins[0]} />
      <Window data={bracket_data.data} tournament_table={table_data.data} />
    </div>
  )
}