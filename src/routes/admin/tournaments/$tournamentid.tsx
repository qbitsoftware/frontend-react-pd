import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { TournamentForm } from './-components/tournament-form'
import { UseGetTournament } from '@/queries/tournaments'

export const Route = createFileRoute('/admin/tournaments/$tournamentid')({
    component: RouteComponent,
    loader: async ({ context: { queryClient }, params }) => {
        let tournament_data = undefined

        if (params.tournamentid == "new") {
            return { tournament_data }
        } else if (params.tournamentid != "new" && isNaN(Number(params.tournamentid))) {
            throw redirect({
                to: '/admin/tournaments'
            })
        }

        tournament_data = await queryClient.ensureQueryData(UseGetTournament(Number(params.tournamentid)))

        return { tournament_data }
    }
})

function RouteComponent() {
    const navigate = useNavigate()
    const { tournament_data } = Route.useLoaderData()

    if (tournament_data?.data) {
        navigate({ to: "/admin/tournaments" })
    }

    return <TournamentForm initial_data={tournament_data?.data} />
}