import { createFileRoute, Outlet } from '@tanstack/react-router'
import Navbar from './-components/navbar'
import { UseGetTournament } from '@/queries/tournaments'
import { TournamentProvider } from './-components/tournament-provider'

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


  if (tournamentData.data) {
    return (
      <TournamentProvider tournamentData={tournamentData.data}>
        <Navbar />
        <div className='h-screen'>
          <Outlet />
        </div>
      </TournamentProvider>
    )
  } else {
    return (
      <div>
        Vaike error
      </div>
    )
  }

}