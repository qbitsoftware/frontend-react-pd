import { createFileRoute } from '@tanstack/react-router'
import Meistriliiga_Instructions from './-components/m_instructions'

export const Route = createFileRoute('/voistlused/$tournamentid/juhend/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <Meistriliiga_Instructions />
    </div>
  )
}
