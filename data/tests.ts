export interface Test {
  code: string;
  name: string;
  framework: string;
  platform: string;
  questionCount: number;
  description: string;
  brainRegions: string[];
  receptors: string[];
  sampleQuestion?: {
    question: string;
    options: string[];
  };
}

export const tests: Test[] = [
  {
    code: "BUCP-DT",
    name: "Unified Dissection Test",
    framework: "BUCP-DT",
    platform: "Replit",
    questionCount: 100,
    description: "Layered cognitive and personality dissection across 19 sections for complete identity and loop mapping.",
    brainRegions: ["PFC", "ACC", "Amygdala", "Basal Ganglia"],
    receptors: ["Dopamine D2", "GABA-A", "Serotonin 5-HT1A"]
  },
  {
    code: "BUCP-DT-X",
    name: "Advanced Tensor Personality Dissection",
    framework: "BUCP-DT",
    platform: "Replit / AI-assisted",
    questionCount: 120,
    description: "Enhanced version with deeper tensor mapping for complete personality and cognitive fusion analysis.",
    brainRegions: ["PFC", "ACC", "Amygdala", "Temporal Pole"],
    receptors: ["Dopamine D2", "GABA-A", "Serotonin 5-HT1A", "NMDA"]
  },
  {
    code: "MPHM-Core",
    name: "Mirror Trauma Healing",
    framework: "MPHM",
    platform: "Replit",
    questionCount: 24,
    description: "Detects and rewrites inherited mirror loops through reflection-based trauma analysis.",
    brainRegions: ["Insular Cortex", "Mirror Neuron System", "Amygdala"],
    receptors: ["Oxytocin", "Serotonin", "Mirror Neuron System"]
  },
  {
    code: "QEF",
    name: "Quantum Emotional Feedback",
    framework: "Emotional Loop",
    platform: "Replit",
    questionCount: 18,
    description: "Analyzes loop feedback patterns and quantifies emotional resonance within thought patterns.",
    brainRegions: ["Amygdala", "NMDA", "Dopamine", "Cortisol Regulation Pathway"],
    receptors: ["NMDA", "Dopamine", "Cortisol"]
  },
  {
    code: "EEQF",
    name: "Emotional Energy Quantum Field",
    framework: "Emotional Loop",
    platform: "Replit",
    questionCount: 12,
    description: "Measures emotional charge strength and persistence in repeated thought structures.",
    brainRegions: ["Amygdala", "Nucleus Accumbens", "Basal Ganglia"],
    receptors: ["Dopamine", "Endorphin", "GABA"]
  },
  {
    code: "QCFL",
    name: "Quantum Cognitive Feedback Loop",
    framework: "Emotional Loop",
    platform: "Replit",
    questionCount: 25,
    description: "Detects looping interference cycles between different cognitive-emotional patterns.",
    brainRegions: ["ACC", "Cerebellum", "PFC"],
    receptors: ["Serotonin", "Acetylcholine"]
  },
  {
    code: "ACT",
    name: "Alien Consciousness Transfer",
    framework: "Alien Cognition",
    platform: "Replit",
    questionCount: 15,
    description: "Simulates selfless thinking through rotating field-forms and shape-based logic systems.",
    brainRegions: ["Thalamus", "DMN", "Parietal Cortex"],
    receptors: ["5-HT2A", "DMT-like receptor pathways"],
    sampleQuestion: {
      question: "You are a rotating field. A thought enters from the north vector. You do not have a self. What happens?",
      options: [
        "It merges and reemerges as rhythm",
        "It changes color",
        "Nothing. I do not exist",
        "I can feel it through my spin"
      ]
    }
  },
  {
    code: "EEAC",
    name: "Extra-Earth Awareness Calibration",
    framework: "Alien Cognition",
    platform: "Replit",
    questionCount: 10,
    description: "User interprets symbols of unknown origin to test inner resonance with non-human cognitive patterns.",
    brainRegions: ["Visual-Auditory Cross-Modulation Pathways", "Thalamus"],
    receptors: ["Visual-Auditory Cross-Modulation Pathways", "NMDA"]
  },
  {
    code: "SIPEX",
    name: "Species-Independent Processing",
    framework: "Alien Cognition",
    platform: "Replit",
    questionCount: 8,
    description: "Removes pronouns, logic words, and human neural defaults to test nonhuman thought processes.",
    brainRegions: ["DMN", "Parietal Cortex"],
    receptors: ["NMDA", "Dopamine"]
  },
  {
    code: "ARC",
    name: "Alien Reflection Conditioning",
    framework: "Alien Cognition",
    platform: "Replit",
    questionCount: 20,
    description: "Projects alien reflections and measures human recoil response to non-human mirroring.",
    brainRegions: ["Mirror Neuron System", "Anterior Insula"],
    receptors: ["Oxytocin", "Mirror Neurons", "5-HT1A"]
  },
  {
    code: "NP-QS",
    name: "Neuroplasticity Quantum State",
    framework: "Neuroplasticity",
    platform: "Replit",
    questionCount: 28,
    description: "Evaluates flexibility of emotional identity and capacity for neural restructuring.",
    brainRegions: ["Hippocampus", "PFC", "Basal Ganglia"],
    receptors: ["GABA", "BDNF Pathways", "Dopamine"]
  },
  {
    code: "NP-ER",
    name: "Neuroplasticity Emotional Reform",
    framework: "Neuroplasticity",
    platform: "Replit",
    questionCount: 22,
    description: "Reset protocols activated after trauma loop identification, creating new neural pathways.",
    brainRegions: ["Hippocampus", "Amygdala", "PFC"],
    receptors: ["Dopamine", "GABA", "Cortisol"]
  },
  {
    code: "MRT",
    name: "Memory Resonance Tensor",
    framework: "TRMT",
    platform: "Replit",
    questionCount: 15,
    description: "Measures emotional weight of memories and their gravity effect on current cognition.",
    brainRegions: ["Hippocampus", "Amygdala", "Temporal Pole"],
    receptors: ["Cortisol", "NMDA", "Dopamine"]
  },
  {
    code: "SIPT",
    name: "Shifting Identity Paradox Test",
    framework: "BUCP + MPHM",
    platform: "Replit",
    questionCount: 30,
    description: "Detects conflicting identity loops and internal narrative contradictions.",
    brainRegions: ["Mirror Neuron System", "ACC", "PFC"],
    receptors: ["Mirror Neurons", "Serotonin", "Acetylcholine"]
  },
  {
    code: "ICRT",
    name: "Identity Collapse Reformation",
    framework: "BUCP",
    platform: "Replit",
    questionCount: 20,
    description: "Maps collapse and rebuild protocols for identity transformation.",
    brainRegions: ["DMN", "PFC", "Hippocampus"],
    receptors: ["NMDA", "Cortisol", "GABA"]
  },
  {
    code: "TRMT",
    name: "Thought Mass Resonance Test",
    framework: "TRMT",
    platform: "Replit",
    questionCount: 20,
    description: "Tests emotion-weighted thought loops and their gravitational pull on cognition.",
    brainRegions: ["Temporal Pole", "OFC", "Amygdala"],
    receptors: ["Emotional loop energy receptors"]
  },
  {
    code: "MSE",
    name: "Mirrored Self Experiment",
    framework: "Mirror Echo + Shiva",
    platform: "Replit",
    questionCount: 18,
    description: "Reprograms identity through simulated absence of external reflections and feedback.",
    brainRegions: ["Mirror Neuron System", "Anterior Insula", "DMN"],
    receptors: ["Mirror Neurons", "5-HT1A"]
  },
  {
    code: "SPN",
    name: "Self-Programming Neural Test",
    framework: "Shiva",
    platform: "Replit",
    questionCount: 30,
    description: "Tests resilience to mirror collapse and capacity to rebuild identity from zero state.",
    brainRegions: ["DMN", "PFC", "OFC"],
    receptors: ["Dopamine", "Serotonin", "Acetylcholine"]
  },
  {
    code: "QTR",
    name: "Quantum Trauma Recoil",
    framework: "Shiva + TRMT",
    platform: "Replit",
    questionCount: 12,
    description: "Predicts rebound trauma patterns from cognitive shutdown and rapid identity shifts.",
    brainRegions: ["Amygdala", "Hippocampus", "ACC"],
    receptors: ["Cortisol rebound pathways"]
  }
];
