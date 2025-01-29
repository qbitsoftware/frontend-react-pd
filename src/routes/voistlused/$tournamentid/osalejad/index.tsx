import { createFileRoute } from "@tanstack/react-router"
import { UseGetParticipants } from "@/queries/participants"
import { useTournament } from "../-components/tournament-provider"
import SoloTable from "./-components/solo-table"

export const Route = createFileRoute("/voistlused/$tournamentid/osalejad/")({
  component: RouteComponent,
  loader: async ({ context: { queryClient }, params }) => {
    const participantData = await queryClient.ensureQueryData(UseGetParticipants(Number(params.tournamentid)))
    return { participantData }
  },
})

function RouteComponent() {
  const tournament = useTournament()
  const { participantData } = Route.useLoaderData()



  return (
    <div className="min-h-screen border shadow-md mt-[20px] lg:mt-[60px] rounded-lg py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Tournament Participants</h1>
        {tournament.solo ? <SoloTable participants={participantData.data} /> :<div></div>}
      </div>
    </div>
  )
}

