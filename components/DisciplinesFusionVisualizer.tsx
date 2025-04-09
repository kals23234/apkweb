import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { testDisciplines, bharadwajTests, TestDiscipline, BharadwajTest } from '@/data/testDisciplines';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  Brain, 
  Atom, 
  Layers, 
  User, 
  Box, 
  Triangle, 
  Sun,
  Maximize2,
  ZoomIn,
  BarChart2,
  ArrowRight,
  X
} from 'lucide-react';

const DisciplinesFusionVisualizer: React.FC = () => {
  const [selectedDiscipline, setSelectedDiscipline] = useState<TestDiscipline | null>(null);
  const [selectedTest, setSelectedTest] = useState<BharadwajTest | null>(null);
  const [mode, setMode] = useState<'disciplines' | 'tests'>('disciplines');
  const [expanded, setExpanded] = useState(false);
  
  // Get icon component based on discipline icon string
  const getIcon = (iconName?: string) => {
    switch(iconName) {
      case 'brain': return <Brain className="w-5 h-5" />;
      case 'atom': return <Atom className="w-5 h-5" />;
      case 'layers': return <Layers className="w-5 h-5" />;
      case 'user': return <User className="w-5 h-5" />;
      case 'box': return <Box className="w-5 h-5" />;
      case 'triangle': return <Triangle className="w-5 h-5" />;
      case 'sun': return <Sun className="w-5 h-5" />;
      case 'activity': return <Activity className="w-5 h-5" />;
      default: return <BarChart2 className="w-5 h-5" />;
    }
  };
  
  // Get tests related to a discipline
  const getRelatedTests = (discipline: TestDiscipline) => {
    if (discipline.relatedTests?.includes('ALL')) {
      return bharadwajTests;
    }
    return bharadwajTests.filter(test => 
      discipline.relatedTests?.some(code => test.code.includes(code))
    );
  };

  // Get disciplines related to a test
  const getRelatedDisciplines = (test: BharadwajTest) => {
    return testDisciplines.filter(discipline => 
      discipline.relatedTests?.includes('ALL') || 
      discipline.relatedTests?.some(code => test.code.includes(code))
    );
  };
  
  return (
    <div className={`${expanded ? 'fixed inset-0 z-50 bg-black/80 backdrop-blur-sm p-6 overflow-auto' : ''}`}>
      <motion.div 
        layout
        className={`relative rounded-xl border border-blue-500/30 bg-black/60 backdrop-blur-md overflow-hidden
          ${expanded ? 'w-full max-w-6xl mx-auto' : 'w-full'}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Floating elements background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {testDisciplines.map((discipline, idx) => (
            <motion.div
              key={idx}
              className="absolute w-20 h-20 rounded-full opacity-10"
              style={{ backgroundColor: discipline.color }}
              animate={{
                x: [
                  Math.random() * 100 - 50 + '%', 
                  Math.random() * 100 - 50 + '%'
                ],
                y: [
                  Math.random() * 100 - 50 + '%', 
                  Math.random() * 100 - 50 + '%'
                ],
                scale: [0.8, 1.2, 0.8]
              }}
              transition={{
                duration: 10 + Math.random() * 20,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
            />
          ))}
        </div>
        
        {/* Header */}
        <div className="relative p-6 border-b border-blue-500/30 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Bharadwaj Framework Disciplines Fusion
            </h3>
            <p className="text-sm text-gray-400">
              Exploring the multidisciplinary foundations of the Bharadwaj test battery
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              className={mode === 'disciplines' ? 'bg-blue-900/30' : ''}
              onClick={() => {
                setMode('disciplines');
                setSelectedTest(null);
              }}
            >
              By Discipline
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className={mode === 'tests' ? 'bg-blue-900/30' : ''}
              onClick={() => {
                setMode('tests');
                setSelectedDiscipline(null);
              }}
            >
              By Test
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? <X className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </Button>
          </div>
        </div>
        
        {/* Main Content Area */}
        <div className="p-6 relative">
          {mode === 'disciplines' ? (
            <div className="space-y-6">
              {/* Disciplines Grid */}
              {!selectedDiscipline && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {testDisciplines.map((discipline, index) => (
                    <motion.div
                      key={index}
                      className="relative group cursor-pointer"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      onClick={() => setSelectedDiscipline(discipline)}
                    >
                      <div className="absolute inset-0 rounded-lg" style={{ 
                        background: `radial-gradient(circle at center, ${discipline.color}30 0%, transparent 70%)`,
                        transform: 'translateY(5px) scale(0.95)',
                        filter: 'blur(10px)',
                        opacity: 0.5
                      }}></div>
                      
                      <Card className="border border-gray-800 bg-black/60 backdrop-blur-sm hover:bg-gray-900/60 transition-all relative overflow-hidden group-hover:border-blue-500/30">
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-10" style={{ backgroundColor: discipline.color }}></div>
                        
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div className="p-2 rounded-full" style={{ backgroundColor: `${discipline.color}20` }}>
                              <div className="text-white">{getIcon(discipline.icon)}</div>
                            </div>
                            
                            <Badge variant="outline" className="bg-blue-900/20">
                              {discipline.relatedTests?.length === 1 && discipline.relatedTests[0] === 'ALL' ? 
                                'All Tests' : 
                                `${discipline.relatedTests?.length || 0} Tests`}
                            </Badge>
                          </div>
                          <CardTitle className="mt-2 text-lg">{discipline.field}</CardTitle>
                        </CardHeader>
                        
                        <CardContent>
                          <p className="text-sm text-gray-400 line-clamp-2">
                            {discipline.influence}
                          </p>
                        </CardContent>
                        
                        <CardFooter className="pt-0">
                          <Button variant="ghost" size="sm" className="w-full gap-1 group-hover:text-blue-400">
                            <span>View Details</span>
                            <ArrowRight className="w-4 h-4" />
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
              
              {/* Selected Discipline Detail */}
              {selectedDiscipline && (
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="mb-4 flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setSelectedDiscipline(null)}
                      >
                        <ArrowRight className="w-4 h-4 rotate-180 mr-1" />
                        Back to Disciplines
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <Card className="border border-gray-800 bg-black/60 backdrop-blur-sm lg:col-span-1">
                        <CardHeader>
                          <div className="flex items-center gap-3 mb-2">
                            <div className="p-3 rounded-full" style={{ backgroundColor: `${selectedDiscipline.color}20` }}>
                              {getIcon(selectedDiscipline.icon)}
                            </div>
                            <CardTitle>{selectedDiscipline.field}</CardTitle>
                          </div>
                          <CardDescription>
                            Scientific discipline integrated into the Bharadwaj Framework
                          </CardDescription>
                        </CardHeader>
                        
                        <CardContent className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-400 mb-1">Influence on Tests</h4>
                            <p className="text-sm">{selectedDiscipline.influence}</p>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-gray-400 mb-1">Primary Contributions</h4>
                            <ul className="space-y-1">
                              {selectedDiscipline.field === "Cognitive Physics" && (
                                <>
                                  <li className="text-sm flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                    <span>Advanced tensor processing models</span>
                                  </li>
                                  <li className="text-sm flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                    <span>Thought field equations for cognitive mapping</span>
                                  </li>
                                  <li className="text-sm flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                    <span>Loop gravity principles for recursive cognition</span>
                                  </li>
                                </>
                              )}
                              
                              {selectedDiscipline.field === "Neurobiology" && (
                                <>
                                  <li className="text-sm flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                    <span>Region-specific activation mapping</span>
                                  </li>
                                  <li className="text-sm flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                    <span>Neural circuit identification for diagnosis</span>
                                  </li>
                                  <li className="text-sm flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                    <span>Multimodal brain region correlation</span>
                                  </li>
                                </>
                              )}
                              
                              {selectedDiscipline.field === "Neuropsychiatry" && (
                                <>
                                  <li className="text-sm flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                    <span>Trauma echo measurement systems</span>
                                  </li>
                                  <li className="text-sm flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                    <span>Neurotransmitter balance detection</span>
                                  </li>
                                  <li className="text-sm flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                    <span>Inhibitory system feedback loops</span>
                                  </li>
                                </>
                              )}
                              
                              {selectedDiscipline.field === "16PF / MBTI" && (
                                <>
                                  <li className="text-sm flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                    <span>Trait logic systems for personality assessment</span>
                                  </li>
                                  <li className="text-sm flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                    <span>Dichotomy conflict simulation patterns</span>
                                  </li>
                                  <li className="text-sm flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                    <span>Multi-dimensional trait mapping</span>
                                  </li>
                                </>
                              )}
                              
                              {selectedDiscipline.field === "Kinesics & Body Psychology" && (
                                <>
                                  <li className="text-sm flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                    <span>Emotion-position tracking systems</span>
                                  </li>
                                  <li className="text-sm flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                    <span>Shame gesture mapping protocols</span>
                                  </li>
                                  <li className="text-sm flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                    <span>Bodily expression of psychological states</span>
                                  </li>
                                </>
                              )}
                              
                              {selectedDiscipline.field === "Quantum Mechanics" && (
                                <>
                                  <li className="text-sm flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                    <span>Superposition identity test models</span>
                                  </li>
                                  <li className="text-sm flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                    <span>Collapse logic processing</span>
                                  </li>
                                  <li className="text-sm flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                    <span>Observer effect on cognitive measurement</span>
                                  </li>
                                </>
                              )}
                              
                              {selectedDiscipline.field === "Fractal & Geometric Theories" && (
                                <>
                                  <li className="text-sm flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                    <span>Thought expansion modeling</span>
                                  </li>
                                  <li className="text-sm flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                    <span>Non-linear perception assessment</span>
                                  </li>
                                  <li className="text-sm flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                    <span>Recursive pattern recognition in cognition</span>
                                  </li>
                                </>
                              )}
                              
                              {selectedDiscipline.field === "Eastern Psychology" && (
                                <>
                                  <li className="text-sm flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                    <span>Vāk duality frameworks</span>
                                  </li>
                                  <li className="text-sm flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                    <span>Mirror mind-body energy systems</span>
                                  </li>
                                  <li className="text-sm flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                    <span>Anatta (no-self) principles application</span>
                                  </li>
                                </>
                              )}
                            </ul>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="border border-gray-800 bg-black/60 backdrop-blur-sm lg:col-span-2">
                        <CardHeader>
                          <CardTitle>Related Tests</CardTitle>
                          <CardDescription>
                            Bharadwaj tests that incorporate {selectedDiscipline.field} principles
                          </CardDescription>
                        </CardHeader>
                        
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2">
                            {getRelatedTests(selectedDiscipline).map((test, idx) => (
                              <motion.div
                                key={idx}
                                className="p-4 rounded-lg border border-gray-800 bg-black/40 hover:bg-gray-900/40 cursor-pointer transition-all"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2, delay: idx * 0.05 }}
                                onClick={() => {
                                  setSelectedTest(test);
                                  setMode('tests');
                                  setSelectedDiscipline(null);
                                }}
                              >
                                <div className="flex justify-between items-start">
                                  <h3 className="font-bold text-blue-400">{test.code}</h3>
                                  <Badge variant="outline" className="bg-blue-900/20 text-xs">
                                    {test.framework}
                                  </Badge>
                                </div>
                                
                                <h4 className="mt-1 mb-2">{test.name}</h4>
                                
                                <div className="flex flex-wrap gap-1 mt-3">
                                  {test.influences.slice(0, 3).map((influence, infIdx) => (
                                    <span key={infIdx} className="text-xs px-2 py-0.5 rounded-full bg-blue-900/20 text-blue-300">
                                      {influence.split(' ')[0]}
                                    </span>
                                  ))}
                                  {test.influences.length > 3 && (
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-900/40 text-gray-400">
                                      +{test.influences.length - 3} more
                                    </span>
                                  )}
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Tests Grid */}
              {!selectedTest && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {bharadwajTests.map((test, index) => (
                    <motion.div
                      key={index}
                      className="cursor-pointer group"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.03 }}
                      onClick={() => setSelectedTest(test)}
                    >
                      <Card className="border border-gray-800 bg-black/60 backdrop-blur-sm hover:bg-gray-900/60 transition-all group-hover:border-blue-500/30 h-full flex flex-col">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between">
                            <Badge className="bg-blue-900/30 text-blue-300 border-blue-500/30">
                              {test.code}
                            </Badge>
                            <ZoomIn className="w-4 h-4 text-gray-500 group-hover:text-blue-400 transition-colors" />
                          </div>
                          <CardTitle className="mt-2 text-lg">{test.name}</CardTitle>
                          <CardDescription>{test.framework}</CardDescription>
                        </CardHeader>
                        
                        <CardContent className="flex-grow">
                          <div className="flex flex-wrap gap-1">
                            {test.influences.slice(0, 4).map((influence, idx) => (
                              <span 
                                key={idx} 
                                className="inline-block text-xs px-2 py-0.5 rounded-full bg-gray-900/60 text-gray-300 mt-1"
                              >
                                {influence.split(' ')[0]}
                              </span>
                            ))}
                            {test.influences.length > 4 && (
                              <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-gray-900/40 text-gray-500 mt-1">
                                +{test.influences.length - 4}
                              </span>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
              
              {/* Selected Test Detail */}
              {selectedTest && (
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="mb-4 flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setSelectedTest(null)}
                      >
                        <ArrowRight className="w-4 h-4 rotate-180 mr-1" />
                        Back to Tests
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <Card className="border border-gray-800 bg-black/60 backdrop-blur-sm lg:col-span-1">
                        <CardHeader>
                          <Badge className="mb-2 bg-blue-900/30 text-blue-300 border-blue-500/30 w-fit">
                            {selectedTest.code}
                          </Badge>
                          <CardTitle>{selectedTest.name}</CardTitle>
                          <CardDescription>{selectedTest.framework}</CardDescription>
                        </CardHeader>
                        
                        <CardContent className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-400 mb-1">Scientific & Theoretical Influences</h4>
                            <ul className="space-y-1">
                              {selectedTest.influences.map((influence, idx) => (
                                <li key={idx} className="text-sm flex items-start gap-2">
                                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                  <span>{influence}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="border border-gray-800 bg-black/60 backdrop-blur-sm lg:col-span-2">
                        <CardHeader>
                          <CardTitle>Related Disciplines</CardTitle>
                          <CardDescription>
                            Scientific fields that informed the development of {selectedTest.code}
                          </CardDescription>
                        </CardHeader>
                        
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {getRelatedDisciplines(selectedTest).map((discipline, idx) => (
                              <motion.div
                                key={idx}
                                className="p-4 rounded-lg border border-gray-800 bg-black/40 hover:bg-gray-900/40 cursor-pointer transition-all"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2, delay: idx * 0.05 }}
                                onClick={() => {
                                  setSelectedDiscipline(discipline);
                                  setMode('disciplines');
                                  setSelectedTest(null);
                                }}
                                style={{
                                  borderLeft: `3px solid ${discipline.color}`
                                }}
                              >
                                <div className="flex items-center gap-2 mb-2">
                                  <div className="p-1.5 rounded-full" style={{ backgroundColor: `${discipline.color}20` }}>
                                    {getIcon(discipline.icon)}
                                  </div>
                                  <h3 className="font-medium">{discipline.field}</h3>
                                </div>
                                
                                <p className="text-sm text-gray-400 line-clamp-2">
                                  {discipline.influence}
                                </p>
                              </motion.div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="mt-6">
                      <Card className="border border-gray-800 bg-black/60 backdrop-blur-sm">
                        <CardHeader>
                          <CardTitle>Test Integration Visualization</CardTitle>
                          <CardDescription>
                            How {selectedTest.code} integrates multiple disciplines and frameworks
                          </CardDescription>
                        </CardHeader>
                        
                        <CardContent>
                          <div className="relative h-60 w-full rounded-lg bg-black/40 flex items-center justify-center overflow-hidden">
                            {/* Central test node */}
                            <div className="absolute z-10 w-24 h-24 rounded-full bg-blue-900/40 border-2 border-blue-500/40 flex items-center justify-center">
                              <div className="text-center">
                                <div className="font-mono text-xs text-blue-400">{selectedTest.code}</div>
                                <div className="text-xs opacity-70">Core Test</div>
                              </div>
                            </div>
                            
                            {/* Connected discipline nodes */}
                            {getRelatedDisciplines(selectedTest).map((discipline, idx) => {
                              const angle = (2 * Math.PI * idx) / getRelatedDisciplines(selectedTest).length;
                              const radius = 120; // Distance from center
                              const x = Math.cos(angle) * radius;
                              const y = Math.sin(angle) * radius;
                              
                              return (
                                <React.Fragment key={idx}>
                                  {/* Connection line */}
                                  <div 
                                    className="absolute bg-blue-500/20 h-px z-0"
                                    style={{
                                      width: radius,
                                      left: '50%',
                                      top: '50%',
                                      transformOrigin: '0 0',
                                      transform: `rotate(${angle}rad)`
                                    }}
                                  />
                                  
                                  {/* Discipline node */}
                                  <motion.div
                                    className="absolute w-16 h-16 rounded-full flex items-center justify-center z-10"
                                    style={{ 
                                      left: `calc(50% + ${x}px)`, 
                                      top: `calc(50% + ${y}px)`,
                                      transform: 'translate(-50%, -50%)',
                                      backgroundColor: `${discipline.color}30`,
                                      border: `2px solid ${discipline.color}50`
                                    }}
                                    animate={{ scale: [1, 1.05, 1] }}
                                    transition={{
                                      duration: 2,
                                      repeat: Infinity,
                                      delay: idx * 0.3
                                    }}
                                  >
                                    <div className="text-center">
                                      {getIcon(discipline.icon)}
                                      <div className="text-xs mt-1 opacity-70">{discipline.field.split(' ')[0]}</div>
                                    </div>
                                  </motion.div>
                                </React.Fragment>
                              );
                            })}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default DisciplinesFusionVisualizer;