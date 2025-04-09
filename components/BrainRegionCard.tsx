import { motion } from "framer-motion";
import { BrainRegion } from "@/data/brainRegions";

interface BrainRegionCardProps {
  region: BrainRegion;
  isActive?: boolean;
  onClick?: () => void;
}

export default function BrainRegionCard({ region, isActive = false, onClick }: BrainRegionCardProps) {
  return (
    <motion.div 
      className={`group cursor-pointer ${isActive ? "border-l-2 border-primary pl-3" : "pl-4"}`}
      whileHover={{ x: 5 }}
      onClick={onClick}
    >
      <div className="flex items-center gap-3 mb-2">
        <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: region.color }}></div>
        <h4 className="font-medium text-neutral-light">{region.name} ({region.acronym})</h4>
      </div>
      
      <p className="text-sm opacity-70 mb-2 pl-6">{region.function}</p>
      
      <div className="flex flex-wrap gap-2 pl-6">
        {region.tests.map(testCode => (
          <span key={testCode} className="px-2 py-0.5 bg-primary/10 rounded-full text-xs text-primary">
            {testCode}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
