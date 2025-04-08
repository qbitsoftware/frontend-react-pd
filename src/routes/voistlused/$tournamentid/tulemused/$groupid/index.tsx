import { useState } from 'react'
import ErrorPage from '@/components/error'
import GroupBracket from '@/components/group-bracket'
import { Window } from '@/components/window'
import { UseGetBracket } from '@/queries/brackets'
import { UseGetTournamentTable } from '@/queries/tables'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { StatisticsCard } from './-components/protocol'
import { MatchWrapper } from "@/types/types"
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation()

  const [activeTab, setActiveTab] = useState('bracket')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedMatch, setSelectedMatch] = useState<MatchWrapper | null>(null)

  const tableQuery = useQuery({
    ...UseGetTournamentTable(Number(params.tournamentid), Number(params.groupid)),
    staleTime: 0,
  })

  const bracketQuery = useQuery({
    ...UseGetBracket(Number(params.tournamentid), Number(params.groupid)),
    staleTime: 0,
  })

  if (tableQuery.isLoading || bracketQuery.isLoading) {
    return <div>{t('news.loading')}</div>
  }

  if (tableQuery.isError || bracketQuery.isError) {
    return <div>{t('errors.general.description')}</div>
  }

  if (!bracketQuery.data?.data || !tableQuery.data?.data) {
    return <div>{t('errors.general.title')}</div>
  }

  const groupName = tableQuery.data.data.class
  const isMeistrikad = tableQuery.data.data.type === "champions_league"

  if (!isMeistrikad && activeTab === "bracket") {
    setActiveTab('placement')
  }

  const handleSelectMatch = (match: MatchWrapper) => {
    if (match.match.winner_id != "") {
      setSelectedMatch(match)
      setIsModalOpen(true)
    }

  }

  return (
    <div className='min-h-screen p-2'>

      <div className="flex justify-center ">
        {isMeistrikad ? (<Tabs defaultValue="bracket" onValueChange={setActiveTab} className="w-full">
          <div className="flex flex-col items-center">
            <h4 className="text-center font-medium pt-4 pb-2">{groupName}</h4>

            <TabsList className="h-10 space-x-2">
              <TabsTrigger value="bracket" className="data-[state=active]:bg-stone-800">{t('competitions.bracket')}</TabsTrigger>
              <TabsTrigger value="placement" className="data-[state=active]:bg-stone-800">{t('competitions.play_off')}</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="bracket" className="w-full mt-6">
            <GroupBracket brackets={bracketQuery.data.data.round_robins[0]} onMatchSelect={handleSelectMatch} />

          </TabsContent>

          <TabsContent value="placement" className="w-full mt-6">
            <Window data={bracketQuery.data.data} tournament_table={tableQuery.data.data} />
          </TabsContent>
        </Tabs>
        ) : (
          <div className="w-full">
            <div className="flex flex-col items-center">
              <h4 className="text-center font-medium pt-4 pb-2">{groupName}</h4>
            </div>
            <div className="w-full mt-6">
              {tableQuery.data.data.type === "free_for_all" ? <div className="text-center text-stone-700">{t('competitions.errors.no_groups')} </div> :
                <Window data={bracketQuery.data.data} tournament_table={tableQuery.data.data} />
              }
            </div>
          </div>
        )}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent aria-describedby={`match-protocol-${selectedMatch?.match.id}`} className="w-[95vw] max-w-[1200px] h-[90vh] p-4 mx-auto flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <DialogTitle className="text-lg font-semibold">{t('competitions.timetable.match_details')}</DialogTitle>

          </div>

          <div className="flex-1 overflow-auto">
            {selectedMatch && (
              <StatisticsCard
                tournament_id={Number(params.tournamentid)}
                group_id={Number(params.groupid)}
                match_id={selectedMatch.match.id}
                index={selectedMatch.match.round}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

    </div>
  )
}