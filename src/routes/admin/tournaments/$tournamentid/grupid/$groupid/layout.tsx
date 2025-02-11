import { createFileRoute, Link, Outlet, useLocation } from '@tanstack/react-router'
import { ErrorResponse } from '@/types/types'
import { UseGetTournamentTable } from '@/queries/tables'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {ScrollArea} from '@/components/ui/scroll-area'

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
  const location = useLocation()

  if (!table_data || !table_data.data) {
    return <></>
  }

  return (
    <div className='px-2'>
      <div className="flex flex-col py-2 lg:flex-row justify-between items-center gap-2 sticky top-0 z-30 bg-gray-50 lg:h-16">
          <div>
            <h3 className="text-2xl font-semibold">{table_data.data.class}</h3>
          </div>
          <div className="flex flex-wrap justify-evenly w-full gap-2 lg:max-w-[500px]">
            <Link className='flex-1' to={`/admin/tournaments/${tournamentid}/grupid/${table_data.data.id}`}>
              <Button className={cn(location.pathname == `/admin/tournaments/${tournamentid}/grupid/${table_data.data.id}` && "bg-secondary text-white", "w-full hover:bg-secondary hover:text-white")} variant="outline">Info</Button>
            </Link>
            <Link className='flex-1' to={`/admin/tournaments/${tournamentid}/grupid/${table_data.data.id}/osalejad`}>
              <Button className={cn(location.pathname == `/admin/tournaments/${tournamentid}/grupid/${table_data.data.id}/osalejad` && "bg-secondary text-white", "w-full hover:bg-secondary hover:text-white")} variant="outline">Participants</Button>
            </Link>
            <Link className='flex-1' to={`/admin/tournaments/${tournamentid}/grupid/${table_data.data.id}/mangud`}>
              <Button className={cn(location.pathname == `/admin/tournaments/${tournamentid}/grupid/${table_data.data.id}/mangud` && "bg-secondary text-white", "w-full hover:bg-secondary hover:text-white")} variant="outline">Matches</Button>
            </Link>
            <Link className='flex-1' to={`/admin/tournaments/${tournamentid}/grupid/${table_data.data.id}/tabelid`}>
              <Button className={cn(location.pathname == `/admin/tournaments/${tournamentid}/grupid/${table_data.data.id}/tabelid` && "bg-secondary text-white", "w-full hover:bg-secondary hover:text-white")} variant="outline">Tables</Button>
            </Link>
          </div>
      </div>

      <div className='pt-4 lg:pt-0'>
        <Outlet />
      </div>
    </div>
  )
}

