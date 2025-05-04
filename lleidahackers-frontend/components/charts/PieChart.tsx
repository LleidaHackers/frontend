"use client"

import { TrendingUp } from "lucide-react"
import { LabelList, Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
const chartData = [
  { resource: "Power", value: 4500, fill: "#4c6ef5" },
  { resource: "Cooling", value: 3200, fill: "#66c2a5" },
  { resource: "Network", value: 2100, fill: "#fc8d62" },
  { resource: "Storage", value: 1800, fill: "#8da0cb" },
  { resource: "Processing", value: 3000, fill: "#e78ac3" },
]

const chartConfig = {
  value: {
    label: "Value",
  },
  Power: {
    label: "Power",
    color: "#4c6ef5",
  },
  Cooling: {
    label: "Cooling",
    color: "#66c2a5",
  },
  Network: {
    label: "Network",
    color: "#fc8d62",
  },
  Storage: {
    label: "Storage",
    color: "#8da0cb",
  },
  Processing: {
    label: "Processing",
    color: "#e78ac3",
  },
} satisfies ChartConfig

export function Component() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Pie Chart - Label List</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] [&_.recharts-text]:fill-background"
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="value" hideLabel />}
            />
            <Pie data={chartData} dataKey="value">
              <LabelList
                dataKey="resource"
                className="fill-background"
                stroke="none"
                fontSize={12}
                formatter={(value: keyof typeof chartConfig) =>
                  chartConfig[value]?.label
                }
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}
