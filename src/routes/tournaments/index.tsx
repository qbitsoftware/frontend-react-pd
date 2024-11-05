import { useGetTournaments } from '@/queries/tournaments'
import { createFileRoute } from '@tanstack/react-router'
import TournamentList from './-components/tournamentList'

export const Route = createFileRoute('/tournaments/')({
    component: RouteComponent,
})


function RouteComponent() {
    const { data, isLoading } = useGetTournaments()
    console.log("DATA", data)
    if (isLoading) return <>Laen...</>
    if (!data) return <>error</>
    return (
        <div className='w-full h-full flex flex-col'>
            <TournamentList tournaments={data.data} />
        </div>
    )
}
