import { createFileRoute, Outlet } from '@tanstack/react-router'
import Navbar from './-components/navbar'
import { UseGetTournament } from '@/queries/tournaments'
import { TournamentProvider } from './-components/tournament-provider'
import {useEffect} from "react"

export const Route = createFileRoute('/voistlused/$tournamentid')({
  component: RouteComponent,
  loader: async ({ context: { queryClient }, params }) => {
    const tournamentData = await queryClient.ensureQueryData(
      UseGetTournament(Number(params.tournamentid)),
    )

    return { tournamentData }
  },
})

function RouteComponent() {
  const { tournamentData } = Route.useLoaderData()

  useEffect(() => {
    window.scrollTo(0,0)
  }, [])

  if (tournamentData.data) {
    return (
      <TournamentProvider tournamentData={tournamentData.data}>
        <div className="max-w-[1440px] mx-auto">
        <Navbar />
        <div className=" rounded-[16px] border border-stone-200 mx-2 md:mx-12 my-3">
          <Outlet />
        </div>
        </div>
      </TournamentProvider>
    )
  } else {
    return <div>Vaike error</div>
  }
}
