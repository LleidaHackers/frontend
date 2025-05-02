'use client';

import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
} from 'reactflow';

import 'reactflow/dist/style.css';

const initialNodes = [
  {
    id: '1',
    type: 'input',
    position: { x: 50, y: 100 },
    data: { label: '☀️ Solar Panel' },
  },
  {
    id: '2',
    position: { x: 250, y: 100 },
    data: { label: '🔋 Battery' },
  },
];

const initialEdges: Edge[] = [];

export default function FlowCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = (connection: Connection) => setEdges((eds) => addEdge(connection, eds));

  return (
    <div style={{ height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <MiniMap />
        <Controls />
        <Background gap={16} />
      </ReactFlow>
    </div>
  );
}