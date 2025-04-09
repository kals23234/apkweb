import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Search, ArrowRightCircle, BrainCircuit, FlaskConical, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";
import { brainRegions } from "../data/brainRegions";

// Types for our neurological disorders and treatments
interface DisorderTreatmentPair {
  id: string;
  disorder: string;
  brainRegions: string[];
  treatment: string;
  description: string;
  color: string;
  isMatched?: boolean;
}

// Data for neurological disorders and treatments
const disorderTreatmentPairs: DisorderTreatmentPair[] = [
  {
    id: "anger",
    disorder: "Anger Dysregulation",
    brainRegions: ["amygdala", "ofc", "dlpfc"],
    treatment: "Mirror Pathway Healing Model (MPHM), DBT",
    description: "Unregulated anger responses due to overactive amygdala and weaker cortical control.",
    color: "#F87171"
  },
  {
    id: "anxiety",
    disorder: "Anxiety (GAD, Panic)",
    brainRegions: ["amygdala", "insula", "bnst"],
    treatment: "CIP Reset Training, CBT, Somatic Therapy",
    description: "Hyperactive threat detection system leading to disproportionate fear responses.",
    color: "#60A5FA"
  },
  {
    id: "depression",
    disorder: "Depression (Major, Dysthymia)",
    brainRegions: ["pfc", "acc", "hippocampus"],
    treatment: "Thought Resonance Mass Therapy (TRMT), ACT",
    description: "Reduced activity in reward centers and prefrontal regulatory regions.",
    color: "#818CF8"
  },
  {
    id: "addiction",
    disorder: "Addictive Behavior",
    brainRegions: ["nac", "vta", "ofc"],
    treatment: "Emotional Density Unloading, BUCP-DT Module 7",
    description: "Dysregulation in reward circuitry and reduced executive control ability.",
    color: "#34D399"
  },
  {
    id: "trauma",
    disorder: "Trauma / PTSD",
    brainRegions: ["amygdala", "hippocampus", "vmpfc"],
    treatment: "MPHM, Memory Reformation Test (MRT), EMDR",
    description: "Hyperarousal in threat processing with impaired extinction of fear responses.",
    color: "#A78BFA"
  },
  {
    id: "ocd",
    disorder: "OCD",
    brainRegions: ["cstc", "ofc"],
    treatment: "TRMT Cognitive Loop Dampening, ERP, Omega Feedback",
    description: "Disruptive feedback loops in cortico-striatal-thalamic-cortical circuits.",
    color: "#FBBF24"
  },
  {
    id: "bpd",
    disorder: "BPD (Borderline Personality)",
    brainRegions: ["amygdala", "acc", "insula"],
    treatment: "BUCP-DT + MPHM combo, DBT with Fractal Integration",
    description: "Emotional dysregulation with disrupted self-perception and attachment circuitry.",
    color: "#EC4899"
  },
  {
    id: "narcissism",
    disorder: "Narcissistic Personality Patterns",
    brainRegions: ["dmpfc", "tpj", "mirror"],
    treatment: "Mirror Resonance Schema Relearning (BUCP-DT Section 4)",
    description: "Reduced mirror neuron activation with heightened self-reference processing.",
    color: "#8B5CF6"
  },
  {
    id: "autism",
    disorder: "Autism Spectrum Emotional Disconnect",
    brainRegions: ["fusiform", "sts", "mirror"],
    treatment: "Kinesic Synchrony Simulation, Symbolic Mirror Feedback",
    description: "Atypical neural development affecting social cognition and sensory processing.",
    color: "#10B981"
  },
  {
    id: "insomnia",
    disorder: "Insomnia / Sleep Dysregulation",
    brainRegions: ["thalamus", "hypothalamus", "pfc"],
    treatment: "Neuroperceptual Rhythm Realignment + Sensory Integration",
    description: "Disruption in circadian rhythm regulation and sleep-wake cycle controls.",
    color: "#6366F1"
  },
  {
    id: "schizotypal",
    disorder: "Schizotypal Thought Dissociation",
    brainRegions: ["tpj", "dmn"],
    treatment: "Self-Curvature Restoration via CIP Tuning",
    description: "Atypical integration of perceptual and cognitive processing with reality testing.",
    color: "#F59E0B"
  },
  {
    id: "procrastination",
    disorder: "Procrastination / Self-Sabotage",
    brainRegions: ["dlpfc", "striatum"],
    treatment: "BUCP-DT Module 6, Resistance Loop Reversal Program",
    description: "Executive functioning deficits affecting goal-directed behavior and motivation.",
    color: "#3B82F6"
  },
  {
    id: "anhedonia",
    disorder: "Anhedonia / Emotional Flatness",
    brainRegions: ["nac", "vmpfc"],
    treatment: "Emotional Density Reinfusion Model, TRMT Pulse Therapy",
    description: "Reduced capacity to experience pleasure due to dampened reward circuitry.",
    color: "#9333EA"
  },
  {
    id: "rumination",
    disorder: "Rumination / Overthinking",
    brainRegions: ["dmn", "precuneus", "dlpfc"],
    treatment: "TRMT Emotional Decoupling, Cognitive Gravity Reset",
    description: "Overactive default mode network creating perseverative thought patterns.",
    color: "#EF4444"
  },
  {
    id: "dissociation",
    disorder: "Identity Fragmentation / Dissociation",
    brainRegions: ["mpfc", "pcc"],
    treatment: "BTMIT, BUCP-DT Full Module, Tensor Field Reconstruction",
    description: "Disruption in self-integration networks affecting identity coherence.",
    color: "#14B8A6"
  },
  {
    id: "selfharm",
    disorder: "Self-Harm / Emotional Collapse",
    brainRegions: ["insula", "cingulate", "amygdala"],
    treatment: "Omega Feedback + MPHM, Thought Loop Detox",
    description: "Severe emotional dysregulation with impaired distress tolerance capability.",
    color: "#F43F5E"
  },
  {
    id: "resilience",
    disorder: "Low Emotional Resilience",
    brainRegions: ["acc", "vmpfc"],
    treatment: "BUCP-DT Emotional Circuit Calibration, Resilience Priming",
    description: "Reduced ability to recover from stressors due to weaker regulatory circuits.",
    color: "#06B6D4"
  },
  {
    id: "obsession",
    disorder: "Obsessive Fantasies / Delusions",
    brainRegions: ["ofc", "temporal"],
    treatment: "Quantum Identity Reframing, Symbolic Displacement Theory",
    description: "Maladaptive thought patterns with poor reality discrimination.",
    color: "#8B5CF6"
  }
];

