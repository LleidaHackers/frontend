"use client";
import { useState, useRef, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import {
  Sun,
  Volume2,
  Thermometer,
  Droplets,
  Wind,
  Map,
  Save,
  RotateCcw,
  Zap,
  Droplet,
  Plug,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const mapContainerStyle = {
  width: "1200px",
  height: "800px",
};

// Default center, will be updated dynamically
const defaultCenter = { lat: 41.6176, lng: 0.62 };

const data = {
  grid: {
    width: 800,
    height: 800,
  },
  blocks: [
    {
      id: "transformer_5000-1",
      name: "Transformer_5000",
      type: "Transformer_5000",
      color: "048229",
      position: {
        x: 0.0,
        y: 0.0,
      },
      dimensions: {
        width: 200,
        height: 200,
      },
    },
    {
      id: "water_supply_500-2",
      name: "Water_Supply_500",
      type: "WaterSupply_500",
      color: "0339ba",
      position: {
        x: 200.0,
        y: 0.0,
      },
      dimensions: {
        width: 150,
        height: 100,
      },
    },
    {
      id: "water_treatment_250-3",
      name: "Water_Treatment_250",
      type: "WaterTreatment_250",
      color: "c95a03",
      position: {
        x: 350.0,
        y: 0.0,
      },
      dimensions: {
        width: 200,
        height: 200,
      },
    },
    {
      id: "water_chiller_400-4",
      name: "Water_Chiller_400",
      type: "WaterChiller_400",
      color: "089b94",
      position: {
        x: 350.0,
        y: 200.0,
      },
      dimensions: {
        width: 300,
        height: 100,
      },
    },
    {
      id: "network_rack_100-5",
      name: "Network_Rack_100",
      type: "NetworkRack_100",
      color: "89bce9",
      position: {
        x: 650.0,
        y: 0.0,
      },
      dimensions: {
        width: 40,
        height: 40,
      },
    },
    {
      id: "server_rack_500-6",
      name: "Server_Rack_500",
      type: "ServerRack_500",
      color: "8c0101",
      position: {
        x: 690.0,
        y: 0.0,
      },
      dimensions: {
        width: 40,
        height: 40,
      },
    },
    {
      id: "data_rack_100-7",
      name: "Data_Rack_100",
      type: "DataRack_100",
      color: "f100ff",
      position: {
        x: 730.0,
        y: 0.0,
      },
      dimensions: {
        width: 40,
        height: 40,
      },
    },
    {
      id: "data_rack_100-8",
      name: "Data_Rack_100",
      type: "DataRack_100",
      color: "f100ff",
      position: {
        x: 730.0,
        y: 40.0,
      },
      dimensions: {
        width: 40,
        height: 40,
      },
    },
  ],
};

export default function SimulatorPage() {
  const [blocks, setBlocks] = useState(data.blocks);
  const containerRef = useRef<HTMLDivElement>(null);
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [mapType, setMapType] = useState<"roadmap" | "satellite">("satellite");

  // Center coordinates state
  const [centerCoords, setCenterCoords] = useState<{
    lat: number;
    lng: number;
  }>(defaultCenter);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
  });

  const handleMouseDown = (id: number) => (e: React.MouseEvent) => {
    setDraggingId(id);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggingId === null || !Array.isArray(blocks)) return;
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
  // Fetch data center coordinates when dataCenterId changes
  useEffect(() => {
    async function fetchCoordinates() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/data-center/${dataCenterId}`
        );
        const json = await res.json();
        const lat = parseFloat(json.latituid);
        const lng = parseFloat(json.longitud);
        if (!isNaN(lat) && !isNaN(lng)) {
          setCenterCoords({ lat, lng });
        }
      } catch (err) {
        console.error("Failed to fetch coordinates", err);
      }
    }
    if (dataCenterId) {
      fetchCoordinates();
    }
  }, [dataCenterId]);

  // Backend modules state
  const [backendModules, setBackendModules] = useState([]);

  useEffect(() => {
    async function loadInfrastructure() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/build/build/${dataCenterId}`
        );
        const json = await res.json();
        setBackendModules(json);
      } catch (err) {
        console.error("Failed to load infrastructure", err);
      }
    }

    loadInfrastructure();
  }, [dataCenterId]);

  const handleSave = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/sat_solver/save/${dataCenterId}`,
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
      toast.success("ayout saved successfully");
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

  // Manual image mapping for module types
  const imageMap: Record<string, string> = {
    transformer: "transformator",
    water_treatment: "water-treatment",
    water_chiller: "water-cooling",
    water_supply: "water-cooling",
    server_rack: "rack",
    data_rack: "data-center",
    network_rack: "rack1",
    wind: "wind_mill",
    solar: "solar",
    nuclear: "nuclear",
    battery: "battery",
    server_square: "data-center", // Added mapping
  };
  // Agrupación visual de módulos por tipo
  const groupOffsets: Record<string, { x: number; y: number }> = {
    Transformer: { x: 100, y: 100 },
    Water: { x: 400, y: 100 },
    Server: { x: 100, y: 400 },
    Data: { x: 400, y: 400 },
    Network: { x: 700, y: 400 },
    Unknown: { x: 700, y: 100 },
  };

  // Use backendModules instead of scadaData, skip modules with "water_supply" in name
  const modules = backendModules
    .filter((mod) => !mod.name?.toLowerCase().includes("water_supply"))
    .map((mod) => {
      const baseName = mod.name?.split("_")[0]?.toLowerCase() || "default";
      // Prefer exact match for 'server_square'
      let imageKey = Object.keys(imageMap).find((key) =>
        mod.name?.toLowerCase().includes(key)
      );
      // Special: if name includes "server_square", use "server_square" as key
      if (mod.name?.toLowerCase().includes("server_square")) {
        imageKey = "server_square";
      }
      return {
        id: mod.id,
        name: mod.name?.replaceAll("_", " ") ?? "Unknown",
        x: mod.posX ?? 0,
        y: mod.posY ?? 0,
        image: `/assets/isometric_images/${
          imageMap[imageKey ?? baseName] || "default"
        }.png`,
        status: "ok",
      };
    });

  // Initial edges, used for simulation state
  const initialEdges = backendModules.flatMap((mod) => {
    const inEdges =
      mod.connectedIn?.map((sourceId) => ({
        sourceId,
        targetId: mod.id,
        status: "ok",
        label: Object.values(mod.current_inputs || {})
          .filter((v) => typeof v === "number")
          .map((v) => `${v}`)
          .join(" / "),
      })) ?? [];

    const outEdges =
      mod.connectedOut?.map((targetId) => ({
        sourceId: mod.id,
        targetId,
        status: "ok",
        label: Object.values(mod.current_outputs || {})
          .filter((v) => typeof v === "number")
          .map((v) => `${v}`)
          .join(" / "),
      })) ?? [];

    return [...inEdges, ...outEdges];
  });

  // Simulation state for edges and logs
  const [edges, setEdges] = useState(initialEdges);
  const [logItems, setLogItems] = useState<string[]>([]);

  // Update edges when backendModules change (to reset simulation)
  useEffect(() => {
    setEdges(initialEdges);
    setLogItems([]);
  }, [backendModules.length]);

  // MQTT topics state
  const [mqttTopics, setMqttTopics] = useState(
    modules.map((mod) => ({
      topic: `topic/${mod.id}`,
      status: "OK",
    }))
  );

  // Handler for Low Voltage Drop simulation
  const handleLowVoltageDrop = () => {
    toast.error("⚡ Low Voltage Drop triggered");

    // Elimina progresivamente líneas aleatorias
    const interval = setInterval(() => {
      setEdges((prev) => {
        if (prev.length === 0) {
          clearInterval(interval);
          return [];
        }
        const idxToRemove = Math.floor(Math.random() * prev.length);
        return prev.filter((_, idx) => idx !== idxToRemove);
      });
    }, 300);

    // Progressive error logs (accumulate in Simulation Log card)
    setTimeout(() => {
      setLogItems((prev) => [...prev, "⚡ Voltage drop detected on transformer line"]);
    }, 1000);
    setTimeout(() => {
      setLogItems((prev) => [...prev, "🔌 Attempting reroute of power to maintain uptime"]);
    }, 2000);
    setTimeout(() => {
      // Simulate rerouting by changing the first edge
      setEdges((prev) =>
        prev.map((edge, idx) => {
          if (idx === 0) {
            return {
              ...edge,
              sourceId: "backup_transformer",
              label: "⚡ Rerouted: 90",
              status: "ok",
            };
          }
          return edge;
        })
      );
      setLogItems((prev) => [...prev, "✅ Power rerouted successfully"]);
      // MQTT topics OFF after reroute
      setTimeout(() => {
        setMqttTopics((prev) =>
          prev.map((t) => ({ ...t, status: "OFF" }))
        );
      }, 5000);
    }, 4000);
  };

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
                  center={centerCoords}
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
                        className="absolute text-white text-sm flex items-center justify-center rounded shadow cursor-move text-center px-2"
                        style={{
                          top: block.position.y,
                          left: block.position.x,
                          width: block.dimensions.width,
                          height: block.dimensions.height,
                          backgroundColor: `#${block.color}99`,
                          border: "2px solid #000",
                        }}
                        onMouseDown={handleMouseDown(block.id)}
                      >
                        {(block.name ?? block.type)
                          .split("_")
                          .slice(0, 2)
                          .join(" ")}
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
                  <Thermometer className="w-5 h-5 text-red-500" />
                  Temperature
                </CardTitle>
                <CardDescription className="text-lg">
                  22°C average
                </CardDescription>
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
                <CardDescription className="text-lg">
                  Moderate (10 km/h average)
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="settings" className="flex-1 overflow-auto">
          <div className="flex justify-center gap-4 mt-4 mb-6">
            <Button
              variant="destructive"
              className="flex gap-2 items-center text-lg py-3 px-6 rounded-md"
              onClick={handleLowVoltageDrop}
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
              onClick={() => {
                toast.error("🔌 Transformer Failure triggered");

                const affectedModules = modules.filter((mod) =>
                  [
                    "transformer",
                    "server_rack",
                    "data_rack",
                    "network_rack",
                  ].some((key) => mod.name.toLowerCase().includes(key))
                );

                const failureLogs = [
                  "🔌 Transformer overload detected",
                  "⚠️ Power fluctuation beyond safety threshold",
                  "🔥 Core temperature rising rapidly",
                  "🚨 Disconnecting affected modules to prevent cascade failure",
                  "❌ Transformer offline – rerouting unavailable",
                ];

                // Apaga progresivamente las líneas
                failureLogs.forEach((log, idx) => {
                  setTimeout(() => {
                    setLogItems((prev) => [...prev, log]);

                    setEdges((prev) =>
                      prev.map((e) =>
                        idx >= 1 &&
                        affectedModules.some(
                          (m) => m.id === e.sourceId || m.id === e.targetId
                        )
                          ? { ...e, status: "warning", label: "0" }
                          : e
                      )
                    );
                  }, 1000 * (idx + 1));
                });

                // Desvanecer conexiones aleatoriamente después del fallo
                setTimeout(() => {
                  const interval = setInterval(() => {
                    setEdges((prev) => {
                      if (prev.length <= 1) {
                        clearInterval(interval);
                        return [];
                      }
                      const idxToRemove = Math.floor(Math.random() * prev.length);
                      return prev.filter((_, idx) => idx !== idxToRemove);
                    });
                  }, 300);
                }, 7000);

                // MQTT topics OFF for affected modules after failure
                setTimeout(() => {
                  setMqttTopics((prev) =>
                    prev.map((t, i) =>
                      affectedModules.some((mod) => `topic/${mod.id}` === t.topic)
                        ? { ...t, status: "OFF" }
                        : t
                    )
                  );
                }, 8000);
              }}
            >
              <Plug className="w-5 h-5" />
              Transformer Failure
            </Button>
          </div>
          {/* SCADA diagram and Simulation Log side by side */}
          <div className="flex justify-center gap-4 mt-4 mb-6">
            <div className="relative bg-gray-100 bg-opacity-70 dark:bg-gray-900 dark:bg-opacity-70 w-full max-w-6xl h-[800px] mx-auto rounded border border-gray-300 dark:border-gray-700 flex items-center justify-center">
              <div className="relative w-full h-full">
                {/* Render modules */}
                {modules.map((el, idx) => {
                  const type = el.name.split(" ")[0];
                  const groupIndex = modules
                    .filter((m) => m.name.startsWith(type))
                    .indexOf(el);
                  const xOffset = groupOffsets[type]?.x || 0;
                  const yOffset = groupOffsets[type]?.y || 0;
                  return (
                    <div
                      key={el.id}
                      className="absolute flex flex-col items-center z-10"
                      style={{
                        left:
                          el.x === 0 ? xOffset + (groupIndex % 2) * 160 : el.x,
                        top:
                          el.y === 0
                            ? yOffset + Math.floor(groupIndex / 2) * 160
                            : el.y,
                      }}
                    >
                      <img
                        src={el.image}
                        alt={el.name}
                        className="w-20 drop-shadow-md"
                      />
                      <span className="text-foreground text-sm mt-1">
                        {el.name}
                      </span>
                    </div>
                  );
                })}
                {/* Animated connection lines */}
                <svg className="absolute w-full h-full pointer-events-none z-0">
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
                    // Posiciones agrupadas por tipo
                    const srcType = src.name.split(" ")[0];
                    const srcGroupIndex = modules
                      .filter((m) => m.name.startsWith(srcType))
                      .indexOf(src);
                    const srcXOffset = groupOffsets[srcType]?.x || 0;
                    const srcYOffset = groupOffsets[srcType]?.y || 0;
                    const x1 =
                      src.x === 0
                        ? srcXOffset + (srcGroupIndex % 2) * 160 + 40
                        : src.x + 40;
                    const y1 =
                      src.y === 0
                        ? srcYOffset + Math.floor(srcGroupIndex / 2) * 160 + 40
                        : src.y + 40;
                    const tgtType = tgt.name.split(" ")[0];
                    const tgtGroupIndex = modules
                      .filter((m) => m.name.startsWith(tgtType))
                      .indexOf(tgt);
                    const tgtXOffset = groupOffsets[tgtType]?.x || 0;
                    const tgtYOffset = groupOffsets[tgtType]?.y || 0;
                    const x2 =
                      tgt.x === 0
                        ? tgtXOffset + (tgtGroupIndex % 2) * 160 + 40
                        : tgt.x + 40;
                    const y2 =
                      tgt.y === 0
                        ? tgtYOffset + Math.floor(tgtGroupIndex / 2) * 160 + 40
                        : tgt.y + 40;
                    // Pick gradient for demonstration
                    const isWater =
                      edge.label?.toLowerCase().includes("water") ||
                      edge.label?.toLowerCase().includes("m³");
                    const stroke =
                      edge.status === "ok"
                        ? isWater
                          ? "url(#water-flow)"
                          : "url(#electric-flow)"
                        : edge.status === "warning"
                        ? "orange"
                        : "red";
                    // Polyline points: from source center to (x1, y2) then to target
                    // This makes a right-angle path (rectangular)
                    // Label position: mid of the elbow
                    const labelX = x1;
                    const labelY = (y1 + y2) / 2 - 5;
                    return (
                      <g key={idx}>
                        <polyline
                          points={`${x1},${y1} ${x1},${y2} ${x2},${y2}`}
                          stroke={stroke}
                          strokeWidth="3"
                          fill="none"
                          className="flow-line"
                        />
                        <text
                          x={labelX}
                          y={labelY}
                          className="fill-foreground"
                          fontSize="12"
                          textAnchor="middle"
                        >
                          {edge.label ? edge.label : "—"}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>
            <Card className="w-96 h-[800px] overflow-auto">
              <CardHeader>
                <CardTitle className="text-2xl">Simulation Log</CardTitle>
                <CardDescription className="text-lg">
                  Latest warnings and errors
                </CardDescription>
              </CardHeader>
              <div className="p-4 space-y-2">
                {logItems.map((log, idx) => (
                  <div
                    key={idx}
                    className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 p-2 rounded text-base"
                  >
                    {log}
                  </div>
                ))}
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

