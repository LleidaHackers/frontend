"use client";
import { useState, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GoogleMap, LoadScript } from "@react-google-maps/api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useParams } from "next/navigation";

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
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_UR}/sat_solver/save/${dataCenterId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ blocks }),
      });

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
              onClick={() =>
                setMapType(mapType === "satellite" ? "roadmap" : "satellite")
              }
            >
              Switch to {mapType === "satellite" ? "Street View" : "Satellite View"}
            </Button>
            <Button variant="secondary" onClick={handleSave}>
              Save Layout
            </Button>
            <Button variant="destructive" onClick={handleReset}>
              Reset Layout
            </Button>
          </div>
          <div className="relative mt-4 flex justify-center w-full">
            <div className="flex justify-center w-full">
              <LoadScript
                googleMapsApiKey={
                  process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string
                }
              >
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
                        className="absolute text-white text-xs flex items-center justify-center rounded shadow cursor-move"
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
              </LoadScript>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="settings" className="flex-1 overflow-auto">
          <div className="relative bg-[#0d1b2a] w-full max-w-6xl h-[800px] mx-auto mt-4 rounded border border-gray-700">
            {[
              {
                id: 1,
                name: "Solar",
                x: 50,
                y: 100,
                image: "/assets/isometric_images/solar.png",
              },
              {
                id: 2,
                name: "Data Center",
                x: 300,
                y: 200,
                image: "/assets/isometric_images/data-center.png",
              },
              {
                id: 3,
                name: "Battery",
                x: 550,
                y: 100,
                image: "/assets/isometric_images/battery.png",
              },
              {
                id: 4,
                name: "Wind",
                x: 100,
                y: 400,
                image: "/assets/isometric_images/wind_mill.png",
              },
              {
                id: 5,
                name: "Cooling",
                x: 500,
                y: 400,
                image: "/assets/isometric_images/water-cooling.png",
              },
            ].map((el) => (
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
                <span className="text-white text-xs mt-1">{el.name}</span>
              </div>
            ))}

            {/* LÍNEAS DE CONEXIÓN animadas */}
            <svg className="absolute w-full h-full pointer-events-none">
              <defs>
                <linearGradient
                  id="electric-flow"
                  gradientTransform="rotate(90)"
                >
                  <stop offset="0%" stopColor="#facc15" />
                  <stop offset="100%" stopColor="#fcd34d" />
                </linearGradient>
                <linearGradient id="water-flow" gradientTransform="rotate(90)">
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

              <line
                x1="90"
                y1="120"
                x2="280"
                y2="220"
                stroke="url(#electric-flow)"
                strokeWidth="3"
                className="flow-line"
              />
              <line
                x1="320"
                y1="220"
                x2="530"
                y2="120"
                stroke="url(#water-flow)"
                strokeWidth="3"
                className="flow-line"
              />
              <line
                x1="90"
                y1="120"
                x2="110"
                y2="420"
                stroke="url(#electric-flow)"
                strokeWidth="3"
                className="flow-line"
              />
              <line
                x1="320"
                y1="220"
                x2="500"
                y2="420"
                stroke="url(#water-flow)"
                strokeWidth="3"
                className="flow-line"
              />
            </svg>

            <div className="absolute top-4 left-4 text-white text-sm bg-black/40 p-2 rounded mqtt-status">
              {Object.entries(mqttValues).map(([topic, status]) => (
                <div key={topic}>
                  <span className="font-mono">{topic}:</span> {status}
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