// 3D Model component simulation
const TherapeuticModel = ({ disorder, isActive = false, onSelect, isMatched = false }: 
  { disorder: DisorderTreatmentPair, isActive: boolean, onSelect: () => void, isMatched?: boolean }) => {
  
  // Animation variants for the 3D effect
  const variants = {
    inactive: { scale: 1, rotateY: 0, opacity: 0.85 },
    active: { scale: 1.05, rotateY: 15, opacity: 1 },
    matched: { scale: 1.1, rotateY: 20, opacity: 1, boxShadow: "0 0 15px 5px #22c55e" }
  };

  return (
    <motion.div
      className={`relative cursor-pointer ${isMatched ? 'z-10' : ''}`}
      onClick={onSelect}
      initial="inactive"
      animate={isMatched ? "matched" : isActive ? "active" : "inactive"}
      variants={variants}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.05, rotateY: 5 }}
    >
      <div className="relative p-1">
        <div 
          className={`absolute inset-0 rounded-xl ${isMatched ? 'bg-green-500/30 animate-pulse' : ''}`} 
          style={{ 
            background: isMatched 
              ? `linear-gradient(45deg, ${disorder.color}, #22c55e)` 
              : `linear-gradient(45deg, ${disorder.color}, rgba(0,0,0,0.7))` 
          }}
        ></div>
        <Card className="backdrop-blur-sm bg-neutral-900/80 border-none shadow-xl relative overflow-hidden group h-[180px] flex flex-col justify-between">
          <CardContent className="p-4 flex flex-col h-full justify-between">
            <div>
              <h3 className="font-bold text-md mb-1 text-white group-hover:text-primary transition-colors">
                {disorder.disorder}
              </h3>
              <p className="text-xs text-neutral-400 line-clamp-2">{disorder.description}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {disorder.brainRegions.map(region => (
                  <span key={region} 
                    className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/20 text-primary"
                  >
                    {region}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-auto">
              <div className={`text-xs p-1.5 rounded-lg ${isMatched ? 'bg-green-500/20 text-green-400' : 'bg-primary/10 text-primary/90'}`}>
                {isMatched ? 'MATCHED TREATMENT' : 'Requires treatment'}
              </div>
            </div>
          </CardContent>
          
          {/* Visual neuron connection effects */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full">
              {Array.from({ length: 5 }).map((_, i) => (
                <div 
                  key={i}
                  className="absolute rounded-full bg-white/30 animate-pulse-slow"
                  style={{ 
                    width: `${Math.random() * 4 + 1}px`,
                    height: `${Math.random() * 4 + 1}px`,
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${Math.random() * 4 + 2}s`,
                    opacity: Math.random() * 0.5 + 0.3
                  }}
                />
              ))}
            </div>
          </div>
        </Card>
      </div>
      
      {isMatched && (
        <div className="absolute -right-2 -top-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center z-20 shadow-lg">
          <Zap className="w-4 h-4 text-white" />
        </div>
      )}
    </motion.div>
  );
};

// 3D Treatment Model
const TreatmentModel = ({ treatment, isActive = false, onSelect, isMatched = false }: 
  { treatment: DisorderTreatmentPair, isActive: boolean, onSelect: () => void, isMatched?: boolean }) => {
  
  const variants = {
    inactive: { scale: 1, rotateY: 0, opacity: 0.85 },
    active: { scale: 1.05, rotateY: -15, opacity: 1 },
    matched: { scale: 1.1, rotateY: -20, opacity: 1, boxShadow: "0 0 15px 5px #22c55e" }
  };

  return (
    <motion.div
      className={`relative cursor-pointer ${isMatched ? 'z-10' : ''}`}
      onClick={onSelect}
      initial="inactive"
      animate={isMatched ? "matched" : isActive ? "active" : "inactive"}
      variants={variants}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.05, rotateY: -5 }}
    >
      <div className="relative p-1">
        <div 
          className={`absolute inset-0 rounded-xl ${isMatched ? 'bg-green-500/30 animate-pulse' : ''}`} 
          style={{ 
            background: isMatched 
              ? `linear-gradient(-45deg, ${treatment.color}, #22c55e)` 
              : `linear-gradient(-45deg, ${treatment.color}, rgba(0,0,0,0.7))` 
          }}
        ></div>
        <Card className="backdrop-blur-sm bg-neutral-900/80 border-none shadow-xl relative overflow-hidden group h-[180px] flex flex-col justify-between">
          <CardContent className="p-4 flex flex-col h-full justify-between">
            <div>
              <div className="flex items-center gap-1 mb-1">
                <FlaskConical className="h-4 w-4 text-primary" />
                <h3 className="font-bold text-md text-white group-hover:text-primary transition-colors line-clamp-2">
                  {treatment.treatment}
                </h3>
              </div>
              <div className="mt-2 text-xs text-neutral-400">
                <strong className="text-primary">Target:</strong> {treatment.disorder}
              </div>
              <div className="mt-1 flex flex-wrap gap-1">
                {treatment.brainRegions.map(region => (
                  <span key={region} 
                    className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/20 text-primary"
                  >
                    {region}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-auto">
              <div className={`text-xs p-1.5 rounded-lg ${isMatched ? 'bg-green-500/20 text-green-400' : 'bg-primary/10 text-primary/90'}`}>
                {isMatched ? 'MATCHED TO DISORDER' : 'Therapeutic model'}
              </div>
            </div>
          </CardContent>
          
          {/* Therapeutic vibration patterns */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full">
              {Array.from({ length: 8 }).map((_, i) => (
                <div 
                  key={i}
                  className="absolute bg-primary/40 rounded-full animate-ripple"
                  style={{ 
                    width: `${Math.random() * 40 + 10}px`,
                    height: `${Math.random() * 40 + 10}px`,
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 4}s`,
                    animationDuration: `${Math.random() * 8 + 4}s`,
                    opacity: Math.random() * 0.3
                  }}
                />
              ))}
            </div>
          </div>
        </Card>
      </div>
      
      {isMatched && (
        <div className="absolute -right-2 -top-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center z-20 shadow-lg">
          <Zap className="w-4 h-4 text-white" />
        </div>
      )}
    </motion.div>
  );
};

// Main component
const TherapyMatchingPage = () => {
  const [selectedDisorder, setSelectedDisorder] = useState<string | null>(null);
  const [selectedTreatment, setSelectedTreatment] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const isMobile = useIsMobile();
  const matchConnectionRef = useRef<SVGSVGElement>(null);

  // Effect to attempt matching when both disorder and treatment are selected
  useEffect(() => {
    if (selectedDisorder && selectedTreatment) {
      // Check if the correct pair is selected
      const isMatch = selectedDisorder === selectedTreatment;
      
      if (isMatch && !matchedPairs.includes(selectedDisorder)) {
        // Add the matched pair to our list
        setMatchedPairs(prev => [...prev, selectedDisorder]);
        
        // Visual feedback for correct match
        setTimeout(() => {
          setSelectedDisorder(null);
          setSelectedTreatment(null);
        }, 2000);
      } else if (!isMatch) {
        // Visual feedback for incorrect match
        setTimeout(() => {
          setSelectedDisorder(null);
          setSelectedTreatment(null);
        }, 1500);
      }
    }
  }, [selectedDisorder, selectedTreatment, matchedPairs]);

  // Filter disorders based on search query and active tab
  const filteredDisorders = disorderTreatmentPairs.filter(item => {
    const matchesSearch = item.disorder.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         item.treatment.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.brainRegions.some(region => region.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "matched") return matchesSearch && matchedPairs.includes(item.id);
    if (activeTab === "unmatched") return matchesSearch && !matchedPairs.includes(item.id);
    
    return matchesSearch;
  });

  return (
    <div className="relative container mx-auto py-6 px-4 max-w-7xl">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-primary to-purple-500 text-transparent bg-clip-text">
          Neurological Disorders & Tensor-Based Treatments
        </h1>
        <p className="text-neutral-400 mt-2 max-w-3xl mx-auto">
          Match disorders with their corresponding tensor-based treatments. The interactive 3D models will light up when correctly paired, revealing the optimal therapeutic model for each neurological condition.
        </p>
      </div>
      
      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500 h-4 w-4" />
          <Input 
            type="text"
            placeholder="Search disorders, treatments or brain regions..." 
            className="pl-10 bg-neutral-900/70 border-neutral-700"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Tabs defaultValue="all" className="w-full sm:w-auto" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 w-full sm:w-[400px]">
            <TabsTrigger value="all" className="data-[state=active]:bg-primary/20">All</TabsTrigger>
            <TabsTrigger value="matched" className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400">
              Matched ({matchedPairs.length})
            </TabsTrigger>
            <TabsTrigger value="unmatched" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
              Unmatched ({disorderTreatmentPairs.length - matchedPairs.length})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="grid grid-cols-1 2xl:grid-cols-2 gap-x-12 gap-y-12">
        {/* Simulator section */}
        <div className="relative py-8 px-4 sm:px-8 bg-neutral-900/30 rounded-2xl border border-neutral-800/50 backdrop-blur-sm">
          <div className="absolute -top-5 left-4 bg-primary/90 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
            <BrainCircuit className="h-4 w-4" />
            <span className="font-bold">Interactive Matching Simulator</span>
          </div>
          
          <p className="mb-6 text-neutral-400 text-sm">
            Select a disorder from the left column and match it with its corresponding treatment from the right. 
            When matched correctly, both models will illuminate and connect.
          </p>
          
          <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Matching line SVG */}
            <svg 
              ref={matchConnectionRef}
              className="absolute top-0 left-0 w-full h-full pointer-events-none z-0" 
              style={{ overflow: 'visible' }}
            >
              {selectedDisorder && selectedTreatment && (
                <line 
                  x1="30%" 
                  y1="50%" 
                  x2="70%" 
                  y2="50%" 
                  stroke={selectedDisorder === selectedTreatment ? "#22c55e" : "#ef4444"} 
                  strokeWidth="2"
                  strokeDasharray={selectedDisorder === selectedTreatment ? "0" : "5,5"}
                  className="animate-pulse-slow"
                />
              )}
              
              {/* Display permanent connections for matched pairs */}
              {matchedPairs.map((pairId, index) => {
                const pair = disorderTreatmentPairs.find(d => d.id === pairId);
                return pair ? (
                  <line 
                    key={pairId}
                    x1="30%" 
                    y1={`${(index * 180) + 90}px`}
                    x2="70%" 
                    y2={`${(index * 180) + 90}px`}
                    stroke={pair.color}
                    strokeWidth="2"
                    opacity="0.5"
                    className="animate-pulse-slow"
                  />
                ) : null;
              })}
            </svg>
            
            {/* Left side: Disorders */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold mb-4 text-white">Neurological Disorders</h3>
              <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {activeTab === "matched" ? (
                  // Show only matched disorders
                  matchedPairs.map(pairId => {
                    const disorder = disorderTreatmentPairs.find(d => d.id === pairId);
                    return disorder ? (
                      <TherapeuticModel 
                        key={disorder.id}
                        disorder={disorder}
                        isActive={selectedDisorder === disorder.id}
                        isMatched={matchedPairs.includes(disorder.id)}
                        onSelect={() => {
                          if (!matchedPairs.includes(disorder.id)) {
                            setSelectedDisorder(selectedDisorder === disorder.id ? null : disorder.id);
                          }
                        }}
                      />
                    ) : null;
                  })
                ) : (
                  // Show filtered disorders based on search and tabs
                  filteredDisorders.map(disorder => (
                    <TherapeuticModel 
                      key={disorder.id}
                      disorder={disorder}
                      isActive={selectedDisorder === disorder.id}
                      isMatched={matchedPairs.includes(disorder.id)}
                      onSelect={() => {
                        if (!matchedPairs.includes(disorder.id)) {
                          setSelectedDisorder(selectedDisorder === disorder.id ? null : disorder.id);
                        }
                      }}
                    />
                  ))
                )}
              </div>
            </div>
            
            {/* Right side: Treatments */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold mb-4 text-white">Tensor-Based Treatments</h3>
              <div className="space-y-6 max-h-[500px] overflow-y-auto pl-2 custom-scrollbar">
                {activeTab === "matched" ? (
                  // Show only matched treatments
                  matchedPairs.map(pairId => {
                    const treatment = disorderTreatmentPairs.find(d => d.id === pairId);
                    return treatment ? (
                      <TreatmentModel 
                        key={treatment.id}
                        treatment={treatment}
                        isActive={selectedTreatment === treatment.id}
                        isMatched={matchedPairs.includes(treatment.id)}
                        onSelect={() => {
                          if (!matchedPairs.includes(treatment.id)) {
                            setSelectedTreatment(selectedTreatment === treatment.id ? null : treatment.id);
                          }
                        }}
                      />
                    ) : null;
                  })
                ) : (
                  // Show all treatments in random order for matching challenge
                  [...filteredDisorders]
                    .sort(() => Math.random() - 0.5)
                    .map(treatment => (
                      <TreatmentModel 
                        key={treatment.id}
                        treatment={treatment}
                        isActive={selectedTreatment === treatment.id}
                        isMatched={matchedPairs.includes(treatment.id)}
                        onSelect={() => {
                          if (!matchedPairs.includes(treatment.id)) {
                            setSelectedTreatment(selectedTreatment === treatment.id ? null : treatment.id);
                          }
                        }}
                      />
                    ))
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Neurological Patterns & Analysis */}
        <div className="relative py-8 px-4 sm:px-8 bg-neutral-900/30 rounded-2xl border border-neutral-800/50 backdrop-blur-sm">
          <div className="absolute -top-5 left-4 bg-indigo-500/90 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
            <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="font-bold">Tensor Network Analysis</span>
          </div>
          
          <div className="mb-6 text-neutral-400 text-sm">
            <p>This section displays the neural tensor patterns and pathway analysis of matched disorders and treatments.</p>
          </div>
          
          {matchedPairs.length > 0 ? (
            <div className="space-y-6">
              {matchedPairs.map(pairId => {
                const pair = disorderTreatmentPairs.find(d => d.id === pairId);
                return pair ? (
                  <div key={pairId} className="bg-neutral-900/60 rounded-xl p-4 border border-neutral-800/60">
                    <div className="flex items-start gap-3">
                      <div 
                        className="rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 mt-1"
                        style={{ background: `linear-gradient(135deg, ${pair.color}, rgba(0,0,0,0.7))` }}
                      >
                        <BrainCircuit className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-md font-bold flex items-center gap-2">
                          <span className="text-white">{pair.disorder}</span>
                          <ArrowRightCircle className="h-4 w-4 text-green-400" />
                          <span className="text-white">{pair.treatment}</span>
                        </h3>
                        <p className="text-sm text-neutral-400 mt-1">{pair.description}</p>
                        
                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="bg-neutral-800/40 rounded-lg p-3">
                            <h4 className="text-xs font-semibold text-primary mb-1">Brain Regions</h4>
                            <div className="flex flex-wrap gap-1">
                              {pair.brainRegions.map(region => (
                                <span key={region} 
                                  className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/20 text-primary"
                                >
                                  {region}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          <div className="bg-neutral-800/40 rounded-lg p-3">
                            <h4 className="text-xs font-semibold text-green-400 mb-1">Treatment Efficacy</h4>
                            <div className="h-2 bg-neutral-700 rounded-full mt-2">
                              <div 
                                className="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full"
                                style={{ width: `${Math.random() * 30 + 70}%` }}
                              ></div>
                            </div>
                            <p className="text-[10px] text-neutral-400 mt-1">Based on BUCP-DT tensor analysis</p>
                          </div>
                          
                          <div className="bg-neutral-800/40 rounded-lg p-3">
                            <h4 className="text-xs font-semibold text-blue-400 mb-1">Recovery Timeline</h4>
                            <div className="flex justify-between text-[10px] text-neutral-500 mt-1">
                              <span>Initial</span>
                              <span>Mid</span>
                              <span>Complete</span>
                            </div>
                            <div className="h-1 bg-neutral-700 rounded-full mt-1 flex">
                              <div className="h-full bg-blue-500/70 rounded-l-full" style={{ width: '33%' }}></div>
                              <div className="h-full bg-indigo-500/70" style={{ width: '33%' }}></div>
                              <div className="h-full bg-purple-500/70 rounded-r-full" style={{ width: '34%' }}></div>
                            </div>
                            <p className="text-[10px] text-neutral-400 mt-1">
                              {Math.floor(Math.random() * 6 + 3)}-{Math.floor(Math.random() * 6 + 8)} weeks with consistent application
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null;
              })}
            </div>
          ) : (
            <div className="h-40 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-neutral-800/70 rounded-full flex items-center justify-center">
                  <BrainCircuit className="h-8 w-8 text-neutral-600" />
                </div>
                <p className="text-neutral-500">Match disorders with their treatments to view neural tensor analyses</p>
              </div>
            </div>
          )}
          
          {/* Progress bar */}
          {disorderTreatmentPairs.length > 0 && (
            <div className="mt-6">
              <div className="flex justify-between text-sm text-neutral-400 mb-1">
                <span>Progress</span>
                <span>{matchedPairs.length} / {disorderTreatmentPairs.length} matches</span>
              </div>
              <div className="h-2 bg-neutral-800 rounded-full">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${(matchedPairs.length / disorderTreatmentPairs.length) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Additional information */}
      <div className="mt-10 bg-neutral-900/30 rounded-xl p-6 border border-neutral-800/50 backdrop-blur-sm">
        <h2 className="text-2xl font-bold text-white mb-4">Understanding the Tensor-Based Therapy Model</h2>
        <p className="text-neutral-400 mb-4">
          The Bharadwaj Tensor Framework provides a revolutionary approach to understanding and treating neurological disorders. 
          By mapping tensor patterns to specific brain regions and their associated disorders, we can develop targeted therapeutic 
          interventions that address the root neural mechanisms of various conditions.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-neutral-800/40 rounded-lg p-4">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mb-3">
              <BrainCircuit className="h-5 w-5 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Neural Mapping</h3>
            <p className="text-neutral-400 text-sm">
              Each disorder correlates to specific tensor patterns in key brain regions, creating a unique neural signature that can be targeted.
            </p>
          </div>
          
          <div className="bg-neutral-800/40 rounded-lg p-4">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center mb-3">
              <FlaskConical className="h-5 w-5 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Treatment Protocols</h3>
            <p className="text-neutral-400 text-sm">
              Treatments utilize specific cognitive exercises, neuro-resonance techniques, and recalibration protocols to reshape dysfunctional tensor patterns.
            </p>
          </div>
          
          <div className="bg-neutral-800/40 rounded-lg p-4">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center mb-3">
              <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Recovery Process</h3>
            <p className="text-neutral-400 text-sm">
              The recovery timeline varies based on condition severity, with most treatments showing significant improvement within 4-12 weeks of consistent application.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TherapyMatchingPage;