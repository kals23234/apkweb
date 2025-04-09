import { HolographicCard } from "./ui/holographic-card";
import { Receptor } from "@/data/receptors";
import { motion } from "framer-motion";

interface ReceptorCardProps {
  receptor: Receptor;
}

export default function ReceptorCard({ receptor }: ReceptorCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <HolographicCard className="h-full">
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-display text-xl font-bold text-secondary">{receptor.name}</h3>
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${receptor.color}20` }}
          >
            <span className="font-mono text-lg" style={{ color: receptor.color }}>{receptor.symbol}</span>
          </div>
        </div>
        
        <p className="text-sm opacity-70 mb-4">{receptor.description}</p>
        
        <h4 className="text-sm font-medium mb-2">Primary in Tests:</h4>
        <div className="flex flex-wrap gap-2 mb-4">
          {receptor.tests.map(testCode => (
            <span key={testCode} className="px-2 py-0.5 bg-primary/10 rounded-full text-xs text-primary">
              {testCode}
            </span>
          ))}
        </div>
        
        <div className="text-xs opacity-70">
          <p>{receptor.function}</p>
        </div>
      </HolographicCard>
    </motion.div>
  );
}
