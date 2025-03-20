"use client"

import { createFileRoute, Outlet, redirect, useLocation } from "@tanstack/react-router"
import { UseGetTournament } from "@/queries/tournaments"
import type { ErrorResponse } from "@/types/types"
import { Link } from "@tanstack/react-router"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTranslation } from "react-i18next"
import ErrorPage from "@/components/error"

export const Route = createFileRoute("/admin/tournaments/$tournamentid")({
  component: RouteComponent,
    errorComponent: () => <ErrorPage />,
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
  const { t } = useTranslation()

  const currentTab = location.pathname.includes("/grupid") ? "groups" : location.pathname.includes("/meedia") ? "media" : location.pathname.includes("/pildid") ? "images" : "info"

  return (
    <div className="mx-auto  h-full">
      <div className="w-full z-12">
        <div className="py-4 sm:py-auto px-10 lg:h-[3.5rem] flex flex-col lg:flex-row gap-4 justify-between items-center w-full bg-gradient-to-b from-white via-white/50 to-[#EBEBEB]/50 z-12">
          <h1 className="text-xl font-semibold text-black">{tournament_data.data?.name}</h1>
          <Tabs value={currentTab} className="">
            <TabsList className="grid grid-cols-2 sm:grid-cols-4">
              <Link to={`/admin/tournaments/${tournamentid}`} >
                <TabsTrigger value="info" className="w-[8rem]">
                  {t("admin.layout.info")}
                </TabsTrigger>
              </Link>
              <Link to={`/admin/tournaments/${tournamentid}/grupid`}>
                <TabsTrigger value="groups" className="w-[8rem]">
                  {t("admin.layout.groups")}
                </TabsTrigger>
              </Link>
              <Link to={`/admin/tournaments/${tournamentid}/meedia`} >
                <TabsTrigger value="media" className="w-[8rem]">
                  {t("admin.layout.media")}
                </TabsTrigger>
              </Link>
              <Link to={`/admin/tournaments/${tournamentid}/pildid`} >
                <TabsTrigger value="images" className="w-[8rem]">
                  {t("admin.layout.images")}
                </TabsTrigger>
              </Link>
            </TabsList>
          </Tabs>
        </div>

        <div className="">
          <ScrollArea className="">
            <Outlet />
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}

