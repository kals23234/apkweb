import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { frameworks } from "@/data/frameworks";
import FrameworkCard from "@/components/FrameworkCard";
import { HolographicCard } from "@/components/ui/holographic-card";

export default function Home() {
  // Display only the first 4 frameworks in the list
  const featuredFrameworks = frameworks.slice(0, 4);

  return (
    <>
      {/* Hero Section */}
      <section className="mb-12">
        <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
          <motion.div 
            className="md:w-1/2 space-y-6 z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 animate-gradient-x">
              <span className="relative">World's First NeuroPhysics</span>{" "}
              <span className="relative">Tensor Based</span> Cognitive Model
              <div className="absolute -top-3 -right-3 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <div className="absolute -bottom-2 left-10 w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              <div className="absolute top-1/2 right-1/4 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
            </h2>
            <p className="text-lg opacity-80 relative before:content-[''] before:absolute before:left-0 before:top-1/2 before:h-px before:w-[30px] before:bg-blue-500/50 before:-translate-x-[40px] ml-10">
              Bharadwaj Mainframe Advancement by AbnAdvance
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/frameworks">
                <Button className="px-6 py-3 bg-primary hover:bg-primary-dark rounded-xl font-medium transition-colors">
                  Explore Frameworks
                </Button>
              </Link>
              <Button variant="outline" className="px-6 py-3 border-primary/50 hover:border-primary rounded-xl font-medium transition-colors">
                Take a Test
              </Button>
            </div>
          </motion.div>
          
          {/* 3D Brain Visualization */}
          <motion.div 
            className="w-full md:w-1/2 h-64 md:h-96 relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <HolographicCard className="w-full h-full flex items-center justify-center">
              <div className="relative w-full h-full">
                {/* Brain visualization component will be implemented here */}
                <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                  <div className="w-48 h-48 md:w-72 md:h-72 relative">
                    {/* Brain structure base with data overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 to-purple-800/20 rounded-full animate-pulse-slow"></div>
                    <div className="absolute inset-0 border-2 border-blue-500/10 rounded-full animate-spin-slow"></div>
                    <div className="absolute inset-[5%] border border-purple-500/10 rounded-full animate-spin-slow" style={{ animationDuration: '30s', animationDirection: 'reverse' }}></div>
                    
                    {/* Data grid visualization */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-20">
                      <div className="grid grid-cols-8 grid-rows-8 w-full h-full">
                        {Array.from({ length: 64 }).map((_, i) => (
                          <motion.div 
                            key={i}
                            className="border-[0.5px] border-blue-400/10"
                            animate={{ 
                              opacity: [0.1, (i % 7 === 0) ? 0.5 : 0.1, 0.1],
                            }}
                            transition={{ 
                              duration: 3 + (i % 5), 
                              repeat: Infinity,
                              delay: i * 0.05
                            }}
                          />
                        ))}
                      </div>
                    </div>
                    
                    {/* Brain regions (animated with glow) */}
                    <motion.div 
                      className="absolute left-[30%] top-[20%] w-7 h-7 bg-blue-500/50 rounded-full shadow-lg shadow-blue-500/20"
                      animate={{ 
                        scale: [1, 1.2, 1],
                        boxShadow: [
                          '0 0 10px rgba(59, 130, 246, 0.3)',
                          '0 0 20px rgba(59, 130, 246, 0.5)',
                          '0 0 10px rgba(59, 130, 246, 0.3)'
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <motion.div 
                      className="absolute left-[60%] top-[25%] w-6 h-6 bg-purple-500/70 rounded-full shadow-lg shadow-purple-500/20"
                      animate={{ 
                        scale: [1, 1.3, 1],
                        boxShadow: [
                          '0 0 10px rgba(168, 85, 247, 0.3)',
                          '0 0 25px rgba(168, 85, 247, 0.5)',
                          '0 0 10px rgba(168, 85, 247, 0.3)'
                        ]
                      }}
                      transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                    />
                    <motion.div 
                      className="absolute left-[45%] top-[50%] w-9 h-9 bg-cyan-500/50 rounded-full shadow-lg shadow-cyan-500/20"
                      animate={{ 
                        scale: [1, 1.15, 1],
                        boxShadow: [
                          '0 0 15px rgba(6, 182, 212, 0.3)',
                          '0 0 30px rgba(6, 182, 212, 0.5)',
                          '0 0 15px rgba(6, 182, 212, 0.3)'
                        ]
                      }}
                      transition={{ duration: 2.5, repeat: Infinity, delay: 1 }}
                    />
                    <motion.div 
                      className="absolute left-[20%] top-[65%] w-5 h-5 bg-green-400/60 rounded-full shadow-lg shadow-green-400/20"
                      animate={{ 
                        scale: [1, 1.25, 1],
                        boxShadow: [
                          '0 0 10px rgba(74, 222, 128, 0.3)',
                          '0 0 20px rgba(74, 222, 128, 0.5)',
                          '0 0 10px rgba(74, 222, 128, 0.3)'
                        ]
                      }}
                      transition={{ duration: 2.8, repeat: Infinity, delay: 1.5 }}
                    />
                    <motion.div 
                      className="absolute left-[70%] top-[60%] w-8 h-8 bg-yellow-400/50 rounded-full shadow-lg shadow-yellow-400/20"
                      animate={{ 
                        scale: [1, 1.15, 1],
                        boxShadow: [
                          '0 0 10px rgba(250, 204, 21, 0.3)',
                          '0 0 20px rgba(250, 204, 21, 0.5)',
                          '0 0 10px rgba(250, 204, 21, 0.3)'
                        ]
                      }}
                      transition={{ duration: 3.2, repeat: Infinity, delay: 0.8 }}
                    />
                    
                    {/* Dynamic neural connections with gradient animation */}
                    <motion.div 
                      className="absolute left-[33%] top-[23%] w-[30%] h-1.5 rotate-[40deg] origin-left"
                      style={{
                        background: "linear-gradient(90deg, rgba(59, 130, 246, 0.7) 0%, rgba(59, 130, 246, 0.1) 100%)"
                      }}
                      animate={{ 
                        opacity: [0.4, 0.8, 0.4],
                        scale: [1, 1.05, 1],
                        background: [
                          "linear-gradient(90deg, rgba(59, 130, 246, 0.7) 0%, rgba(59, 130, 246, 0.1) 100%)",
                          "linear-gradient(90deg, rgba(59, 130, 246, 0.9) 0%, rgba(59, 130, 246, 0.2) 100%)",
                          "linear-gradient(90deg, rgba(59, 130, 246, 0.7) 0%, rgba(59, 130, 246, 0.1) 100%)"
                        ]
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <motion.div 
                        className="absolute top-0 left-0 h-full w-[30%] bg-blue-400/80 rounded-full"
                        animate={{ 
                          x: ['0%', '250%', '0%'],
                          opacity: [0.4, 0.8, 0.4]
                        }}
                        transition={{ 
                          duration: 3, 
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                    </motion.div>
                    
                    <motion.div 
                      className="absolute left-[48%] top-[50%] w-[25%] h-1.5 rotate-[20deg] origin-left"
                      style={{
                        background: "linear-gradient(90deg, rgba(168, 85, 247, 0.7) 0%, rgba(168, 85, 247, 0.1) 100%)"
                      }}
                      animate={{ 
                        opacity: [0.4, 0.8, 0.4],
                        scale: [1, 1.05, 1],
                        background: [
                          "linear-gradient(90deg, rgba(168, 85, 247, 0.7) 0%, rgba(168, 85, 247, 0.1) 100%)",
                          "linear-gradient(90deg, rgba(168, 85, 247, 0.9) 0%, rgba(168, 85, 247, 0.2) 100%)",
                          "linear-gradient(90deg, rgba(168, 85, 247, 0.7) 0%, rgba(168, 85, 247, 0.1) 100%)"
                        ]
                      }}
                      transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
                    >
                      <motion.div 
                        className="absolute top-0 left-0 h-full w-[30%] bg-purple-400/80 rounded-full"
                        animate={{ 
                          x: ['0%', '250%', '0%'],
                          opacity: [0.4, 0.8, 0.4]
                        }}
                        transition={{ 
                          duration: 3.5, 
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 0.5
                        }}
                      />
                    </motion.div>
                    
                    <motion.div 
                      className="absolute left-[45%] top-[50%] w-[30%] h-1.5 rotate-[-60deg] origin-left"
                      style={{
                        background: "linear-gradient(90deg, rgba(6, 182, 212, 0.7) 0%, rgba(6, 182, 212, 0.1) 100%)"
                      }}
                      animate={{ 
                        opacity: [0.4, 0.8, 0.4],
                        scale: [1, 1.05, 1],
                        background: [
                          "linear-gradient(90deg, rgba(6, 182, 212, 0.7) 0%, rgba(6, 182, 212, 0.1) 100%)",
                          "linear-gradient(90deg, rgba(6, 182, 212, 0.9) 0%, rgba(6, 182, 212, 0.2) 100%)",
                          "linear-gradient(90deg, rgba(6, 182, 212, 0.7) 0%, rgba(6, 182, 212, 0.1) 100%)"
                        ]
                      }}
                      transition={{ duration: 3.2, repeat: Infinity, delay: 1 }}
                    >
                      <motion.div 
                        className="absolute top-0 left-0 h-full w-[30%] bg-cyan-400/80 rounded-full"
                        animate={{ 
                          x: ['0%', '250%', '0%'],
                          opacity: [0.4, 0.8, 0.4]
                        }}
                        transition={{ 
                          duration: 3.2, 
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 1
                        }}
                      />
                    </motion.div>
                    
                    {/* Data particles effect */}
                    {Array.from({ length: 8 }).map((_, i) => (
                      <motion.div
                        key={`particle-${i}`}
                        className="absolute w-1.5 h-1.5 rounded-full bg-blue-300/70"
                        initial={{
                          x: Math.random() * 100 - 50,
                          y: Math.random() * 100 - 50,
                          opacity: 0.3
                        }}
                        animate={{
                          x: Math.random() * 150 - 75,
                          y: Math.random() * 150 - 75,
                          opacity: [0.3, 0.7, 0.3],
                          scale: [0.8, 1.2, 0.8]
                        }}
                        transition={{
                          duration: 3 + Math.random() * 2,
                          repeat: Infinity,
                          delay: i * 0.3
                        }}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-neutral-dark/80 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono">INTERACTIVE BRAIN MODEL</span>
                    <div className="flex space-x-2">
                      <Button size="icon" variant="secondary" className="p-1 rounded">
                        <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </Button>
                      <Button size="icon" variant="secondary" className="p-1 rounded">
                        <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                        </svg>
                      </Button>
                      <Button size="icon" variant="secondary" className="p-1 rounded">
                        <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </HolographicCard>
          </motion.div>
        </div>
      </section>
      
      {/* Neurofeedback Highlight Section */}
      <section className="mb-12 relative">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-3xl -z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        />
        
        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <motion.div 
              className="md:w-1/2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                Live Neurofeedback Simulation
              </h2>
              <p className="text-lg mb-4 opacity-90">
                Experience our revolutionary real-time brain visualization technology that maps cognitive test responses to neural activity patterns.
              </p>
              <ul className="space-y-2 mb-5">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                  <span>Dynamic 3D visualization of brain region activations</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                  <span>Real-time response through WebSocket technology</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                  <span>Interactive controls for brain exploration</span>
                </li>
              </ul>
              <Link href="/neurofeedback">
                <Button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-medium transition-colors">
                  Try Neurofeedback Demo
                </Button>
              </Link>
            </motion.div>
            
            <motion.div 
              className="md:w-1/2 h-48 sm:h-64 md:h-80"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative w-full h-full rounded-2xl overflow-hidden border border-blue-500/30">
                <div className="absolute inset-0 bg-black/60"></div>
                
                {/* Simulated Neurofeedback Visual */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-32 h-32 md:w-48 md:h-48">
                    {/* EEG-like wave animation */}
                    <motion.div 
                      className="absolute top-1/2 left-0 right-0 h-0.5 bg-blue-500"
                      style={{
                        background: "linear-gradient(90deg, rgba(59,130,246,0) 0%, rgba(59,130,246,1) 50%, rgba(59,130,246,0) 100%)"
                      }}
                    >
                      <motion.div 
                        className="absolute inset-0"
                        animate={{
                          scaleY: [1, 3, 0.5, 2, 1],
                        }}
                        transition={{ 
                          duration: 3, 
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                    </motion.div>
                    
                    {/* Pulsing brain regions */}
                    <motion.div 
                      className="absolute left-[30%] top-[20%] w-5 h-5 bg-blue-500/70 rounded-full"
                      animate={{ 
                        scale: [1, 1.5, 1],
                        boxShadow: [
                          "0 0 10px rgba(59,130,246,0.5)",
                          "0 0 20px rgba(59,130,246,0.8)",
                          "0 0 10px rgba(59,130,246,0.5)"
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <motion.div 
                      className="absolute left-[60%] top-[25%] w-4 h-4 bg-purple-500/70 rounded-full"
                      animate={{ 
                        scale: [1, 1.4, 1],
                        boxShadow: [
                          "0 0 10px rgba(168,85,247,0.5)",
                          "0 0 20px rgba(168,85,247,0.8)",
                          "0 0 10px rgba(168,85,247,0.5)"
                        ]
                      }}
                      transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
                    />
                    <motion.div 
                      className="absolute left-[45%] top-[50%] w-6 h-6 bg-cyan-500/70 rounded-full"
                      animate={{ 
                        scale: [1, 1.3, 1],
                        boxShadow: [
                          "0 0 10px rgba(20,184,166,0.5)",
                          "0 0 20px rgba(20,184,166,0.8)",
                          "0 0 10px rgba(20,184,166,0.5)"
                        ]
                      }}
                      transition={{ duration: 2.8, repeat: Infinity, delay: 1 }}
                    />
                    
                    {/* Neural connections */}
                    <motion.div 
                      className="absolute left-[33%] top-[23%] w-[35%] h-0.5 bg-blue-500/50 rotate-[40deg] origin-left"
                      animate={{ 
                        opacity: [0.3, 0.7, 0.3],
                        background: [
                          "linear-gradient(90deg, rgba(59,130,246,0.3) 0%, rgba(59,130,246,0.01) 100%)",
                          "linear-gradient(90deg, rgba(59,130,246,0.7) 0%, rgba(59,130,246,0.01) 100%)",
                          "linear-gradient(90deg, rgba(59,130,246,0.3) 0%, rgba(59,130,246,0.01) 100%)"
                        ]
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                    <motion.div 
                      className="absolute left-[48%] top-[50%] w-[25%] h-0.5 bg-purple-500/50 rotate-[20deg] origin-left"
                      animate={{ 
                        opacity: [0.3, 0.6, 0.3],
                        background: [
                          "linear-gradient(90deg, rgba(168,85,247,0.3) 0%, rgba(168,85,247,0.01) 100%)",
                          "linear-gradient(90deg, rgba(168,85,247,0.6) 0%, rgba(168,85,247,0.01) 100%)",
                          "linear-gradient(90deg, rgba(168,85,247,0.3) 0%, rgba(168,85,247,0.01) 100%)"
                        ]
                      }}
                      transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
                    />
                  </div>
                </div>
                
                <div className="absolute bottom-3 left-3 right-3 p-2 rounded bg-black/70 text-xs font-mono tracking-wide text-blue-300 border border-blue-500/30">
                  NeuroFeedback To Bharadwaj Mainframe Database : MONITORING ACTIVE - CMT
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Framework Overview Section */}
      <section id="frameworks" className="mb-12">
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-display text-3xl font-bold mb-2">Advance Bharadwaj Framework MAINFRAME</h2>
            <p className="opacity-70">Explore the multi-dimensional architectures for cognitive analysis and therapy</p>
          </motion.div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredFrameworks.map((framework, index) => (
            <FrameworkCard key={framework.id} framework={framework} index={index} />
          ))}
        </div>
        
        <div className="mt-6 text-center">
          <Link href="/frameworks">
            <Button variant="outline" className="px-6 py-3 border-primary/50 hover:border-primary rounded-xl font-medium transition-colors inline-flex items-center gap-2">
              View All Frameworks
              <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
