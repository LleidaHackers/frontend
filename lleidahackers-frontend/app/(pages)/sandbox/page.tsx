"use client";

import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  ReactFlowProvider,
} from "reactflow";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Eye, Hammer, RotateCcw, EyeOff, Save, Car, Search } from "lucide-react";
import "reactflow/dist/style.css";
import { useCallback, useEffect, useState } from "react";
import StatusBar from "./_components/StatusBar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";

const initialNodes: Node[] = [
  {
    id: "solar",
    type: "default",
    position: { x: 100, y: 100 },
    data: {
      label: "☀️ Solar Panel\n(Energy Output: 20W)",
      type: "source",
      power: 20,
    },
  },
  {
    id: "server",
    type: "default",
    position: { x: 400, y: 100 },
    data: {
      label: "🖥️ Server\n(Needs: 10W)",
      type: "sink",
      demand: 10,
      powered: false,
    },
  },
];

const initialEdges: Edge[] = [];

function FlowCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [history, setHistory] = useState<{ nodes: Node[]; edges: Edge[] }[]>(
    []
  );
  const [showSidebar, setShowSidebar] = useState(true);
  const [showSpecs, setShowSpecs] = useState(false);
  // Specs
  const [budget, setBudget] = useState(50000);
  const [totalBudget, setTotalBudget] = useState(50000);
  const [powerConsume, setConsumeUsage] = useState(0);
  const [powerRequired, setPowerRequired] = useState(0);
  const [accomulatePower, setAccomulatePower] = useState(0);
  const [occupedSurface, setOccupiedSurface] = useState(0);
  const [totalSurface, setTotalSurface] = useState(0);
  const [waterUsage, setWaterUsage] = useState(0);
  const [distilledWaterUsage, setDistilledWaterUsage] = useState(0);
  const [chilledWaterUsage, setChilledWaterUsage] = useState(0);

  const devices = [
    {
      type: "source",
      name: "Solar Panel",
      icon: "Sun",
      specs: ["Output: 20W", "Type: Renewable"],
      cost: 2000,
    },
    {
      type: "sink",
      name: "Server",
      icon: "Server",
      specs: ["Consumption: 10W", "Critical Load"],
      cost: 1500,
    },
    {
      type: "sink",
      name: "Cooler",
      icon: "Snowflake",
      specs: ["Consumption: 5W", "Thermal Control"],
      cost: 1000,
    },
    {
      type: "sink",
      name: "Cooler",
      icon: "Snowflake",
      specs: ["Consumption: 5W", "Thermal Control"],
      cost: 1000,
    },
    {
      type: "sink",
      name: "Cooler",
      icon: "Snowflake",
      specs: ["Consumption: 5W", "Thermal Control"],
      cost: 1000,
    },
    {
      type: "sink",
      name: "Cooler",
      icon: "Snowflake",
      specs: ["Consumption: 5W", "Thermal Control"],
      cost: 1000,
    },
    {
      type: "source",
      name: "Solar Panel",
      icon: "Sun",
      specs: ["Output: 20W", "Type: Renewable"],
      cost: 2000,
    },
    {
      type: "sink",
      name: "Server",
      icon: "Server",
      specs: ["Consumption: 10W", "Critical Load"],
      cost: 1500,
    },
    {
      type: "sink",
      name: "Cooler",
      icon: "Snowflake",
      specs: ["Consumption: 5W", "Thermal Control"],
      cost: 1000,
    },
    {
      type: "sink",
      name: "Cooler",
      icon: "Snowflake",
      specs: ["Consumption: 5W", "Thermal Control"],
      cost: 1000,
    },
    {
      type: "sink",
      name: "Cooler",
      icon: "Snowflake",
      specs: ["Consumption: 5W", "Thermal Control"],
      cost: 1000,
    },
    {
      type: "sink",
      name: "Cooler",
      icon: "Snowflake",
      specs: ["Consumption: 5W", "Thermal Control"],
      cost: 1000,
    },
    {
      type: "source",
      name: "Solar Panel",
      icon: "Sun",
      specs: ["Output: 20W", "Type: Renewable"],
      cost: 2000,
    },
    {
      type: "sink",
      name: "Server",
      icon: "Server",
      specs: ["Consumption: 10W", "Critical Load"],
      cost: 1500,
    },
    {
      type: "sink",
      name: "Cooler",
      icon: "Snowflake",
      specs: ["Consumption: 5W", "Thermal Control"],
      cost: 1000,
    },
    {
      type: "sink",
      name: "Cooler",
      icon: "Snowflake",
      specs: ["Consumption: 5W", "Thermal Control"],
      cost: 1000,
    },
    {
      type: "sink",
      name: "Cooler",
      icon: "Snowflake",
      specs: ["Consumption: 5W", "Thermal Control"],
      cost: 1000,
    },
    {
      type: "sink",
      name: "Cooler",
      icon: "Snowflake",
      specs: ["Consumption: 5W", "Thermal Control"],
      cost: 1000,
    },
  ];
  const [search, setSearch] = useState("");

  const handleNodesChange = (changes: any) => {
    setHistory((prev) => [...prev, { nodes, edges }]);
    onNodesChange(changes);
  };

  const handleEdgesChange = (changes: any) => {
    setHistory((prev) => [...prev, { nodes, edges }]);
    onEdgesChange(changes);
  };

  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    []
  );

  useEffect(() => {
    const powerSources = nodes.filter((n) => n.data.type === "source");
    const sinks = nodes.map((n) => {
      if (n.data.type === "sink") {
        const isConnected = edges.some(
          (e) => e.target === n.id && powerSources.length > 0
        );
        return {
          ...n,
          data: {
            ...n.data,
            label: isConnected
              ? `${n.data.label.split("\n")[0]}\n✅ Powered`
              : `${n.data.label.split("\n")[0]}\n❌ No Power`,
          },
        };
      }
      return n;
    });

    setNodes(sinks);
  }, [edges]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault();
        setHistory((prev) => {
          const last = prev[prev.length - 1];
          if (last) {
            setNodes(last.nodes);
            setEdges(last.edges);
            return prev.slice(0, -1);
          }
          return prev;
        });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const addNode = (device: (typeof devices)[number]) => {
    if (budget < device.cost) return;

    const id = `${device.name.toLowerCase().replace(" ", "-")}-${
      nodes.length + 1
    }`;
    const newNode: Node = {
      id,
      type: "default",
      position: { x: Math.random() * 600, y: Math.random() * 400 },
      data: {
        label: `${
          device.icon === "Sun" ? "☀️" : device.icon === "Server" ? "🖥️" : "❄️"
        } ${device.name}\n($${device.cost})`,
        type: device.type,
        power: device.type === "source" ? 20 : undefined,
        demand: device.type === "sink" ? 10 : undefined,
      },
    };
    setNodes((nds) => [...nds, newNode]);
    setBudget((b) => b - device.cost);
  };

  const handleSave = () => {
    const state = { nodes, edges };
    console.log("Saved state:", state);
    // Aquí podrías hacer un fetch POST a tu backend
  };

  return (
    <>
      {/*Toogle Menu Bar */}
      <Card className="mt-2">
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                className="bg-yellow-400 hover:bg-yellow-500 text-black"
                onClick={() => setShowSpecs(!showSpecs)}
              >
                {showSpecs ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
                {showSpecs ? "Hide Specs" : "Show Specs"}
              </Button>

              <Button
                className="bg-red-500 hover:bg-red-600 text-white"
                onClick={() => {
                  setNodes([]);
                  setEdges([]);
                  setHistory([]);
                  setBudget(50000);
                }}
              >
                <RotateCcw className="w-4 h-4" />
                Reset Design
              </Button>

              <Button className="bg-green-500 hover:bg-green-600 text-white">
                <Hammer className="w-4 h-4" />
                Build Simulation
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Button>
                <Save className="w-4 h-4" />
                Safe
              </Button>
              <Button
                className="bg-purple-500 hover:bg-purple-600 text-white"
                onClick={() => setShowSidebar(!showSidebar)}
              >
                {showSidebar ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
                {showSidebar ? "Hide Menu" : "Show Menu"}
              </Button>
            </div>
          </div>
        </CardContent>
        {showSpecs && (
          <StatusBar
            budget={budget}
            totalBudget={totalBudget}
            powerConsume={powerConsume}
            powerRequired={powerRequired}
            accomulatePower={accomulatePower}
            occupedSurface={occupedSurface}
            totalSurface={totalSurface}
            waterUsage={waterUsage}
            distilledWaterUsage={distilledWaterUsage}
            chilledWaterUsage={chilledWaterUsage}
          />
        )}
      </Card>
      <div className="flex h-[calc(100vh-48px)]">
        <div className="flex-1">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={handleNodesChange}
            onEdgesChange={handleEdgesChange}
            onConnect={onConnect}
            fitView
          >
            {/* <MiniMap /> */}
            {/* <Controls /> */}
            <Background />
          </ReactFlow>
        </div>

        {showSidebar && (
          <>
            <Card className="w-[400px] bg-white border-l overflow-y-auto mt-2">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Devices</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  Drag and drop devices to the canvas
                </CardDescription>
              </CardHeader>
              <Separator />
              <CardContent className="px-3 pt-0">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search device..."
                    className="w-full pl-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardContent className="px-3 grid grid-cols-2 gap-3">
                {devices
                  .filter((device) =>
                    device.name.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((device, index) => (
                    <Card
                      key={index}
                      className="hover:bg-muted cursor-pointer aspect-square"
                      onClick={() => addNode(device)}
                    >
                      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">
                          {device.name}
                        </CardTitle>
                        <span className="text-gray-500 text-xl">
                          <i data-lucide={device.icon}></i>
                        </span>
                      </CardHeader>
                      <CardContent>
                        <ul className="text-xs text-muted-foreground list-disc list-inside">
                          {device.specs.map((s, i) => (
                            <li key={i}>{s}</li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
              </CardContent>
            </Card>
            {/* <div className="w-[300px] bg-white border-l p-4 space-y-4 overflow-y-auto">
              <h3 className="text-lg font-semibold">Device Library</h3>
              <input
                type="text"
                placeholder="Search devices..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-3 py-2 border rounded text-sm"
              />

              {["source", "sink"].map((section) => (
                <div key={section}>
                  <h4 className="text-sm font-semibold mt-4 mb-2 capitalize">
                    {section === "source" ? "Sources" : "Sinks"}
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {devices
                      .filter(
                        (d) =>
                          d.type === section &&
                          d.name.toLowerCase().includes(search.toLowerCase())
                      )
                      .map((device, index) => (
                        <Card
                          key={index}
                          className="hover:bg-muted cursor-pointer aspect-square flex flex-col justify-between"
                          onClick={() => addNode(device)}
                        >
                          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium">
                              {device.name}
                            </CardTitle>
                            <span className="text-gray-500 text-xl">
                              <i data-lucide={device.icon}></i>
                            </span>
                          </CardHeader>
                          <CardContent>
                            <ul className="text-xs text-muted-foreground list-disc list-inside">
                              {device.specs.map((s, i) => (
                                <li key={i}>{s}</li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </div>
              ))}
            </div> */}
          </>
        )}
      </div>
    </>
  );
}

export default function Page() {
  return (
    <ReactFlowProvider>
      <FlowCanvas />
    </ReactFlowProvider>
  );
}
