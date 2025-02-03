import { createFileRoute } from '@tanstack/react-router'
import { UseGetTournament } from '@/queries/tournaments'
import { UseGetParticipants } from '@/queries/participants'
import { ErrorResponse } from '@/types/types'
import { UseGetTournamentTable } from '@/queries/tables'
import { ParticipanForm } from '../../../-components/participants-form'

export const Route = createFileRoute(
    '/admin/tournaments/$tournamentid/grupid/$groupid/osalejad/',
)({
    component: RouteComponent,
    loader: async ({ context: { queryClient }, params }) => {
        let participants
        let tournament_data
        let table_data
        try {
            participants = await queryClient.ensureQueryData(
                UseGetParticipants(Number(params.tournamentid), Number(params.groupid)),
            )
        } catch (error) {
            const err = error as ErrorResponse
            if (err.response.status !== 404) {
                throw error
            }
        }
        try {
            tournament_data = await queryClient.ensureQueryData(
                UseGetTournament(Number(params.tournamentid)),
            )
        } catch (error) {
            const err = error as ErrorResponse
            if (err.response.status !== 404) {
                throw error
            }
        }

        try {
            table_data = await queryClient.ensureQueryData(
                UseGetTournamentTable(
                    Number(params.tournamentid),
                    Number(params.groupid),
                ),
            )
        } catch (error) {
            const err = error as ErrorResponse
            if (err.response.status !== 404) {
                throw error
            }
        }
        return { participants, tournament_data, table_data }
    },
})

function RouteComponent() {
    const { participants, tournament_data, table_data } = Route.useLoaderData()

    if (tournament_data && tournament_data.data && table_data && table_data.data) {
        return (
            <div>
                {tournament_data && table_data && participants &&
                    <ParticipanForm
                        participants={participants.data}
                        tournament_data={tournament_data.data}
                        table_data={table_data.data}
                    />
                }
            </div>
        )
    } else {
        return (
            <div>
                Some osrt oferror SIIIIIIIIIN HILJEM OTSI ULESSE MIND
            </div>
        )
    }


}
