import React from 'react';
import { motion } from 'framer-motion';
import TensorPatternDatabase from '@/components/TensorPatternDatabase';

export default function TensorPatternsPage() {
  return (
    <div className="py-8">
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <span className="text-primary font-mono text-sm">SECTION 9</span>
          <span className="h-px flex-grow bg-primary/30"></span>
        </div>
        <h2 className="font-display text-3xl font-bold mb-2">Tensor Pattern Database</h2>
        <p className="opacity-70 max-w-3xl">
          The complete catalogue of cognitive-emotional patterns mapped under the Bharadwaj Tensor Framework,
          spanning BUCP-DT, Loop Matrix, Quantum Cognition Extensions, and Tensor Diagnostics.
        </p>
      </motion.div>
      
      <TensorPatternDatabase />
    </div>
  );
}