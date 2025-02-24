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
    <div className="mx-auto container h-full">
      <div className="w-full md:px-6">
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-center w-full bg-gray-50 lg:my-1 lg:h-16">
          <h1 className="text-3xl font-bold text-black">{tournament_data.data?.name}</h1>
          <Tabs value={currentTab} className="w-full lg:max-w-[500px]">
            <TabsList className="grid w-full grid-cols-2">
              <Link to={`/admin/tournaments/${tournamentid}`}>
                <TabsTrigger value="info" className="w-full">
                  Info
                </TabsTrigger>
              </Link>
              <Link to={`/admin/tournaments/${tournamentid}/grupid`}>
                <TabsTrigger value="groups" className="w-full">
                  Groups
                </TabsTrigger>
              </Link>
            </TabsList>
          </Tabs>
        </div>

        <div className="pt-4">
          <ScrollArea className="h-[calc(100vh-12rem)]">
            <Outlet />
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}

