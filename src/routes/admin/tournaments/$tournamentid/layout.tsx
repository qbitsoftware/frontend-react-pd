import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { UseGetTournament } from '@/queries/tournaments'
import { ErrorResponse } from '@/types/types'
import { Button } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'

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
  const { tournament_data } = Route.useLoaderData()
  const { tournamentid } = Route.useParams()

  return (
    <div className="w-full p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{tournament_data.data?.name}</h1>
        <div className="space-x-4">
          <Link to={`/admin/tournaments/${tournamentid}/matches`}>
            <Button variant="outline">Matches</Button>
          </Link>
          <Link to={`/admin/tournaments/${tournamentid}/participants`}>
            <Button variant="outline">Participants</Button>
          </Link>
          <Link to={`/admin/tournaments/${tournamentid}/brackets`}>
            <Button variant="outline">Brackets</Button>
          </Link>
          <Link to={`/admin/tournaments/${tournamentid}/edit`}>
            <Button variant="outline">Brackets</Button>
          </Link>
        </div>
      </div>
      <Outlet/>
    </div>
  )
}
