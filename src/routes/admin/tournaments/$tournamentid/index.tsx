import { createFileRoute, redirect } from '@tanstack/react-router'
import { TournamentForm } from '../-components/tournament-form'
import { UseGetTournament } from '@/queries/tournaments'
import { ErrorResponse } from '@/types/types'

export const Route = createFileRoute('/admin/tournaments/$tournamentid/')({
  component: RouteComponent,
  loader: async ({ context: { queryClient }, params }) => {
    let tournament_data = undefined

    if (params.tournamentid == 'new') {
      return { tournament_data }
    } else if (
      params.tournamentid != 'new' &&
      isNaN(Number(params.tournamentid))
    ) {
      throw redirect({
        to: '/admin/tournaments',
      })
    }

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
  const { tournament_data } = Route.useLoaderData()

  return (
    <div className="w-full">
      <TournamentForm initial_data={tournament_data?.data} />
    </div>
  )
}
