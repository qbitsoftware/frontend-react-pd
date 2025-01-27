import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/voistlused/$tournamentid/meedia/')({
  component: RouteComponent,
})

function RouteComponent() {
  return 'Hello /voistlused/$tournamentid/meedia/!'
}
