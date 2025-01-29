import { createFileRoute } from '@tanstack/react-router'
import { UseGetBracket } from '@/queries/brackets'
import { Window } from '@/components/window'
import { BracketReponse } from '@/queries/tournaments'
import { useTournament } from '../-components/tournament-provider'
import { Card, CardContent } from '@/components/ui/card'

export const Route = createFileRoute('/voistlused/$tournamentid/tulemused/')({
  component: RouteComponent,
  loader: async ({ context: { queryClient }, params }) => {
    const matches_data = await queryClient.ensureQueryData(UseGetBracket(Number(params.tournamentid)))
    return { matches_data }
  },
})

function RouteComponent() {
  const { matches_data } = Route.useLoaderData()

  const BracketComponent = (matches: BracketReponse) => {
    const tournament = useTournament()
    if (matches_data.data) {

    }
  }

  return (
    <div className='w-full h-[75vh]'>
      <div className='h-full w-full mt-[20px] lg:mt-[60px]'>
        {matches_data.data ? (
          <Window data={matches_data.data} />
        ) : (
          <Card className="w-full">
              <CardContent className="p-6">
                <p className="text-center text-xl font-semibold">Tabelid Hetkel puuduvad</p>
              </CardContent>
            </Card>
        )}
      </div>
    </div>
  )
}


