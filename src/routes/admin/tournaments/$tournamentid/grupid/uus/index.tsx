import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import TournamentTableForm from '../-components/table-form'

export const Route = createFileRoute(
  '/admin/tournaments/$tournamentid/grupid/uus/',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <TournamentTableForm initial_data={undefined} />
    </div>
  )
}
