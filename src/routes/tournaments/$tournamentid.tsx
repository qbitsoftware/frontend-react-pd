import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/tournaments/$tournamentid')({
  component: RouteComponent,
})

function RouteComponent() {
  return 'Hello /tournaments/$tournamentId!'
}
