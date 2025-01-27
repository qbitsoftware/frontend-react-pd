import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { UseGetMatches } from '@/queries/match'
import { createFileRoute } from '@tanstack/react-router'
import { Clock, MapPin, Trophy } from 'lucide-react'

export const Route = createFileRoute('/voistlused/$tournamentid/ajakava/')({
  loader: async ({ context: { queryClient }, params }) => {
    const matchesData = await queryClient.ensureQueryData(
      UseGetMatches(Number(params.tournamentid)),
    )

    return { matchesData }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { matchesData } = Route.useLoaderData()

  const getBracketColor = (bracket: string) => {
    switch (bracket.toLowerCase()) {
      case "winner":
        return "bg-green-100 text-green-800"
      case "loser":
        return "bg-red-100 text-red-800"
      case "bracket":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (matchesData.data) {
    return (
      <div className='grid grid-cols-3 pt-8'>
        {matchesData.data.map((match) => {
          return (
            <Card className="mb-4 overflow-hidden mx-auto w-[500px]">
              <CardContent className="p-0">
                <div className="flex items-center justify-between bg-gray-50 p-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">
                      {new Date().toLocaleTimeString("et-EE", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <Badge variant="outline" className={`${getBracketColor(match.match.type.toLowerCase())}`}>
                    {match.match.type == "winner" ? "Plussring" : match.match.type == "loser" ? "Miinusring" : match.match.type == "bracket" ? "Kohamangud" : ""}
                  </Badge>
                </div>
                <div className="p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{match.p1.name}</h3>
                    <span className="text-sm font-medium text-gray-500">vs</span>
                    <h3 className="text-lg font-semibold">{match.p2.name}</h3>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <span>Table: {match.match.extra_data.table}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Trophy className="h-4 w-4" />
                      <span>Round {match.match.round}</span>
                    </div>
                  </div>
                </div>
                {match.match.winner_id && (
                  <div className="bg-green-50 p-2 text-center text-sm font-medium text-green-800">
                    Winner: {match.match.winner_id === match.p1.id ? match.p1.name : match.p2.name}
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    )
  }
}
