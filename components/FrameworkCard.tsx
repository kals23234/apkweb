import { Link } from "wouter";
import { HolographicCard } from "@/components/ui/holographic-card";
import { Framework } from "@/data/frameworks";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

interface FrameworkCardProps {
  framework: Framework;
  index: number;
}

export default function FrameworkCard({ framework, index }: FrameworkCardProps) {
  return (
    <Link href={`/frameworks/${framework.id}`}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        whileHover={{ scale: 1.02 }}
      >
        <HolographicCard className="h-full hover:cursor-pointer group transition-all duration-300">
          <div className="relative mb-4 h-8">
            <span className="text-primary font-mono opacity-60 text-sm">Framework {(index + 1).toString().padStart(2, '0')}</span>
            <div className="absolute right-0 top-0 w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center group-hover:bg-primary/30 transition-colors">
              <ChevronRight className="w-4 h-4 text-primary" />
            </div>
          </div>
          
          <h3 className="font-display text-xl font-bold mb-2 text-secondary">{framework.name}</h3>
          <p className="text-sm opacity-70 mb-3">{framework.description}</p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {framework.tags.map(tag => (
              <span key={tag} className="px-2 py-1 bg-primary/10 rounded-full text-xs text-primary">{tag}</span>
            ))}
          </div>
          
          <div className="flex justify-between items-center text-xs opacity-60">
            <span>{framework.focus}</span>
            <span>{framework.tests.length} Tests</span>
          </div>
        </HolographicCard>
      </motion.div>
    </Link>
  );
}
