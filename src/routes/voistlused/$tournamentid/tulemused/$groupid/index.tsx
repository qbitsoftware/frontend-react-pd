import { useState } from 'react'
import ErrorPage from '@/components/error'
import GroupBracket from '@/components/group-bracket'
import { Window } from '@/components/window'
import { UseGetBracket } from '@/queries/brackets'
import { UseGetTournamentTable } from '@/queries/tables'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'


export const Route = createFileRoute(
  '/voistlused/$tournamentid/tulemused/$groupid/',
)({
  loader: ({ params }) => {
    return { params }
  },
  errorComponent: () => <ErrorPage />,
  component: RouteComponent,
})

function RouteComponent() {
  const { params } = Route.useLoaderData()

  const [_, setActiveTab] = useState('bracket')

  const tableQuery = useQuery({
    ...UseGetTournamentTable(Number(params.tournamentid), Number(params.groupid)),
    staleTime: 0,
  })

  const bracketQuery = useQuery({
    ...UseGetBracket(Number(params.tournamentid), Number(params.groupid)),
    staleTime: 0,
  })

  if (tableQuery.isLoading || bracketQuery.isLoading) {
    return <div>Loading...</div>
  }

  if (tableQuery.isError || bracketQuery.isError) {
    return <div>Error loading data: {tableQuery.error?.message || bracketQuery.error?.message}</div>
  }

  if (!bracketQuery.data?.data || !tableQuery.data?.data) {
    return <div>No data available</div>
  }

  const groupName = tableQuery.data.data.class

  return (
    <div className='min-h-screen'>
      <div className="flex justify-center ">
        <Tabs defaultValue="bracket" onValueChange={setActiveTab} className="w-full">
          <div className="flex flex-col items-center">
            <h4 className="text-center font-medium pt-4 pb-2">{groupName}</h4>

            <TabsList className="h-10 space-x-2">
              <TabsTrigger value="bracket" className="data-[state=active]:bg-stone-800">Bracket</TabsTrigger>
              <TabsTrigger value="placement" className="data-[state=active]:bg-stone-800">Playoffs</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="bracket" className="w-full mt-6">
            <GroupBracket brackets={bracketQuery.data.data.round_robins[0]} />
          </TabsContent>

          <TabsContent value="placement" className="w-full mt-6">
            <Window data={bracketQuery.data.data} tournament_table={tableQuery.data.data} />
          </TabsContent>
        </Tabs>
      </div>

    </div>
  )
}