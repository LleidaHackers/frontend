"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { HousePlug } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
const dataCenters = [
  {
    id: 1,
    name: "Data Center 1",
    location: "Location 1",
    budget: 100000,
    energyPriduction: 50000,
    status: "Active",
  },
  {
    id: 2,
    name: "Data Center 2",
    location: "Location 2",
    status: "Inactive",
    budget: 200000,
    energyPriduction: 100000,
  },
  {
    id: 3,
    name: "Data Center 2",
    location: "Location 2",
    status: "Inactive",
    budget: 200000,
    energyPriduction: 100000,
  },
];
import { Button } from "@/components/ui/button";
export default function DataCentersPage() {
  const router = useRouter();
  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold mb-2 text-center">Data Centers</h1>
          <p className="text-center mb-4">Siemens data centers</p>
        </div>
        <div>
          <Button onClick={() => router.push("/data-centers/create")}>
            New Data Center
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {dataCenters.map((center) => (
          <Card
            key={center.id}
            className="shadow-md p-4 flex "
            // onClick={() => router.push(`/data-centers/sandbox/${center.id}`)}
          >
            <div className="flex items-center justify-center">
              <HousePlug className="w-16 h-16 text-primary" />
            </div>
            <div className="">
              <div className="items-center justify-center flex flex-col gap-y-2">
                <CardTitle className="text-xl font-semibold text-center">
                  {center.name}
                </CardTitle>
                <Badge
                  className={`text-xs px-2 py-1 rounded-full font-medium ${
                    center.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {center.status}
                </Badge>
              </div>
              <CardContent className="mt-2 space-y-1 p-0">
                <p className="text-sm text-muted-foreground">
                  📍 Location: {center.location}
                </p>
                <p className="text-sm text-muted-foreground">
                  💰 Budget: ${center.budget.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">
                  ⚡ Energy Production:{" "}
                  {center.energyPriduction.toLocaleString()} kW
                </p>
              </CardContent>
            </div>
            <CardFooter className="flex justify-center mt-4 gap-x-4">
              <Button
                onClick={() => router.push(`/data-centers/sandbox/${center.id}`)}
              >
                Sandbox
              </Button>
              <Button
                onClick={() =>
                  router.push(`/data-centers/simulator/${center.id}`)
                }
              >
                Simulator
              </Button>
              {/*if data center is disconetec inable the button to monitor */}
              <Button
                onClick={() =>
                  router.push(`/data-center/monitor/${center.id}`)
                }
                disabled={center.status === "Inactive"}
                variant="outline"
              >
                Monitor
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
