import { createFileRoute, useParams } from '@tanstack/react-router'
import Standings from '@/components/standings'
import { UseGetParticipantsQuery } from '@/queries/participants'
import LoadingScreen from '@/routes/-components/loading-screen'
import EmptyComponent from '@/routes/-components/empty-component'
import ErrorPage from '@/components/error'

export const Route = createFileRoute('/voistlused/$tournamentid/standings/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { tournamentid } = useParams({ strict: false })
  // Hard coded query, that will come with new query
  const { data: participants, isLoading, isError } = UseGetParticipantsQuery(Number(tournamentid), 28)


  if (isLoading) {
    return (
      <LoadingScreen />
    )
  }

  if (isError) {
    <div>
      <ErrorPage/>
    </div>
  }

  if (participants && participants.data) {
    return (
      <>
        <Standings participants={participants?.data} />
      </>
    )
  }
  

  return <div><EmptyComponent errorMessage="competitions.errors.standings_missing" /></div>
}