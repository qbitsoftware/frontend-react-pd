"use client"

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

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
    <Card className="bg-yellow rounded-lg">
      <CardContent className="pt-0">
        <ChartContainer config={chartConfig} className="relative">
          <AreaChart
            accessibilityLayer
            data={mockRatingChartData}
            margin={{
              left: 12,
              right: 12,
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
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
