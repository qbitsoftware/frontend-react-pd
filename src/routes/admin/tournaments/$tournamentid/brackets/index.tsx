import { createFileRoute} from '@tanstack/react-router'
import BracketComponent from './-components/bracket'
import { UseGetBracketQuery } from '@/queries/brackets'

export const Route = createFileRoute(
    '/admin/tournaments/$tournamentid/brackets/',
)({
    component: RouteComponent,
})

function RouteComponent() {
    const params = Route.useParams()

    const { data: bracketsData, isLoading, error } = UseGetBracketQuery(Number(params.tournamentid))

    if (isLoading) {
        return <div>Laeb</div>
    } else if (!bracketsData || error) {
        <div>Haige error</div>
    } else {
        return (
            <div className='w-screen h-screen'>
                <BracketComponent bracket={bracketsData} />
            </div>
        )
    }
}
