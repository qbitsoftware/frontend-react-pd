"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Trophy, Target, type LucideIcon, LayoutDashboard, AlertCircle } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { UseGetTournaments } from "@/queries/tournaments";
import ErrorPage from "@/components/error";
import { formatDateString } from "@/lib/utils";
import { ErrorResponse, Tournament } from "@/types/types";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/dashboard/")({
  loader: async ({ context: { queryClient } }) => {
    try {
      const tournaments_data = await queryClient.ensureQueryData(UseGetTournaments());
      return { tournaments_data, error: null };
    } catch (error) {
      return { tournaments_data: null, error };
    }
  },
  component: RouteComponent,
  errorComponent: () => <ErrorPage />,
});

export default function RouteComponent() {
  const { tournaments_data, error } = Route.useLoaderData();
  const router = useRouter();
  const { t } = useTranslation();

  const processChartData = (tournaments: Tournament[]) => {
    const monthMap = new Map();
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    months.forEach((month) => {
      monthMap.set(month, 0);
    });

    tournaments.forEach((tournament) => {
      if (tournament.start_date) {
        const date = new Date(tournament.start_date);
        const month = months[date.getMonth()];
        monthMap.set(month, monthMap.get(month) + 1);
      }
    });

    return months.map((month) => ({
      name: month,
      tournaments: monthMap.get(month),
    }));
  };

  const getStats = (tournaments: Tournament[]) => {
    const activeTournaments = tournaments.filter(
      (t) => t.state === "active"
    ).length;

    return {
      totalTournaments: tournaments.length,
      activeTournaments: activeTournaments,
    };
  };

  // Handle error cases
  if (error) {
    const err = error as ErrorResponse;
    if (err.response && err.response.status === 404) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] m-8 space-y-2 rounded-lg border-2 border-dashed border-gray-200">
          <LayoutDashboard className="w-16 h-16 text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            {t("admin.dashboard.missing")}
          </h3>
          <p className="text-gray-500 text-center max-w-md">
            {t("admin.dashboard.missing_subtitle")}
          </p>
          <Link href="/admin/tournaments/new">
            <Button className="mt-2 px-6">{t("admin.tournaments.add_new")}</Button>
          </Link>
        </div>
      );
    } else {
      // Handle other errors like network issues
      return (
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center space-x-4">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <CardTitle>
                {t("admin.dashboard.errors.network.title")}
              </CardTitle>
              <p className="text-gray-600 mt-1">
                {t("admin.dashboard.errors.network.description")}
              </p>
            </div>
          </CardHeader>
        </Card>
      );
    }
  }

  // If there's no error but also no data or empty data
  if (!tournaments_data || !tournaments_data.data || tournaments_data.data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] m-8 space-y-2 rounded-lg border-2 border-dashed border-gray-200">
        <LayoutDashboard className="w-16 h-16 text-gray-300 mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          {t("admin.dashboard.not_found.title")}
        </h3>
        <p className="text-gray-500 text-center max-w-md">
          {t("admin.dashboard.not_found.subtitle")}
        </p>
        <Link href="/admin/tournaments/new">
          <Button className="mt-2 px-6">{t("admin.dashboard.add_new")}</Button>
        </Link>
      </div>
    );
  }

  // Process data for display if we have valid data
  const chartData = processChartData(tournaments_data.data);
  const stats = getStats(tournaments_data.data);

  const currentDate = new Date();

  const upcomingTournaments = [...tournaments_data.data]
    .filter((tournament) => new Date(tournament.start_date) > currentDate)
    .sort(
      (a, b) =>
        new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
    );

  // Main content when everything is working properly
  return (
    <div className="space-y-6 p-8 overflow-y-scroll h-full">
      <h3 className=" font-bold">{t("admin.dashboard.name")}</h3>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatsCard
          Icon={Trophy}
          iconColor="text-blue-600"
          bgColor="bg-blue-100"
          title={stats.totalTournaments}
          description={t("admin.dashboard.total_tournaments")}
        />
        <StatsCard
          Icon={Target}
          iconColor="text-green-600"
          bgColor="bg-green-100"
          title={stats.activeTournaments}
          description={t("admin.dashboard.active_tournaments")}
        />
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("admin.dashboard.upcoming_tournaments")}</CardTitle>
            <CardDescription>
              {t("admin.dashboard.upcoming_tournaments_description")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("admin.dashboard.utils.name")}</TableHead>
                  <TableHead>{t("admin.dashboard.utils.status")}</TableHead>
                  <TableHead>
                    {t("admin.dashboard.utils.start_date")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {upcomingTournaments.map((tournament) => (
                  <TableRow
                    className="cursor-pointer"
                    key={tournament.name}
                    onClick={() => {
                      router.navigate({
                        to: "/admin/tournaments/" + tournament.id,
                      });
                    }}
                  >
                    <TableCell>{tournament.name}</TableCell>
                    <TableCell>
                      <TournamentStatusBadge status={tournament.state} />
                    </TableCell>
                    <TableCell className="truncate">
                      {formatDateString(tournament.start_date)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>
              {t("admin.dashboard.recently_created_tournaments")}
            </CardTitle>
            <CardDescription>
              {t("admin.dashboard.recently_created_tournaments_description")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("admin.dashboard.utils.name")}</TableHead>
                  <TableHead>{t("admin.dashboard.utils.status")}</TableHead>
                  <TableHead>
                    {t("admin.dashboard.utils.start_date")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tournaments_data.data.map((tournament) => (
                  <TableRow
                    className="cursor-pointer"
                    key={tournament.name}
                    onClick={() => {
                      router.navigate({
                        to: "/admin/tournaments/" + tournament.id,
                      });
                    }}
                  >
                    <TableCell>{tournament.name}</TableCell>
                    <TableCell>
                      <TournamentStatusBadge status={tournament.state} />
                    </TableCell>
                    <TableCell className="truncate">
                      {formatDateString(tournament.start_date)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{t("admin.dashboard.tournament_activity")}</CardTitle>
          <CardDescription>
            {t("admin.dashboard.tournament_activity_description")}
          </CardDescription>
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
  );
}

interface StatsCardProps {
  Icon: LucideIcon;
  iconColor: string;
  bgColor: string;
  title: number;
  description: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  Icon,
  iconColor,
  bgColor,
  title,
  description,
}) => {
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
  );
};

interface TournamentStatusBadgeProps {
  status: string;
}

const TournamentStatusBadge: React.FC<TournamentStatusBadgeProps> = ({
  status,
}) => {
  return <Badge className={"bg-gray-100 text-gray-800 hover:bg-stone-200"}>{status}</Badge>;
};