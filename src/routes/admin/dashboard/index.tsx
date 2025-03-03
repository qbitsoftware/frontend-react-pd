"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Target, type LucideIcon } from "lucide-react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { createFileRoute, useRouter } from "@tanstack/react-router"
import { UseGetTournaments } from "@/queries/tournaments"
import ErrorPage from "@/components/error"
import { formatDateString } from "@/lib/utils"
import { Tournament } from "@/types/types"


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

  const processChartData = (tournaments: Tournament[]) => {
    const monthMap = new Map();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    months.forEach(month => {
      monthMap.set(month, 0);
    });

    tournaments.forEach(tournament => {
      if (tournament.start_date) {
        const date = new Date(tournament.start_date);
        const month = months[date.getMonth()];
        monthMap.set(month, monthMap.get(month) + 1);
      }
    });

    return months.map(month => ({
      name: month,
      tournaments: monthMap.get(month)
    }));
  };

  const getStats = (tournaments: Tournament[]) => {
    const activeTournaments = tournaments.filter(t => t.state === "active").length;

    return {
      totalTournaments: tournaments.length,
      activeTournaments: activeTournaments,
    };
  };

  if (tournaments_data.data) {
    const chartData = processChartData(tournaments_data.data);
    const stats = getStats(tournaments_data.data);

    const currentDate = new Date();

    const upcomingTournaments = [...tournaments_data.data]
      .filter(tournament => new Date(tournament.start_date) > currentDate)
      .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());

    return (
      <div className="space-y-6 p-8 overflow-y-scroll h-full">
        <h1 className="text-3xl font-bold">Tournament Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatsCard
            Icon={Trophy}
            iconColor="text-blue-600"
            bgColor="bg-blue-100"
            title={stats.totalTournaments}
            description="Total Tournaments"
          />
          <StatsCard
            Icon={Target}
            iconColor="text-green-600"
            bgColor="bg-green-100"
            title={stats.activeTournaments}
            description="Active Tournaments"
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
                    <TableHead>Start Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {upcomingTournaments.map((tournament) => (
                    <TableRow className="cursor-pointer" key={tournament.name} onClick={() => { router.navigate({ to: "/admin/tournaments/" + tournament.id }) }}>
                      <TableCell>{tournament.name}</TableCell>
                      <TableCell>
                        <TournamentStatusBadge status={tournament.state} />
                      </TableCell>
                      <TableCell className="truncate">{formatDateString(tournament.start_date)}</TableCell>
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
                      <TableCell className="truncate">{formatDateString(tournament.start_date)}</TableCell>
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
              <BarChart data={chartData}>
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

