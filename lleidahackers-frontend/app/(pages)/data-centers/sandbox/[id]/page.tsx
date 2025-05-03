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
  Handle,
  Position,
} from "reactflow";
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  EdgeTypes,
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
import {
  Eye,
  Hammer,
  RotateCcw,
  EyeOff,
  Save,
  Car,
  Search,
  Bolt,
  Droplet,
  Snowflake,
  FlaskConical,
  Network,
  Globe,
  Cpu,
  Database,
  Lightbulb,
  HelpCircle,
  Loader2,
} from "lucide-react";
import * as LucideIcons from "lucide-react";
import "reactflow/dist/style.css";
import { useCallback, useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import StatusBar from "./_components/StatusBar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
type CustomNodeData = {
  label: string;
  type: string;
  power?: number;
  demand?: number;
  compatibleWith?: string[];
  inputs?: string[];
  outputs?: string[];
};

const getResourceIcon = (type: string) => {
  switch (type) {
    case "power":
      return <Lightbulb className="w-3 h-3 text-yellow-500" />;
    case "water":
      return <Droplet className="w-3 h-3 text-blue-600" />;
    case "chilledWater":
      return <Snowflake className="w-3 h-3 text-cyan-600" />;
    case "distilledWater":
      return <FlaskConical className="w-3 h-3 text-indigo-600" />;
    case "internalNetwork":
      return <Network className="w-3 h-3 text-orange-600" />;
    case "externalNetwork":
      return <Globe className="w-3 h-3 text-emerald-600" />;
    case "proces":
      return <Cpu className="w-3 h-3 text-gray-700" />;
    case "dataStorage":
      return <Database className="w-3 h-3 text-purple-700" />;
    default:
      return <span className="text-xs">{type}</span>;
  }
};

const CustomNode = ({
  id,
  data,
  setNodes,
  setEdges,
}: {
  id: string;
  data: CustomNodeData;
  setNodes: React.Dispatch<React.SetStateAction<Node<CustomNodeData>[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
}) => {
  return (
    <div
      className="group relative rounded-md border p-3 text-sm shadow-md min-w-[140px]"
      style={{
        backgroundColor: data?.style?.backgroundColor ?? "#FFF",
        border: "1px solid #CBD5E1",
      }}
    >
      <div
        className="absolute -top-5 -right-5 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center cursor-pointer z-50 shadow-md"
        onClick={(e) => {
          e.stopPropagation();
          setNodes((nds) => nds.filter((n) => n.id !== id));
          setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
        }}
      >
        ×
      </div>
      <div className="font-semibold text-center whitespace-pre-line">
        {data.label}
      </div>
      <div className="text-xs text-muted-foreground text-center mb-2">
        {data.type}
      </div>
      {data.inputs?.map((input, idx) => (
        <div
          key={`input-${input}`}
          style={{ position: "absolute", left: -20, top: 30 + idx * 20 }}
          className="flex items-center"
        >
          {getResourceIcon(input)}
          <Handle
            type="target"
            position={Position.Left}
            id={`${input}-in`}
            style={{
              background: "#E5E7EB",
              border: "1px solid #ccc",
              width: 8,
              height: 8,
              borderRadius: "50%",
            }}
          />
        </div>
      ))}
      {data.outputs?.map((output, idx) => (
        <div
          key={`output-${output}`}
          style={{ position: "absolute", right: -20, top: 30 + idx * 20 }}
          className="flex items-center gap-1"
        >
          <Handle
            type="source"
            position={Position.Right}
            id={`${output}-out`}
            style={{
              background: "#E5E7EB",
              border: "1px solid #ccc",
              width: 8,
              height: 8,
              borderRadius: "50%",
            }}
          />
          {getResourceIcon(output)}
        </div>
      ))}
    </div>
  );
};

const initialNodes: Node<CustomNodeData>[] = [
  {
    id: "solar",
    type: "custom",
    position: { x: 100, y: 100 },
    data: {
      label: "☀️ Solar Panel\n(Energy Output: 20W)",
      type: "source",
      power: 20,
      compatibleWith: ["sink"],
      inputs: [],
      outputs: ["power"],
    },
    style: {
      borderRadius: 8,
      padding: 8,
      backgroundColor: "#ECFDF5",
      border: "1px solid #CBD5E1",
    },
  },
  {
    id: "server",
    type: "custom",
    position: { x: 400, y: 100 },
    data: {
      label: "🖥️ Server\n(Needs: 10W)",
      type: "sink",
      demand: 10,
      powered: false,
      compatibleWith: ["source"],
      inputs: ["power"],
      outputs: [],
    },
    style: {
      borderRadius: 8,
      padding: 8,
      backgroundColor: "#EEF2FF",
      border: "1px solid #CBD5E1",
    },
  },
];

const initialEdges: Edge[] = [];

const CustomEdge = ({ id, sourceX, sourceY, targetX, targetY, data }: any) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  return (
    <>
      <BaseEdge path={edgePath} id={id} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            background: "white",
            padding: "2px 6px",
            borderRadius: "4px",
            fontSize: 10,
            border: "1px solid #ccc",
          }}
        >
          {data?.label || "⚡ Power"}
        </div>
      </EdgeLabelRenderer>
    </>
  );
};


