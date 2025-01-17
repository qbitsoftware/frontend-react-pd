import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/admin/tournaments/$tournamentid/matches/',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return 'Hello /admin/tournaments/$tournamentid/matches/!'
}
