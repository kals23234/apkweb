export interface TestDiscipline {
  field: string;
  influence: string;
  relatedTests?: string[];
  color?: string;
  icon?: string;
}

export const testDisciplines: TestDiscipline[] = [
  {
    field: "Cognitive Physics",
    influence: "Curvature, Loop Gravity, Thought Field Equations (used in TRMT, BUCP-DT, QEF)",
    relatedTests: ["TRMT", "BUCP-DT", "QEF"],
    color: "#6366f1",
    icon: "atom"
  },
  {
    field: "Neurobiology",
    influence: "Region-specific diagnostics (Amygdala, ACC, Insula, etc.) across all tests",
    relatedTests: ["ALL"],
    color: "#ec4899",
    icon: "brain"
  },
  {
    field: "Neuropsychiatry",
    influence: "Trauma Echo, Dopaminergic Overload, GABA inhibition, Rebound Stress (MRT, SPN, QTR)",
    relatedTests: ["MRT", "SPN", "QTR"],
    color: "#8b5cf6",
    icon: "activity"
  },
  {
    field: "16PF / MBTI",
    influence: "Trait logic, dichotomy conflict simulation (BUCP-DT, BUCP-DT-X)",
    relatedTests: ["BUCP-DT", "BUCP-DT-X"],
    color: "#f59e0b",
    icon: "layers"
  },
  {
    field: "Kinesics & Body Psychology",
    influence: "Emotion-position tracking, shame gesture maps (MPHM, ARC, SIPT)",
    relatedTests: ["MPHM", "ARC", "SIPT"],
    color: "#10b981",
    icon: "user"
  },
  {
    field: "Quantum Mechanics",
    influence: "Superposition identity tests, collapse logic (Shiva, ACT, TRMT)",
    relatedTests: ["Shiva", "ACT", "TRMT"],
    color: "#3b82f6",
    icon: "box"
  },
  {
    field: "Fractal & Geometric Theories",
    influence: "Thought expansion, non-linear perception (MSE, EEAC, NDTX)",
    relatedTests: ["MSE", "EEAC", "NDTX"],
    color: "#ef4444",
    icon: "triangle"
  },
  {
    field: "Eastern Psychology",
    influence: "Vāk duality, mirror mind-body energy, Anatta (no-self) principles (MPHM, Shiva Framework)",
    relatedTests: ["MPHM", "Shiva"],
    color: "#f97316",
    icon: "sun"
  }
];

export interface BharadwajTest {
  code: string;
  name: string;
  framework: string;
  influences: string[];
}

