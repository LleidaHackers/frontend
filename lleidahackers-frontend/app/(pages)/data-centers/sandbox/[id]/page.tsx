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
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";
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
  DatabaseZap,
  HardDrive,
  Waves,
} from "lucide-react";
import * as LucideIcons from "lucide-react";
import "reactflow/dist/style.css";
import { useCallback, useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import StatusBar from "./_components/StatusBar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { set } from "zod";
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
  const normalized = type.toLowerCase().replace(/\s+/g, "_");

  switch (normalized) {
    case "usable_power":
      return <Lightbulb className="w-5 h-5 text-yellow-500" />;
    case "power_source":
      return <Lightbulb className="w-5 h-5 text-yellow-500" />;
    case "power":
      return <Lightbulb className="w-5 h-5 text-yellow-500" />;
    case "grid_connection":
      return <Bolt className="w-5 h-5 text-yellow-700" />;
    case "water":
      return <Waves className="w-5 h-5 text-blue-500" />;
    case "water_connection":
      return <Droplet className="w-5 h-5 text-blue-600" />;
    case "fresh_water":
      return <Snowflake className="w-5 h-5 text-cyan-600" />;
    case "distilled_water":
      return <FlaskConical className="w-5 h-5 text-indigo-600" />;
    case "chilled_water":
      return <Snowflake className="w-5 h-5 text-sky-400" />;
    case "internal_network":
      return <Network className="w-5 h-5 text-orange-600" />;
    case "external_network":
      return <Globe className="w-5 h-5 text-emerald-600" />;
    case "proces":
      return <Cpu className="w-5 h-5 text-gray-700" />;
    case "processing":
      return <Cpu className="w-5 h-5 text-gray-700" />;
    case "data_storage":
      return <Database className="w-5 h-5 text-purple-700" />;
    case "proceccing_connection":
      return <Cpu className="w-5 h-5 text-gray-700" />;

    default:
      return <span className="text-xs">{type}</span>;
  }
};

