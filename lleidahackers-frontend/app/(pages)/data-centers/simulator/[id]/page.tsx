"use client";
import { useState, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { Sun, Volume2, Thermometer, Droplets, Wind, Map, Save, RotateCcw, Zap, Droplet, Plug } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const center = { lat: 41.6176, lng: 0.62 }; // Ejemplo: Lleida
const mapContainerStyle = {
  width: "1200px",
  height: "800px",
};

const data = {
  grid: {
    width: 100,
    height: 500,
  },
  blocks: [
    {
      id: 309887,
      name: "asdf",
      type: "Transformer_100",
      color: "#FF0000",
      position: {
        x: 0.0,
        y: 0.0,
      },
      dimensions: {
        width: 40,
        height: 45,
      },
    },
    {
      id: 428269,
      name: "asdf",
      type: "Transformer_100",
      color: "#FF0000",
      position: {
        x: 40.0,
        y: 0.0,
      },
      dimensions: {
        width: 40,
        height: 45,
      },
    },
    {
      id: 392429,
      name: "asdf",
      type: "Transformer_100",
      color: "#FF0000",
      position: {
        x: 40.0,
        y: 45.0,
      },
      dimensions: {
        width: 40,
        height: 45,
      },
    },
    {
      id: 919969,
      name: "asdf",
      type: "Transformer_100",
      color: "#FF0000",
      position: {
        x: 40.0,
        y: 90.0,
      },
      dimensions: {
        width: 40,
        height: 45,
      },
    },
    {
      id: 238949,
      name: "asdf",
      type: "Transformer_100",
      color: "#FF0000",
      position: {
        x: 40.0,
        y: 135.0,
      },
      dimensions: {
        width: 40,
        height: 45,
      },
    },
  ],
};

export default function SimulatorPage() {
  const [blocks, setBlocks] = useState(data.blocks);
  const containerRef = useRef<HTMLDivElement>(null);
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [mapType, setMapType] = useState<"roadmap" | "satellite">("satellite");

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
  });

  const handleMouseDown = (id: number) => (e: React.MouseEvent) => {
    setDraggingId(id);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggingId === null) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const newBlocks = blocks.map((b) =>
      b.id === draggingId
        ? {
            ...b,
            position: {
              x: e.clientX - rect.left,
              y: e.clientY - rect.top,
            },
          }
        : b
    );
    setBlocks(newBlocks);
  };

  const handleMouseUp = () => {
    setDraggingId(null);
  };
  const params = useParams();

  const dataCenterId = params?.id as string;

  const handleSave = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_UR}/sat_solver/save/${dataCenterId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ blocks }),
        }
      );

      if (!response.ok) throw new Error("Failed to save layout");

      toast.success("Layout saved successfully");
    } catch (error) {
      toast.error("Failed to save layout");
      console.error(error);
    }
  };

  const handleReset = () => {
    setBlocks(data.blocks);
  };

  const mqttValues = {
    "topic/solar": "OK",
    "topic/battery": "LOW",
    "topic/wind": "OK",
  };

  // --- SCADA backend-like data (replace with backend call when available) ---
  const scadaData = [
    {
      id: "solar",
      name: "Solar_Panel",
      posX: 50,
      posY: 100,
      connectedIn: [],
      current_inputs: {},
    },
    {
      id: "datacenter",
      name: "Data_Center",
      posX: 300,
      posY: 200,
      connectedIn: ["solar", "battery"],
      current_inputs: { power: 120, water: 80 },
    },
    {
      id: "battery",
      name: "Battery",
      posX: 550,
      posY: 100,
      connectedIn: ["datacenter"],
      current_inputs: { power: 60 },
    },
    {
      id: "wind",
      name: "Wind_Mill",
      posX: 100,
      posY: 400,
      connectedIn: ["solar"],
      current_inputs: { power: 60 },
    },
    {
      id: "cooling",
      name: "Water_Cooling",
      posX: 500,
      posY: 400,
      connectedIn: ["datacenter"],
      current_inputs: { water: 50 },
    },
  ];

  const modules = scadaData.map((mod) => ({
    id: mod.id,
    name: mod.name.replaceAll("_", " "),
    x: mod.posX,
    y: mod.posY,
    image: `/assets/isometric_images/${mod.name.toLowerCase()}.png`,
    status: "ok",
  }));

  const edges = scadaData.flatMap(
    (mod) =>
      mod.connectedIn?.map((sourceId) => ({
        sourceId,
        targetId: mod.id,
        status: "ok",
        label: Object.values(mod.current_inputs)
          .filter((v) => typeof v === "number")
          .map((v) => `${v}`)
          .join(" / "),
      })) ?? []
  );

  const mqttTopics = modules.map((mod) => ({
    topic: `topic/${mod.id}`,
    status: "OK",
  }));

  return (
    <div className="flex flex-col h-screen p-8 w-full">
      <h1 className="text-2xl font-bold text-center">SIMULATING PAGE</h1>
      <Tabs defaultValue="overview" className="flex-1 flex flex-col">
        <TabsList>
          <TabsTrigger value="overview">2D Distribution</TabsTrigger>
          <TabsTrigger value="settings">SCADA</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="flex-1 overflow-auto">
          <div className="flex justify-center mt-4 space-x-4">
            <Button
              variant="default"
              className="text-lg py-3 px-6 rounded-md flex items-center"
              onClick={() =>
                setMapType(mapType === "satellite" ? "roadmap" : "satellite")
              }
            >
              <Map className="w-5 h-5 mr-2" />
              Switch to{" "}
              {mapType === "satellite" ? "Street View" : "Satellite View"}
            </Button>
            <Button
              variant="secondary"
              className="text-lg py-3 px-6 rounded-md flex items-center"
              onClick={handleSave}
            >
              <Save className="w-5 h-5 mr-2" />
              Save Layout
            </Button>
            <Button
              variant="destructive"
              className="text-lg py-3 px-6 rounded-md flex items-center"
              onClick={handleReset}
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Reset Layout
            </Button>
          </div>
          <div className="relative mt-4 flex justify-center w-full">
            <div className="flex justify-center w-full">
              {isLoaded && (
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={center}
                  zoom={17}
                  mapTypeId={mapType}
                  options={{
                    draggable: false,
                    scrollwheel: false,
                    disableDefaultUI: true,
                    gestureHandling: "none",
                  }}
                >
                  {/* Área total del grid */}
                  <div
                    className="absolute border-2 border-dashed border-green-500"
                    style={{
                      width: data.grid.width,
                      height: data.grid.height,
                      left: (1200 - data.grid.width) / 2,
                      top: (800 - data.grid.height) / 2,
                      zIndex: 1,
                    }}
                  />
                  <div
                    ref={containerRef}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    className="absolute top-0 left-0"
                    style={{
                      width: data.grid.width,
                      height: data.grid.height,
                      left: (1200 - data.grid.width) / 2,
                      top: (800 - data.grid.height) / 2,
                      zIndex: 2,
                    }}
                  >
                    {blocks.map((block) => (
                      <div
                        key={block.id}
                        className="absolute text-white text-sm flex items-center justify-center rounded shadow cursor-move"
                        style={{
                          top: block.position.y,
                          left: block.position.x,
                          width: block.dimensions.width,
                          height: block.dimensions.height,
                          backgroundColor: block.color,
                          opacity: 0.4,
                          border: "1px solid #000",
                        }}
                        onMouseDown={handleMouseDown(block.id)}
                      >
                        {block.type}
                      </div>
                    ))}
                  </div>
                </GoogleMap>
              )}
            </div>
          </div>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto w-full">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Sun className="w-5 h-5 text-yellow-500" />
                  Solar Irradiance
                </CardTitle>
                <CardDescription className="text-lg">
                  5.4 kWh/m²/day (estimated average)
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Volume2 className="w-5 h-5 text-blue-500" />
                  Ambient Noise Level
                </CardTitle>
                <CardDescription className="text-lg">42 dB (rural/suburban zone)</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Thermometer className="w-5 h-5 text-red-500" />
                  Temperature
                </CardTitle>
                <CardDescription className="text-lg">22°C average</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Droplets className="w-5 h-5 text-cyan-500" />
                  Humidity
                </CardTitle>
                <CardDescription className="text-lg">55%</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Wind className="w-5 h-5 text-indigo-500" />
                  Wind Availability
                </CardTitle>
                <CardDescription className="text-lg">Moderate (10 km/h average)</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="settings" className="flex-1 overflow-auto">
          <div className="flex justify-center gap-4 mt-4 mb-6">
            <Button
              variant="destructive"
              className="flex gap-2 items-center text-lg py-3 px-6 rounded-md"
              onClick={() => toast.error("⚡ Low Voltage Drop triggered")}
            >
              <Zap className="w-5 h-5" />
              Low Voltage Drop
            </Button>
            <Button
              variant="secondary"
              className="flex gap-2 items-center text-lg py-3 px-6 rounded-md"
              onClick={() => toast.warning("🚱 Water Shortage triggered")}
            >
              <Droplet className="w-5 h-5" />
              Water Shortage
            </Button>
            <Button
              variant="default"
              className="flex gap-2 items-center text-lg py-3 px-6 rounded-md"
              onClick={() => toast("🔌 Transformer Failure triggered")}
            >
              <Plug className="w-5 h-5" />
              Transformer Failure
            </Button>
          </div>
          {/* SCADA diagram and Simulation Log side by side */}
          <div className="flex justify-center gap-4 mt-4 mb-6">
            <div className="relative bg-[#0d1b2a] w-full max-w-6xl h-[800px] mx-auto rounded border border-gray-700">
              {/* Render modules */}
              {modules.map((el) => (
                <div
                  key={el.id}
                  className="absolute flex flex-col items-center"
                  style={{ left: el.x, top: el.y }}
                >
                  <img
                    src={el.image}
                    alt={el.name}
                    className="w-20 drop-shadow-md"
                  />
                  <span className="text-white text-sm mt-1">{el.name}</span>
                </div>
              ))}
              {/* Animated connection lines */}
              <svg className="absolute w-full h-full pointer-events-none">
                <defs>
                  <linearGradient
                    id="electric-flow"
                    gradientTransform="rotate(90)"
                  >
                    <stop offset="0%" stopColor="#facc15" />
                    <stop offset="100%" stopColor="#fcd34d" />
                  </linearGradient>
                  <linearGradient
                    id="water-flow"
                    gradientTransform="rotate(90)"
                  >
                    <stop offset="0%" stopColor="#38bdf8" />
                    <stop offset="100%" stopColor="#0ea5e9" />
                  </linearGradient>
                  <style>
                    {`
                      .flow-line {
                        stroke-dasharray: 8;
                        stroke-dashoffset: 0;
                        animation: dash 1s linear infinite;
                      }
                      @keyframes dash {
                        to {
                          stroke-dashoffset: -16;
                        }
                      }
                      .mqtt-status {
                        animation: blink 1.5s infinite;
                      }
                      @keyframes blink {
                        0%, 100% { opacity: 1; }
                        50% { opacity: 0.5; }
                      }
                    `}
                  </style>
                </defs>
                {edges.map((edge, idx) => {
                  const getModuleById = (id: string) =>
                    modules.find((m) => m.id === id);
                  const src = getModuleById(edge.sourceId);
                  const tgt = getModuleById(edge.targetId);
                  if (!src || !tgt) return null;
                  // Calculate center points of modules (offset image size/2 for better appearance)
                  const x1 = src.x + 40;
                  const y1 = src.y + 40;
                  const x2 = tgt.x + 40;
                  const y2 = tgt.y + 40;
                  // Pick gradient for demonstration
                  const isWater = edge.label?.includes("m³");
                  const stroke =
                    edge.status === "ok"
                      ? isWater
                        ? "url(#water-flow)"
                        : "url(#electric-flow)"
                      : edge.status === "warning"
                      ? "orange"
                      : "red";
                  // Label position, simple midpoint
                  const labelX = (x1 + x2) / 2;
                  const labelY = (y1 + y2) / 2 - 5;
                  return (
                    <g key={idx}>
                      <line
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke={stroke}
                        strokeWidth="3"
                        className="flow-line"
                      />
                      {edge.label && (
                        <text
                          x={labelX}
                          y={labelY}
                          fill="white"
                          fontSize="12"
                          textAnchor="middle"
                        >
                          {edge.label}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>
            <Card className="w-96 h-[800px] overflow-auto">
              <CardHeader>
                <CardTitle className="text-2xl">Simulation Log</CardTitle>
                <CardDescription className="text-lg">Latest warnings and errors</CardDescription>
              </CardHeader>
              <div className="p-4 space-y-2">
                <div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 p-2 rounded text-base">
                  ⚠️ Solar input too low
                </div>
                <div className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 p-2 rounded text-base">
                  ❌ Battery failure
                </div>
                <div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 p-2 rounded text-base">
                  ⚠️ Cooling efficiency reduced
                </div>
              </div>
            </Card>
          </div>
          {/* MQTT Topics Status below the flex row */}
          <div className="w-full max-w-6xl mx-auto bg-muted p-4 rounded border text-base text-foreground mt-6">
            <h4 className="font-semibold mb-2 text-xl">MQTT Topics Status</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {mqttTopics.map(({ topic, status }) => (
                <div
                  key={topic}
                  className="flex justify-between p-2 rounded bg-background border"
                >
                  <span className="font-mono">{topic}</span>
                  <span
                    className={
                      status === "OK"
                        ? "text-green-600"
                        : status === "LOW"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }
                  >
                    {status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
