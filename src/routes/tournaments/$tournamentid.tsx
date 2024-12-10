import { createFileRoute } from '@tanstack/react-router'
import GroupBracket from './-components/group-bracket';
import { useGetPlayers } from '@/queries/players';
import { useGetTournament } from '@/queries/tournaments';
import { useGetProtocols } from '@/queries/protocols';
import { useGetGroupBrackets } from '@/queries/brackets';
import ErrorPage from '../../components/error';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Statistics from './-components/statistics';
import { Separator } from '@/components/ui/separator';



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
  const { playersResponse, statisticsData, groupBracket, tournamentData } = Route.useLoaderData()

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl sm:text-4xl font-semibold text-center mb-4 sm:mb-6 md:my-10 mx-8">{tournamentData.data?.name}</h1>
      <Tabs defaultValue="tulemused" className="max-w-[1440px] mx-auto md:px-4">
        <TabsList className="flex flex-wrap justify-center items-center gap-2 mb-4 md:mx-4">
          <TabsTrigger value="ajakava" className="text-sm sm:text-base">Ajakava</TabsTrigger>
          <TabsTrigger value="tulemused" className="text-sm sm:text-base">Tulemused</TabsTrigger>
          <TabsTrigger value="meeskonnad" className="text-sm sm:text-base">Meeskonnad</TabsTrigger>
          <TabsTrigger value="galerii" className="text-sm sm:text-base">Galerii</TabsTrigger>
          <TabsTrigger value="juhend" className="text-sm sm:text-base">Juhend</TabsTrigger>
          <TabsTrigger value="sponsorid" className="text-sm sm:text-base">Sponsorid</TabsTrigger>
          <TabsTrigger value="meedia" className='text-sm sm:text-base'>Meedia</TabsTrigger>

          {/* {user && <TabsTrigger value="admin" className="text-sm sm:text-base">Admin</TabsTrigger>} */}
        </TabsList>
        <TabsContent value="ajakava" className='mt-10 md:mt-0'>
          {/* <TimeTable tournament={tournamentData} statisticsData={statisticData} players={playersResponse} /> */}
        </TabsContent>
        <TabsContent value="tulemused" className='mt-10 md:mt-0 mx-auto'>
          {tournamentData.data?.type == "meistriliiga" && playersResponse && statisticsData &&
            <GroupBracket teams={groupBracket?.data} players={playersResponse} statisticsData={statisticsData} />
            // : <TournamentBracket tournament_id={params.tournamentid} tournament_type={tournamentData.data?.type!} />
          }
          <h1 className="text-2xl sm:text-4xl font-semibold text-center mb-4 sm:mb-6 md:my-10 mx-8">Protokollid</h1>
          {
            playersResponse?.data && statisticsData?.data &&
            <Statistics playersResponse={playersResponse} statisticsData={statisticsData} />
          }
        </TabsContent>
        {/* <TabsContent value="meeskonnad" className='mt-10 md:mt-0'>
          {teamResponse && <Teams tournament={tournamentData?.data!} />}
        </TabsContent>
        <TabsContent value="galerii" className='mt-10 md:mt-0'>
          <GameDayGallery user={user} tournament_id={String(tournamentData.data?.ID)} />
        </TabsContent>
        <TabsContent value="juhend" className='mt-10 md:mt-0'>
          <Instructions />
        </TabsContent>
        <TabsContent value="sponsorid" className='mt-10 md:mt-0'>
          <SponsorGallery />
        </TabsContent>
        <TabsContent value='meedia' className='mt-10 md:mt-0'>
          <EditorContextProvider>
            {user ? (
              blogisLoading ? (
                <div className="flex justify-center items-center h-[50vh]">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-2 text-lg font-medium">Laadin...</span>
                </div>
              ) : (
                <Editor
                  tournament_id={String(tournamentData.data?.ID)}
                  blogData={blogData ? blogData.data : undefined}
                />
              )
            ) : (
              blogisLoading ?
                (
                  <div className="flex justify-center items-center h-[50vh]">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="ml-2 text-lg font-medium">Laadin...</span>
                  </div>
                ) : <BlogComponent blog={blogData?.data} tournament_id={String(tournamentData.data?.ID)} />
            )}

          </EditorContextProvider>
        </TabsContent>
        <TabsContent value='admin' className='mt-20 md:mt-0'>
          <TournamentForm initialData={tournamentData?.data!} />
        </TabsContent> */}

      </Tabs>
    </div >
  )
}

