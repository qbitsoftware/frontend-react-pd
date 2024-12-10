import { createFileRoute } from '@tanstack/react-router'
import { Window } from './-components/window'





export const Route = createFileRoute('/test/page')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Window />
  )
}
