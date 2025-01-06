import { createFileRoute } from '@tanstack/react-router'
import { UseGetTournaments } from '@/queries/tournaments'
import AdminTournament from './-components/tournaments'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'

export const Route = createFileRoute('/admin/tournaments/')({
    loader: async ({ context: { queryClient } }) => {
        try {
            const tournaments_data =
                await queryClient.ensureQueryData(UseGetTournaments())
            return { tournaments_data, error: null }
        } catch (error: any) {
            return { tournaments_data: null, error }
        }
    },
    component: RouteComponent,
})

function RouteComponent() {
    const { tournaments_data, error } = Route.useLoaderData()
    console.log(tournaments_data, error)

    if (error) {
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
            <AdminTournament tournaments={tournaments_data.data} />
        </div>
    )
}
