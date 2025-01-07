import { createFileRoute } from '@tanstack/react-router'
import { UserPlus, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ParticipantsList } from '../-components/participant-list'
import { AddParticipantDialog } from '../-components/participant-dialog'
import { useState } from 'react'
import { ErrorResponse } from '@/types/types'
import { UseGetParticipants } from '@/queries/participants'


export const Route = createFileRoute(
    '/admin/tournaments/$tournamentid/participants/',
)({
    component: RouteComponent,
    loader: async ({ context: { queryClient }, params }) => {
        let participants
        try {
            participants = await queryClient.ensureQueryData(
                UseGetParticipants(Number(params.tournamentid)),
            )
            return { participants }
        } catch (error) {
            const err = error as ErrorResponse
            if (err.response.status !== 404) {
                console.log("JOu meil on error")
                throw error
            } 
        }
        return { participants }
    },
})

function RouteComponent() {
    const { tournamentid } = Route.useParams()
    const { participants } = Route.useLoaderData()
    console.log("idddd", tournamentid, participants)
    const tournamentId = "1"
    const [isAddParticipantOpen, setIsAddParticipantOpen] = useState(false)


    if (participants && participants.data) {
        return (
            <div className="container py-6 space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Manage Teams</h1>
                    <Button onClick={() => setIsAddParticipantOpen(true)}>
                        <UserPlus className="w-4 h-4 mr-2" />
                        Add Participant
                    </Button>
                </div>

                <Tabs defaultValue="participants">
                    <TabsList>
                        <TabsTrigger value="participants">
                            <Users className="w-4 h-4 mr-2" />
                            Participants
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="participants">
                        <Card>
                            <CardHeader>
                                <CardTitle>Registered Participants</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ParticipantsList participants={participants.data} />
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                <AddParticipantDialog
                    open={isAddParticipantOpen}
                    onOpenChange={setIsAddParticipantOpen}
                    tournamentId={tournamentId}
                />
            </div>
        )
    } else {
        return (
            <div className="container py-6 space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Manage Teams</h1>
                    <Button onClick={() => setIsAddParticipantOpen(true)}>
                        <UserPlus className="w-4 h-4 mr-2" />
                        Add Participant
                    </Button>
                </div>

                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <Users className="w-12 h-12 text-gray-400 mb-4" />
                        <h2 className="text-xl font-semibold text-gray-600 mb-2">No Participants Yet</h2>
                        <p className="text-gray-500 text-center mb-4">No participants have registered for this tournament yet.</p>
                        <Button onClick={() => setIsAddParticipantOpen(true)}>
                            <UserPlus className="w-4 h-4 mr-2" />
                            Add First Participant
                        </Button>
                    </CardContent>
                </Card>

                <AddParticipantDialog
                    open={isAddParticipantOpen}
                    onOpenChange={setIsAddParticipantOpen}
                    tournamentId={tournamentId}
                />
            </div>
        )
    }

}
