import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"

import {
  Card,
  CardContent,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

import { mockRatingChartData } from "@/lib/mock_data/rating_mocks"
import { Player } from "@/types/types"

const chartConfig = {
  ratingPoints: {
    label: "Rating Points",
    color: "hsl(var(--chart-1))",
  },
  weightPoints: {
    label: "Weight Points",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

interface Props {
  stats: Player[]
}

export function PlayerRankingChangeGraph({ stats }: Props) {
  const chartData = stats.map((player, index) => ({
    id: index,
    month: player.created_at ? new Date(player.created_at).toLocaleString('default', { month: 'long' }) : `Tournament ${index + 1}`,
    ratingPoints: player.extra_data?.rate_points * Math.floor(Math.random() * 5) + 1 || 0,
    // ratingPoints: player.rank || 0,
    weightPoints: player.extra_data?.rate_order * Math.floor(Math.random() * 5) + 1 || 0,
  }));

  return (
    <Card className="border-0 shadow-none ">
      <CardContent className="p-0 pt-4">
        <ChartContainer config={chartConfig} className="relative h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData.length > 0 ? chartData : mockRatingChartData}
              margin={{
                top: 10,
                right: 15,
                left: 5,
                bottom: 20,
              }}
            >
              <CartesianGrid vertical={false} stroke="#f0f0f0" />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
                tick={{ fill: "#777" }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#777" }}
                width={30}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Area
                dataKey="ratingPoints"
                type="natural"
                fill="var(--blue-light)"
                fillOpacity={0.4}
                stroke="var(--blue-light)"
                strokeWidth={2}
                stackId="a"
              />
              <Area
                dataKey="weightPoints"
                type="natural"
                fill="var(--green-light)"
                fillOpacity={0.4}
                stroke="var(--green-light)"
                strokeWidth={2}
                stackId="b"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}