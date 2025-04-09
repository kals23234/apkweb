import { useState } from "react";
import { HolographicCard } from "@/components/ui/holographic-card";
import BrainVisualization from "@/components/BrainVisualization";
import FluidBrainVisualization from "@/components/FluidBrainVisualization";
import BrainRegionCard from "@/components/BrainRegionCard";
import { brainRegions, BrainRegion } from "@/data/brainRegions";
import { tests } from "@/data/tests";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FaBrain, FaNetworkWired, FaDna } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import React from "react";

export default function BrainMap() {
  const [activeRegion, setActiveRegion] = useState<BrainRegion | null>(null);
  const [activeTests, setActiveTests] = useState<any[]>([]);
  const [visualizationMode, setVisualizationMode] = useState<'standard' | 'fluid'>('fluid');

  const handleRegionClick = (region: BrainRegion) => {
    setActiveRegion(region);
    
    // Find tests associated with this brain region
    const regionTests = tests.filter(test => 
      test.brainRegions.includes(region.name) || 
      test.brainRegions.includes(region.acronym)
    );
    setActiveTests(regionTests);
  };

  return (
    <div>
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <span className="text-primary font-mono text-sm">SECTION 4</span>
          <span className="h-px flex-grow bg-primary/30"></span>
        </div>
        <h2 className="font-display text-3xl font-bold mb-2">Brain Region Mapping</h2>
        <p className="opacity-70 max-w-3xl">Each test in the Bharadwaj Framework targets specific brain regions and neurotransmitter systems for precise cognitive analysis.</p>
      </motion.div>
      
      <Tabs defaultValue="neuro-dynamic" className="mb-6">
        <div className="flex justify-between items-center">
          <TabsList className="bg-black/40 border border-blue-900/40">
            <TabsTrigger value="neuro-dynamic" className="data-[state=active]:bg-blue-900/50">
              <FaBrain className="mr-2" /> Neural Dynamics
            </TabsTrigger>
            <TabsTrigger value="functional" className="data-[state=active]:bg-blue-900/50">
              <FaNetworkWired className="mr-2" /> Functional Map
            </TabsTrigger>
            <TabsTrigger value="genetic" className="data-[state=active]:bg-blue-900/50">
              <FaDna className="mr-2" /> Genetic Expression
            </TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2">
            <Button 
              variant={visualizationMode === 'standard' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setVisualizationMode('standard')}
              className="text-xs"
            >
              Standard View
            </Button>
            <Button 
              variant={visualizationMode === 'fluid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setVisualizationMode('fluid')}
              className="text-xs"
            >
              Fluid Dynamics
            </Button>
          </div>
        </div>
        
        <TabsContent value="neuro-dynamic" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column - Brain diagram */}
            <div className="lg:col-span-2">
              <HolographicCard className="h-full overflow-hidden">
                {/* Brain region interactive map */}
                {visualizationMode === 'standard' ? (
                  <BrainVisualization 
                    onRegionClick={handleRegionClick} 
                    activeRegion={activeRegion?.id || null}
                  />
                ) : (
                  <FluidBrainVisualization
                    regions={brainRegions}
                    activeRegionId={activeRegion?.id || null}
                    onRegionClick={handleRegionClick}
                    height={650}
                  />
                )}
              </HolographicCard>
            </div>
            
            {/* Right column - Brain region list */}
            <div className="bg-black/40 border border-primary/20 rounded-xl p-6 overflow-y-auto max-h-[650px]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display text-xl font-bold text-secondary">Brain Regions</h3>
                
                <div className="text-xs bg-blue-900/20 border border-blue-900/40 px-2 py-1 rounded font-mono text-blue-400">
                  {brainRegions.length} Regions Mapped
                </div>
              </div>
              
              <div className="space-y-3">
                {brainRegions.map(region => (
                  <BrainRegionCard 
                    key={region.id} 
                    region={region} 
                    isActive={activeRegion?.id === region.id}
                    onClick={() => handleRegionClick(region)}
                  />
                ))}
              </div>
            </div>
          </div>
          
          {/* Tests associated with selected brain region */}
          {activeRegion && activeTests.length > 0 && (
            <motion.div 
              className="mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <HolographicCard>
                <h3 className="font-display text-xl font-bold mb-4 text-secondary">
                  Tests Targeting {activeRegion.name}
                </h3>
                <p className="text-sm opacity-70 mb-6">These tests specifically activate neural pathways in the {activeRegion.name}, affecting {activeRegion.function.toLowerCase()}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeTests.map(test => (
                    <div key={test.code} className="border border-primary/20 rounded-xl p-4 hover:border-primary/40 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-primary font-mono">{test.code}</span>
                        <span className="bg-neutral-medium/50 rounded-full px-2 py-0.5 text-xs">{test.framework}</span>
                      </div>
                      
                      <h4 className="font-medium mb-1">{test.name}</h4>
                      <p className="text-xs opacity-70 mb-2">{test.description}</p>
                      
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-secondary">{test.receptors.join(", ")}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </HolographicCard>
            </motion.div>
          )}
        </TabsContent>
        
        <TabsContent value="functional" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <HolographicCard className="relative p-0 overflow-hidden min-h-[600px]">
                {/* Functional connectivity visualization - simplified for now */}
                <div className="absolute inset-0">
                  {/* Grid background */}
                  <div className="absolute inset-0" style={{
                    backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px), 
                                      linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)`,
                    backgroundSize: '20px 20px',
                  }}></div>
                  
                  {/* Functional network visualization (simplified for now) */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-[500px] h-[500px]">
                      {/* Create network nodes for brain regions */}
                      {brainRegions.map((region, index) => {
                        // Position nodes in a circle
                        const angle = (index / brainRegions.length) * Math.PI * 2;
                        const radius = 200;
                        const x = Math.cos(angle) * radius + 250;
                        const y = Math.sin(angle) * radius + 250;
                        
                        return (
                          <motion.div
                            key={region.id}
                            className="absolute rounded-full border-2 flex items-center justify-center cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
                            style={{
                              left: `${x}px`,
                              top: `${y}px`,
                              width: `${region.size * 20}px`,
                              height: `${region.size * 20}px`,
                              backgroundColor: `${region.color}20`,
                              borderColor: region.color,
                              boxShadow: activeRegion?.id === region.id ? `0 0 20px ${region.color}` : 'none',
                            }}
                            animate={{
                              scale: activeRegion?.id === region.id ? [1, 1.1, 1] : 1,
                            }}
                            transition={{
                              duration: 2,
                              repeat: activeRegion?.id === region.id ? Infinity : 0,
                            }}
                            onClick={() => handleRegionClick(region)}
                          >
                            <span className="text-xs font-bold">{region.acronym}</span>
                          </motion.div>
                        );
                      })}
                      
                      {/* Draw connections between regions */}
                      <svg className="absolute inset-0 w-full h-full pointer-events-none">
                        <defs>
                          <marker id="arrowhead" markerWidth="10" markerHeight="7" 
                            refX="0" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
                          </marker>
                        </defs>
                        
                        {brainRegions.map((region, i) => {
                          // Create connections to 2-3 random regions
                          const connections = [];
                          const numConnections = Math.min(3, brainRegions.length - 1);
                          
                          for (let j = 1; j <= numConnections; j++) {
                            const targetIndex = (i + j) % brainRegions.length;
                            const targetRegion = brainRegions[targetIndex];
                            
                            // Calculate positions
                            const sourceAngle = (i / brainRegions.length) * Math.PI * 2;
                            const targetAngle = (targetIndex / brainRegions.length) * Math.PI * 2;
                            const radius = 200;
                            
                            const x1 = Math.cos(sourceAngle) * radius + 250;
                            const y1 = Math.sin(sourceAngle) * radius + 250;
                            const x2 = Math.cos(targetAngle) * radius + 250;
                            const y2 = Math.sin(targetAngle) * radius + 250;
                            
                            // Determine if this connection should be highlighted
                            const isHighlighted = activeRegion && 
                              (activeRegion.id === region.id || activeRegion.id === targetRegion.id);
                            
                            connections.push(
                              <g key={`${region.id}-${targetRegion.id}`}>
                                <path
                                  d={`M ${x1},${y1} C ${(x1 + x2) / 2 + (Math.random() - 0.5) * 50},${(y1 + y2) / 2 + (Math.random() - 0.5) * 50} ${(x1 + x2) / 2 + (Math.random() - 0.5) * 50},${(y1 + y2) / 2 + (Math.random() - 0.5) * 50} ${x2},${y2}`}
                                  stroke={isHighlighted ? '#60a5fa' : '#1e3a8a'}
                                  strokeWidth={isHighlighted ? 2 : 1}
                                  strokeOpacity={isHighlighted ? 0.8 : 0.3}
                                  fill="none"
                                  markerEnd="url(#arrowhead)"
                                />
                                
                                {/* Add animated particles on the path */}
                                {isHighlighted && (
                                  <motion.circle
                                    r="3"
                                    fill="#60a5fa"
                                    opacity="0.8"
                                    animate={{
                                      offsetDistance: ['0%', '100%'],
                                      opacity: [0.8, 0],
                                    }}
                                    transition={{
                                      duration: 1.5,
                                      ease: "linear",
                                      repeat: Infinity,
                                    }}
                                    style={{
                                      offsetPath: `path("M ${x1},${y1} C ${(x1 + x2) / 2 + (Math.random() - 0.5) * 50},${(y1 + y2) / 2 + (Math.random() - 0.5) * 50} ${(x1 + x2) / 2 + (Math.random() - 0.5) * 50},${(y1 + y2) / 2 + (Math.random() - 0.5) * 50} ${x2},${y2}")`,
                                    }}
                                  />
                                )}
                              </g>
                            );
                          }
                          
                          return connections;
                        })}
                      </svg>
                    </div>
                  </div>
                </div>
                
                {/* Info overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-4 backdrop-blur-sm">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium text-blue-400">Functional Connectivity Map</h3>
                      <p className="text-sm opacity-70">Visualizing neural pathway interactions between regions</p>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="text-xs border rounded px-2 py-1 border-blue-900/40 bg-blue-900/20">
                        42 functional connections
                      </div>
                    </div>
                  </div>
                </div>
              </HolographicCard>
            </div>
            
            <div className="bg-black/40 border border-primary/20 rounded-xl p-6 overflow-y-auto max-h-[600px]">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-display text-xl font-bold text-secondary">Functional Analysis</h3>
                
                <div className="text-xs bg-blue-900/20 border border-blue-900/40 px-2 py-1 rounded font-mono">
                  7 Networks Identified
                </div>
              </div>
              
              {activeRegion ? (
                <div className="space-y-4">
                  <div className="p-4 border border-blue-900/40 rounded-lg bg-blue-900/10">
                    <h4 className="font-medium text-blue-400 mb-2">{activeRegion.name} Functional Network</h4>
                    <p className="text-sm opacity-70 mb-3">Primary function: {activeRegion.function}</p>
                    
                    <div className="space-y-2">
                      <div>
                        <div className="text-xs mb-1">Activation Strength</div>
                        <div className="h-1.5 bg-black/60 rounded-full overflow-hidden">
                          <motion.div 
                            className="h-full bg-blue-500" 
                            initial={{ width: "0%" }}
                            animate={{ width: "75%" }}
                            transition={{ duration: 1 }}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-xs mb-1">Connectivity Density</div>
                        <div className="h-1.5 bg-black/60 rounded-full overflow-hidden">
                          <motion.div 
                            className="h-full bg-purple-500" 
                            initial={{ width: "0%" }}
                            animate={{ width: "58%" }}
                            transition={{ duration: 1, delay: 0.2 }}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-xs mb-1">Signal Propagation</div>
                        <div className="h-1.5 bg-black/60 rounded-full overflow-hidden">
                          <motion.div 
                            className="h-full bg-green-500" 
                            initial={{ width: "0%" }}
                            animate={{ width: "82%" }}
                            transition={{ duration: 1, delay: 0.4 }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-sm font-medium">Connected Regions:</div>
                  <div className="grid grid-cols-2 gap-2">
                    {brainRegions
                      .filter(r => r.id !== activeRegion.id)
                      .slice(0, 6)
                      .map(region => (
                        <div 
                          key={region.id}
                          className="p-2 border border-blue-900/20 rounded bg-black/20 flex items-center cursor-pointer hover:bg-blue-900/10 transition-colors"
                          onClick={() => handleRegionClick(region)}
                        >
                          <div 
                            className="w-2 h-2 rounded-full mr-2"
                            style={{ backgroundColor: region.color }}
                          />
                          <span className="text-xs">{region.acronym} - {region.name.split(' ')[0]}</span>
                        </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center p-8 opacity-70">
                  <FaBrain className="mx-auto text-4xl mb-3 text-blue-900" />
                  <p>Select a brain region to view detailed functional connectivity</p>
                </div>
              )}
              
              <div className="mt-8 bg-black/40 p-4 rounded-lg">
                <h4 className="text-sm font-medium mb-3">Grey Matter & White Matter Analysis</h4>
                <div className="flex justify-between text-xs">
                  <div>
                    <div className="font-medium text-blue-400">Grey Matter</div>
                    <div>Neuron density: High</div>
                  </div>
                  <div>
                    <div className="font-medium text-purple-400">White Matter</div>
                    <div>Connectivity: 94.3%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="genetic" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <HolographicCard className="p-6 min-h-[600px]">
                <h3 className="font-medium text-xl mb-4 text-blue-400">Genetic Expression Atlas</h3>
                
                <div className="relative h-[500px] border border-blue-900/20 rounded-lg bg-black/20 mb-4 overflow-hidden">
                  {/* DNA/RNA visualization placeholder */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-full h-full">
                      {/* DNA helix animation */}
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 h-full w-60">
                        {Array.from({ length: 20 }).map((_, i) => (
                          <React.Fragment key={i}>
                            <motion.div
                              className="absolute w-40 h-2 rounded-full"
                              style={{
                                top: `${i * 25}px`,
                                backgroundColor: i % 2 === 0 ? '#60a5fa' : '#a78bfa',
                                transformOrigin: 'center',
                              }}
                              animate={{
                                scaleX: [1, 0.7, 1],
                                rotateY: [0, 180, 360],
                              }}
                              transition={{
                                duration: 8,
                                repeat: Infinity,
                                delay: i * 0.2,
                                ease: "linear",
                              }}
                            />
                            <motion.div
                              className="absolute w-2 h-2 rounded-full"
                              style={{
                                top: `${i * 25}px`,
                                left: '30%',
                                backgroundColor: i % 3 === 0 ? '#34d399' : '#f472b6',
                              }}
                              animate={{
                                x: [0, 120, 0],
                              }}
                              transition={{
                                duration: 8,
                                repeat: Infinity,
                                delay: i * 0.2,
                                ease: "linear",
                              }}
                            />
                            <motion.div
                              className="absolute w-2 h-2 rounded-full"
                              style={{
                                top: `${i * 25}px`,
                                left: '70%',
                                backgroundColor: i % 4 === 0 ? '#fbbf24' : '#60a5fa',
                              }}
                              animate={{
                                x: [0, -120, 0],
                              }}
                              transition={{
                                duration: 8,
                                repeat: Infinity,
                                delay: i * 0.2,
                                ease: "linear",
                              }}
                            />
                          </React.Fragment>
                        ))}
                      </div>
                      
                      {/* Expression heatmap overlay */}
                      {activeRegion && (
                        <motion.div
                          className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/80 to-transparent"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5 }}
                        >
                          <div className="absolute bottom-4 left-4 right-4">
                            <h4 className="text-sm font-medium mb-2">{activeRegion.name} Expression Profile</h4>
                            <div className="flex space-x-1">
                              {Array.from({ length: 20 }).map((_, i) => (
                                <div
                                  key={i}
                                  className="flex-1 h-8 rounded-sm"
                                  style={{
                                    backgroundColor: `hsl(${210 + i * 6}, 80%, ${40 + i * 2}%)`,
                                    opacity: Math.random() * 0.5 + 0.5,
                                  }}
                                />
                              ))}
                            </div>
                            <div className="flex justify-between text-xs mt-1">
                              <span>Low expression</span>
                              <span>High expression</span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                  
                  {/* Info overlay */}
                  <div className="absolute top-2 right-2 bg-black/70 rounded px-2 py-1 text-xs font-mono">
                    GENE-MAP-v2.1
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-xs">
                  <div className="p-3 bg-black/20 border border-blue-900/20 rounded-lg">
                    <div className="font-medium mb-1 text-blue-400">BDNF Expression</div>
                    <div className="opacity-70">Neural growth factor</div>
                    <div className="h-1 mt-2 bg-black/40 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 w-4/5"></div>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-black/20 border border-blue-900/20 rounded-lg">
                    <div className="font-medium mb-1 text-purple-400">COMT Allele</div>
                    <div className="opacity-70">Dopamine regulation</div>
                    <div className="h-1 mt-2 bg-black/40 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 w-3/5"></div>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-black/20 border border-blue-900/20 rounded-lg">
                    <div className="font-medium mb-1 text-green-400">OXTR Variation</div>
                    <div className="opacity-70">Social bonding</div>
                    <div className="h-1 mt-2 bg-black/40 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 w-2/3"></div>
                    </div>
                  </div>
                </div>
              </HolographicCard>
            </div>
            
            <div className="bg-black/40 border border-primary/20 rounded-xl p-6 overflow-y-auto max-h-[600px]">
              <h3 className="font-display text-xl font-bold mb-6 text-secondary">Gene Expression</h3>
              
              {activeRegion ? (
                <div className="space-y-4">
                  <div className="p-4 border border-green-900/40 rounded-lg bg-green-900/10">
                    <h4 className="font-medium text-green-400 mb-2">{activeRegion.name} Gene Profile</h4>
                    
                    <div className="grid grid-cols-3 gap-2 text-xs mb-3">
                      <div className="bg-black/40 p-2 rounded">
                        <div className="font-medium">Gene Count</div>
                        <div className="text-green-400">1,289</div>
                      </div>
                      
                      <div className="bg-black/40 p-2 rounded">
                        <div className="font-medium">Variants</div>
                        <div className="text-green-400">72</div>
                      </div>
                      
                      <div className="bg-black/40 p-2 rounded">
                        <div className="font-medium">Epigenetic</div>
                        <div className="text-green-400">43%</div>
                      </div>
                    </div>
                    
                    <div className="text-sm opacity-70">
                      This region shows significant BDNF and COMT expression patterns correlated with {activeRegion.function.toLowerCase()}.
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Key Gene-Function Correlations:</h4>
                    <div className="space-y-3">
                      {['BDNF', 'COMT', 'OXTR', 'MTHFR', 'APOE'].map((gene, idx) => (
                        <div key={idx} className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-2 h-2 rounded-full"
                              style={{ 
                                backgroundColor: ['#60a5fa', '#a78bfa', '#34d399', '#f472b6', '#fbbf24'][idx % 5]
                              }}
                            />
                            <span className="text-sm">{gene}</span>
                          </div>
                          <div className="text-xs opacity-70">
                            {['Neural growth', 'Dopamine regulation', 'Social bonding', 'Methylation', 'Lipid transport'][idx % 5]}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-black/20 rounded-lg">
                    <h4 className="text-sm font-medium mb-2">Grey Matter Development</h4>
                    <p className="text-xs opacity-70 mb-3">
                      Grey matter development in the {activeRegion.name} is regulated by BDNF expression and 
                      modulated by environmental factors and cognitive training.
                    </p>
                    
                    <div className="flex items-center gap-2 mt-4">
                      <Button size="sm" variant="outline" className="text-xs h-7 bg-green-900/20 border-green-900/40">
                        View Full Gene Map
                      </Button>
                      <Button size="sm" variant="outline" className="text-xs h-7 bg-black/20 border-blue-900/40">
                        Correlation Analysis
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center p-8 opacity-70">
                  <FaDna className="mx-auto text-4xl mb-3 text-green-900" />
                  <p>Select a brain region to view detailed genetic expression data</p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}