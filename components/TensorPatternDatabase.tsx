import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  tensorPatterns, 
  healingProtocols, 
  TensorPattern, 
  HealingProtocol,
  getTensorPatternsBySeverity,
  getTensorPatternsByFramework
} from '@/data/tensorPatterns';
import { FaBrain, FaRadiationAlt, FaFilter, FaSearch, FaWaveSquare, FaNetworkWired, FaLayerGroup, FaDna, FaClock } from 'react-icons/fa';

// Neural Signature Viewer component
const NeuralSignatureViewer: React.FC<{ pattern: TensorPattern }> = ({ pattern }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number>(0);
  const controls = useAnimation();
  
  // Setup the neural signature visualization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    let particles: { x: number, y: number, size: number, speed: number, color: string, alpha: number }[] = [];
    const particleCount = 50;
    const colors = {
      MILD: '#3b82f6',
      MODERATE: '#f59e0b',
      SEVERE: '#ef4444'
    };
    
    // Create particles based on pattern severity
    for (let i = 0; i < particleCount; i++) {
      const size = Math.random() * 3 + 1;
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size,
        speed: Math.random() * 1 + 0.2,
        color: colors[pattern.severity as keyof typeof colors],
        alpha: Math.random() * 0.5 + 0.1
      });
    }
    
    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw mirror state indicator
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, 40, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(30, 41, 59, 0.7)';
      ctx.fill();
      
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, 38, 0, Math.PI * 2);
      ctx.strokeStyle = colors[pattern.severity as keyof typeof colors];
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Draw particles
      particles.forEach(particle => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `${particle.color}${Math.floor(particle.alpha * 255).toString(16).padStart(2, '0')}`;
        ctx.fill();
        
        // Move particles in a circular pattern around the center
        const dx = particle.x - canvas.width / 2;
        const dy = particle.y - canvas.height / 2;
        const angle = Math.atan2(dy, dx);
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 40) {
          // Move particles away from center
          particle.x += Math.cos(angle) * particle.speed * 2;
          particle.y += Math.sin(angle) * particle.speed * 2;
        } else {
          // Make particles orbit around center
          particle.x += Math.cos(angle + Math.PI / 2) * particle.speed;
          particle.y += Math.sin(angle + Math.PI / 2) * particle.speed;
          
          // Slowly move towards center
          particle.x += (canvas.width / 2 - particle.x) * 0.001;
          particle.y += (canvas.height / 2 - particle.y) * 0.001;
        }
        
        // Wrap particles around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
      });
      
      // Draw central text
      ctx.font = '10px Monospace';
      ctx.textAlign = 'center';
      ctx.fillStyle = 'white';
      ctx.fillText('MIRROR-STATE', canvas.width / 2, canvas.height / 2 - 5);
      ctx.fillText('SIGNATURE', canvas.width / 2, canvas.height / 2 + 10);
      
      // Continue animation
      animationFrameId.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Pulse animation for the tensor severity ring
    controls.start({
      scale: [1, 1.1, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 2,
        ease: "easeInOut",
        repeat: Infinity,
      }
    });
    
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [pattern, controls]);
  
  return (
    <div className="relative">
      <canvas ref={canvasRef} className="w-full h-52 rounded-lg" />
      
      {/* Tensor Severity Ring */}
      <motion.div
        animate={controls}
        className="absolute top-4 right-4 w-16 h-16 rounded-full border-2"
        style={{
          borderColor: pattern.severity === 'MILD' ? '#3b82f6' 
            : pattern.severity === 'MODERATE' ? '#f59e0b' : '#ef4444'
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <span className="text-xs font-mono">{pattern.severity}</span>
          <span className="text-[8px] opacity-70">TENSOR PHASE</span>
        </div>
      </motion.div>
      
      {/* Framework Tag */}
      {pattern.framework && (
        <div className="absolute bottom-4 left-4 bg-black/50 text-xs px-2 py-1 rounded">
          {pattern.framework}
        </div>
      )}
      
      {/* Mirror State Signature */}
      <div className="absolute bottom-4 right-4 bg-black/50 text-xs px-2 py-1 rounded">
        {pattern.mirrorStateSignature}
      </div>
    </div>
  );
};

// Loop Timeline Visualizer component
const LoopTimelineVisualizer: React.FC<{ pattern: TensorPattern }> = ({ pattern }) => {
  const [timePoint, setTimePoint] = useState(0);
  const timelineRef = useRef<HTMLDivElement>(null);
  
  // Simulate timeline progress
  useEffect(() => {
    const interval = setInterval(() => {
      setTimePoint(prev => (prev + 1) % 100);
    }, 200);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="p-4 bg-black/30 rounded-lg border border-gray-700">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium flex items-center gap-2">
          <FaClock className="text-blue-400" />
          <span>Loop Replay & Healing Timeline</span>
        </h3>
        <div className="text-xs bg-blue-900/30 px-2 py-0.5 rounded text-blue-400 font-mono">
          T+{timePoint}
        </div>
      </div>
      
      <div className="relative h-6 bg-black/50 rounded overflow-hidden mb-2" ref={timelineRef}>
        <motion.div 
          className="absolute h-full" 
          style={{ 
            width: `${timePoint}%`,
            background: `linear-gradient(90deg, 
              ${pattern.severity === 'MILD' ? '#3b82f6' : 
                pattern.severity === 'MODERATE' ? '#f59e0b' : '#ef4444'} 0%,
              rgba(59, 130, 246, 0.3) 100%)`
          }}
        />
        
        {/* Timeline markers */}
        <div className="absolute inset-0 flex items-center justify-between px-2">
          <div className="bg-white/20 w-0.5 h-2"></div>
          <div className="bg-white/20 w-0.5 h-2"></div>
          <div className="bg-white/20 w-0.5 h-2"></div>
          <div className="bg-white/20 w-0.5 h-2"></div>
          <div className="bg-white/20 w-0.5 h-2"></div>
        </div>
        
        {/* Current point marker */}
        <div 
          className="absolute top-0 bottom-0 w-0.5 bg-white" 
          style={{ left: `${timePoint}%` }}
        />
      </div>
      
      <div className="grid grid-cols-3 text-xs gap-1 mb-3">
        <div className="text-left">Loop Initiation</div>
        <div className="text-center">Peak Activation</div>
        <div className="text-right">Resolution</div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs">Emotional Intensity</span>
          <div className="w-32 h-1.5 bg-black/40 rounded-full overflow-hidden">
            <motion.div 
              className="h-full" 
              style={{ 
                width: `${timePoint}%`,
                backgroundColor: pattern.severity === 'MILD' ? '#3b82f6' : 
                  pattern.severity === 'MODERATE' ? '#f59e0b' : '#ef4444'
              }}
            />
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-xs">Neural Activation</span>
          <div className="w-32 h-1.5 bg-black/40 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-purple-500" 
              style={{ 
                width: `${Math.sin(timePoint * 0.1) * 40 + 50}%`
              }}
            />
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-xs">Healing Progress</span>
          <div className="w-32 h-1.5 bg-black/40 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-green-500" 
              style={{ 
                width: `${Math.min(timePoint, 100)}%`
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const TensorPatternDatabase: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPattern, setSelectedPattern] = useState<TensorPattern | null>(null);
  const [activeSeverityFilter, setActiveSeverityFilter] = useState<'ALL' | 'MILD' | 'MODERATE' | 'SEVERE'>('ALL');
  const [frameworkFilter, setFrameworkFilter] = useState<string>('ALL');
  
  // Framework options
  const frameworks = ['ALL', 'BUCP-DT', 'Loop Matrix', 'MPHM', 'Quantum Cognition Extensions', 'Tensor Diagnostics'];
  
  // Filter patterns based on search term, severity filter, and framework filter
  const filteredPatterns = tensorPatterns.filter(pattern => {
    const matchesSearch = searchTerm === '' || 
      pattern.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pattern.brainRegions.some(region => region.toLowerCase().includes(searchTerm.toLowerCase())) ||
      pattern.loopDisruptionMethod.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSeverity = activeSeverityFilter === 'ALL' || pattern.severity === activeSeverityFilter;
    const matchesFramework = frameworkFilter === 'ALL' || pattern.framework === frameworkFilter;
    
    return matchesSearch && matchesSeverity && matchesFramework;
  });
  
  // Find healing protocol for selected pattern
  const findHealingProtocol = (patternName: string): HealingProtocol | undefined => {
    return healingProtocols.find(protocol => protocol.tensorPatternName === patternName);
  };
  
  // Get severity badge color
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'MILD':
        return 'bg-blue-900/20 border-blue-500/30 text-blue-400';
      case 'MODERATE':
        return 'bg-amber-900/20 border-amber-500/30 text-amber-400';
      case 'SEVERE':
        return 'bg-red-900/20 border-red-500/30 text-red-400';
      default:
        return 'bg-gray-900/20 border-gray-500/30 text-gray-400';
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card className="border-gray-800 bg-black/40 backdrop-blur-sm h-full">
            <CardHeader>
              <CardTitle>Tensor Pattern Library</CardTitle>
              <CardDescription>
                The Bharadwaj Framework's cognitive pattern taxonomy
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Search input */}
              <div className="relative">
                <Input
                  placeholder="Search patterns, brain regions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10 bg-black/20 border-gray-700"
                />
                <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
              
              {/* Severity filters */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <FaFilter className="text-gray-400" />
                  <span className="text-sm">Filter by Severity</span>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Badge 
                    variant={activeSeverityFilter === 'ALL' ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => setActiveSeverityFilter('ALL')}
                  >
                    All
                  </Badge>
                  <Badge 
                    variant={activeSeverityFilter === 'MILD' ? 'default' : 'outline'}
                    className="cursor-pointer bg-blue-900/40 hover:bg-blue-900/60"
                    onClick={() => setActiveSeverityFilter('MILD')}
                  >
                    Mild
                  </Badge>
                  <Badge 
                    variant={activeSeverityFilter === 'MODERATE' ? 'default' : 'outline'}
                    className="cursor-pointer bg-amber-900/40 hover:bg-amber-900/60"
                    onClick={() => setActiveSeverityFilter('MODERATE')}
                  >
                    Moderate
                  </Badge>
                  <Badge 
                    variant={activeSeverityFilter === 'SEVERE' ? 'default' : 'outline'}
                    className="cursor-pointer bg-red-900/40 hover:bg-red-900/60"
                    onClick={() => setActiveSeverityFilter('SEVERE')}
                  >
                    Severe
                  </Badge>
                </div>
              </div>
              
              {/* Framework filters */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <FaLayerGroup className="text-gray-400" />
                  <span className="text-sm">Filter by Framework</span>
                </div>
                
                <Select
                  value={frameworkFilter}
                  onValueChange={setFrameworkFilter}
                >
                  <SelectTrigger className="bg-black/20 border-gray-700">
                    <SelectValue placeholder="Select Framework" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700">
                    {frameworks.map((framework) => (
                      <SelectItem key={framework} value={framework}>
                        {framework}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Pattern count */}
              <div className="text-xs text-gray-400">
                Showing {filteredPatterns.length} of {tensorPatterns.length} patterns
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <Card className="border-gray-800 bg-black/40 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>
                <div className="flex items-center gap-2">
                  <FaRadiationAlt className="text-blue-400" />
                  <span>Cognitive Tensor Patterns</span>
                </div>
              </CardTitle>
              <CardDescription>
                Identified emotional-cognitive loop structures from the Bharadwaj framework
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                {filteredPatterns.length > 0 ? (
                  filteredPatterns.map((pattern, index) => (
                    <motion.div
                      key={index}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        selectedPattern?.name === pattern.name 
                          ? 'bg-blue-900/30 border-blue-500/40' 
                          : 'bg-black/20 border-gray-700 hover:bg-gray-900/80'
                      }`}
                      onClick={() => setSelectedPattern(pattern)}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium">{pattern.name}</h3>
                        <div className={`px-2 py-0.5 rounded text-xs border ${getSeverityColor(pattern.severity)}`}>
                          {pattern.severity}
                        </div>
                      </div>
                      
                      <div className="mt-2 flex flex-wrap gap-1">
                        {pattern.brainRegions.map((region, idx) => (
                          <span 
                            key={idx} 
                            className="bg-gray-900/60 text-xs px-2 py-0.5 rounded"
                          >
                            {region}
                          </span>
                        ))}
                      </div>
                      
                      {pattern.description && (
                        <p className="mt-2 text-sm opacity-70">
                          {pattern.description}
                        </p>
                      )}
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8 opacity-70">
                    <div className="mb-2">No tensor patterns found matching your criteria</div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        setSearchTerm('');
                        setActiveSeverityFilter('ALL');
                      }}
                    >
                      Reset Filters
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {selectedPattern && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="border-gray-800 bg-black/40 backdrop-blur-sm">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>{selectedPattern.name}</CardTitle>
                  <CardDescription>
                    Detailed tensor pattern analysis and treatment protocols
                  </CardDescription>
                </div>
                <div className={`px-3 py-1 rounded text-xs border ${getSeverityColor(selectedPattern.severity)}`}>
                  {selectedPattern.severity} PATTERN
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <Tabs defaultValue="analysis">
                <TabsList className="mb-4">
                  <TabsTrigger value="analysis">Pattern Analysis</TabsTrigger>
                  <TabsTrigger value="neural">Neural Correlates</TabsTrigger>
                  <TabsTrigger value="treatment">Treatment Protocol</TabsTrigger>
                </TabsList>
                
                <TabsContent value="analysis" className="space-y-4">
                  <div className="bg-black/20 rounded-lg p-4 border border-gray-700">
                    <h3 className="font-medium mb-2">Pattern Description</h3>
                    <p className="text-sm">
                      {selectedPattern.description || 'No detailed description available.'}
                    </p>
                  </div>
                  
                  <div className="bg-black/20 rounded-lg p-4 border border-gray-700">
                    <h3 className="font-medium mb-2">Mirror State Signature</h3>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                      <span>{selectedPattern.mirrorStateSignature}</span>
                    </div>
                    <p className="mt-2 text-sm opacity-70">
                      The characteristic reflection pattern that emerges in mirroring relationships.
                    </p>
                  </div>
                  
                  <div className="bg-black/20 rounded-lg p-4 border border-gray-700">
                    <h3 className="font-medium mb-2">Loop Disruption Method</h3>
                    <p className="text-sm font-medium text-blue-400">
                      {selectedPattern.loopDisruptionMethod}
                    </p>
                    <p className="mt-2 text-sm opacity-70">
                      The therapeutic approaches that have been found effective in breaking this pattern.
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="neural" className="space-y-4">
                  {/* Neural Signature Viewer */}
                  <div className="bg-black/20 rounded-lg border border-gray-700 overflow-hidden">
                    <div className="p-4 border-b border-gray-700">
                      <h3 className="font-medium flex items-center gap-2">
                        <FaWaveSquare className="text-blue-400" />
                        <span>Neural Signature Viewer</span>
                      </h3>
                    </div>
                    <NeuralSignatureViewer pattern={selectedPattern} />
                  </div>
                  
                  {/* Loop Timeline Visualizer */}
                  <LoopTimelineVisualizer pattern={selectedPattern} />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-black/20 rounded-lg p-4 border border-gray-700">
                      <h3 className="font-medium mb-3 flex items-center gap-2">
                        <FaBrain className="text-blue-400" />
                        <span>Brain Regions</span>
                      </h3>
                      
                      <div className="space-y-3">
                        {selectedPattern.brainRegions.map((region, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-900/30 flex items-center justify-center">
                              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                            </div>
                            <div>
                              <div className="font-medium">{region}</div>
                              <div className="text-xs opacity-70">
                                {idx === 0 ? 'Primary activation region' : 'Secondary activation'}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="bg-black/20 rounded-lg p-4 border border-gray-700">
                      <h3 className="font-medium mb-3">Neurochemical Signatures</h3>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Dopamine</span>
                          <div className="w-32 h-1.5 bg-black/40 rounded-full overflow-hidden">
                            <motion.div 
                              className="h-full bg-green-500" 
                              initial={{ width: "0%" }}
                              animate={{ width: `${20 + Math.random() * 80}%` }}
                              transition={{ duration: 1 }}
                            />
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Serotonin</span>
                          <div className="w-32 h-1.5 bg-black/40 rounded-full overflow-hidden">
                            <motion.div 
                              className="h-full bg-blue-500" 
                              initial={{ width: "0%" }}
                              animate={{ width: `${20 + Math.random() * 80}%` }}
                              transition={{ duration: 1, delay: 0.2 }}
                            />
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Cortisol</span>
                          <div className="w-32 h-1.5 bg-black/40 rounded-full overflow-hidden">
                            <motion.div 
                              className="h-full bg-red-500" 
                              initial={{ width: "0%" }}
                              animate={{ width: `${20 + Math.random() * 80}%` }}
                              transition={{ duration: 1, delay: 0.4 }}
                            />
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm">GABA</span>
                          <div className="w-32 h-1.5 bg-black/40 rounded-full overflow-hidden">
                            <motion.div 
                              className="h-full bg-purple-500" 
                              initial={{ width: "0%" }}
                              animate={{ width: `${20 + Math.random() * 80}%` }}
                              transition={{ duration: 1, delay: 0.6 }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-black/20 rounded-lg p-4 border border-gray-700">
                    <h3 className="font-medium mb-2 flex items-center gap-2">
                      <FaNetworkWired className="text-blue-400" />
                      <span>Network Connectivity</span>
                    </h3>
                    <p className="text-sm">
                      This pattern shows disrupted connectivity between the Default Mode Network and 
                      the Executive Control Network, with hyperactivation in the emotional processing
                      circuits and decreased integration with higher cognitive areas.
                    </p>
                    {selectedPattern.framework && (
                      <div className="mt-3 text-xs px-3 py-2 bg-blue-900/20 border border-blue-500/20 rounded-md">
                        <span className="font-medium">Framework:</span> {selectedPattern.framework}
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="treatment" className="space-y-4">
                  {findHealingProtocol(selectedPattern.name) ? (
                    <>
                      <div className="bg-black/20 rounded-lg p-4 border border-gray-700">
                        <h3 className="font-medium mb-2">Healing Protocol</h3>
                        <div className="space-y-3">
                          {findHealingProtocol(selectedPattern.name)?.steps.map((step, idx) => (
                            <div key={idx} className="flex items-start gap-3">
                              <div className="mt-0.5 w-6 h-6 rounded-full bg-blue-900/30 border border-blue-500/30 flex items-center justify-center text-xs">
                                {idx + 1}
                              </div>
                              <div>
                                <div className="font-medium">{step}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-black/20 rounded-lg p-4 border border-gray-700">
                          <h3 className="font-medium mb-2">Neurochemistry Target</h3>
                          <div className="flex items-center gap-2 text-green-400">
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <span>{findHealingProtocol(selectedPattern.name)?.neurochemistry || 'Not specified'}</span>
                          </div>
                        </div>
                        
                        <div className="bg-black/20 rounded-lg p-4 border border-gray-700">
                          <h3 className="font-medium mb-2">Protocol Duration</h3>
                          <div className="flex items-center gap-2 text-blue-400">
                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                            <span>{findHealingProtocol(selectedPattern.name)?.duration || 'Not specified'}</span>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8 opacity-70">
                      <p className="mb-2">No detailed healing protocol available for this pattern.</p>
                      <p>The recommended approach is to use the Loop Disruption Method:</p>
                      <div className="mt-3 font-medium text-blue-400">
                        {selectedPattern.loopDisruptionMethod}
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
            
            <CardFooter className="border-t border-gray-800 pt-4">
              <div className="flex justify-between items-center w-full">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedPattern(null)}
                >
                  Back to Pattern List
                </Button>
                
                <div className="text-xs opacity-70">
                  ADVANCED BHARADWAJ TENSOR INTERFACE v.MaxMind
                </div>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default TensorPatternDatabase;