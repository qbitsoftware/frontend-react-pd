
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

const chartConfig = {
  NR: {
    label: "NR",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function PlayerRankingChangeGraph() {
  return (
    <Card className="border-0 shadow-none">
      <CardContent className="p-0 pt-4">
        <ChartContainer config={chartConfig} className="relative h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={mockRatingChartData}
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
                dataKey="NR"
                type="natural"
                fill="var(--blue-light)"
                fillOpacity={0.4}
                stroke="var(--blue-light)"
                strokeWidth={2}
                stackId="a"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}