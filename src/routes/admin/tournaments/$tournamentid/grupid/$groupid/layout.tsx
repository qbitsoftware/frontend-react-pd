import { createFileRoute, Link, Outlet, useLocation } from '@tanstack/react-router'
import { ErrorResponse } from '@/types/types'
import { UseGetTournamentTable } from '@/queries/tables'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export const Route = createFileRoute(
  '/admin/tournaments/$tournamentid/grupid/$groupid',
)({
  component: RouteComponent,
  loader: async ({ context: { queryClient }, params }) => {

    let table_data

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
    return { table_data }
  },
})


function RouteComponent() {
  const { table_data } = Route.useLoaderData()
  const { tournamentid } = Route.useParams()
  const location = useLocation() // see oli puudu enne

  if (!table_data || !table_data.data) {
    return <></>
  }

  return (
    <>
      <div className="sticky top-0 z-10 bg-gray-50 py-4">
        <div className='flex justify-between'>
          <div>
            <h3 className="text-3xl font-semibold">{table_data.data.class}</h3>

          </div>
          <div className="flex flex-wrap justify-evenly w-full gap-2 lg:max-w-[500px]">
            <Link className='flex-1' to={`/admin/tournaments/${tournamentid}/grupid/${table_data.data.id}`}>
              <Button className={cn(location.pathname == `/admin/tournaments/${tournamentid}/grupid/${table_data.data.id}` && "bg-secondary text-white", "w-full hover:bg-secondary hover:text-white")} variant="outline">Info</Button>
            </Link>
            <Link className='flex-1' to={`/admin/tournaments/${tournamentid}/grupid/${table_data.data.id}/mangud`}>
              <Button className={cn(location.pathname == `/admin/tournaments/${tournamentid}/grupid/${table_data.data.id}/mangud` && "bg-secondary text-white", "w-full hover:bg-secondary hover:text-white")} variant="outline">Mängud</Button>
            </Link>
            <Link className='flex-1' to={`/admin/tournaments/${tournamentid}/grupid/${table_data.data.id}/osalejad`}>
              <Button className={cn(location.pathname == `/admin/tournaments/${tournamentid}/grupid/${table_data.data.id}/osalejad` && "bg-secondary text-white", "w-full hover:bg-secondary hover:text-white")} variant="outline">Osalejad</Button>
            </Link>
            <Link className='flex-1' to={`/admin/tournaments/${tournamentid}/grupid/${table_data.data.id}/tabelid`}>
              <Button className={cn(location.pathname == `/admin/tournaments/${tournamentid}/grupid/${table_data.data.id}/tabelid` && "bg-secondary text-white", "w-full hover:bg-secondary hover:text-white")} variant="outline">Tabelid</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className='py-4'>
        <Outlet />
      </div>
    </>
  )
}

