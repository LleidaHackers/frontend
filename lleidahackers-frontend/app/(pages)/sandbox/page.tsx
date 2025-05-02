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
  Node,
  ReactFlowProvider,
} from 'reactflow';

import 'reactflow/dist/style.css';
import { useCallback, useEffect } from 'react';

const initialNodes: Node[] = [
  {
    id: 'solar',
    type: 'default',
    position: { x: 100, y: 100 },
    data: { label: '☀️ Solar Panel\n(Energy Output: 20W)', type: 'source', power: 20 },
  },
  {
    id: 'server',
    type: 'default',
    position: { x: 400, y: 100 },
    data: { label: '🖥️ Server\n(Needs: 10W)', type: 'sink', demand: 10, powered: false },
  },
];

const initialEdges: Edge[] = [];

function FlowCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    []
  );

  useEffect(() => {
    const powerSources = nodes.filter((n) => n.data.type === 'source');
    const sinks = nodes.map((n) => {
      if (n.data.type === 'sink') {
        const isConnected = edges.some((e) => e.target === n.id && powerSources.length > 0);
        return {
          ...n,
          data: {
            ...n.data,
            label: isConnected
              ? `${n.data.label.split('\n')[0]}\n✅ Powered`
              : `${n.data.label.split('\n')[0]}\n❌ No Power`,
          },
        };
      }
      return n;
    });

    setNodes(sinks);
  }, [edges]);

  const addNode = (type: 'source' | 'sink') => {
    const id = `${type}-${nodes.length + 1}`;
    const newNode: Node = {
      id,
      type: 'default',
      position: { x: Math.random() * 600, y: Math.random() * 400 },
      data: {
        label: type === 'source'
          ? `☀️ Solar Panel\n(Energy Output: 20W)`
          : `🖥️ Server\n(Needs: 10W)`,
        type,
        power: type === 'source' ? 20 : undefined,
        demand: type === 'sink' ? 10 : undefined,
      },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const handleSave = () => {
    const state = { nodes, edges };
    console.log('Saved state:', state);
    // Aquí podrías hacer un fetch POST a tu backend
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ width: 200, background: '#f3f4f6', padding: 10 }}>
        <h3>Bloques</h3>
        <button onClick={() => addNode('source')}>➕ Añadir Solar Panel</button>
        <button onClick={() => addNode('sink')}>➕ Añadir Server</button>
        <hr style={{ margin: '10px 0' }} />
        <button onClick={handleSave}>💾 Guardar</button>
      </div>
      <div style={{ flex: 1 }}>
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
          <Background />
        </ReactFlow>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <ReactFlowProvider>
      <FlowCanvas />
    </ReactFlowProvider>
  );
}