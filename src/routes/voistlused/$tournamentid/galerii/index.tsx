import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Images } from '../../-components/images'
import { useTournament } from '../-components/tournament-provider'


export const Route = createFileRoute('/voistlused/$tournamentid/galerii/')({
    component: RouteComponent,
})


function RouteComponent() {
    const tournament_id = Route.useParams().tournamentid
    const [activeTab, setActiveTab] = React.useState("1")
    const tournament = useTournament();

    const startDate = tournament?.start_date ? new Date(tournament.start_date) : new Date();
    const endDate = tournament?.end_date ? new Date(tournament.end_date) : new Date();

    const diffTime = Math.abs(Number(endDate) - Number(startDate));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const gameDaysArray = Array.from({ length: Math.max(diffDays, 1) }, (_, index) => index + 1);



    return (
        <div className="px-12 py-8">
            <h5 className="font-bold mb-8">Galerii</h5>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 md:grid-cols-8 mb-10 md:mb-4">
                    {gameDaysArray.map((day) => (
                        <TabsTrigger
                            key={day}
                            value={day.toString()}
                            className=""
                        >
                            Päev {day}
                        </TabsTrigger>
                    ))}
                </TabsList>
                {gameDaysArray.map((day) => (
                    <TabsContent key={day} value={day.toString()}>
                        <div>
                            <Images tournament_id={Number(tournament_id)} user={undefined} gameDay={String(day)} />
                        </div>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    )
}