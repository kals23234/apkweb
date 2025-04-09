export interface Framework {
  id: string;
  name: string;
  description: string;
  focus: string;
  tags: string[];
  tests: string[];
  coreElements?: {
    name: string;
    description: string;
    icon: string; // Changed to string from React.ReactNode
  }[];
  brainRegions?: string[];
}

export const frameworks: Framework[] = [
  {
    id: "bucp-dt",
    name: "BUCP-DT Framework",
    description: "Bharadwaj Unified Cognitive & Personality Dissection Test Framework for identity splitting and emotional loop architecture.",
    focus: "19-20 Test Sections",
    tags: ["Identity Splitting", "Emotional Loops"],
    tests: ["BUCP-DT", "BUCP-DT-X", "SIPT", "MRT", "ICRT"],
    coreElements: [
      {
        name: "Emotional Tensor Triggers",
        description: "Activates specific emotional response patterns to map tensor fields",
        icon: "Zap"
      },
      {
        name: "Loop Curvature Mapping",
        description: "Visualizes how thought patterns bend under emotional gravity",
        icon: "Shield"
      },
      {
        name: "Neuro-receptor Targeting",
        description: "Specifically activates dopamine, serotonin and GABA receptors",
        icon: "Brain"
      },
      {
        name: "Response-tensor Triangulation",
        description: "Maps cognitive responses to create multi-dimensional tensors",
        icon: "Sigma"
      }
    ],
    brainRegions: ["Prefrontal Cortex", "Anterior Cingulate", "Amygdala", "Basal Ganglia"]
  },
  {
    id: "mphm",
    name: "MPHM",
    description: "Mirror Pathway Healing Model focusing on mirror trauma loops, inherited reflection damage, and silent memory repair.",
    focus: "Reflection-Based",
    tags: ["Mirror Trauma", "Reflection Damage"],
    tests: ["MPHM-Core", "SIPT", "Reflection Resonance Test"],
    coreElements: [
      {
        name: "Mirror Neuron Activation",
        description: "Activates reflection-based neural circuits to map trauma patterns",
        icon: "Layers"
      },
      {
        name: "Trauma Echo Detection",
        description: "Identifies repeated emotional patterns from mirrored experiences",
        icon: "Repeat"
      },
      {
        name: "Reflection Override",
        description: "Methods to disengage from externally-reinforced identity loops",
        icon: "Shield"
      }
    ],
    brainRegions: ["Insular Cortex", "Mirror Neuron System", "Amygdala", "Ventromedial PFC"]
  },
  {
    id: "emotional-loop",
    name: "Emotional Loop Disruption Matrix",
    description: "Identifies and breaks cognitive-emotional feedback loops through measured anchor points, repetition frequency, and resistance.",
    focus: "Resistance Focused",
    tags: ["Loop Breaking", "Repeat Patterns"],
    tests: ["QEF", "QCFL", "EEQF", "Loop Resistance Test", "RCI"],
    coreElements: [
      {
        name: "Loop Frequency Measurement",
        description: "Quantifies how often emotional patterns repeat in different contexts",
        icon: "Repeat"
      },
      {
        name: "Anchor Point Identification",
        description: "Locates the triggering events that initiate emotional loops",
        icon: "Sigma"
      },
      {
        name: "Resistance Calculation",
        description: "Measures how strongly loops resist interruption or modification",
        icon: "Shield"
      }
    ],
    brainRegions: ["Basal Ganglia", "Cerebellum", "ACC", "Nucleus Accumbens"]
  },
  {
    id: "alien-cognition",
    name: "Alien Cognition Framework",
    description: "Simulates consciousness beyond human neural defaults with non-linear, non-symbolic, frequency-based, and shape-based cognition.",
    focus: "Consciousness Simulation",
    tags: ["Non-Linear", "Shape Cognition"],
    tests: ["ACT", "EEAC", "SIPEX", "ARC", "NDTX"],
    coreElements: [
      {
        name: "Non-symbolic Processing",
        description: "Thought without words, symbols, or language containers",
        icon: "AlertCircle"
      },
      {
        name: "Shape-based Logic",
        description: "Patterns that form meaning through form rather than language",
        icon: "Layers"
      },
      {
        name: "Observer-free Processing",
        description: "Cognition without first-person reference or central self",
        icon: "Network"
      }
    ],
    brainRegions: ["Thalamus", "Parietal Cortex", "DMN", "Visual Cortex"]
  },
  {
    id: "trmt",
    name: "Thought Resonance Mass Theory",
    description: "Proves thoughts gain emotional mass over time, measuring thought density, emotional inertia, and identity curvature.",
    focus: "Emotional Weight Mapping",
    tags: ["Thought Mass", "Emotional Inertia"],
    tests: ["TRMT", "MRT", "MRT-2"],
    brainRegions: ["Amygdala", "Hippocampus", "Temporal Pole", "OFC"]
  },
  {
    id: "shiva-cortex",
    name: "Shiva Cortex Framework",
    description: "Enables total collapse and rebirth of identity through non-dual observer state, allowing rebirth from cognitive zero.",
    focus: "Identity Collapse & Rebirth",
    tags: ["Observer State", "Identity Rebirth"],
    tests: ["QTR", "SPN", "Shiva Collapse Trigger", "Observer Tensor Alignment"],
    brainRegions: ["Default Mode Network", "PFC", "ACC", "Insular Cortex"]
  },
  {
    id: "neuroplasticity",
    name: "Neuroplasticity Framework",
    description: "Models adaptive transformation of thought loops and emotional patterns through neuron flexibility and attachment shifts.",
    focus: "Neural Rewiring",
    tags: ["Flexibility", "Emotional Rerouting"],
    tests: ["NP-QS", "NP-ER", "Neural Drift Calibration Test", "Quantum Reintegration Matrix"],
    brainRegions: ["Hippocampus", "PFC", "Basal Ganglia", "ACC"]
  },
  {
    id: "mirror-echo",
    name: "Mirror Echo Framework",
    description: "Tests self-image, shame loops, and public perception overlays through cognitive-emotional reflections on identity.",
    focus: "Self-Image Reflection",
    tags: ["Shame Loops", "Self-Perception"],
    tests: ["SIPR", "MSE", "Social Mirror Recalibration Test"],
    brainRegions: ["Mirror Neuron System", "Insular Cortex", "Temporal Pole", "Ventromedial PFC"]
  }
];
