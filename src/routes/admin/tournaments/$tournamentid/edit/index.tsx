import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { TournamentForm } from '../../-components/tournament-form'
import { UseGetTournament } from '@/queries/tournaments'
import ErrorPage from '@/components/error'

export const Route = createFileRoute('/admin/tournaments/$tournamentid/edit/')({
    errorComponent: ({ error, reset }) => {
        return <ErrorPage error={error} reset={reset} />
      },
    component: RouteComponent,
    loader: async ({ context: { queryClient }, params }) => {
        const tournament_data = await queryClient.ensureQueryData(
            UseGetTournament(Number(params.tournamentid)),
        )
    }
})

function RouteComponent() {
    return (
        <div>
            <TournamentForm initial_data={undefined} />
        </div>
    )
}