type DeviceDefinition = {
  name: string;
  icon: string;
  cost: number;
  surface: number;
  energyConsumption: number;
  energyProduction: number;
  waterUsage: number;
  waterProduction: number;
  chilledWaterUsage: number;
  chilledWaterProduction: number;
  distilledWaterUsage: number;
  distilledWaterProduction: number;
  internalNetworkUsage: number;
  internalNetworkProduction: number;
  externalNetworkProduction: number;
  soundLevel: number;
  procesProduction: number;
  dataStorageProduction: number;
  inputs: string[];
  outputs: string[];
  type: string;
};

const test = [
  {
    name: "Solar Panel",
    icon: "Sun",
    cost: 2000,
    surface: 2,
    energyConsumption: 20,
    energyProduction: 20,
    waterUsage: 0,
    waterProduction: 0,
    chilledWaterUsage: 0,
    chilledWaterProduction: 0,
    distilledWaterUsage: 0,
    distilledWaterProduction: 0,
    internalNetworkUsage: 2,
    internalNetworkProduction: 2,
    externalNetworkProduction: 0,
    soundLevel: 0,
    procesProduction: 0,
    dataStorageProduction: 0,
    inputs: ["chilledWater", "distilledWater"],
    outputs: ["power"],
    type: "source",
  },
];

