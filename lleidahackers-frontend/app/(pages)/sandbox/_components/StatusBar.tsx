import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DollarSign, Zap, Server, Layers, Droplet, Snowflake } from "lucide-react";

export default function StatusBar({
  budget,
  totalBudget,
  powerConsume,
  powerRequired,
  accomulatePower,
  occupedSurface,
  totalSurface,
  waterUsage,
  distilledWaterUsage,
  chilledWaterUsage,
}: {
  budget: number;
  totalBudget: number;
  powerConsume: number;
  powerRequired: number;
  accomulatePower: number;
  occupedSurface: number;
  totalSurface: number;
  waterUsage: number;
  distilledWaterUsage: number;
  chilledWaterUsage: number;
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 px-4 py-2">
      <Card className="">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <DollarSign className="w-4 h-4" /> Budget
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-semibold">
            ${budget.toLocaleString()} / ${totalBudget.toLocaleString()}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Zap className="w-4 h-4" /> Power Used
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-semibold">{powerConsume} W</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Zap className="w-4 h-4" /> Power Required
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-semibold">{powerRequired} W</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Zap className="w-4 h-4" /> Power Accumulated
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-semibold">{accomulatePower} W</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Layers className="w-4 h-4" /> Surface Used
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-semibold">{occupedSurface} / {totalSurface} m²</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Droplet className="w-4 h-4" /> Water Usage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-semibold">{waterUsage} L</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Droplet className="w-4 h-4" /> Distilled Water
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-semibold">{distilledWaterUsage} L</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Snowflake className="w-4 h-4" /> Chilled Water
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-semibold">{chilledWaterUsage} L</p>
        </CardContent>
      </Card>
    </div>
  );
}
