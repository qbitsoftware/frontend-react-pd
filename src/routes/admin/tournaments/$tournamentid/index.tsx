import { createFileRoute } from '@tanstack/react-router'
import { TournamentForm } from '../-components/tournament-form'
import { UseGetTournament } from '@/queries/tournaments'
import ErrorPage from '@/components/error'

export const Route = createFileRoute('/admin/tournaments/$tournamentid/')({
    loader: async ({ context: { queryClient }, params }) => {
        const tournamentId = Number(params.tournamentid)
        let tournament = queryClient.getQueryData(UseGetTournament(tournamentId).queryKey)

        if (!tournament) {
            tournament = await queryClient.fetchQuery(UseGetTournament(tournamentId))
        }

        return { tournament }
    },

    errorComponent: () => <ErrorPage />,
    component: RouteComponent,
})

function RouteComponent() {
    const { tournament } = Route.useLoaderData()
    return (
        <div className='mb-12'>
            <TournamentForm initial_data={tournament.data} />
        </div>
    )
}