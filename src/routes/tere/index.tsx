import { createFileRoute } from '@tanstack/react-router'
import { Window } from './-components/window'
import { UseGetBracket } from '@/queries/tournaments'

export const Route = createFileRoute('/tere/')({
  component: RouteComponent,
  loader: async ({ context: { queryClient } }) => {
    const brackets = await queryClient.ensureQueryData(UseGetBracket(15))
    return brackets
  },
})

function RouteComponent() {
  const { data, error } = Route.useLoaderData()
  if (error) {
    return <div>Error</div>
  }
  if (data) {
    return <Window data={data} />
  }
  return <div>Somethign wvery bad</div>
}
