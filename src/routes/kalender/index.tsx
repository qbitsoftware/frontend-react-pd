import { createFileRoute } from '@tanstack/react-router'
import ErrorPage from '@/components/error'
import { UseGetTournaments } from '@/queries/tournaments'
import CalendarView from '@/components/CalendarView'

export const Route = createFileRoute('/kalender/')({
  errorComponent: ({ error, reset }) => {
    return <ErrorPage error={error} reset={reset} />
  },
  component: RouteComponent,
  loader: async ({ context: { queryClient } }) => {
    const tournaments = await queryClient.ensureQueryData(UseGetTournaments())
    return { tournaments }
  },
})

function RouteComponent() {
  const { tournaments } = Route.useLoaderData()

  if (tournaments.data) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-medium mb-6">Calendar</h1>
        <CalendarView tournaments={tournaments.data} />
      </div>
    )
  } else {
    return (<div>test</div>)
  }
}
