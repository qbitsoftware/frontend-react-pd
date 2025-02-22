"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Users, AlertCircle, Calendar, UserPlus, Target, type LucideIcon } from "lucide-react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { createFileRoute, useRouter } from "@tanstack/react-router"
import { UseGetTournaments } from "@/queries/tournaments"
import ErrorPage from "@/components/error"
import { formatDateString } from "@/lib/utils"


export const Route = createFileRoute("/admin/dashboard/")({
  errorComponent: ErrorPage,
  loader: async ({ context: { queryClient } }) => {
    const tournaments_data = await queryClient.ensureQueryData(UseGetTournaments())
    return { tournaments_data }
  },
  component: RouteComponent,
})

export default function RouteComponent() {

  const { tournaments_data } = Route.useLoaderData()
  const router = useRouter()

  console.log("Tournaments", tournaments_data)

  const mockStats = {
    totalTournaments: 45,
    activeTournaments: 3,
    totalTeams: 128,
    totalUsers: 512,
    recentSignups: 24,
    pendingApprovals: 8,
  }

  const mockChartData = [
    { name: "Jan", tournaments: 4 },
    { name: "Feb", tournaments: 3 },
    { name: "Mar", tournaments: 5 },
    { name: "Apr", tournaments: 6 },
    { name: "May", tournaments: 4 },
    { name: "Jun", tournaments: 7 },
  ]

  if (tournaments_data.data) {
    return (
      <div className="space-y-6 p-8 overflow-y-scroll h-full">
        <h1 className="text-3xl font-bold">Tournament Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatsCard
            Icon={Trophy}
            iconColor="text-blue-600"
            bgColor="bg-blue-100"
            title={tournaments_data.data?.length}
            description="Total Tournaments"
          />
          <StatsCard
            Icon={Target}
            iconColor="text-green-600"
            bgColor="bg-green-100"
            title={mockStats.activeTournaments}
            description="Active Tournaments"
          />
          <StatsCard
            Icon={Users}
            iconColor="text-purple-600"
            bgColor="bg-purple-100"
            title={mockStats.totalTeams}
            description="Registered Teams"
          />
          <StatsCard
            Icon={UserPlus}
            iconColor="text-orange-600"
            bgColor="bg-orange-100"
            title={mockStats.recentSignups}
            description="Recent Signups"
          />
          <StatsCard
            Icon={AlertCircle}
            iconColor="text-yellow-600"
            bgColor="bg-yellow-100"
            title={mockStats.pendingApprovals}
            description="Pending Approvals"
          />
          <StatsCard
            Icon={Calendar}
            iconColor="text-red-600"
            bgColor="bg-red-100"
            title={mockStats.totalUsers}
            description="Total Users"
          />
        </div>

        {/* Charts and Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Tournaments</CardTitle>
              <CardDescription>Overview of upcoming tournaments</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    {/* <TableHead>Participants</TableHead> */}
                    <TableHead>Start Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tournaments_data.data.map((tournament) => (
                    <TableRow className="cursor-pointer" key={tournament.name} onClick={() => { router.navigate({ to: "/admin/tournaments/" + tournament.id }) }}>
                      <TableCell>{tournament.name}</TableCell>
                      <TableCell>
                        <TournamentStatusBadge status={tournament.state} />
                      </TableCell>
                      {/* <TableCell>{tournament.participants}</TableCell> */}
                      <TableCell>{formatDateString(tournament.start_date)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Recenty Created Tournaments</CardTitle>
              <CardDescription>Overview of the recently created tournaments</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    {/* <TableHead>Participants</TableHead> */}
                    <TableHead>Start Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tournaments_data.data.map((tournament) => (
                    <TableRow className="cursor-pointer" key={tournament.name} onClick={() => { router.navigate({ to: "/admin/tournaments/" + tournament.id }) }}>
                      <TableCell>{tournament.name}</TableCell>
                      <TableCell>
                        <TournamentStatusBadge status={tournament.state} />
                      </TableCell>
                      {/* <TableCell>{tournament.participants}</TableCell> */}
                      <TableCell>{formatDateString(tournament.start_date)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Tournament Activity</CardTitle>
            <CardDescription>Number of tournaments per month</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockChartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Bar dataKey="tournaments" fill="#4f46e5" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    )

  }
}

interface StatsCardProps {
  Icon: LucideIcon
  iconColor: string
  bgColor: string
  title: number
  description: string
}

const StatsCard: React.FC<StatsCardProps> = ({ Icon, iconColor, bgColor, title, description }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{description}</CardTitle>
        <div className={`p-2 ${bgColor} rounded-full`}>
          <Icon className={`w-4 h-4 ${iconColor}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{title}</div>
      </CardContent>
    </Card>
  )
}

interface TournamentStatusBadgeProps {
  status: string
}

const TournamentStatusBadge: React.FC<TournamentStatusBadgeProps> = ({ status }) => {


  return <Badge className={"bg-gray-100 text-gray-800"}>{status}</Badge>
}

