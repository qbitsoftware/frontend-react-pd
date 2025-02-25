"use client"

import { createFileRoute, Outlet, redirect, useLocation } from "@tanstack/react-router"
import { UseGetTournament } from "@/queries/tournaments"
import type { ErrorResponse } from "@/types/types"
import { Link } from "@tanstack/react-router"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const Route = createFileRoute("/admin/tournaments/$tournamentid")({
  component: RouteComponent,
  loader: async ({ context: { queryClient }, params }) => {
    let tournament_data = undefined
    try {
      tournament_data = await queryClient.ensureQueryData(UseGetTournament(Number(params.tournamentid)))
    } catch (error) {
      const err = error as ErrorResponse
      if (err.response.status === 404) {
        throw redirect({
          to: "/admin/tournaments",
        })
      }
      throw error
    }

    return { tournament_data }
  },
})

function RouteComponent() {
  const location = useLocation()
  const { tournament_data } = Route.useLoaderData()
  const { tournamentid } = Route.useParams()

  const currentTab = location.pathname.includes("/grupid") ? "groups" : "info"

  return (
    <div className="mx-auto  h-full">
      <div className="w-full">
        <div className="px-10 md:h-[3.5rem] flex flex-col lg:flex-row gap-4 justify-between items-center w-full bg-gradient-to-b from-white via-white/50 to-[#EBEBEB]/50">
          <h1 className="text-xl font-semibold text-black">{tournament_data.data?.name}</h1>
          <Tabs value={currentTab} className="">
            <TabsList className="grid grid-cols-2">
              <Link to={`/admin/tournaments/${tournamentid}`} >
                <TabsTrigger value="info" className="w-[8rem]">
                  Info
                </TabsTrigger>
              </Link>
              <Link to={`/admin/tournaments/${tournamentid}/grupid`}>
                <TabsTrigger value="groups" className="w-[8rem]">
                  Groups
                </TabsTrigger>
              </Link>
            </TabsList>
          </Tabs>
        </div>

        <div className="">
          <ScrollArea className="h-[calc(100vh-8rem)]">
            <Outlet />
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}

