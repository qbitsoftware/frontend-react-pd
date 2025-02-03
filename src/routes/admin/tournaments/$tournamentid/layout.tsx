import { createFileRoute, Outlet, redirect, useLocation } from '@tanstack/react-router'
import { UseGetTournament } from '@/queries/tournaments'
import { ErrorResponse } from '@/types/types'
import { Button } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'

export const Route = createFileRoute('/admin/tournaments/$tournamentid')({
  component: RouteComponent,
  loader: async ({ context: { queryClient }, params }) => {
    let tournament_data = undefined
    try {
      tournament_data = await queryClient.ensureQueryData(
        UseGetTournament(Number(params.tournamentid)),
      )
    } catch (error) {
      const err = error as ErrorResponse
      if (err.response.status === 404) {
        throw redirect({
          to: '/admin/tournaments',
        })
      }
      throw error
    }

    return { tournament_data }
  },
})


function RouteComponent() {
  const location = useLocation()
  console.log(location)
  const { tournament_data } = Route.useLoaderData()
  const { tournamentid } = Route.useParams()

  return (
    <div className="w-full md:p-6 space-y-6 max-h-screen">
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-center w-full ">
        <h1 className="text-4xl font-bold text-secondary">{tournament_data.data?.name}</h1>
        <div className="flex flex-wrap justify-evenly w-full gap-2 lg:max-w-[800px]">
          <Link className='flex-1' to={`/admin/tournaments/${tournamentid}`}>
            <Button className={cn(location.href == `/admin/tournaments/${tournamentid}` && "bg-secondary text-white", "w-full hover:bg-secondary hover:text-white")} variant="outline">Info</Button>
          </Link>
          <Link className='flex-1' to={`/admin/tournaments/${tournamentid}/grupid`}>
            <Button className={cn(location.href == `/admin/tournaments/${tournamentid}/grupid` && "bg-secondary text-white", "w-full hover:bg-secondary hover:text-white")} variant="outline">Grupid</Button>
          </Link>
        </div>
      </div>
      <Separator/>
      <div className=''>
        <Outlet />
      </div>
    </div>
  )
}
