import { createFileRoute, Outlet, redirect, useLocation } from '@tanstack/react-router'
import { UseGetTournament } from '@/queries/tournaments'
import { ErrorResponse } from '@/types/types'
import { Button } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ArrowLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'

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
  const { tournament_data } = Route.useLoaderData()
  const { tournamentid } = Route.useParams()

  const { t } = useTranslation()

  return (
      <div className="mx-auto container h-full">
        <div className="w-full md:px-6">
          {/*
          <div className="flex flex-col sm:flex-row justify-between mb-6">
            <Link href="/admin/tournaments">
              <Button variant="outline" className="flex items-center w-full sm:w-auto">
                <ArrowLeft className="w-4 h-4 mr-2" />
                  {t("admin.tournaments.create_tournament.back_button")}
              </Button>
            </Link>
          </div>
          */}
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-center w-full bg-gray-50 lg:my-1 lg:h-16">
            <h1 className="text-3xl font-bold text-secondary">{tournament_data.data?.name}</h1>
            <div className="flex flex-wrap justify-evenly w-full gap-2 lg:max-w-[500px]">
              <Link className='flex-1' to={`/admin/tournaments/${tournamentid}`}>
                <Button className={cn(location.pathname == (`/admin/tournaments/${tournamentid}`) && "bg-secondary text-white", "w-full hover:bg-secondary hover:text-white")} variant="outline">Info</Button>
              </Link>
              <Link className='flex-1' to={`/admin/tournaments/${tournamentid}/grupid`}>
                <Button className={cn(location.href.includes(`/admin/tournaments/${tournamentid}/grupid`) && "bg-secondary text-white", "w-full hover:bg-secondary hover:text-white")} variant="outline">Groups</Button>
              </Link>
              <Link className='flex-1' to={`/admin/tournaments/${tournamentid}/mangud`}>
                <Button className={cn(location.pathname == (`/admin/tournaments/${tournamentid}/mangud`) && "bg-secondary text-white", "w-full hover:bg-secondary hover:text-white")} variant="outline">All matches</Button>
              </Link>
            </div>
          </div>
          
          
          <div className='pt-4'>
            <ScrollArea className='h-[calc(100vh-12rem)] pr-4'>
              <Outlet />
            </ScrollArea>
          </div>
        </div>
      </div>
  )
}
