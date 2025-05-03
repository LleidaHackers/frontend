"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { HousePlug, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { toast } from "sonner";
export default function DataCentersPage() {
  const router = useRouter();
  const [dataCenters, setDataCenters] = useState<any[]>([]);

  useEffect(() => {
    const fetchDataCenters = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/data-center`
        );
        const data = await response.json();
        console.log("Data centers:", data);
        setDataCenters(data);
      } catch (error) {
        console.error("Error loading data centers:", error);
      }
    };

    fetchDataCenters();
  }, []);
  const handleDelete = (id: string) => async () => {
    if (confirm("Are you sure you want to delete this data center?")) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/data-center/${id}`,
          {
            method: "DELETE",
          }
        );
        if (response.ok) {
          setDataCenters((prev) => prev.filter((center) => center._id !== id));
          toast.success("Data center deleted successfully");
          router.refresh();
        } else {
          console.error("Error deleting data center:", response.statusText);
        }
      } catch (error) {
        console.error("Error deleting data center:", error);
      }
    }
  };

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
      {!dataCenters.length && (
        <div className="flex items-center justify-center">
          <p className="text-lg text-muted-foreground">
            No data centers found. Please create one.
          </p>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {dataCenters.map((center) => (
          <Card
            key={center._id ?? center.id}
            className="shadow-md p-4 flex relative"
            // onClick={() => router.push(`/data-centers/sandbox/${center.id}`)}
          >
            <div className="absolute top-2 right-2">
              <Button
                size="icon"
                variant="destructive"
                onClick={async () => {
                  await handleDelete(center._id?.$oid)();
                  router.refresh();
                }}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center justify-center">
              <HousePlug className="w-16 h-16 text-primary" />
            </div>
            <div className="">
              <div className="items-center justify-center flex flex-col gap-y-2">
                <CardTitle className="text-xl font-semibold text-center">
                  {center.projectName}
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
                  📍 Location: {center.country}
                </p>
                <p className="text-sm text-muted-foreground">
                  💰 Budget: ${center.budget?.toLocaleString?.() ?? "N/A"}
                </p>
                <p className="text-sm text-muted-foreground">
                  ⚡ Energy Production:{" "}
                  {center.energyProduction?.toLocaleString?.() ?? "N/A"} kW
                </p>
              </CardContent>
            </div>
            <CardFooter className="flex justify-center mt-4 gap-x-4">
              <Button
                onClick={() =>
                  router.push(`/data-centers/sandbox/${center._id?.$oid}`)
                }
              >
                Sandbox
              </Button>
              <Button
                onClick={() =>
                  router.push(`/data-centers/simulator/${center._id?.$oid}`)
                }
              >
                Simulator
              </Button>
              {/*if data center is disconetec inable the button to monitor */}
              <Button
                onClick={() =>
                  router.push(`/data-centers/monitor/${center._id?.$oid}`)
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
