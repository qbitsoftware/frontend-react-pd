import { createFileRoute } from '@tanstack/react-router'
import { TournamentForm } from '../-components/tournament-form'
import { UseGetTournament } from '@/queries/tournaments'

export const Route = createFileRoute('/admin/tournaments/$tournamentid/')({
    loader: async ({ context: { queryClient }, params }) => {
        const tournamentId = Number(params.tournamentid)
        let tournament = queryClient.getQueryData(UseGetTournament(tournamentId).queryKey)

        if (!tournament) {
            tournament = await queryClient.fetchQuery(UseGetTournament(tournamentId))
        }

        return { tournament }
    },
    component: RouteComponent,
})

function RouteComponent() {
    const { tournament } = Route.useLoaderData()
    return (
        <TournamentForm initial_data={tournament.data} />
    )
}