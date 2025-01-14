import { createFileRoute, Link } from '@tanstack/react-router'
import { UseGetTournaments } from '@/queries/tournaments'
import AdminTournament from './-components/tournaments'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'
import { ErrorResponse } from '@/types/types'
import { Trophy } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/admin/tournaments/')({
    loader: async ({ context: { queryClient } }) => {
        try {
            const tournaments_data = await queryClient.ensureQueryData(UseGetTournaments())
            return { tournaments_data, error: null }
        } catch (error) {
            return { tournaments_data: null, error }
        }
    },
    component: RouteComponent,
})

function RouteComponent() {
    const { tournaments_data, error } = Route.useLoaderData()
    console.log(tournaments_data, error)

    if (tournaments_data && tournaments_data.data ) {
        return (
            <div className=''>
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Tournaments
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Manage and organize tournaments
                        </p>
                    </div>
                </div>
                <AdminTournament tournaments={tournaments_data.data}  />
            </div>
        )

    } else {
        const err = error as ErrorResponse
        if (err.response.status == 404) {
            return (
                <div className="flex flex-col items-center justify-center min-h-[400px] bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                    <Trophy className="w-16 h-16 text-gray-300 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No Tournaments Found</h3>
                    <p className="text-gray-500 text-center max-w-md">
                        There are currently no tournaments to display. Create a new tournament to get started.
                    </p>
                    <Link href='/admin/tournaments/new'>
                        <Button>
                            Lisa uus turniir
                        </Button>
                    </Link>
                </div>
            );
        } else {
            return (
                <Card className="w-full">
                    <CardHeader className="flex flex-row items-center space-x-4">
                        <div className="p-2 bg-red-100 rounded-lg">
                            <AlertCircle className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                            <CardTitle>Error</CardTitle>
                            <p className="text-gray-600 mt-1">
                                An error occurred while fetching tournaments
                            </p>
                        </div>
                    </CardHeader>
                </Card>
            )

        }
    }
}
