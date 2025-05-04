import { AppSidebar } from "@/components/app-sidebar";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Component as BarChartComponent } from "@/components/charts/BarChart";
import { Component as LineChartComponent } from "@/components/charts/LineChart";
import { Component as RadialChartComponent } from "@/components/charts/RadialChart";
import { Component as RadarChartComponent } from "@/components/charts/RadarChart";
import {
  Bolt,
  Droplet,
  ThermometerSun,
  Cpu,
  Activity,
  CloudRain,
  Wind,
  Fan,
  HardDrive,
  Cloud,
  AlarmSmoke,
  BatteryFull,
  Wifi,
  Gauge
} from "lucide-react";
import data from "./data.json";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const dummyData = {
  line: [
    { month: "Jan", power: 120, temperature: 26 },
    { month: "Feb", power: 135, temperature: 27 },
    { month: "Mar", power: 160, temperature: 29 },
    { month: "Apr", power: 180, temperature: 30 },
    { month: "May", power: 140, temperature: 28 },
    { month: "Jun", power: 150, temperature: 27 },
    { month: "Jul", power: 165, temperature: 31 },
    { month: "Aug", power: 175, temperature: 32 },
    { month: "Sep", power: 160, temperature: 30 },
    { month: "Oct", power: 145, temperature: 27 },
    { month: "Nov", power: 130, temperature: 26 },
    { month: "Dec", power: 125, temperature: 25 },
  ],
  bar: [
    { month: "Jan", gpu: 76, cpu: 48 },
    { month: "Feb", gpu: 85, cpu: 52 },
    { month: "Mar", gpu: 90, cpu: 60 },
    { month: "Apr", gpu: 88, cpu: 58 },
    { month: "May", gpu: 82, cpu: 55 },
    { month: "Jun", gpu: 84, cpu: 57 },
    { month: "Jul", gpu: 90, cpu: 60 },
    { month: "Aug", gpu: 92, cpu: 62 },
    { month: "Sep", gpu: 88, cpu: 59 },
    { month: "Oct", gpu: 80, cpu: 54 },
    { month: "Nov", gpu: 75, cpu: 50 },
    { month: "Dec", gpu: 70, cpu: 48 },
  ],
  radar: [
    { metric: "Power", value: 85 },
    { metric: "Cooling", value: 72 },
    { metric: "Network", value: 60 },
    { metric: "Storage", value: 90 },
    { metric: "Processing", value: 78 },
    { metric: "Security", value: 70 },
  ],
  radial: [
    { label: "Visitors", visitors: 1293, fill: "#4c6ef5" },
    { label: "Incidents", visitors: 45, fill: "#f03e3e" },
    { label: "Optimizations", visitors: 289, fill: "#37b24d" },
  ],
};

export default function Page() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="px-4 lg:px-6">
        <div className="mb-6 space-y-2">
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <Gauge className="w-6 h-6" /> Data Center Monitoring
          </h2>
          <p className="text-lg text-muted-foreground">Realtime overview of key metrics and trends</p>
        </div>
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="flex justify-center gap-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="charts">Charts</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 gap-4 px-4 sm:grid-cols-2 md:grid-cols-3 lg:px-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bolt className="w-5 h-5 text-green-600" />
                    Power Usage
                  </CardTitle>
                  <CardDescription>Current usage in MW</CardDescription>
                </CardHeader>
                <CardContent className="text-4xl font-bold text-green-600">120 MW</CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Droplet className="w-5 h-5 text-blue-500" />
                    Water Flow
                  </CardTitle>
                  <CardDescription>Fresh water consumption</CardDescription>
                </CardHeader>
                <CardContent className="text-4xl font-bold text-blue-500">500 L/min</CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ThermometerSun className="w-5 h-5 text-red-500" />
                    Temperature
                  </CardTitle>
                  <CardDescription>Internal temperature</CardDescription>
                </CardHeader>
                <CardContent className="text-4xl font-bold text-red-500">27°C</CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-purple-600" />
                    GPU Utilization
                  </CardTitle>
                  <CardDescription>Avg usage across servers</CardDescription>
                </CardHeader>
                <CardContent className="text-4xl font-bold text-purple-600">76%</CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-orange-500" />
                    CPU Load
                  </CardTitle>
                  <CardDescription>Core avg last minute</CardDescription>
                </CardHeader>
                <CardContent className="text-4xl font-bold text-orange-500">42%</CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CloudRain className="w-5 h-5 text-cyan-600" />
                    Humidity Level
                  </CardTitle>
                  <CardDescription>Current internal humidity</CardDescription>
                </CardHeader>
                <CardContent className="text-4xl font-bold text-cyan-600">58%</CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wind className="w-5 h-5 text-teal-600" />
                    Air Pressure
                  </CardTitle>
                  <CardDescription>Server room pressure</CardDescription>
                </CardHeader>
                <CardContent className="text-4xl font-bold text-teal-600">1.03 atm</CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Fan className="w-5 h-5 text-amber-500" />
                    Fan Speed
                  </CardTitle>
                  <CardDescription>Average fan rotation</CardDescription>
                </CardHeader>
                <CardContent className="text-4xl font-bold text-amber-500">3400 RPM</CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HardDrive className="w-5 h-5 text-gray-700" />
                    Disk I/O
                  </CardTitle>
                  <CardDescription>Storage system throughput</CardDescription>
                </CardHeader>
                <CardContent className="text-4xl font-bold text-gray-700">380 MB/s</CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Cloud className="w-5 h-5 text-lime-600" />
                    CO₂ Levels
                  </CardTitle>
                  <CardDescription>Air quality indicator</CardDescription>
                </CardHeader>
                <CardContent className="text-4xl font-bold text-lime-600">412 ppm</CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlarmSmoke className="w-5 h-5 text-green-600" />
                    Fire Alarm
                  </CardTitle>
                  <CardDescription>Status of alarm system</CardDescription>
                </CardHeader>
                <CardContent className="text-4xl font-bold text-green-600">✅ Normal</CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BatteryFull className="w-5 h-5 text-blue-600" />
                    UPS Battery
                  </CardTitle>
                  <CardDescription>Current charge level</CardDescription>
                </CardHeader>
                <CardContent className="text-4xl font-bold text-blue-600">89%</CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wifi className="w-5 h-5 text-indigo-600" />
                    Bandwidth
                  </CardTitle>
                  <CardDescription>Average network usage</CardDescription>
                </CardHeader>
                <CardContent className="text-4xl font-bold text-indigo-600">780 Mbps</CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="charts">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 px-4">
              <LineChartComponent data={dummyData.line} />
              <BarChartComponent data={dummyData.bar} />
              <RadarChartComponent data={dummyData.radar} />
              <RadialChartComponent data={dummyData.radial} />
            </div>
          </TabsContent>

          <TabsContent value="logs">
            <div className="px-4 lg:px-6">
              <Card>
                <CardHeader>
                  <CardTitle>Warnings & Logs</CardTitle>
                  <CardDescription>Recent system messages</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-yellow-600 font-medium">⚠️ Cooling system operating near limit.</div>
                  <div className="text-red-600 font-medium">❌ Power surge detected on grid connection.</div>
                  <div className="text-green-600">✅ All systems nominal as of 10:45 AM.</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
