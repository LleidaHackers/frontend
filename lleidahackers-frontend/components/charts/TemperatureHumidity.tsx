"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
const chartData = [
  { date: "2025-05-04 00:00", temperature: 20, humidity: 65 },
  { date: "2025-05-04 01:00", temperature: 19.5, humidity: 66 },
  { date: "2025-05-04 02:00", temperature: 19, humidity: 67 },
  { date: "2025-05-04 03:00", temperature: 18.8, humidity: 68 },
  { date: "2025-05-04 04:00", temperature: 18.5, humidity: 69 },
  { date: "2025-05-04 05:00", temperature: 18.3, humidity: 70 },
  { date: "2025-05-04 06:00", temperature: 18.5, humidity: 71 },
  { date: "2025-05-04 07:00", temperature: 19, humidity: 70 },
  { date: "2025-05-04 08:00", temperature: 20, humidity: 68 },
  { date: "2025-05-04 09:00", temperature: 21.5, humidity: 65 },
  { date: "2025-05-04 10:00", temperature: 23, humidity: 63 },
  { date: "2025-05-04 11:00", temperature: 24.5, humidity: 60 },
  { date: "2025-05-04 12:00", temperature: 26, humidity: 58 },
  { date: "2025-05-04 13:00", temperature: 27.2, humidity: 55 },
  { date: "2025-05-04 14:00", temperature: 28, humidity: 53 },
  { date: "2025-05-04 15:00", temperature: 28.5, humidity: 51 },
  { date: "2025-05-04 16:00", temperature: 28, humidity: 52 },
  { date: "2025-05-04 17:00", temperature: 27, humidity: 54 },
  { date: "2025-05-04 18:00", temperature: 25.5, humidity: 56 },
  { date: "2025-05-04 19:00", temperature: 24, humidity: 58 },
  { date: "2025-05-04 20:00", temperature: 22.5, humidity: 60 },
  { date: "2025-05-04 21:00", temperature: 21.5, humidity: 62 },
  { date: "2025-05-04 22:00", temperature: 20.5, humidity: 64 },
  { date: "2025-05-04 23:00", temperature: 20, humidity: 65 }
]

const chartConfig = {
  temperature: {
    label: "Temperature (°C)",
    color: "rgba(255, 99, 132, 1)",
  },
  humidity: {
    label: "Humidity (%)",
    color: "rgba(54, 162, 235, 1)",
  },
} satisfies ChartConfig

export function Component() {
  const [timeRange, setTimeRange] = React.useState("90d")

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date("2024-06-30")
    let daysToSubtract = 90
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Temperature & Humidity</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="temperature"
              type="monotone"
              fill="rgba(255, 99, 132, 0.2)"
              stroke="rgba(255, 99, 132, 1)"
              name="Temperature (°C)"
            />
            <Area
              dataKey="humidity"
              type="monotone"
              fill="rgba(54, 162, 235, 0.2)"
              stroke="rgba(54, 162, 235, 1)"
              name="Humidity (%)"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