function FlowCanvas() {
  const params = useParams();
  const dataCenterId = params?.id as string;
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [history, setHistory] = useState<{ nodes: Node[]; edges: Edge[] }[]>(
    []
  );
  const [showSidebar, setShowSidebar] = useState(true);
  const [showSpecs, setShowSpecs] = useState(false);
  // Agrupado por tipo
  const [devices, setDevices] = useState<Record<string, DeviceDefinition[]>>(
    {}
  );
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

  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);

  const handleNodesChange = (changes: any) => {
    setHistory((prev) => [...prev, { nodes, edges }]);
    onNodesChange(changes);
  };

  const handleEdgesChange = (changes: any) => {
    setHistory((prev) => [...prev, { nodes, edges }]);
    onEdgesChange(changes);
  };

  const edgeTypes: EdgeTypes = useMemo(
    () => ({
      custom: CustomEdge,
    }),
    []
  );

  // nodeTypes must be defined inside FlowCanvas to access setNodes and setEdges
  const nodeTypes = useMemo(
    () => ({
      custom: (nodeProps: any) => (
        <CustomNode
          {...nodeProps}
          setNodes={setNodes}
          setEdges={setEdges}
        />
      ),
    }),
    [setNodes, setEdges]
  );

  // Nueva conexión: validación por tipo de recurso
  const onConnect = useCallback((connection: Connection) => {
    const sourceHandle = connection.sourceHandle?.split("-")[0];
    const targetHandle = connection.targetHandle?.split("-")[0];
    if (sourceHandle === targetHandle) {
      setEdges((eds) =>
        addEdge(
          {
            ...connection,
            type: "custom",
            data: { label: sourceHandle },
          },
          eds
        )
      );
    } else {
      alert("Incompatible connection types");
    }
  }, []);

  // Optimización: actualiza nodos solo si realmente cambian para evitar renders innecesarios
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

    const updatedNodes = sinks.map((node) => {
      const requiredInputs = node.data.inputs?.length || 0;
      const connectedInputs = edges.filter(
        (e) =>
          e.target === node.id &&
          node.data.inputs?.includes(e.targetHandle?.split("-")[0] || "")
      ).length;

      const isFullyConnected = connectedInputs >= requiredInputs;
      const baseStyle = node.style || {};

      return {
        ...node,
        style: {
          ...baseStyle,
          backgroundColor:
            requiredInputs === 0
              ? "#FFFFFF"
              : isFullyConnected
              ? "#D1FAE5"
              : "#E5E7EB",
        },
      };
    });

    const hasChanged =
      JSON.stringify(nodes.map((n) => ({ ...n, position: undefined }))) !==
      JSON.stringify(updatedNodes.map((n) => ({ ...n, position: undefined })));

    if (hasChanged) {
      setNodes(updatedNodes);
    }
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

  // Cargar workflow desde backend o usar por defecto
  const loadWorkflow = async () => {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      const response = await fetch(`${backendUrl}/modules/workflow/${dataCenterId}`);
      if (response.ok) {
        const data = await response.json();
        if (data?.nodes && data?.edges) {
          setNodes(data.nodes);
          setEdges(data.edges);
        } else {
          // Si no hay workflow guardado, carga nodos por defecto
          setNodes(initialNodes);
          setEdges(initialEdges);
        }
      } else {
        // Si no existe aún
        setNodes(initialNodes);
        setEdges(initialEdges);
      }
    } catch (error) {
      console.error("Error loading workflow:", error);
      setNodes(initialNodes);
      setEdges(initialEdges);
    }
  };

  useEffect(() => {
    if (dataCenterId) {
      loadWorkflow();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataCenterId]);

  const addNode = (device: DeviceDefinition) => {
    if (budget < device.cost) {
      toast.error("Insufficient budget", {
        description: `You need $${device.cost} to add this device.`,
        duration: 3000,
        action: {
          label: "OK",
          onClick: () => toast.dismiss(),
        },
      });

      return;
      return;
    }
    const id = `${device.name.toLowerCase().replace(/ /g, "-")}-${
      nodes.length + 1
    }`;
    const newNode: Node<CustomNodeData> = {
      id,
      type: "custom",
      position: {
        x: typeof window !== "undefined" ? Math.random() * 600 : 100,
        y: typeof window !== "undefined" ? Math.random() * 400 : 100,
      },
      data: {
        label: `${device.name}\n($${device.cost})`,
        type: device.type,
        power: device.energyProduction,
        demand: device.energyConsumption,
        inputs: device.inputs,
        outputs: device.outputs,
      },
      style: {
        borderRadius: 8,
        padding: 8,
        backgroundColor:
          device.energyProduction > 0
            ? "#ECFDF5"
            : device.energyConsumption > 0
            ? "#FEF3C7"
            : "#EEF2FF",
        border: "1px solid #CBD5E1",
      },
    };
    setNodes((nds) => [...nds, newNode]);
    setBudget((b) => b - device.cost);
  };

  const handleSave = async () => {
    const state = { nodes, edges };
    setSaving(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/modules/save/${dataCenterId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(state),
        }
      );
      if (response.ok) {
        toast.success("Configuration saved successfully");
      } else {
        toast.error("Failed to save configuration");
      }
    } catch (error) {
      toast.error("Error saving configuration");
      console.error("Error saving configuration:", error);
    } finally {
      setSaving(false);
    }
  };

  // Agrupa los módulos por tipo
  const getModules = async () => {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      const fullUrl = `${backendUrl}/modules/modules`;
      const response = await fetch(fullUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        // Agrupamos por tipo usando el objeto real de modules.json
        const grouped: Record<string, DeviceDefinition[]> = {};
        for (const category of Object.keys(data)) {
          const modules = data[category];
          for (const mod of modules) {
            if (!grouped[mod.type]) grouped[mod.type] = [];
            grouped[mod.type].push(mod);
          }
        }
        setDevices(grouped);
      }
    } catch (error) {
      console.error("Error fetching modules:", error);
    }
  };
  useEffect(() => {
    getModules();
  }, []);
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
              <Button onClick={handleSave} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-1" />
                    Save
                  </>
                )}
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
            edgeTypes={edgeTypes}
            nodeTypes={nodeTypes}
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
              <CardContent className="px-3 grid gap-6">
                {Object.entries(devices).map(([type, items]) => (
                  <div key={type}>
                    <h3 className="text-sm font-semibold mb-2 text-muted-foreground capitalize">
                      {type.replace(/_/g, " ")}
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {items
                        .filter((device) =>
                          device.name
                            .toLowerCase()
                            .includes(search.toLowerCase())
                        )
                        .map((device, index) => {
                          const LucideIcon =
                            LucideIcons[
                              device.icon as keyof typeof LucideIcons
                            ];
                          return (
                            <Card
                              key={`${type}-${index}`}
                              className="hover:bg-muted cursor-pointer"
                              onClick={() => addNode(device)}
                            >
                              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                <CardTitle className="text-sm font-medium">
                                  {device.name}
                                </CardTitle>
                                <span className="text-gray-500 text-xl">
                                  {LucideIcon ? (
                                    <LucideIcon className="w-4 h-4 text-muted-foreground" />
                                  ) : (
                                    <HelpCircle className="w-4 h-4 text-muted-foreground" />
                                  )}
                                </span>
                              </CardHeader>
                              <CardContent>
                                <ul className="text-xs text-muted-foreground list-disc list-inside">
                                  <li>
                                    <strong>Cost:</strong> ${device.cost}
                                  </li>
                                  <li>
                                    <strong>Surface:</strong> {device.surface}{" "}
                                    m²
                                  </li>
                                  {Object.entries(device)
                                    .filter(
                                      ([key, val]) =>
                                        typeof val === "number" &&
                                        val !== 0 &&
                                        key !== "cost" &&
                                        key !== "surface"
                                    )
                                    .map(([key, val]) => (
                                      <li key={key}>
                                        {key
                                          .replace(/([A-Z])/g, " $1")
                                          .replace(/^./, (str) =>
                                            str.toUpperCase()
                                          )}
                                        : {val}
                                      </li>
                                    ))}
                                </ul>
                              </CardContent>
                            </Card>
                          );
                        })}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
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