export const bharadwajTests: BharadwajTest[] = [
  {
    code: "BUCP-DT",
    name: "Unified Cognitive & Personality Dissection Test",
    framework: "BUCP-DT Core Framework",
    influences: ["Advanced Tensor Calculus", "MBTI (split dichotomies)", "Big Five (traits)", "16PF (factor logic)", "Cognitive Physics (curvature modeling)", "Neurobiology (ACC, DMN)", "Jungian Archetypes"]
  },
  {
    code: "MPHM-Core",
    name: "Mirror Pathway Healing Model Test",
    framework: "MPHM",
    influences: ["Mirror Neuron Theory", "Attachment Theory", "Kinesics (face/emotion link)", "EMDR Foundation", "Social Reflection Neuroscience", "Indian Vāk–Reflection Duality"]
  },
  {
    code: "QEF",
    name: "Quantum Emotional Feedback",
    framework: "Loop Disruption Matrix",
    influences: ["Quantum Feedback Theory", "Resonance Harmonics", "Emotion-as-Frequency Hypothesis", "Cybernetic Loop Theory"]
  },
  {
    code: "EEQF",
    name: "Emotional Energy Quantum Field",
    framework: "Loop Disruption Matrix",
    influences: ["Emotional Thermodynamics", "Somatic Loop Theory", "Energy Psychology", "Acupuncture Analogues (field balance)"]
  },
  {
    code: "QCFL",
    name: "Quantum Cognitive Feedback Loop",
    framework: "Loop Disruption Matrix",
    influences: ["Signal Processing", "Neural Feedback Delay Theory", "Kinesic Delay Theory (posture-reflection lag)"]
  },
  {
    code: "ACT",
    name: "Alien Consciousness Transfer",
    framework: "Alien Cognition Framework",
    influences: ["Non-Euclidean Geometry", "Non-Human Semantics Theory", "Dissociation Research", "DMT/5-HT2A Receptor Mapping", "Observer Effect Physics"]
  },
  {
    code: "EEAC",
    name: "Extra-Earth Awareness Calibration",
    framework: "Alien Framework",
    influences: ["Cymatics", "Sacred Geometry", "Semantic Field Theory", "AI-Error Perception Logic"]
  },
  {
    code: "SIPEX",
    name: "Species-Independent Processing Experiment",
    framework: "Alien Framework",
    influences: ["Belief Suspension Theory", "Linguistic Minimalism", "Symbolic Cognition Theory"]
  },
  {
    code: "ARC",
    name: "Alien Reflection Conditioning",
    framework: "Alien Framework",
    influences: ["Mirror Trauma Inversion Theory", "Shame-Echo Neuroscience", "Body Rejection Kinesics"]
  },
  {
    code: "NP-QS",
    name: "Neuroplasticity Quantum State",
    framework: "Neuroplasticity Framework",
    influences: ["Hebbian Learning Theory", "Neural Regeneration Research", "Plasticity Index Models", "GABA/Dopamine Adaptation Studies"]
  },
  {
    code: "NP-ER",
    name: "Neuroplasticity Emotional Reform",
    framework: "Neuroplasticity Framework",
    influences: ["Emotion Reinforcement Models", "CBT Overwrite Models", "Neural Inhibition-Activation Models"]
  },
  {
    code: "TRMT",
    name: "Thought Resonance Mass Theory Test",
    framework: "TRMT Framework",
    influences: ["Field Theory (Physics)", "Thought Mass Hypothesis", "Quantum Identity Anchoring", "Cognitive Inertia Physics"]
  },
  {
    code: "MRT",
    name: "Memory Resonance Tensor",
    framework: "TRMT Framework",
    influences: ["Cortisol-Memory Binding Theory", "PTSD Loop Theory", "Emotional Density Mapping"]
  },
  {
    code: "MSE",
    name: "Mirrored Self Experiment",
    framework: "Projection + Shiva",
    influences: ["Mirror Trauma", "Identity Rewriting Hypnosis", "Shiva Observer Model", "Deep NLP Echo Collapse"]
  },
  {
    code: "SPN",
    name: "Self-Programming Neural Test",
    framework: "Shiva Cortex Framework",
    influences: ["Neuro-Linguistic Programming (NLP)", "Internal Voice Remapping", "Self-Hypnosis", "Dopaminergic Inhibition Overwrite Theory"]
  },
  {
    code: "QTR",
    name: "Quantum Trauma Recoil",
    framework: "Shiva Cortex Framework",
    influences: ["Emotional Rebound Hypothesis", "Observer-Reflection Collapse Theory", "Quantum Loop Phase Disruption"]
  },
  {
    code: "SIPT",
    name: "Shifting Identity Paradox Test",
    framework: "BUCP + MPHM",
    influences: ["Multiple Self-Theory", "Kinesic Emotion Conflict Models", "Role Theory", "Psychological Projection Collapse"]
  },
  {
    code: "ICRT",
    name: "Identity Collapse & Reformation Test",
    framework: "BUCP-DT Framework",
    influences: ["Structural Dissociation Theory", "Ego-State Therapy", "Shiva Collapse Tensor", "Trauma Layering Models"]
  },
  {
    code: "BUCP-DT-X",
    name: "Advanced Tensor Personality Dissection",
    framework: "BUCP-DT + Tensor Fusion",
    influences: ["16PF (factorized subtypes)", "MBTI (multi-state conflict)", "Tensor Personality Projection Theory"]
  },
  {
    code: "NDTX",
    name: "Neuro-Dimensional Thought Experiment",
    framework: "Alien Cognition + Shiva Observer",
    influences: ["Nonlinear Dimensional Logic", "Cognitive Space-Time Folding", "Observer Dissolution Models", "Thought Fractal Theory"]
  }
];