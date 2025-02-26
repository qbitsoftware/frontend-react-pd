import { createFileRoute } from '@tanstack/react-router'
import { TournamentForm } from '../-components/tournament-form'

export const Route = createFileRoute('/admin/tournaments/new/')({
  component: RouteComponent,
})


function RouteComponent() {
  return (
    <div className="w-full overflow-hidden">
      <TournamentForm initial_data={undefined} />
    </div>
  )
}
