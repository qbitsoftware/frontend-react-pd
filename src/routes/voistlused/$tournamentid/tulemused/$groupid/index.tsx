import { useState } from 'react'
import ErrorPage from '@/components/error'
import GroupBracket from '@/components/group-bracket'
import { Window } from '@/components/window'
import { UseGetBracket } from '@/queries/brackets'
import { UseGetTournamentTable } from '@/queries/tables'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/voistlused/$tournamentid/tulemused/$groupid/',
)({
  loader: async ({ context: { queryClient }, params }) => {
    const table_data = await queryClient.ensureQueryData(UseGetTournamentTable(Number(params.tournamentid), Number(params.groupid)))
    const bracket_data = await queryClient.ensureQueryData(UseGetBracket(Number(params.tournamentid), Number(params.groupid)))

    return { table_data, bracket_data }
  },
  errorComponent: () => <ErrorPage />,
  component: RouteComponent,
})

function RouteComponent() {
  const { bracket_data, table_data } = Route.useLoaderData()
  const [activeTab, setActiveTab] = useState('bracket')

  if (!bracket_data.data || !table_data.data) {
    return <div>0</div>
  }
  return (
    <div className='min-h-screen py-2'>
      <div className="flex w-full mb-6 border-b">
        <button
          onClick={() => setActiveTab('bracket')}
          className={`px-4 py-2 text-sm sm:text-base font-medium flex-1 text-center ${activeTab === 'bracket'
            ? 'text-blue-600 border-b-2 border-blue-600'
            : 'text-gray-500 hover:text-gray-700'
            }`}
        >
          Bracket
        </button>
        <button
          onClick={() => setActiveTab('placement')}
          className={`px-4 py-2 text-sm sm:text-base font-medium flex-1 text-center ${activeTab === 'placement'
            ? 'text-blue-600 border-b-2 border-blue-600'
            : 'text-gray-500 hover:text-gray-700'
            }`}
        >
          Placement Games
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'bracket' && (
        <GroupBracket brackets={bracket_data.data.round_robins[0]} />
      )}

      {activeTab === 'placement' && (
        <Window data={bracket_data.data} tournament_table={table_data.data} />
      )}
    </div>
  )
}