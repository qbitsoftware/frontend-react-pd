import { createFileRoute, Outlet } from '@tanstack/react-router'
import Navbar from './-components/navbar'
import { UseGetTournament } from '@/queries/tournaments'
import { TournamentProvider } from './-components/tournament-provider'
import { useEffect } from "react"
import ErrorPage from '@/components/error'
import NotFoundPage from '@/routes/-components/notfound'
import { UseGetTournamentTables } from '@/queries/tables'
import { ErrorResponse } from '@/types/types'

export const Route = createFileRoute('/voistlused/$tournamentid')({
  component: RouteComponent,
  errorComponent: () => <ErrorPage />,
  notFoundComponent: () => <NotFoundPage />,
  loader: async ({ context: { queryClient }, params }) => {
    const tournamentData = await queryClient.ensureQueryData(
      UseGetTournament(Number(params.tournamentid)),
    )

    let tournament_tables = null;
    try {
      tournament_tables = await queryClient.ensureQueryData(
        UseGetTournamentTables(Number(params.tournamentid)),
      )
    } catch (error) {
      const err = error as ErrorResponse
      if (err.response?.status === 404) {
        return { tournamentData, tournament_tables: null }
      }
    }

    return { tournament_tables, tournamentData }
  },
})

function RouteComponent() {
  const { tournamentData, tournament_tables } = Route.useLoaderData()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  if (tournamentData.data && tournament_tables && tournament_tables.data) {
    return (
      <TournamentProvider tournamentData={tournamentData.data}>
        <div className="max-w-[1440px] mx-auto">
          <Navbar tournament_tables={tournament_tables.data} />
          <div className=" rounded-[16px] border border-stone-200 mx-2 md:mx-12 my-3">
            <Outlet />
          </div>
        </div>
      </TournamentProvider>
    )
  } else {
    return <ErrorPage />
  }
}
