import React, { useRef, useEffect, useState } from "react";
import { tensors } from "@/data/tensors";
import { HolographicCard } from "@/components/ui/holographic-card";
import TensorShape from "@/components/TensorShape";
import AdvancedTensorVisualization from "@/components/AdvancedTensorVisualization";
import TensorRadarChart from "@/components/TensorRadarChart";
import { motion } from "framer-motion";
import { tests } from "@/data/tests";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import * as THREE from "three";
import { FaPlay, FaPause, FaStepForward, FaVolumeUp, FaVolumeMute, FaSync, FaExpand, FaMinus, FaPlus } from "react-icons/fa";
import { 
  PiCirclesFour, 
  PiAtom, 
  PiWaveform, 
  PiCube, 
  PiSpiral, 
  PiCircleDashed,
  PiGaugeLight,
  PiBrain,
  PiFlask,
  PiMathOperations,
  PiArrowsInLineVertical
} from "react-icons/pi";

export default function TensorGeometry() {
  const [selectedTab, setSelectedTab] = useState('visualize');
  const [selectedTensorIndex, setSelectedTensorIndex] = useState(0);
  
  // Radar chart data based on tensor properties
  const generateRadarData = (tensor: any) => {
    return [
      { dimension: 'Energy', value: 0.7 + Math.random() * 0.3, color: '#4ade80' },
      { dimension: 'Structure', value: 0.5 + Math.random() * 0.5, color: '#60a5fa' },
      { dimension: 'Resonance', value: 0.6 + Math.random() * 0.4, color: '#f472b6' },
      { dimension: 'Pattern', value: 0.4 + Math.random() * 0.6, color: '#fbbf24' },
      { dimension: 'Stability', value: 0.5 + Math.random() * 0.5, color: '#a78bfa' },
      { dimension: 'Complexity', value: 0.6 + Math.random() * 0.4, color: '#34d399' },
    ];
  };
  
  // Get tensor geometric properties
  const getTensorType = (geometry: string): "spiral" | "torus" | "fractal" | "cube" | "field" | "radial" => {
    if (geometry.includes('spiral')) return 'spiral';
    if (geometry.includes('torus')) return 'torus';
    if (geometry.includes('fractal')) return 'fractal';
    if (geometry.includes('cube')) return 'cube';
    if (geometry.includes('field')) return 'field';
    
    return 'radial';
  };
  
  // Get tensor color
  const getTensorColor = (index: number) => {
    const colors = [
      '#3b82f6', // blue
      '#8b5cf6', // purple
      '#ec4899', // pink
      '#10b981', // emerald
      '#f59e0b', // amber
      '#ef4444', // red
    ];
    
    return colors[index % colors.length];
  };
  
  // Define our tensor geometries with descriptions
  const tensorGeometries = [
    {
      type: 'spiral',
      title: 'Spiral Tensor',
      description: 'Thought bending toward emotional gravity, creating recursive patterns of amplification',
      color: '#3b82f6'
    },
    {
      type: 'torus',
      title: 'Torus Tensor',
      description: 'Self-regenerative feedback (e.g., habits) forming closed-loop systems with internal resonance',
      color: '#8b5cf6'
    },
    {
      type: 'fractal',
      title: 'Fractal Tensor',
      description: 'Infinite pattern layers in identity with self-similar structures across multiple scales',
      color: '#ec4899'
    },
    {
      type: 'cube',
      title: 'Collapse Cube',
      description: 'Sudden loss of identity structure, creating a rapid dimensional transformation',
      color: '#10b981'
    },
    {
      type: 'field',
      title: 'Rotating Field',
      description: 'Field-based observer logic (Alien), creating oscillating perspectives of reality perception',
      color: '#f59e0b'
    },
    {
      type: 'radial',
      title: 'Radial Mirror Burst',
      description: 'Mirror trauma breaking, causing symmetry disruptions in core identity structures',
      color: '#ef4444'
    }
  ];
  
  // Animation control state
  const [isSimulationPaused, setIsSimulationPaused] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(1.0);
  const [isMuted, setIsMuted] = useState(true);
  
  // Manage simulation state
  const toggleSimulationPause = () => {
    const newPausedState = !isSimulationPaused;
    setIsSimulationPaused(newPausedState);
    
    // Apply pause/play to all simulation elements
    const simElements = document.querySelectorAll('.simulation-element');
    simElements.forEach(el => {
      if (newPausedState) {
        el.classList.add('paused');
      } else {
        el.classList.remove('paused');
      }
    });
  };
  
  // Update simulation speed
  const updateSimulationSpeed = (speed: number) => {
    setSimulationSpeed(speed);
    
    // Apply speed to CSS variables controlling animations
    document.documentElement.style.setProperty('--tensor-animation-speed', `${1/speed}s`);
  };
  
  // Reset viewports and simulations
  const resetSimulations = () => {
    // Reset animation state
    setIsSimulationPaused(false);
    setSimulationSpeed(1.0);
    
    // Reset all simulations
    const simElements = document.querySelectorAll('.simulation-element');
    simElements.forEach(el => {
      el.classList.remove('paused');
      
      // Force reflow to restart animations (type assertion for TypeScript)
      const htmlEl = el as HTMLElement;
      void htmlEl.offsetWidth;
      
      el.classList.add('running');
    });
    
    // Reset CSS variables
    document.documentElement.style.setProperty('--tensor-animation-speed', '1s');
  };
  
  // Effect to setup initial CSS variables for animation control
  useEffect(() => {
    // Set up global CSS variables for animation control
    document.documentElement.style.setProperty('--tensor-animation-speed', '1s');
    
    return () => {
      // Clean up CSS variables on component unmount
      document.documentElement.style.removeProperty('--tensor-animation-speed');
    };
  }, []);
  
  return (
    <div className="tensor-geometry-container relative">
      {/* Background particle effect for immersion */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 to-purple-900/5"></div>
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-blue-500/20 blur-xl"
            style={{
              width: `${Math.random() * 30 + 10}px`,
              height: `${Math.random() * 30 + 10}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: Math.random() * 20 + 10,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>
      
      <motion.div 
        className="mb-8 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="text-primary font-mono text-sm px-3 py-1 bg-blue-950/30 rounded-full border border-blue-900/40 flex items-center">
            <span className="w-2 h-2 rounded-full bg-blue-400 mr-2 animate-pulse"></span>
            SECTION 7
          </div>
          <span className="h-px flex-grow bg-primary/30"></span>
        </div>
        <h2 className="font-display text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
          Bharadwaj Tensors
        </h2>
        <p className="opacity-80 max-w-3xl text-blue-100">
          Thoughts, emotions, and identities are dynamic energy structures behaving like tensors — multi-dimensional 
          entities with direction, intensity, curvature, and field resonance that can be visualized, measured, and manipulated.
        </p>
      </motion.div>
      
      {/* Advanced Interactive Visualization Section */}
      <div className="mb-12">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <div className="flex justify-between items-center mb-6">
            <TabsList className="bg-black/40 border border-blue-900/40">
              <TabsTrigger value="visualize" className="data-[state=active]:bg-blue-900/50">
                <PiAtom className="mr-2" /> 3D Tensor Visualization
              </TabsTrigger>
              <TabsTrigger value="analyze" className="data-[state=active]:bg-blue-900/50">
                <PiCirclesFour className="mr-2" /> Tensor Analysis
              </TabsTrigger>
              <TabsTrigger value="simulate" className="data-[state=active]:bg-blue-900/50">
                <PiWaveform className="mr-2" /> Simulation Charts
              </TabsTrigger>
            </TabsList>
            
            <div className="text-xs text-blue-400 font-mono tracking-wider flex items-center">
              <div className="bg-blue-900/20 border border-blue-900/40 px-3 py-1 rounded-full flex items-center">
                <span className="w-2 h-2 rounded-full bg-blue-400 mr-2 animate-pulse"></span>
                ADVANCED BHARADWAJ TENSOR INTERFACE v.MaxMind
              </div>
            </div>
          </div>
          
          <TabsContent value="visualize" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-6 relative">
              {/* Side selector panel */}
              <motion.div
                className="md:col-span-2 bg-black/40 rounded-lg border border-blue-900/40 p-4 h-fit"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-lg font-medium mb-4 text-blue-400">Tensor Geometries</h3>
                <div className="space-y-2">
                  {tensorGeometries.map((geometry, index) => (
                    <div 
                      key={index}
                      className={`p-3 rounded-md cursor-pointer transition-all flex items-center ${
                        selectedTensorIndex === index 
                          ? 'bg-blue-900/40 border border-blue-500/40' 
                          : 'bg-black/20 border border-blue-900/20 hover:bg-blue-900/20'
                      }`}
                      onClick={() => setSelectedTensorIndex(index)}
                    >
                      <div className={`w-3 h-3 rounded-full mr-3`} style={{ backgroundColor: geometry.color }}></div>
                      <div>
                        <h4 className="text-sm font-medium">{geometry.title}</h4>
                        <p className="text-xs opacity-70 truncate">{geometry.description.split(',')[0]}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center">
                      <PiBrain className="mr-2" /> Neural Correlates
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-black/30 rounded p-2 border border-blue-900/20">
                        <span className="block font-medium text-blue-400">Prefrontal Cortex</span>
                        <span className="opacity-70">85% activation</span>
                      </div>
                      <div className="bg-black/30 rounded p-2 border border-blue-900/20">
                        <span className="block font-medium text-purple-400">Cingulate Cortex</span>
                        <span className="opacity-70">64% activation</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center">
                      <PiFlask className="mr-2" /> Receptor Activity
                    </h4>
                    <div className="bg-black/30 rounded p-2 border border-blue-900/20">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Dopamine D2</span>
                        <span className="text-green-400">Active</span>
                      </div>
                      <div className="h-1 bg-black/40 rounded overflow-hidden">
                        <motion.div 
                          className="h-full bg-green-500" 
                          initial={{ width: "0%" }}
                          animate={{ width: "70%" }}
                          transition={{ duration: 1 }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              {/* Main visualization area */}
              <motion.div
                className="md:col-span-4 bg-black/40 rounded-lg border border-blue-900/40 overflow-hidden"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
              >
                {tensorGeometries.map((geometry, index) => (
                  <div key={index} className={selectedTensorIndex === index ? 'block' : 'hidden'}>
                    <AdvancedTensorVisualization
                      type={geometry.type as any}
                      color={geometry.color}
                      title={geometry.title}
                      description={geometry.description}
                    />
                  </div>
                ))}
              </motion.div>
            </div>
          </TabsContent>
          
          <TabsContent value="analyze" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Tensor Radar Charts */}
              <motion.div
                className="bg-black/40 rounded-lg border border-blue-900/40 p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-lg font-medium mb-6 text-blue-400">Tensor Property Analysis</h3>
                
                <div className="flex justify-center">
                  {tensors[selectedTensorIndex] && (
                    <TensorRadarChart 
                      data={generateRadarData(tensors[selectedTensorIndex])}
                      title={tensors[selectedTensorIndex].name}
                      subtitle="Property Distribution"
                    />
                  )}
                </div>
              </motion.div>
              
              {/* Tensor Test Correlations */}
              <motion.div
                className="bg-black/40 rounded-lg border border-blue-900/40 p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h3 className="text-lg font-medium mb-6 text-blue-400">Test Correlations</h3>
                
                {tensors[selectedTensorIndex] && (
                  <div className="space-y-4">
                    <div className="text-sm mb-6">
                      <p>
                        The {tensors[selectedTensorIndex].name} tensor shows high activation 
                        patterns in the following cognitive tests:
                      </p>
                    </div>
                    
                    {/* Test correlations */}
                    <div className="space-y-3">
                      {tensors[selectedTensorIndex].activeTests.map((testCode: string, idx: number) => {
                        const test = tests.find(t => t.code === testCode);
                        const correlationValue = 60 + Math.floor(Math.random() * 40); // 60-100%
                        
                        return test ? (
                          <div key={idx} className="bg-black/20 rounded-lg p-3 border border-blue-900/20">
                            <div className="flex justify-between mb-1">
                              <span className="font-medium">{test.name}</span>
                              <span className="text-blue-400">{correlationValue}% correlation</span>
                            </div>
                            <div className="h-1.5 bg-black/40 rounded-full overflow-hidden">
                              <motion.div 
                                className="h-full bg-blue-500" 
                                initial={{ width: "0%" }}
                                animate={{ width: `${correlationValue}%` }}
                                transition={{ duration: 1 }}
                              />
                            </div>
                            <div className="mt-2 text-xs opacity-70">
                              <p>{test.description.slice(0, 100)}...</p>
                            </div>
                          </div>
                        ) : null;
                      })}
                    </div>
                    
                    {/* Brain region correlations */}
                    <div className="mt-8">
                      <h4 className="text-sm font-medium mb-4 flex items-center">
                        <PiBrain className="mr-2" /> Associated Brain Regions
                      </h4>
                      
                      <div className="grid grid-cols-2 gap-3">
                        {['Prefrontal Cortex', 'Anterior Cingulate', 'Amygdala', 'Hippocampus']
                          .map((region, idx) => (
                            <div key={idx} className="bg-black/20 rounded p-2 border border-blue-900/20 flex items-center">
                              <div className="w-2 h-2 rounded-full bg-blue-400 mr-2"></div>
                              <span className="text-xs">{region}</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </TabsContent>
          
          <TabsContent value="simulate" className="mt-0">
            <motion.div
              className="bg-black/40 rounded-lg border border-blue-900/40 p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-blue-400">Tensor Simulation Curves</h3>
                
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    className={`text-xs h-8 ${!isSimulationPaused ? 'bg-blue-900/40' : 'bg-blue-900/20'} border-blue-900/40 hover:bg-blue-900/50`}
                    onClick={toggleSimulationPause}
                  >
                    {isSimulationPaused ? (
                      <><FaPlay className="mr-2 h-3 w-3" /> Resume</>
                    ) : (
                      <><FaPause className="mr-2 h-3 w-3" /> Pause</>
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="text-xs h-8 bg-black/20 border-blue-900/40 hover:bg-blue-900/30"
                    onClick={resetSimulations}
                  >
                    <FaSync className="mr-2 h-3 w-3" /> Reset
                  </Button>
                  <Button 
                    variant="outline" 
                    className={`text-xs h-8 ${!isMuted ? 'bg-blue-900/40' : 'bg-blue-900/20'} border-blue-900/40 hover:bg-blue-900/50`}
                    onClick={() => setIsMuted(!isMuted)}
                  >
                    {isMuted ? (
                      <><FaVolumeMute className="mr-2 h-3 w-3" /> Unmute</>
                    ) : (
                      <><FaVolumeUp className="mr-2 h-3 w-3" /> Mute</>
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="text-xs h-8 bg-black/20 border-blue-900/40 hover:bg-blue-900/30"
                    onClick={() => {
                      // Open in fullscreen
                      const container = document.querySelector('.tensor-geometry-container');
                      if (container instanceof HTMLElement) {
                        if (document.fullscreenElement) {
                          document.exitFullscreen();
                        } else {
                          container.requestFullscreen();
                        }
                      }
                    }}
                  >
                    <FaExpand className="mr-2 h-3 w-3" /> Fullscreen
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Tensor Evolution Chart */}
                <div className="border border-blue-900/20 rounded-lg p-4 bg-black/20 relative h-80">
                  <div className="absolute top-3 left-3 z-10">
                    <span className="text-xs font-mono bg-black/60 px-2 py-1 rounded">TENSOR EVOLUTION CURVE</span>
                  </div>
                  
                  {/* Wave simulation visualization */}
                  <div className="relative w-full h-full overflow-hidden">
                    <div className="absolute inset-0 flex flex-col justify-center">
                      {/* Animated waves */}
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="h-2 w-full"
                          style={{
                            backgroundColor: 'transparent',
                            backgroundImage: `linear-gradient(90deg, transparent 0%, ${tensorGeometries[selectedTensorIndex].color}80 50%, transparent 100%)`,
                            margin: '10px 0',
                          }}
                          animate={{
                            scaleX: [0.8, 1.2, 0.8],
                            opacity: [0.3, 0.7, 0.3],
                            x: [0, 50, 0],
                          }}
                          transition={{
                            duration: 8 - i,
                            repeat: Infinity,
                            delay: i * 0.5,
                            ease: "easeInOut",
                          }}
                        />
                      ))}
                      
                      {/* Animated particles */}
                      {[...Array(20)].map((_, i) => {
                        const size = Math.random() * 4 + 2;
                        return (
                          <motion.div
                            key={`p-${i}`}
                            className="absolute rounded-full bg-blue-400"
                            style={{
                              width: size,
                              height: size,
                              left: `${Math.random() * 100}%`,
                              top: `${Math.random() * 100}%`,
                              opacity: 0.6,
                              boxShadow: '0 0 8px rgba(59, 130, 246, 0.6)',
                            }}
                            animate={{
                              x: [0, Math.random() * 50 - 25, 0],
                              y: [0, Math.random() * 50 - 25, 0],
                              scale: [1, 1.5, 1],
                              opacity: [0.3, 0.7, 0.3],
                            }}
                            transition={{
                              duration: Math.random() * 10 + 10,
                              delay: Math.random() * 5,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                          />
                        );
                      })}
                    </div>
                    
                    {/* Grid overlay */}
                    <div className="absolute inset-0" style={{
                      backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px), 
                                        linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)`,
                      backgroundSize: '20px 20px',
                    }}></div>
                    
                    {/* Data points */}
                    <div className="absolute left-0 right-0 bottom-0 h-40">
                      <svg width="100%" height="100%" viewBox="0 0 100 40" preserveAspectRatio="none">
                        <path
                          d={`M0,40 C10,35 20,20 30,25 C40,30 50,10 60,15 C70,20 80,30 90,25 C95,22 100,20 100,20 V40 H0 Z`}
                          fill={`${tensorGeometries[selectedTensorIndex].color}20`}
                          stroke={tensorGeometries[selectedTensorIndex].color}
                          strokeWidth="0.5"
                        />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Timestamp markers */}
                  <div className="absolute bottom-3 left-3 right-3 flex justify-between">
                    <span className="text-xs opacity-70">t₀</span>
                    <span className="text-xs opacity-70">t₁₀₀</span>
                  </div>
                </div>
                
                {/* Calculus-Based Tensor Field Visualization */}
                <div className="border border-blue-900/20 rounded-lg p-4 bg-black/20 relative h-80">
                  <div className="absolute top-3 left-3 z-10">
                    <span className="text-xs font-mono bg-black/60 px-2 py-1 rounded">FIELD DIFFERENTIAL SIMULATION</span>
                  </div>
                  
                  <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                    {/* Mathematical mesh grid */}
                    <div className="absolute inset-0" style={{
                      backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px), 
                                        linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)`,
                      backgroundSize: '20px 20px',
                    }}></div>
                    
                    {/* Central tensor representation */}
                    <motion.div
                      className="relative w-40 h-40"
                      animate={{
                        rotate: 360,
                      }}
                      transition={{
                        duration: 40,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      {/* Field lines */}
                      {[...Array(12)].map((_, i) => {
                        const angle = (i / 12) * Math.PI * 2;
                        return (
                          <motion.div
                            key={i}
                            className="absolute top-1/2 left-1/2 w-[150%] h-[1px] origin-left"
                            style={{
                              background: `linear-gradient(90deg, ${tensorGeometries[selectedTensorIndex].color}, transparent)`,
                              transform: `rotate(${angle}rad)`,
                            }}
                            animate={{
                              scaleX: [1, 1.2, 1],
                              opacity: [0.7, 0.3, 0.7],
                            }}
                            transition={{
                              duration: 8,
                              repeat: Infinity,
                              delay: i * 0.3,
                              ease: "easeInOut",
                            }}
                          />
                        );
                      })}
                      
                      {/* Tensor core */}
                      <motion.div
                        className="absolute top-1/2 left-1/2 w-16 h-16 -ml-8 -mt-8 rounded-full"
                        style={{
                          background: `radial-gradient(circle, ${tensorGeometries[selectedTensorIndex].color}, transparent)`,
                          boxShadow: `0 0 40px ${tensorGeometries[selectedTensorIndex].color}`,
                        }}
                        animate={{
                          scale: [1, 1.3, 1],
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                    </motion.div>
                    
                    {/* Floating calculation elements */}
                    <div className="absolute top-10 right-10 p-2 bg-black/40 backdrop-blur-sm rounded-lg border border-blue-900/20">
                      <div className="text-xs font-mono">
                        <div>∇ × T = ∂ψ/∂t</div>
                        <div>∫∫ T·dS = ∮ γ·dl</div>
                      </div>
                    </div>
                    
                    <div className="absolute bottom-10 left-10 p-2 bg-black/40 backdrop-blur-sm rounded-lg border border-blue-900/20">
                      <div className="text-xs font-mono">
                        <div>λ₁ = 4.62</div>
                        <div>λ₂ = 1.87</div>
                        <div>λ₃ = 0.35</div>
                      </div>
                    </div>
                    
                    {/* Animated particles */}
                    {[...Array(15)].map((_, i) => {
                      const size = Math.random() * 4 + 2;
                      return (
                        <motion.div
                          key={`fp-${i}`}
                          className="absolute rounded-full bg-blue-400"
                          style={{
                            width: size,
                            height: size,
                            boxShadow: `0 0 15px ${tensorGeometries[selectedTensorIndex].color}`,
                          }}
                          animate={{
                            x: [
                              Math.cos((i / 15) * Math.PI * 2) * 100, 
                              Math.cos((i / 15) * Math.PI * 2 + Math.PI) * 100, 
                              Math.cos((i / 15) * Math.PI * 2) * 100
                            ],
                            y: [
                              Math.sin((i / 15) * Math.PI * 2) * 100, 
                              Math.sin((i / 15) * Math.PI * 2 + Math.PI) * 100, 
                              Math.sin((i / 15) * Math.PI * 2) * 100
                            ],
                            scale: [1, i % 3 === 0 ? 2 : 1.3, 1],
                            opacity: [0.7, 0.3, 0.7],
                          }}
                          transition={{
                            duration: 20 - i * 0.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
              
              {/* Additional simulation info */}
              {/* Simulation Controls Panel */}
              <div className="mt-6 bg-black/20 border border-blue-900/20 rounded-lg p-4">
                {/* Simulation Speed Slider */}
                <div className="mb-4 border-b border-blue-900/20 pb-4">
                  <h4 className="text-sm font-medium mb-4 flex items-center">
                    <PiGaugeLight className="mr-2" /> Simulation Speed Control
                  </h4>
                  
                  <div className="flex items-center space-x-4">
                    <button 
                      className="bg-black/40 rounded-full p-1 hover:bg-blue-900/30 transition-colors"
                      onClick={() => updateSimulationSpeed(Math.max(0.5, simulationSpeed - 0.5))}
                    >
                      <FaMinus className="h-3 w-3" />
                    </button>
                    
                    <div className="flex-1 px-2">
                      <div className="relative h-2 bg-black/40 rounded-full overflow-hidden">
                        <div 
                          className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-600 to-blue-400" 
                          style={{ width: `${(simulationSpeed / 2) * 100}%` }}
                        />
                      </div>
                      
                      <div className="mt-1 flex justify-between text-xs opacity-70">
                        <span>0.5x</span>
                        <span>1.0x</span>
                        <span>1.5x</span>
                        <span>2.0x</span>
                      </div>
                    </div>
                    
                    <button 
                      className="bg-black/40 rounded-full p-1 hover:bg-blue-900/30 transition-colors"
                      onClick={() => updateSimulationSpeed(Math.min(2, simulationSpeed + 0.5))}
                    >
                      <FaPlus className="h-3 w-3" />
                    </button>
                    
                    <div className="bg-black/40 rounded-md px-3 py-1 min-w-[60px] text-center">
                      <span className="text-sm font-mono">{simulationSpeed.toFixed(1)}x</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs opacity-70 mt-2">
                    <span>Current speed: {simulationSpeed.toFixed(1)}x</span>
                    <button 
                      className="hover:text-blue-400 transition-colors"
                      onClick={() => updateSimulationSpeed(1.0)}
                    >
                      Reset to 1.0x
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center">
                      <PiMathOperations className="mr-2" /> Tensor Transformation
                    </h4>
                    <div className="bg-black/40 p-3 rounded font-mono text-xs">
                      <div className="mb-2">T<sub>μν</sub> = ∂<sub>μ</sub>Φ∂<sub>ν</sub>Φ - g<sub>μν</sub>L</div>
                      <div>∇ × (E + iB) = 0</div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center">
                      <PiCube className="mr-2" /> Eigenvalues
                    </h4>
                    <div className="space-y-2">
                      {[
                        { label: "λ₁ (Primary)", value: 4.62, color: "#3b82f6" },
                        { label: "λ₂ (Secondary)", value: 1.87, color: "#8b5cf6" },
                        { label: "λ₃ (Tertiary)", value: 0.35, color: "#ec4899" },
                      ].map((eigen, idx) => (
                        <div key={idx} className="flex justify-between items-center text-xs">
                          <span>{eigen.label}</span>
                          <div className="flex items-center">
                            <div className="w-16 h-1.5 bg-black/40 rounded-full overflow-hidden mr-2">
                              <motion.div 
                                className="h-full" 
                                style={{ backgroundColor: eigen.color }}
                                initial={{ width: "0%" }}
                                animate={{ width: `${(eigen.value / 5) * 100}%` }}
                                transition={{ duration: 1 }}
                              />
                            </div>
                            <span className="font-mono">{eigen.value}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center">
                      <PiArrowsInLineVertical className="mr-2" /> Vector Field
                    </h4>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      {["Curl", "Divergence", "Gradient"].map((field, idx) => (
                        <div key={idx} className="bg-black/40 p-2 rounded text-center">
                          <div className="font-medium mb-1">{field}</div>
                          <div className={
                            idx === 0 ? "text-blue-400" : 
                            idx === 1 ? "text-purple-400" : "text-pink-400"
                          }>
                            {idx === 0 ? "3.4" : idx === 1 ? "0.0" : "2.7"}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Tensor Gallery */}
      <motion.div 
        className="mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h3 className="font-display text-2xl font-bold mb-6 flex items-center">
          <span className="text-secondary mr-2">Tensor Classification</span>
          <span className="text-xs bg-secondary/20 px-2 py-1 rounded font-mono">CATALOG v2.4</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tensors.map((tensor, index) => {
            // Find tests that use this tensor
            const tensorTests = tests.filter(test => 
              tensor.activeTests.includes(test.code)
            );
            
            return (
              <motion.div
                key={tensor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="h-full"
              >
                <HolographicCard className="h-full flex flex-col relative overflow-hidden">
                  {/* Floating balls background */}
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute rounded-full bg-secondary/30"
                      style={{
                        width: 4 + i * 3,
                        height: 4 + i * 3,
                        top: `${20 + Math.random() * 60}%`,
                        left: `${20 + Math.random() * 60}%`,
                        boxShadow: '0 0 10px rgba(139, 92, 246, 0.3)',
                      }}
                      animate={{
                        x: [0, (i % 2 === 0 ? 30 : -30), 0],
                        y: [0, (i % 3 === 0 ? -40 : 40), 0],
                        scale: [1, 1.5, 1],
                        opacity: [0.3, 0.7, 0.3],
                      }}
                      transition={{
                        duration: 10 - i,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  ))}
                  
                  <div className="tensor-visualization mb-4 h-32 flex items-center justify-center">
                    <TensorShape tensor={tensor} />
                  </div>
                  
                  <h3 className="font-display text-xl font-bold mb-2 text-secondary">{tensor.name} ({tensor.symbol})</h3>
                  <p className="text-sm opacity-70 mb-3">{tensor.description}</p>
                  
                  <div className="mt-auto">
                    <h4 className="text-sm font-medium mb-2">Active in Tests:</h4>
                    <div className="flex flex-wrap gap-2">
                      {tensor.activeTests.map(testCode => (
                        <span key={testCode} className="px-2 py-1 bg-primary/10 rounded-full text-xs text-primary">
                          {testCode}
                        </span>
                      ))}
                    </div>
                  </div>
                </HolographicCard>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
      
      {/* Tensor Explanation Section */}
      <motion.div 
        className="mt-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <HolographicCard>
          <h3 className="font-display text-2xl font-bold mb-4 text-secondary">Understanding Tensor Functions</h3>
          
          <div className="space-y-6 mt-6">
            <div>
              <h4 className="font-medium text-xl mb-2">Tensor Input Function</h4>
              <p className="text-sm opacity-70 mb-3">Each test question feeds into a tensor transformation:</p>
              
              <div className="bg-neutral-medium/30 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                Input_Vector = (Emotion Type, Intensity, Time Anchoring, Resistance)
              </div>
              
              <p className="text-sm opacity-70 mt-3">These are mapped into the consciousness state tensor equation:</p>
              
              <div className="bg-neutral-medium/30 p-4 rounded-lg font-mono text-sm overflow-x-auto mt-2">
                Ψ = ∂E / ∂t + δ(L²) / δx + γCμν
              </div>
              
              <p className="text-sm opacity-70 mt-3">
                Where Ψ = Consciousness State Tensor, E = Emotional Identity Field, 
                L = Loop Curvature, and Cμν = Cognitive Feedback Matrix
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-xl mb-2">Tensor Geometry in Interface</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {tensorGeometries.map((geometry, index) => (
                  <motion.div 
                    key={index}
                    className="p-4 border border-primary/20 rounded-lg hover:border-primary/50 cursor-pointer transition-colors"
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedTensorIndex(index)}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: geometry.color }}></div>
                      <h5 className="font-medium">{geometry.title.split(' ')[0]}</h5>
                    </div>
                    <p className="text-xs opacity-70">{geometry.description.split(',')[0]}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </HolographicCard>
      </motion.div>
    </div>
  );
}
