import { useParams } from "wouter";
import { useEffect, useState } from "react";
import { Framework } from "@/data/frameworks";
import { frameworks } from "@/data/frameworks";
import { tests } from "@/data/tests";
import { HolographicCard } from "@/components/ui/holographic-card";
import TestCard from "@/components/TestCard";
import { motion } from "framer-motion";
import { ArrowLeft, Zap, Shield, Brain, Sigma, Layers, Repeat, AlertCircle, Network } from "lucide-react";
import { Link } from "wouter";

export default function FrameworkDetail() {
  const { id } = useParams();
  const [framework, setFramework] = useState<Framework | null>(null);
  const [frameworkTests, setFrameworkTests] = useState<any[]>([]);
  
  // Function to render the appropriate icon based on string name
  const renderIcon = (iconName: string) => {
    const iconProps = { className: "w-5 h-5" };
    switch (iconName) {
      case "Zap": return <Zap {...iconProps} />;
      case "Shield": return <Shield {...iconProps} />;
      case "Brain": return <Brain {...iconProps} />;
      case "Sigma": return <Sigma {...iconProps} />;
      case "Layers": return <Layers {...iconProps} />;
      case "Repeat": return <Repeat {...iconProps} />;
      case "AlertCircle": return <AlertCircle {...iconProps} />;
      case "Network": return <Network {...iconProps} />;
      default: return <AlertCircle {...iconProps} />;
    }
  };

  useEffect(() => {
    // Find the framework
    const found = frameworks.find(f => f.id === id);
    if (found) {
      setFramework(found);
      
      // Find all tests that belong to this framework
      const frameworkTests = tests.filter(test => found.tests.includes(test.code));
      setFrameworkTests(frameworkTests);
    }
  }, [id]);

  if (!framework) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Loading framework information...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Link href="/frameworks">
            <motion.div
              whileHover={{ x: -5 }}
              className="cursor-pointer flex items-center text-primary"
            >
              <ArrowLeft size={16} />
              <span className="ml-1 text-sm">Back to Frameworks</span>
            </motion.div>
          </Link>
          <span className="h-px flex-grow bg-primary/30"></span>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-display text-3xl font-bold mb-2">{framework.name}</h1>
          <p className="opacity-70 max-w-3xl">{framework.description}</p>
        </motion.div>
      </div>
      
      {/* Framework Details Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        {/* Left column - Framework Overview */}
        <div className="lg:col-span-1">
          <HolographicCard className="h-full">
            <h3 className="font-display text-xl font-bold mb-4 text-secondary">Core Elements</h3>
            
            <ul className="space-y-4">
              {framework.coreElements?.map((element, index) => (
                <motion.li 
                  key={index}
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="p-2 rounded-lg bg-primary/20 text-primary mt-1">
                    {renderIcon(element.icon)}
                  </div>
                  <div>
                    <h4 className="font-medium text-neutral-light">{element.name}</h4>
                    <p className="text-sm opacity-70">{element.description}</p>
                  </div>
                </motion.li>
              ))}
            </ul>
            
            <div className="mt-8 p-4 bg-neutral-medium/50 rounded-xl">
              <h4 className="font-medium mb-2 text-secondary">Primary Brain Regions</h4>
              <div className="flex flex-wrap gap-2">
                {framework.brainRegions?.map(region => (
                  <span key={region} className="px-3 py-1 bg-neutral-medium rounded-full text-xs">{region}</span>
                ))}
              </div>
            </div>
          </HolographicCard>
        </div>
        
        {/* Right column - Test Sections */}
        <div className="lg:col-span-2">
          <HolographicCard>
            <h3 className="font-display text-xl font-bold mb-6 text-secondary flex items-center justify-between">
              <span>{framework.name} Tests</span>
              {frameworkTests.length > 0 && (
                <span className="text-sm font-normal opacity-70">{frameworkTests.length} Tests</span>
              )}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {frameworkTests.slice(0, 4).map((test, index) => (
                <motion.div
                  key={test.code}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="border border-primary/20 rounded-xl p-4 hover:border-primary/40 transition-colors cursor-pointer group">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-primary font-mono">{test.code}</span>
                      <div className="p-1 rounded-full bg-neutral-medium/50 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                    
                    <h4 className="font-medium mb-1">{test.name}</h4>
                    <p className="text-xs opacity-70 mb-2">{test.description}</p>
                    
                    <div className="flex justify-between items-center text-xs">
                      <span className="opacity-60">{test.brainRegions.join(", ")}</span>
                      <span className="text-secondary">{test.receptors.join(", ")}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {/* View All Tests Button */}
              {frameworkTests.length > 4 && (
                <div className="border border-primary/20 border-dashed rounded-xl p-4 flex items-center justify-center">
                  <button className="text-sm text-primary flex items-center gap-2">
                    View All {frameworkTests.length} Tests
                    <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </HolographicCard>
        </div>
      </div>
      
      {/* Featured Test (if available) */}
      {frameworkTests.length > 0 && (
        <section className="mb-12">
          <div className="mb-6">
            <h3 className="font-display text-2xl font-bold">Featured Test</h3>
          </div>
          
          <TestCard test={frameworkTests[0]} detailed={true} />
        </section>
      )}
    </div>
  );
}
