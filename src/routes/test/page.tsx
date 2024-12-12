import { createFileRoute } from '@tanstack/react-router'
import { Window } from './-components/window'
import { useGetBracket } from '@/queries/tournaments'





export const Route = createFileRoute('/test/page')({
  component: RouteComponent,
  loader: async ({ context: { queryClient } }) => {
    const brackets = await queryClient.ensureQueryData(useGetBracket(15))
    return brackets
  }

})

function RouteComponent() {
  const { data, error } = Route.useLoaderData()
  console.log("REALDATA", data)
  if (error) {
    return <div>Error</div>
  }
  if (data) {
    return (
      <Window data={data} />
    )
  }
  return (
    <div>
      Somethign wvery bad
    </div>
  )
}
