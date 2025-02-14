import { createFileRoute } from "@tanstack/react-router"
import { UseGetParticipants } from "@/queries/participants"
import { useTournament } from "../-components/tournament-provider"
import SoloTable from "./-components/solo-table"
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
  const tournament = useTournament()
  const { tables_data } = Route.useLoaderData()

  console.log("TAbles", tables_data)


  return (
    <div className="min-h-screen border shadow-md mt-[20px] lg:mt-[60px] rounded-lg py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
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

