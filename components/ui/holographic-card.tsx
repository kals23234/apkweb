import React from "react";
import { cn } from "@/lib/utils";

interface HolographicCardProps {
  children: React.ReactNode;
  className?: string;
}

export const HolographicCard = ({
  children,
  className,
}: HolographicCardProps) => {
  return (
    <div
      className={cn(
        "border border-primary/30 bg-neutral-dark/70 backdrop-blur-lg rounded-xl p-6 shadow-md transition-all duration-300",
        "shadow-primary/20 hover:shadow-primary/40",
        "hover:border-primary/40 hover:translate-y-[-3px]",
        className
      )}
    >
      {children}
    </div>
  );
};
