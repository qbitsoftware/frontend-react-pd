import { UseGetTournaments } from '@/queries/tournaments'
import { createFileRoute } from '@tanstack/react-router'
import TournamentList from './-components/tournamentList'
import ErrorPage from '@/components/error'
import { XCircle } from 'lucide-react'

export const Route = createFileRoute('/voistlused/')({
  errorComponent: ({ error, reset }) => {
    return <ErrorPage error={error} reset={reset} />
  },
  component: RouteComponent,
  loader: async ({ context: { queryClient } }) => {
    const tournaments = await queryClient.ensureQueryData(UseGetTournaments())
    return { tournaments }
  },
})

function RouteComponent() {
  const { tournaments } = Route.useLoaderData()
  return (
    <div className="w-full h-full flex flex-col mb-20">
      {tournaments.data ? (
        <TournamentList tournaments={tournaments.data} />
      ) : (
        <div className="w-full h-[90vh] flex flex-col items-center justify-center space-y-4 text-center">
          <XCircle className="w-16 h-16 text-gray-400 dark:text-gray-600" />
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-700 dark:text-gray-300">
            Turniirid puuduvad
          </h2>
        </div>
      )}
    </div>
  )
}
