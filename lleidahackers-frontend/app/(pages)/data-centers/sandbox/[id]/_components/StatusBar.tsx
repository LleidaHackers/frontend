import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DollarSign,
  Zap,
  Server,
  Layers,
  Droplet,
  Snowflake,
} from "lucide-react";

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
  soundLevel,
  waterProduction,
  chilledWaterProduction,
  freshWaterUsage,
  freshWaterProduction,
  distilledWaterProduction,
  internalNetworkUsage,
  internalNetworkProduction,
  externalNetworkProduction,
  procesProduction,
  dataStorageProduction,
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
  soundLevel: number;
  waterProduction: number;
  chilledWaterProduction: number;
  freshWaterUsage: number;
  freshWaterProduction: number;
  distilledWaterProduction: number;
  internalNetworkUsage: number;
  internalNetworkProduction: number;
  externalNetworkProduction: number;
  procesProduction: number;
  dataStorageProduction: number;
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
        <CardHeader>
          <CardTitle>⚡ Power Stats</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-1">
          <div>
            Used:{" "}
            <span className={accomulatePower >= powerConsume ? "text-green-600" : "text-red-600"}>
              {powerConsume} W
            </span>
          </div>
          <div>
            Required:{" "}
            <span className={accomulatePower >= powerRequired ? "text-green-600" : "text-red-600"}>
              {powerRequired} W
            </span>
          </div>
          <div>Accumulated: {accomulatePower} W</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Layers className="w-4 h-4" /> Surface Used
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-semibold">
            {occupedSurface} / {totalSurface} m²
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>💧 Water Stats</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-1">
          <div>Water Usage: {waterUsage} L</div>
          <div>
            Fresh:{" "}
            <span className={freshWaterProduction >= freshWaterUsage ? "text-green-600" : "text-red-600"}>
              {freshWaterUsage}L
            </span>{" "}
            / {freshWaterProduction}L
          </div>
          <div>
            Distilled:{" "}
            <span className={distilledWaterProduction >= distilledWaterUsage ? "text-green-600" : "text-red-600"}>
              {distilledWaterUsage}L
            </span>{" "}
            / {distilledWaterProduction}L
          </div>
          <div>
            Chilled:{" "}
            <span className={chilledWaterProduction >= chilledWaterUsage ? "text-green-600" : "text-red-600"}>
              {chilledWaterUsage}L
            </span>{" "}
            / {chilledWaterProduction}L
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Internal Network</CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          <div className={internalNetworkProduction >= internalNetworkUsage ? "text-green-600" : "text-red-600"}>
            Usage: {internalNetworkUsage}
          </div>
          <div>Production: {internalNetworkProduction}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>External Network Production</CardTitle>
        </CardHeader>
        <CardContent>{externalNetworkProduction}</CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Process Production</CardTitle>
        </CardHeader>
        <CardContent>{procesProduction}</CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Data Storage Production</CardTitle>
        </CardHeader>
        <CardContent>{dataStorageProduction} GB</CardContent>
      </Card>
      {/* <Card>
        <CardHeader>
          <CardTitle>Sound Level</CardTitle>
        </CardHeader>
        <CardContent>{soundLevel} dB</CardContent>
      </Card> */}
    </div>
  );
}
