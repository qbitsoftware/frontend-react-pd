import { createFileRoute } from '@tanstack/react-router'
import { TournamentForm } from '../-components/tournament-form'
import { ScrollArea } from '@/components/ui/scroll-area'

export const Route = createFileRoute('/admin/tournaments/new/')({
  component: RouteComponent,
})


function RouteComponent() {
  return (

    <ScrollArea className="sm:h-[calc(100vh-8rem)]">
      <div className="w-full">
        <TournamentForm initial_data={undefined} />
      </div>
    </ScrollArea>
  )
}
