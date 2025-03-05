import { createFileRoute } from "@tanstack/react-router"
import { UseGetTournamentTables } from "@/queries/tables"
import Group from "./-components/group"

export const Route = createFileRoute("/voistlused/$tournamentid/osalejad/")({
  component: RouteComponent,
  loader: async ({ context: { queryClient }, params }) => {
    const tables_data = await queryClient.ensureQueryData(
      UseGetTournamentTables(Number(params.tournamentid))
    )
    return { tables_data }
  },
})

function RouteComponent() {
  const { tables_data } = Route.useLoaderData()
  
  return (
    <div className="min-h-screen px-4 py-8">
      <div className="mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Tournament Participants</h1>
        <div className="flex flex-col gap-10">
          {tables_data && tables_data.data ? tables_data.data.map((table) => (
            <Group group={table}/>
          ))
            : <div>No participants</div>
          }
        </div>
      </div>
    </div>
  )
}

