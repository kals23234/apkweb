import { frameworks } from "@/data/frameworks";
import FrameworkCard from "@/components/FrameworkCard";
import DisciplinesFusionVisualizer from "@/components/DisciplinesFusionVisualizer";
import FrameworkVisualizer from "@/components/FrameworkVisualizer";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Function to determine color based on framework ID
function getFrameworkColor(frameworkId: string): string {
  switch (frameworkId) {
    case "bucp-dt":
      return "#FF5E5B";
    case "alien-cognition":
      return "#00C2A8";
    case "tensor-geometry":
      return "#845EC2";
    case "quantum-mind":
      return "#4D8076";
    case "neurotensor":
      return "#00C6FF";
    case "consciousness-tensor":
      return "#FF9671";
    case "quantum-physics":
      return "#00D2FC";
    case "metapsychology":
      return "#B39CD0";
    default:
      return "#FF6F91";
  }
}

export default function FrameworksPage() {
  return (
    <div>
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
          <span className="text-primary glow-text">Diagnostic</span> Frameworks
        </h1>
        <p className="opacity-80 max-w-3xl">
          The Bharadwaj Framework consists of 8 diagnostic and theoretical frameworks, each acting as a multi-dimensional architecture for designing tests, therapy models, and cognitive simulations.
        </p>
      </motion.div>

      <Tabs defaultValue="frameworks" className="mb-12">
        <TabsList className="w-full max-w-md mx-auto mb-8">
          <TabsTrigger value="frameworks" className="flex-1">Frameworks</TabsTrigger>
          <TabsTrigger value="visualizations" className="flex-1">3D Visualizations</TabsTrigger>
          <TabsTrigger value="disciplines" className="flex-1">Scientific Disciplines</TabsTrigger>
        </TabsList>
        
        <TabsContent value="frameworks" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {frameworks.map((framework, index) => (
              <FrameworkCard key={framework.id} framework={framework} index={index} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="visualizations" className="mt-0">
          <div className="space-y-8">
            <p className="opacity-80 max-w-3xl mx-auto text-center mb-8">
              Advanced 3D tensor simulations of each framework, illustrating their underlying mathematical structure and cognitive properties.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {frameworks.map((framework) => (
                <FrameworkVisualizer 
                  key={framework.id}
                  frameworkId={framework.id}
                  color={getFrameworkColor(framework.id)}
                  title={framework.name}
                  description={framework.focus}
                />
              ))}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="disciplines" className="mt-0">
          <DisciplinesFusionVisualizer />
        </TabsContent>
      </Tabs>
    </div>
  );
}
