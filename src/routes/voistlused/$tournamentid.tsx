import { createFileRoute } from '@tanstack/react-router'
import { UseGetTournament } from '@/queries/tournaments'
import ErrorPage from '../../components/error'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Window } from '../tere/-components-2/window'
import { UseGetBracket } from '@/queries/brackets'

export const Route = createFileRoute('/voistlused/$tournamentid')({
  errorComponent: ({ error, reset }) => {
    return <ErrorPage error={error} reset={reset} />
  },
  component: RouteComponent,
  loader: async ({ context: { queryClient }, params }) => {
    const tournamentData = await queryClient.ensureQueryData(
      UseGetTournament(Number(params.tournamentid)),
    )

    // const playersResponse = await queryClient.ensureQueryData(UseGetPlayers())
    // const bracketData = 
    // const statisticsData = await queryClient.ensureQueryData(
    //   UseGetProtocols(Number(params.tournamentid)),
    // )
    const bracket = await queryClient.ensureQueryData(
      UseGetBracket(Number(params.tournamentid)),
    )
    return { tournamentData, bracket }
  },
})

function RouteComponent() {
  const { tournamentData, bracket } = Route.useLoaderData()

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl sm:text-4xl font-semibold text-center mb-4 sm:mb-6 md:my-10 mx-8">
        {tournamentData.data?.name}
      </h1>
      <Tabs defaultValue="tulemused" className="max-w-[1440px] mx-auto md:px-4">
        <TabsList className="flex flex-wrap justify-center items-center gap-2 mb-4 md:mx-4 bg-secondary text-white">
          <TabsTrigger value="ajakava" className="text-sm sm:text-base">
            Ajakava
          </TabsTrigger>
          <TabsTrigger value="tulemused" className="text-sm sm:text-base">
            Tulemused
          </TabsTrigger>
          <TabsTrigger value="meeskonnad" className="text-sm sm:text-base">
            Meeskonnad
          </TabsTrigger>
          <TabsTrigger value="galerii" className="text-sm sm:text-base">
            Galerii
          </TabsTrigger>
          <TabsTrigger value="juhend" className="text-sm sm:text-base">
            Juhend
          </TabsTrigger>
          <TabsTrigger value="sponsorid" className="text-sm sm:text-base">
            Sponsorid
          </TabsTrigger>
          <TabsTrigger value="meedia" className="text-sm sm:text-base">
            Meedia
          </TabsTrigger>

          {/* {User && <TabsTrigger value="admin" className="text-sm sm:text-base">Admin</TabsTrigger>} */}
        </TabsList>
        <TabsContent value="ajakava" className="mt-10 md:mt-0">
          {/* <TimeTable tournament={tournamentData} statisticsData={statisticData} players={playersResponse} /> */}
        </TabsContent>
        <TabsContent value="tulemused" className="mt-10 md:mt-0 mx-auto">
          {
            tournamentData.data?.type == 'meistriliiga' ?
              <div></div>
              // playersResponse &&
              // statisticsData && (
              //   <GroupBracket
              //     teams={groupBracket?.data}
              //     players={playersResponse}
              //     statisticsData={statisticsData}
              //   />
              // )
              //  <TournamentBracket tournament_id={tournamentData.data?.id} tournament_type={tournamentData.data?.type!} />
              : bracket.data && (<div className='w-full h-[75vh] md:px-4'><Window data={bracket.data} /> </div>)
          }
          {/* <h1 className="text-2xl sm:text-4xl font-semibold text-center mb-4 sm:mb-6 md:my-10 mx-8">
            Protokollid
          </h1>
          {playersResponse?.data && statisticsData?.data && (
            <Statistics
              playersResponse={playersResponse}
              statisticsData={statisticsData}
            />
          )} */}
        </TabsContent>
        {/* <TabsContent value="meeskonnad" className='mt-10 md:mt-0'>
          {teamResponse && <Teams tournament={tournamentData?.data!} />}
        </TabsContent>
        <TabsContent value="galerii" className='mt-10 md:mt-0'>
          <GameDayGallery User={User} tournament_id={String(tournamentData.data?.ID)} />
        </TabsContent>
        <TabsContent value="juhend" className='mt-10 md:mt-0'>
          <Instructions />
        </TabsContent>
        <TabsContent value="sponsorid" className='mt-10 md:mt-0'>
          <SponsorGallery />
        </TabsContent>
        <TabsContent value='meedia' className='mt-10 md:mt-0'>
          <EditorContextProvider>
            {User ? (
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
    </div>
  )
}


const placeholder = {
  "message": "Successfully started tournament",
  "data": [
    {
      "tables": [
        {
          "rounds": [
            {
              "name": ""
            },
            {
              "name": ""
            },
            {
              "name": ""
            },
            {
              "name": ""
            }
          ],
          "matches": [
            {
              "matchId": "b10a968b-2e38-4c11-8e28-7c67d18068e6",
              "roundIndex": 0,
              "order": 0,
              "sides": [
                {
                  "contestantId": "370076a3-c580-466a-873f-abe494f80ba5",
                  "scores": []
                },
                {
                  "contestantId": "7bfa1195-4d3f-48e2-b808-1528ca7734da",
                  "scores": []
                }
              ],
              "isBronzeMatch": false,
              "bracket": ""
            },
            {
              "matchId": "7e0aa2e6-2c91-4ac9-95e1-786dfe7ad69b",
              "roundIndex": 0,
              "order": 1,
              "sides": [
                {
                  "contestantId": "72c1049e-ec88-4788-8a07-7fa7b8832a3e",
                  "scores": []
                },
                {
                  "contestantId": "eb3b4cdd-dc9d-4644-8760-fb00f063153f",
                  "scores": []
                }
              ],
              "isBronzeMatch": false,
              "bracket": ""
            },
            {
              "matchId": "4a1b0209-ba5c-46cb-905f-36ce87fe6914",
              "roundIndex": 0,
              "order": 2,
              "sides": [
                {
                  "contestantId": "6aba63bd-1408-41a6-ad58-3b3ba8d2366f",
                  "scores": []
                },
                {
                  "contestantId": "15dce7ac-f2c5-4fc5-9c63-9a5adf5627b6",
                  "scores": []
                }
              ],
              "isBronzeMatch": false,
              "bracket": ""
            },
            {
              "matchId": "ca9672df-3ead-4a67-9970-67ee1c364321",
              "roundIndex": 0,
              "order": 3,
              "sides": [
                {
                  "contestantId": "16742449-1937-4db9-b104-82bb01a2ac4d",
                  "scores": []
                },
                {
                  "contestantId": "3cf2801b-2513-40fd-8c10-0143434e52dc",
                  "scores": []
                }
              ],
              "isBronzeMatch": false,
              "bracket": ""
            },
            {
              "matchId": "fb2a57bc-22e6-42c2-96d8-ceb34d999316",
              "roundIndex": 1,
              "order": 0,
              "sides": [
                {
                  "contestantId": "",
                  "scores": []
                },
                {
                  "contestantId": "",
                  "scores": []
                }
              ],
              "isBronzeMatch": false,
              "bracket": ""
            },
            {
              "matchId": "af8691cb-db87-4e3f-91dd-86448c6f6976",
              "roundIndex": 1,
              "order": 1,
              "sides": [
                {
                  "contestantId": "",
                  "scores": []
                },
                {
                  "contestantId": "",
                  "scores": []
                }
              ],
              "isBronzeMatch": false,
              "bracket": ""
            },
            {
              "matchId": "e864f68c-2101-4bcc-a80f-b3f142e97835",
              "roundIndex": 2,
              "order": 0,
              "sides": [
                {
                  "contestantId": "",
                  "scores": []
                },
                {
                  "contestantId": "",
                  "scores": []
                }
              ],
              "isBronzeMatch": false,
              "bracket": "1-2"
            }
          ],
          "contestants": {
            "15dce7ac-f2c5-4fc5-9c63-9a5adf5627b6": {
              "entryStatus": "",
              "players": [
                {
                  "title": "3",
                  "nationality": ""
                }
              ]
            },
            "16742449-1937-4db9-b104-82bb01a2ac4d": {
              "entryStatus": "",
              "players": [
                {
                  "title": "radikate kogukond",
                  "nationality": ""
                }
              ]
            },
            "370076a3-c580-466a-873f-abe494f80ba5": {
              "entryStatus": "",
              "players": [
                {
                  "title": "4",
                  "nationality": ""
                }
              ]
            },
            "3cf2801b-2513-40fd-8c10-0143434e52dc": {
              "entryStatus": "",
              "players": [
                {
                  "title": "Jouu",
                  "nationality": ""
                }
              ]
            },
            "6aba63bd-1408-41a6-ad58-3b3ba8d2366f": {
              "entryStatus": "",
              "players": [
                {
                  "title": "1",
                  "nationality": ""
                }
              ]
            },
            "72c1049e-ec88-4788-8a07-7fa7b8832a3e": {
              "entryStatus": "",
              "players": [
                {
                  "title": "Kalev / Radiaatorikeskus 2",
                  "nationality": ""
                }
              ]
            },
            "7bfa1195-4d3f-48e2-b808-1528ca7734da": {
              "entryStatus": "",
              "players": [
                {
                  "title": "2",
                  "nationality": ""
                }
              ]
            },
            "eb3b4cdd-dc9d-4644-8760-fb00f063153f": {
              "entryStatus": "",
              "players": [
                {
                  "title": "5",
                  "nationality": ""
                }
              ]
            },
            "empty": {
              "entryStatus": "",
              "players": [
                {
                  "title": "empty",
                  "nationality": ""
                }
              ]
            }
          },
          "name": "Plussring"
        }
      ]
    },
    {
      "tables": [
        {
          "rounds": [
            {
              "name": ""
            },
            {
              "name": ""
            },
            {
              "name": ""
            },
            {
              "name": ""
            }
          ],
          "matches": [
            {
              "matchId": "4b809348-b9eb-4d5f-a937-e5f8cfffa5f5",
              "roundIndex": 0,
              "order": 0,
              "sides": [
                {
                  "contestantId": "",
                  "scores": []
                },
                {
                  "contestantId": "",
                  "scores": []
                }
              ],
              "isBronzeMatch": false,
              "bracket": ""
            },
            {
              "matchId": "4f1eaf3f-a430-4f0d-950b-6c2c6228d85e",
              "roundIndex": 0,
              "order": 1,
              "sides": [
                {
                  "contestantId": "",
                  "scores": []
                },
                {
                  "contestantId": "",
                  "scores": []
                }
              ],
              "isBronzeMatch": false,
              "bracket": ""
            },
            {
              "matchId": "41aab982-f4e6-4a1b-9992-fa7b13bee56b",
              "roundIndex": 1,
              "order": 0,
              "sides": [
                {
                  "contestantId": "",
                  "scores": []
                },
                {
                  "contestantId": "",
                  "scores": []
                }
              ],
              "isBronzeMatch": false,
              "bracket": ""
            },
            {
              "matchId": "7623e9b0-eef0-41de-9b93-4d516f1fb4c1",
              "roundIndex": 1,
              "order": 1,
              "sides": [
                {
                  "contestantId": "",
                  "scores": []
                },
                {
                  "contestantId": "",
                  "scores": []
                }
              ],
              "isBronzeMatch": false,
              "bracket": ""
            },
            {
              "matchId": "79dc27ba-abf4-43e5-98c1-5ddd22fe294d",
              "roundIndex": 2,
              "order": 0,
              "sides": [
                {
                  "contestantId": "",
                  "scores": []
                },
                {
                  "contestantId": "",
                  "scores": []
                }
              ],
              "isBronzeMatch": true,
              "bracket": "3-4"
            }
          ],
          "contestants": {
            "15dce7ac-f2c5-4fc5-9c63-9a5adf5627b6": {
              "entryStatus": "",
              "players": [
                {
                  "title": "3",
                  "nationality": ""
                }
              ]
            },
            "16742449-1937-4db9-b104-82bb01a2ac4d": {
              "entryStatus": "",
              "players": [
                {
                  "title": "radikate kogukond",
                  "nationality": ""
                }
              ]
            },
            "370076a3-c580-466a-873f-abe494f80ba5": {
              "entryStatus": "",
              "players": [
                {
                  "title": "4",
                  "nationality": ""
                }
              ]
            },
            "3cf2801b-2513-40fd-8c10-0143434e52dc": {
              "entryStatus": "",
              "players": [
                {
                  "title": "Jouu",
                  "nationality": ""
                }
              ]
            },
            "6aba63bd-1408-41a6-ad58-3b3ba8d2366f": {
              "entryStatus": "",
              "players": [
                {
                  "title": "1",
                  "nationality": ""
                }
              ]
            },
            "72c1049e-ec88-4788-8a07-7fa7b8832a3e": {
              "entryStatus": "",
              "players": [
                {
                  "title": "Kalev / Radiaatorikeskus 2",
                  "nationality": ""
                }
              ]
            },
            "7bfa1195-4d3f-48e2-b808-1528ca7734da": {
              "entryStatus": "",
              "players": [
                {
                  "title": "2",
                  "nationality": ""
                }
              ]
            },
            "eb3b4cdd-dc9d-4644-8760-fb00f063153f": {
              "entryStatus": "",
              "players": [
                {
                  "title": "5",
                  "nationality": ""
                }
              ]
            },
            "empty": {
              "entryStatus": "",
              "players": [
                {
                  "title": "empty",
                  "nationality": ""
                }
              ]
            }
          },
          "name": "Miinusring"
        }
      ]
    },
    {
      "tables": [
        {
          "rounds": [
            {
              "name": ""
            },
            {
              "name": ""
            },
            {
              "name": ""
            },
            {
              "name": ""
            }
          ],
          "matches": [
            {
              "matchId": "56934ab8-157f-4deb-b936-be3f89150123",
              "roundIndex": 0,
              "order": 0,
              "sides": [
                {
                  "contestantId": "",
                  "scores": []
                },
                {
                  "contestantId": "",
                  "scores": []
                }
              ],
              "isBronzeMatch": false,
              "bracket": "7-8"
            }
          ],
          "contestants": {
            "15dce7ac-f2c5-4fc5-9c63-9a5adf5627b6": {
              "entryStatus": "",
              "players": [
                {
                  "title": "3",
                  "nationality": ""
                }
              ]
            },
            "16742449-1937-4db9-b104-82bb01a2ac4d": {
              "entryStatus": "",
              "players": [
                {
                  "title": "radikate kogukond",
                  "nationality": ""
                }
              ]
            },
            "370076a3-c580-466a-873f-abe494f80ba5": {
              "entryStatus": "",
              "players": [
                {
                  "title": "4",
                  "nationality": ""
                }
              ]
            },
            "3cf2801b-2513-40fd-8c10-0143434e52dc": {
              "entryStatus": "",
              "players": [
                {
                  "title": "Jouu",
                  "nationality": ""
                }
              ]
            },
            "6aba63bd-1408-41a6-ad58-3b3ba8d2366f": {
              "entryStatus": "",
              "players": [
                {
                  "title": "1",
                  "nationality": ""
                }
              ]
            },
            "72c1049e-ec88-4788-8a07-7fa7b8832a3e": {
              "entryStatus": "",
              "players": [
                {
                  "title": "Kalev / Radiaatorikeskus 2",
                  "nationality": ""
                }
              ]
            },
            "7bfa1195-4d3f-48e2-b808-1528ca7734da": {
              "entryStatus": "",
              "players": [
                {
                  "title": "2",
                  "nationality": ""
                }
              ]
            },
            "eb3b4cdd-dc9d-4644-8760-fb00f063153f": {
              "entryStatus": "",
              "players": [
                {
                  "title": "5",
                  "nationality": ""
                }
              ]
            },
            "empty": {
              "entryStatus": "",
              "players": [
                {
                  "title": "empty",
                  "nationality": ""
                }
              ]
            }
          },
          "name": "7-8"
        }
      ]
    },
    {
      "tables": [
        {
          "rounds": [
            {
              "name": ""
            },
            {
              "name": ""
            },
            {
              "name": ""
            },
            {
              "name": ""
            }
          ],
          "matches": [
            {
              "matchId": "ca39fa0c-7994-4304-bb72-410fdfcaa820",
              "roundIndex": 0,
              "order": 0,
              "sides": [
                {
                  "contestantId": "",
                  "scores": []
                },
                {
                  "contestantId": "",
                  "scores": []
                }
              ],
              "isBronzeMatch": false,
              "bracket": "5-6"
            }
          ],
          "contestants": {
            "15dce7ac-f2c5-4fc5-9c63-9a5adf5627b6": {
              "entryStatus": "",
              "players": [
                {
                  "title": "3",
                  "nationality": ""
                }
              ]
            },
            "16742449-1937-4db9-b104-82bb01a2ac4d": {
              "entryStatus": "",
              "players": [
                {
                  "title": "radikate kogukond",
                  "nationality": ""
                }
              ]
            },
            "370076a3-c580-466a-873f-abe494f80ba5": {
              "entryStatus": "",
              "players": [
                {
                  "title": "4",
                  "nationality": ""
                }
              ]
            },
            "3cf2801b-2513-40fd-8c10-0143434e52dc": {
              "entryStatus": "",
              "players": [
                {
                  "title": "Jouu",
                  "nationality": ""
                }
              ]
            },
            "6aba63bd-1408-41a6-ad58-3b3ba8d2366f": {
              "entryStatus": "",
              "players": [
                {
                  "title": "1",
                  "nationality": ""
                }
              ]
            },
            "72c1049e-ec88-4788-8a07-7fa7b8832a3e": {
              "entryStatus": "",
              "players": [
                {
                  "title": "Kalev / Radiaatorikeskus 2",
                  "nationality": ""
                }
              ]
            },
            "7bfa1195-4d3f-48e2-b808-1528ca7734da": {
              "entryStatus": "",
              "players": [
                {
                  "title": "2",
                  "nationality": ""
                }
              ]
            },
            "eb3b4cdd-dc9d-4644-8760-fb00f063153f": {
              "entryStatus": "",
              "players": [
                {
                  "title": "5",
                  "nationality": ""
                }
              ]
            },
            "empty": {
              "entryStatus": "",
              "players": [
                {
                  "title": "empty",
                  "nationality": ""
                }
              ]
            }
          },
          "name": "5-6"
        }
      ]
    }
  ],
  "error": null
}