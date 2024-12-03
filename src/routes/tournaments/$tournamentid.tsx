import { createFileRoute } from '@tanstack/react-router'
import GroupBracket from './-components/group-bracket';
import { useGetPlayers } from '@/queries/players';
import { useGetTournament } from '@/queries/tournaments';
import { useGetProtocols } from '@/queries/protocols';
import { useGetGroupBrackets } from '@/queries/brackets';
import ErrorPage from '../../components/error';



export const Route = createFileRoute('/tournaments/$tournamentid')({
  errorComponent: ({ error, reset }) => {
    return (
      <ErrorPage error={error} reset={reset} />
    )
  },
  component: RouteComponent,
  loader: async ({ context: { queryClient }, params }) => {
    const tournamentData = await queryClient.ensureQueryData(useGetTournament(Number(params.tournamentid)))
    const playersResponse = await queryClient.ensureQueryData(useGetPlayers())
    const statisticsData = await queryClient.ensureQueryData(useGetProtocols(Number(params.tournamentid)))
    const groupBracket = await queryClient.ensureQueryData(useGetGroupBrackets(Number(params.tournamentid)))
    return { tournamentData, playersResponse, statisticsData, groupBracket }
  }
});

function RouteComponent() {
  const { playersResponse, statisticsData, groupBracket } = Route.useLoaderData()

  return (
    <>
      <GroupBracket teams={groupBracket.data} players={playersResponse} statisticsData={statisticsData} />
    </>
  )
}

