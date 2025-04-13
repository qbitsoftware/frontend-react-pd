import { createFileRoute } from '@tanstack/react-router'
import { UseGetTournament } from '@/queries/tournaments'
import { UseGetParticipants, UseGetParticipantsQuery } from '@/queries/participants'
import { UseGetTournamentTable } from '@/queries/tables'
import { ParticipanForm } from '../../../-components/participants-form'
import Loader from '@/components/loader'
import ErrorPage from '@/components/error'
import TournamentParticipantsManager from '../../-components/subgroup-form'
import { ErrorResponse } from '@/types/errors'

export const Route = createFileRoute(
    '/admin/tournaments/$tournamentid/grupid/$groupid/osalejad/',
)({
    component: RouteComponent,
    errorComponent: () => <ErrorPage />,
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

    const { data: participant_data } = UseGetParticipantsQuery(tournament_data?.data?.id!, table_data?.data?.id!, false, participants!)

    if (tournament_data && tournament_data.data && table_data && table_data.data && participant_data) {
        return (
            <div className=''>
                {tournament_data && table_data && participants && table_data.data.type !== "round_robin_full_placement" &&
                    <ParticipanForm
                        participants={participants.data}
                        tournament_data={tournament_data.data}
                        table_data={table_data.data}
                    />
                }
                {tournament_data && table_data && participants && table_data.data.type === "round_robin_full_placement" &&
                    <TournamentParticipantsManager
                        participants={participant_data.data}
                        tournament_data={tournament_data.data}
                        table_data={table_data.data}
                    />
                }
            </div>
        )
    } else {
        return (
            <div className='flex justify-center items-center h-[50vh]'>
                <Loader />
            </div>
        )
    }


}
