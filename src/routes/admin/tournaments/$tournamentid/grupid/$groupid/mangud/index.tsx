import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { MatchesResponse } from '@/queries/match'
import { UseGetMatches } from '@/queries/match'
import { MatchesTable } from '../../../matches/-components/matches-table'

export const Route = createFileRoute(
  '/admin/tournaments/$tournamentid/grupid/$groupid/mangud/',
)({
  loader: async ({ context: { queryClient }, params }) => {
    let matches: MatchesResponse | undefined = undefined
    try {
      matches = await queryClient.ensureQueryData(UseGetMatches(Number(params.tournamentid), Number(params.groupid)))
    } catch (error) {
      console.error(error)
    }
    return { matches }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { matches } = Route.useLoaderData()
  return (
    <div className='pb-12'>
      <MatchesTable data={matches?.data || []} />
    </div>
  )
}
