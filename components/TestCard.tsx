import { Test } from "@/data/tests";
import { HolographicCard } from "./ui/holographic-card";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

interface TestCardProps {
  test: Test;
  detailed?: boolean;
}

export default function TestCard({ test, detailed = false }: TestCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
    >
      {detailed ? (
        <HolographicCard className="p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 opacity-30 pointer-events-none">
            <div className="absolute inset-0 bg-primary/20 rounded-full animate-spin-slow"></div>
            <div className="absolute inset-0 bg-secondary/10 rounded-full animate-pulse-slow"></div>
          </div>
          
          <div className="relative">
            <div className="flex justify-between items-start mb-4">
              <span className="text-primary font-mono">{test.code}</span>
              <span className="bg-neutral-medium/50 rounded-full px-2 py-0.5 text-xs">{test.questionCount} Questions</span>
            </div>
            
            <h4 className="font-medium mb-2">{test.name}</h4>
            <p className="text-sm opacity-70 mb-4">{test.description}</p>
            
            {test.sampleQuestion && (
              <div className="bg-neutral-medium/30 rounded-lg p-4 mb-3">
                <p className="text-sm mb-3">{test.sampleQuestion.question}</p>
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {test.sampleQuestion.options.map((option, idx) => (
                    <div 
                      key={idx}
                      className="border border-primary/30 rounded-lg p-2 flex items-center gap-2 cursor-pointer hover:bg-primary/10 transition-colors"
                    >
                      <span className="w-3 h-3 rounded-full bg-primary/50"></span>
                      {option}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex justify-between items-center text-xs">
              <span className="text-secondary">{test.receptors.join(", ")} Receptors</span>
              <button className="flex items-center gap-1 text-primary">
                <span>Take Test</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </HolographicCard>
      ) : (
        <div className="border border-primary/20 rounded-xl p-4 hover:border-primary/40 transition-colors cursor-pointer group">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-primary font-mono">{test.code}</span>
                <span className="bg-neutral-medium/50 rounded-full px-2 py-0.5 text-xs">{test.questionCount} Questions</span>
              </div>
              <h4 className="font-medium mb-1">{test.name}</h4>
              <p className="text-xs opacity-70">{test.description}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      )}
    </motion.div>
  );
}
