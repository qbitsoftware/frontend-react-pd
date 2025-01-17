import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { TournamentForm } from '../-components/tournament-form'

export const Route = createFileRoute('/admin/tournaments/new/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="w-full">
      <TournamentForm initial_data={undefined} />
    </div>
  )
}
