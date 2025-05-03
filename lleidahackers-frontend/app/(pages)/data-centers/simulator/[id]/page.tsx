import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SimulatorPage() {
  return (
    <div className="flex flex-col h-screen p-8">
      <h1 className="text-2xl font-bold text-center">SIMULATING PAGE</h1>
      <Tabs defaultValue="overview" className="flex-1 flex flex-col">
        <TabsList>
          <TabsTrigger value="overview">2D Distribution</TabsTrigger>
          <TabsTrigger value="settings">SCADA</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="flex-1 overflow-auto">
          <div className="relative bg-gray-100 border border-gray-300 w-full max-w-4xl mx-auto h-[600px] mt-4">
            {[
              {
                id: 1,
                type: "Transformer",
                position: { x: 50, y: 100 },
                dimensions: { width: 100, height: 60 },
              },
              {
                id: 2,
                type: "Inverter",
                position: { x: 200, y: 150 },
                dimensions: { width: 120, height: 80 },
              },
            ].map((block) => (
              <div
                key={block.id}
                className="absolute bg-blue-500 text-white text-xs flex items-center justify-center rounded"
                style={{
                  top: block.position.y,
                  left: block.position.x,
                  width: block.dimensions.width,
                  height: block.dimensions.height,
                }}
              >
                {block.type}
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="settings" className="flex-1 overflow-auto">
          <div className="relative bg-[#0d1b2a] w-full max-w-6xl h-[800px] mx-auto mt-4 rounded border border-gray-700">
            {[
              { id: 1, name: "Solar", x: 50, y: 100, image: "/assets/isometric_images/solar.png" },
              { id: 2, name: "Data Center", x: 300, y: 200, image: "/assets/isometric_images/data-center.png" },
              { id: 3, name: "Battery", x: 550, y: 100, image: "/assets/isometric_images/battery.png" },
              { id: 4, name: "Wind", x: 100, y: 400, image: "/assets/isometric_images/wind_mill.png" },
              { id: 5, name: "Cooling", x: 500, y: 400, image: "/assets/isometric_images/water-cooling.png" },
            ].map((el) => (
              <div
                key={el.id}
                className="absolute flex flex-col items-center"
                style={{ left: el.x, top: el.y }}
              >
                <img src={el.image} alt={el.name} className="w-20 drop-shadow-md" />
                <span className="text-white text-xs mt-1">{el.name}</span>
              </div>
            ))}

            {/* LÍNEAS DE CONEXIÓN animadas */}
            <svg className="absolute w-full h-full pointer-events-none">
              <defs>
                <linearGradient id="electric-flow" gradientTransform="rotate(90)">
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
                  `}
                </style>
              </defs>

              <line x1="90" y1="120" x2="280" y2="220" stroke="url(#electric-flow)" strokeWidth="3" className="flow-line" />
              <line x1="320" y1="220" x2="530" y2="120" stroke="url(#water-flow)" strokeWidth="3" className="flow-line" />
              <line x1="90" y1="120" x2="110" y2="420" stroke="url(#electric-flow)" strokeWidth="3" className="flow-line" />
              <line x1="320" y1="220" x2="500" y2="420" stroke="url(#water-flow)" strokeWidth="3" className="flow-line" />
            </svg>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
