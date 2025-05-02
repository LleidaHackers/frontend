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
} from "@/components/ui/card";

import "reactflow/dist/style.css";
import { useCallback, useEffect, useState } from "react";

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
  const [history, setHistory] = useState<{ nodes: Node[]; edges: Edge[] }[]>([]);
  const [showSidebar, setShowSidebar] = useState(true);
  const [budget, setBudget] = useState(50000);

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
  ];
  const [search, setSearch] = useState("");



  const handleNodesChange = (changes) => {
    setHistory((prev) => [...prev, { nodes, edges }]);
    onNodesChange(changes);
  };

  const handleEdgesChange = (changes) => {
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

  const addNode = (device: typeof devices[number]) => {
    if (budget < device.cost) return;

    const id = `${device.name.toLowerCase().replace(" ", "-")}-${nodes.length + 1}`;
    const newNode: Node = {
      id,
      type: "default",
      position: { x: Math.random() * 600, y: Math.random() * 400 },
      data: {
        label: `${device.icon === "Sun" ? "☀️" : device.icon === "Server" ? "🖥️" : "❄️"} ${device.name}\n($${device.cost})`,
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
      <div className="flex items-center justify-between px-4 py-2 border-b bg-white">
        <div className="flex space-x-4 text-sm font-medium">
          <span>💰 Available Budget: ${budget.toLocaleString()}</span>
          <span>⚡ Power Usage: 0 kW</span>
          <span>📏 Occupied Surface: 0 m²</span>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={handleSave}>
            💾 Save
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => {
              setNodes([]);
              setEdges([]);
              setHistory([]);
              setBudget(50000);
            }}
          >
            🔄 Reset
          </Button>
          <Button size="sm" onClick={() => setShowSidebar(!showSidebar)}>
            {showSidebar ? "Hide Menu" : "Show Menu"}
          </Button>
        </div>
      </div>

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
            <MiniMap />
            <Controls />
            <Background />
          </ReactFlow>
        </div>

        {showSidebar && (
          <div className="w-[300px] bg-white border-l p-4 space-y-4 overflow-y-auto">
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
                          <CardTitle className="text-sm font-medium">{device.name}</CardTitle>
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
          </div>
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
