"use client"

import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router"
import type { ErrorResponse } from "@/types/types"
import { UseGetTournamentTable } from "@/queries/tables"
import { cn } from "@/lib/utils"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const Route = createFileRoute("/admin/tournaments/$tournamentid/grupid/$groupid")({
  component: RouteComponent,
  loader: async ({ context: { queryClient }, params }) => {
    let table_data

    try {
      table_data = await queryClient.ensureQueryData(
        UseGetTournamentTable(Number(params.tournamentid), Number(params.groupid)),
      )
    } catch (error) {
      const err = error as ErrorResponse
      if (err.response.status !== 404) {
        throw error
      }
    }
    return { table_data }
  },
})

function RouteComponent() {
  const { table_data } = Route.useLoaderData()
  const { tournamentid, groupid } = Route.useParams()
  const location = useLocation()

  if (!table_data || !table_data.data) {
    return <></>
  }

  const pathSegments = location.pathname.split("/")
  const currentTab = pathSegments[pathSegments.length - 1] === groupid ? "/" : pathSegments.pop() || "/"

  const tabs = [
    { value: "/", label: "Info" },
    { value: "osalejad", label: "Participants" },
    { value: "mangud", label: "Matches" },
    { value: "tabelid", label: "Tables" }
  ]

  return (
    <div className="px-2">
      <div className="flex flex-col py-2 lg:flex-row justify-between items-center gap-2 bg-gray-50 lg:h-16">
        <div>
          <h3 className="text-2xl font-semibold">{table_data.data.class}</h3>
        </div>
        <Tabs value={currentTab} className="w-full lg:max-w-[500px]">
          <TabsList className="grid w-full grid-cols-4">
            {tabs.map((tab) => (
              <Link
                key={tab.value}
                to={`/admin/tournaments/${tournamentid}/grupid/${groupid}${tab.value === "/" ? "" : `/${tab.value}`}`}
                className="w-full"
              >
                <TabsTrigger
                  value={tab.value}
                  className={cn(
                    "w-full",
                    currentTab === tab.value && "bg-secondary text-white hover:bg-secondary/90",
                    currentTab !== tab.value && "hover:bg-secondary/10",
                  )}
                >
                  {tab.label}
                </TabsTrigger>
              </Link>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="pt-4 lg:pt-0">
        <Outlet />
      </div>
    </div>
  )
}