const CustomNode = ({
  id,
  data,
  setNodes,
  setEdges,
  setBudget,
  setOccupiedSurface,
  setConsumeUsage,
  setAccomulatePower,
  setWaterUsage,
  setChilledWaterUsage,
  setDistilledWaterUsage,
}: {
  id: string;
  data: CustomNodeData;
  setNodes: React.Dispatch<React.SetStateAction<Node<CustomNodeData>[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  setBudget: React.Dispatch<React.SetStateAction<number>>;
  setOccupiedSurface: React.Dispatch<React.SetStateAction<number>>;
  setConsumeUsage: React.Dispatch<React.SetStateAction<number>>;
  setAccomulatePower: React.Dispatch<React.SetStateAction<number>>;
  setWaterUsage: React.Dispatch<React.SetStateAction<number>>;
  setChilledWaterUsage: React.Dispatch<React.SetStateAction<number>>;
  setDistilledWaterUsage: React.Dispatch<React.SetStateAction<number>>;
}) => {
  return (
    <div
      className="group relative rounded-lg border p-4 text-sm shadow-lg min-w-[160px] bg-white"
      style={{
        backgroundColor: data?.style?.backgroundColor ?? "#FFF",
        border: "1px solid #CBD5E1",
      }}
    >
      <div
        className="absolute -top-6 -right-6 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center cursor-pointer z-50 shadow-md"
        onClick={(e) => {
          e.stopPropagation();
          setNodes((nds) => nds.filter((n) => n.id !== id));
          setEdges((eds) =>
            eds.filter((e) => e.source !== id && e.target !== id)
          );

          setBudget(
            (b) =>
              b +
              (data.label?.match(/\(\$(\d+)\)/)?.[1]
                ? parseInt(data.label.match(/\(\$(\d+)\)/)?.[1] ?? "0", 10)
                : 0)
          );
          // Extract surface from data or from label using regex
          const surfaceMatch = data.label?.match(/\(.*?(\d+)\s?m².*?\)/);
          const surface =
            data.surface ?? (surfaceMatch ? parseInt(surfaceMatch[1], 10) : 0);
          setOccupiedSurface((s) => s - surface);
          setConsumeUsage((c) => c - (data.demand ?? 0));
          setAccomulatePower((p) => p - (data.power ?? 0));
          setWaterUsage((w) => w - (data.waterUsage ?? 0));
          setChilledWaterUsage((c) => c - (data.chilledWaterUsage ?? 0));
          setDistilledWaterUsage((d) => d - (data.distilledWaterUsage ?? 0));
        }}
      >
        ×
      </div>
      <div className="text-center font-semibold">
        {data.label?.split("\n")[0].replace(/_/g, " ")}
      </div>
      <div className="text-center text-xs text-muted-foreground mb-2">
        ${data.label?.match(/\(\$(\d+)\)/)?.[1] ?? "0"}
      </div>
      <div className="flex flex-col gap-1 text-xs">
        {data.power && data.power > 0 && (
          <div className="text-green-600">⚡ Produces: {data.power}W</div>
        )}
        {data.freshWaterUsage && data.freshWaterUsage > 0 && (
          <div className="text-blue-600">
            💧 Consumes: {data.freshWaterUsage}L Fresh Water
          </div>
        )}
        {data.freshWaterProduction && data.freshWaterProduction > 0 && (
          <div className="text-cyan-600">
            💧 Produces: {data.freshWaterProduction}L Fresh Water
          </div>
        )}
      </div>
      {/* Inputs */}
      {data.inputs?.map((input, idx) => (
        <div
          key={`input-${input}`}
          style={{ position: "absolute", left: -24, top: 40 + idx * 20 }}
          className="flex items-center"
        >
          <div className="mr-1" title={input}>
            {getResourceIcon(input)}
          </div>
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

      {/* Outputs */}
      {data.outputs?.map((output, idx) => (
        <div
          key={`output-${output}`}
          style={{ position: "absolute", right: -24, top: 40 + idx * 20 }}
          className="flex items-center"
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
          <div className="ml-1" title={output}>
            {getResourceIcon(output)}
          </div>
        </div>
      ))}
    </div>
  );
};

const initialNodes: Node<CustomNodeData>[] = [];

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
  const Router = useRouter();
  // Specs
  const [budget, setBudget] = useState(0);
  const [totalBudget, setTotalBudget] = useState(0);
  const [powerConsume, setConsumeUsage] = useState(0);
  const [powerRequired, setPowerRequired] = useState(0);
  const [accomulatePower, setAccomulatePower] = useState(0);
  const [occupedSurface, setOccupiedSurface] = useState(0);
  const [totalSurface, setTotalSurface] = useState(0);
  const [waterUsage, setWaterUsage] = useState(0);
  const [distilledWaterUsage, setDistilledWaterUsage] = useState(0);
  const [chilledWaterUsage, setChilledWaterUsage] = useState(0);
  // New module metrics
  const [freshWaterUsage, setFreshWaterUsage] = useState(0);
  const [freshWaterProduction, setFreshWaterProduction] = useState(0);
  const [distilledWaterProduction, setDistilledWaterProduction] = useState(0);
  const [chilledWaterProduction, setChilledWaterProduction] = useState(0);
  const [internalNetworkUsage, setInternalNetworkUsage] = useState(0);
  const [internalNetworkProduction, setInternalNetworkProduction] = useState(0);
  const [externalNetworkProduction, setExternalNetworkProduction] = useState(0);
  const [procesProduction, setProcesProduction] = useState(0);
  const [dataStorageProduction, setDataStorageProduction] = useState(0);
  // Data
  const [id, setId] = useState("");

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
          setBudget={setBudget}
          setOccupiedSurface={setOccupiedSurface}
          setConsumeUsage={setConsumeUsage}
          setAccomulatePower={setAccomulatePower}
          setWaterUsage={setWaterUsage}
          setChilledWaterUsage={setChilledWaterUsage}
          setDistilledWaterUsage={setDistilledWaterUsage}
        />
      ),
    }),
    [
      setNodes,
      setEdges,
      setBudget,
      setOccupiedSurface,
      setConsumeUsage,
      setAccomulatePower,
      setWaterUsage,
      setChilledWaterUsage,
      setDistilledWaterUsage,
    ]
  );

  // Nueva conexión: validación por tipo de recurso y capacidad
  const onConnect = useCallback(
    (connection: Connection) => {
      const sourceNode = nodes.find((n) => n.id === connection.source);
      const targetNode = nodes.find((n) => n.id === connection.target);
      const sourceHandle = connection.sourceHandle?.split("-")[0];
      const targetHandle = connection.targetHandle?.split("-")[0];

      if (!sourceNode || !targetNode) {
        toast.error("Cannot connect: invalid nodes.");
        return;
      }

      if (sourceHandle !== targetHandle) {
        toast.error("Incompatible connection types");
        return;
      }



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
    },
    [nodes, edges]
  );

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
      const response = await fetch(`${backendUrl}/workflow/${dataCenterId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Invalid response");

      const parsed = await response.json();

      if (Array.isArray(parsed?.nodes) && Array.isArray(parsed?.edges)) {
        const cleanNodes = parsed.nodes.map((node: any) => {
          const {
            selected,
            dragging,
            positionAbsolute,
            width,
            height,
            ...rest
          } = node;
          return rest;
        });

        const cleanEdges = parsed.edges.map((edge: any) => {
          const { selected, ...rest } = edge;
          return rest;
        });

        setNodes(cleanNodes);
        setEdges(cleanEdges);
      } else {
        throw new Error("Parsed data missing nodes or edges");
      }
    } catch (error) {
      console.error("Error loading workflow:", error);
      setNodes(initialNodes);
      setEdges(initialEdges);
    }
  };
  const [hasAppliedAI, setHasAppliedAI] = useState(false);
  const [buttonText, setButtonText] = useState("🤖 Autocomplete with AI");
  const [optimizeLoading, setOptimizeLoading] = useState(false);
  useEffect(() => {
    if (dataCenterId) {
      loadWorkflow();
      // Fetch initial stats from backend (extended to all stats)
      const fetchDataCenterStats = async () => {
        try {
          const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
          const res = await fetch(`${backendUrl}/data-center/${dataCenterId}`);
          const json = await res.json();
          console.log("Data center stats:", json);
          setTotalBudget(json.totalBudget ?? 0);
          setBudget(json.budget ?? 0);
          setTotalSurface(json.totalSurface ?? 0);
          setOccupiedSurface(json.occupedSurface ?? 0);
          setConsumeUsage(json.powerConsume ?? 0);
          setPowerRequired(json.powerRequired ?? 0);
          setAccomulatePower(json.accomulatePower ?? 0);
          setWaterUsage(json.waterUsage ?? 0);
          setChilledWaterUsage(json.chilledWaterUsage ?? 0);
          setDistilledWaterUsage(json.distilledWaterUsage ?? 0);
          setFreshWaterUsage(json.freshWaterUsage ?? 0);
          setFreshWaterProduction(json.freshWaterProduction ?? 0);
          setDistilledWaterProduction(json.distilledWaterProduction ?? 0);
          setChilledWaterProduction(json.chilledWaterProduction ?? 0);
          setInternalNetworkUsage(json.internalNetworkUsage ?? 0);
          setInternalNetworkProduction(json.internalNetworkProduction ?? 0);
          setExternalNetworkProduction(json.externalNetworkProduction ?? 0);
          setProcesProduction(json.procesProduction ?? 0);
          setDataStorageProduction(json.dataStorageProduction ?? 0);
          setFreshWaterProduction(json.freshWaterProduction ?? 0);
          setInternalNetworkProduction(json.internalNetworkProduction ?? 0);
        } catch (err) {
          console.error("Error loading data center stats", err);
        }
      };
      fetchDataCenterStats();
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
        surface: device.surface, // Ensure surface is available in data
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
    setOccupiedSurface((s) => s + device.surface);
    setConsumeUsage((c) => c + device.energyConsumption);
    setAccomulatePower((p) => p + device.energyProduction);
    setWaterUsage((w) => w + device.waterUsage);
    setChilledWaterUsage((c) => c + device.chilledWaterUsage);
    setDistilledWaterUsage((d) => d + device.distilledWaterUsage);
    setFreshWaterUsage((f) => f + (device.freshWaterUsage ?? 0));
    setFreshWaterProduction((f) => f + (device.freshWaterProduction ?? 0));
    setDistilledWaterProduction(
      (d) => d + (device.distilledWaterProduction ?? 0)
    );
    setChilledWaterProduction((c) => c + (device.chilledWaterProduction ?? 0));
    setInternalNetworkUsage((n) => n + (device.internalNetworkUsage ?? 0));
    setInternalNetworkProduction(
      (n) => n + (device.internalNetworkProduction ?? 0)
    );
    setExternalNetworkProduction(
      (e) => e + (device.externalNetworkProduction ?? 0)
    );
    setProcesProduction((p) => p + (device.procesProduction ?? 0));
    setDataStorageProduction((d) => d + (device.dataStorageProduction ?? 0));
    setInternalNetworkProduction(
      (n) => n + (device.internalNetworkProduction ?? 0)
    );
  };

  const handleSave = async () => {
    const state = { nodes, edges };
    setSaving(true);
    try {
      // Validación previa al guardado
      if (
        freshWaterUsage > freshWaterProduction ||
        distilledWaterUsage > distilledWaterProduction ||
        chilledWaterUsage > chilledWaterProduction ||
        internalNetworkUsage > internalNetworkProduction
      ) {
        toast.error("Cannot save: Resource usage exceeds production.");
        setSaving(false);
        return;
      }
      console.log("Saving configuration:", state);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/workflow/${dataCenterId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(state),
        }
      );
      // POST a /save-data-center/{id} con todas las estadísticas relevantes
      await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/data-center/${dataCenterId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            budget,
            powerConsume,
            powerRequired,
            accomulatePower,
            occupedSurface,
            totalSurface,
            waterUsage,
            distilledWaterUsage,
            chilledWaterUsage,
            waterProduction: 0,
            freshWaterUsage,
            freshWaterProduction,
            distilledWaterProduction,
            chilledWaterProduction,
            internalNetworkUsage,
            internalNetworkProduction,
            externalNetworkProduction,
            soundLevel: 0,
            procesProduction,
            dataStorageProduction,
          }),
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
      const fullUrl = `${backendUrl}/modules/`;
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
                className="bg-yellow-400 hover:bg-yellow-500 text-black h-12 text-base px-5"
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
                className="bg-red-500 hover:bg-red-600 text-white h-12 text-base px-5"
                onClick={() => {
                  setNodes([]);
                  setEdges([]);
                  setHistory([]);
                  setBudget(totalBudget);
                  setConsumeUsage(0);
                  setPowerRequired(0);
                  setAccomulatePower(0);
                  setOccupiedSurface(0);
                  setWaterUsage(0);
                  setChilledWaterUsage(0);
                  setDistilledWaterUsage(0);
                  setFreshWaterProduction(0);
                  setInternalNetworkProduction(0);
                  setExternalNetworkProduction(0);
                  setProcesProduction(0);
                  setDataStorageProduction(0);
                  setFreshWaterUsage(0);
                  setInternalNetworkUsage(0);
                }}
              >
                <RotateCcw className="w-4 h-4" />
                Reset Design
              </Button>

              <Button
                className="bg-green-500 hover:bg-green-600 text-white h-12 text-base px-5"
                disabled={optimizeLoading}
                onClick={() => {
                  setOptimizeLoading(true);
                  setTimeout(() => {
                    Router.push(`/data-centers/simulator/${dataCenterId}`);
                  }, 2000);
                }}
              >
                {optimizeLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Optimizing...
                  </>
                ) : (
                  <>
                    <Hammer className="w-4 h-4" />
                    Optimize
                  </>
                )}
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                className="h-12 text-base px-5"
                onClick={handleSave}
                disabled={saving}
              >
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
                className="bg-purple-500 hover:bg-purple-600 text-white h-12 text-base px-5"
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
            soundLevel={0}
            waterProduction={0}
            chilledWaterProduction={chilledWaterProduction}
            freshWaterUsage={freshWaterUsage}
            freshWaterProduction={freshWaterProduction}
            distilledWaterProduction={distilledWaterProduction}
            internalNetworkUsage={internalNetworkUsage}
            internalNetworkProduction={internalNetworkProduction}
            externalNetworkProduction={externalNetworkProduction}
            procesProduction={procesProduction}
            dataStorageProduction={dataStorageProduction}
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
                <div className="flex gap-x-2">
                  {/* Autocomplete with AI button */}
                  <Button
                    className="bg-pink-500 hover:bg-pink-600 text-white h-12 text-base px-5"
                    onClick={async () => {
                      const statuses = [
                        "Analyzing energy requirements...",
                        "Checking water distribution...",
                        "Evaluating cooling systems...",
                        "Optimizing network layout...",
                        "Calculating best module...",
                        "Finalizing..."
                      ];
                      let current = 0;
                      setButtonText(statuses[current]);
                      const interval = setInterval(() => {
                        current++;
                        if (current < statuses.length) {
                          setButtonText(statuses[current]);
                        }
                      }, 2000);

                      try {
                        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
                        const response = await fetch(`${backendUrl}/gemini`);
                        const json = await response.json();
                        const newNodes = Array.isArray(json.nodes) ? json.nodes : [];
                        const newEdges = Array.isArray(json.edges) ? json.edges : [];

                        const animatedNodes = newNodes.map((node: any) => ({
                          ...node,
                          style: {
                            ...(node.style || {}),
                            animation: "pulse 2s infinite",
                          },
                        }));

                        setTimeout(() => {
                          clearInterval(interval);
                          setNodes((prev) => [...prev, ...animatedNodes]);
                          setEdges((prev) => [...prev, ...newEdges]);
                          toast.success("Sugerencias añadidas. Pulsa 'Apply' para confirmar.");
                          setButtonText("🤖 Autocomplete with AI");
                        }, statuses.length * 1000 + 1000);
                      } catch (err) {
                        clearInterval(interval);
                        console.error("Error fetching smart suggestion", err);
                        toast.error("Error al obtener sugerencia inteligente");
                        setButtonText("🤖 Autocomplete with AI");
                      }
                    }}
                  >
                    <>
                      {buttonText !== "🤖 Autocomplete with AI" && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      {buttonText}
                    </>
                  </Button>

                  {/* Smart Suggest button */}
                 

                  {/* Apply Suggestions button */}
                  {nodes.some((n) => n.style?.animation) &&
                    !hasAppliedAI && (
                      <Button
                        className="bg-indigo-500 hover:bg-indigo-600 text-white h-12 text-base px-5"
                        onClick={() => {
                          setNodes((prev) =>
                            prev.map((node) =>
                              node.style?.animation
                                ? {
                                    ...node,
                                    style: {
                                      ...node.style,
                                      animation: undefined,
                                    },
                                    // Optionally mark as confirmed if needed
                                  }
                                : node
                            )
                          );
                          setHasAppliedAI(true); // Ocultar botón tras aplicar
                          toast.success("Suggestions applied");
                        }}
                      >
                        ✅ Apply
                      </Button>
                    )}
                </div>
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
                        .filter((device) => {
                          const query = search.toLowerCase();
                          return (
                            device.name.toLowerCase().includes(query) ||
                            device.inputs?.some((i) =>
                              i.toLowerCase().includes(query)
                            ) ||
                            device.outputs?.some((o) =>
                              o.toLowerCase().includes(query)
                            )
                          );
                        })
                        .map((device, index) => {
                          const LucideIcon =
                            LucideIcons[
                              device.icon as keyof typeof LucideIcons
                            ];
                          return (
                            <Card
                              key={`${type}-${index}`}
                              className="hover:bg-muted cursor-pointer relative"
                              onClick={() => addNode(device)}
                            >
                              {/* HoverCard with inputs/outputs info in the top-right corner */}
                              <div className="absolute top-2 right-2 z-10">
                                <HoverCard>
                                  <HoverCardTrigger asChild>
                                    <HelpCircle className="w-5 h-5 text-muted-foreground cursor-pointer" />
                                  </HoverCardTrigger>
                                  <HoverCardContent className="text-xs max-w-xs">
                                    {device.inputs?.length > 0 && (
                                      <div className="flex items-center gap-1 mb-1">
                                        <strong className="w-12">
                                          Inputs:
                                        </strong>
                                        {device.inputs.map((input, idx) => (
                                          <div
                                            key={`input-icon-${idx}`}
                                            className="flex items-center gap-1"
                                            title={input}
                                          >
                                            {getResourceIcon(input)}
                                            <span className="text-xs capitalize">
                                              {input.replace(/_/g, " ")}
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                    {device.outputs?.length > 0 && (
                                      <div className="flex items-center gap-1 mt-1">
                                        <strong className="w-12">
                                          Outputs:
                                        </strong>
                                        {device.outputs.map((output, idx) => (
                                          <div
                                            key={`output-icon-${idx}`}
                                            className="flex items-center gap-1"
                                            title={output}
                                          >
                                            {getResourceIcon(output)}
                                            <span className="text-xs capitalize">
                                              {output.replace(/_/g, " ")}
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </HoverCardContent>
                                </HoverCard>
                              </div>
                              <CardHeader className="items-center text-center pb-2 space-y-1">
                                {LucideIcon && (
                                  <LucideIcon className="w-5 h-5 text-primary mx-auto" />
                                )}
                                <CardTitle className="text-lg font-bold">
                                  {device.name.replace(
                                    new RegExp(`^${type}_?`, "i"),
                                    ""
                                  )}
                                </CardTitle>
                                <div className="text-base text-muted-foreground">
                                  ${device.cost}
                                </div>
                              </CardHeader>
                              <CardContent className="text-sm text-muted-foreground text-center px-2">
                                {device.energyProduction > 0 && (
                                  <div>
                                    Produces ⚡ {device.energyProduction}MW
                                  </div>
                                )}
                                {/* {device.energyConsumption > 0 && (
                                  <div>
                                    Consumes ⚡ {device.energyConsumption}MW
                                  </div>
                                )} */}
                                {device.waterProduction > 0 && (
                                  <div>
                                    Produces 💧 {device.waterProduction}KL
                                  </div>
                                )}
                                {device.waterUsage > 0 && (
                                  <div>Consumes 💧 {device.waterUsage}KL</div>
                                )}
                                {device.dataStorageProduction > 0 && (
                                  <div>
                                    Storage 🗄️ {device.dataStorageProduction}PT
                                  </div>
                                )}
                                {device.procesProduction > 0 && (
                                  <div>
                                    Processing 🧠 {device.procesProduction}{" "}
                                    Units
                                  </div>
                                )}
                                {/* {device.dataStorageProduction > 0 && (
                                  <div>
                                    Storage 🗄️ {device.dataStorageProduction} GB
                                    </div>
                                )} */}
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

// Pulse animation CSS for AI suggestions
if (typeof window !== "undefined") {
  const styleId = "pulse-keyframes-style";
  if (!document.getElementById(styleId)) {
    const style = document.createElement("style");
    style.id = styleId;
    style.innerHTML = `
@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(99, 102, 241, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(99, 102, 241, 0);
  }
}
`;
    document.head.appendChild(style);
  }
}