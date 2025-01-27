import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/voistlused/$tournamentid/osalejad/')({
  component: RouteComponent,
})

function RouteComponent() {
  return 'Hello /voistlused/$tournamentid/osalejad/!'
}
