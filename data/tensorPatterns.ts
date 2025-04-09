export interface TensorPattern {
  name: string;
  severity: 'MILD' | 'MODERATE' | 'SEVERE';
  brainRegions: string[];
  loopDisruptionMethod: string;
  mirrorStateSignature: string;
  description?: string;
  framework?: string;
}

export const tensorPatterns: TensorPattern[] = [
  // SEVERE PATTERNS
  {
    name: "Trust Dissolution Field",
    severity: "SEVERE",
    brainRegions: ["Anterior Insula", "TPJ", "Basolateral Amygdala"],
    loopDisruptionMethod: "Safe Place Visualization, Rejection Simulation",
    mirrorStateSignature: "Fractured Empathic Loop",
    description: "A deterioration of trust in relationships, causing emotional withdrawal and defensive behaviors.",
    framework: "BUCP-DT"
  },
  {
    name: "Identity Erosion Field",
    severity: "SEVERE",
    brainRegions: ["PCC", "DMN", "Hippocampus"],
    loopDisruptionMethod: "Mirror-State Journaling",
    mirrorStateSignature: "Self-Fade Collapse",
    description: "Progressive loss of clear self-concept and core values across social contexts.",
    framework: "BUCP-DT"
  },
  {
    name: "Recursive Anger Loops",
    severity: "SEVERE",
    brainRegions: ["Amygdala", "ACC", "Prefrontal Cortex"],
    loopDisruptionMethod: "Breath Reset, Cognitive Reframe",
    mirrorStateSignature: "Self-Attacking Pattern",
    description: "Recurring anger that feeds back into itself, creating escalating internal conflict.",
    framework: "Loop Matrix"
  },
  {
    name: "Guilt-Reinforcement Axis",
    severity: "SEVERE",
    brainRegions: ["Subgenual ACC", "vmPFC"],
    loopDisruptionMethod: "Self-Compassion Practice, Thought Flipping",
    mirrorStateSignature: "Moral Loop Lock",
    description: "Self-criticism loop that reinforces feelings of unworthiness and shame.",
    framework: "Loop Matrix"
  },
  {
    name: "Trauma Displacement Spiral",
    severity: "SEVERE",
    brainRegions: ["Hippocampus", "Amygdala", "ACC"],
    loopDisruptionMethod: "Memory Reconsolidation, Safe Place Anchoring",
    mirrorStateSignature: "Projected Pain Matrix",
    description: "Trauma reactions triggered by unrelated present events, causing emotional confusion.",
    framework: "MPHM"
  },
  {
    name: "Repressed Anger Field",
    severity: "SEVERE",
    brainRegions: ["Amygdala", "OFC"],
    loopDisruptionMethod: "Loop Playback Narration, Breath Reset",
    mirrorStateSignature: "Explosive Mirror Distortion",
    description: "Suppressed anger that transforms into passive aggression or emotional eruptions.",
    framework: "Loop Matrix"
  },
  {
    name: "Memory Echo Pattern",
    severity: "SEVERE",
    brainRegions: ["Hippocampus", "DLPFC", "Amygdala"],
    loopDisruptionMethod: "Memory Reconsolidation Protocol",
    mirrorStateSignature: "Past Reflection Trap",
    description: "Recurring intrusive memories that trigger identical emotional responses.",
    framework: "MPHM"
  },
  {
    name: "Past Trauma Echoes",
    severity: "SEVERE",
    brainRegions: ["Hippocampus", "Amygdala", "vmPFC"],
    loopDisruptionMethod: "Timeline Reintegration",
    mirrorStateSignature: "Past-Present Collapse",
    description: "Past traumatic events continuing to influence current emotional responses.",
    framework: "MPHM"
  },
  {
    name: "Future Uncertainty Matrix",
    severity: "SEVERE",
    brainRegions: ["Prefrontal Cortex", "Anterior Cingulate"],
    loopDisruptionMethod: "Quantum Outcome Mapping",
    mirrorStateSignature: "Infinite Branching Pathways",
    description: "Overwhelming anxiety about potential future outcomes creating decision paralysis.",
    framework: "Quantum Cognition Extensions"
  },
  {
    name: "Love Deprivation Feedback Field",
    severity: "SEVERE",
    brainRegions: ["Subgenual ACC", "Insula"],
    loopDisruptionMethod: "Inner Child Tensor Activation",
    mirrorStateSignature: "Longing Reflection Freeze",
    description: "Emotional numbness stemming from unmet needs for affection and connection.",
    framework: "BUCP-DT"
  },
  {
    name: "Threat Matrix Elevation",
    severity: "SEVERE",
    brainRegions: ["Amygdala", "Hypothalamus", "ACC"],
    loopDisruptionMethod: "Safety Recalibration Protocol",
    mirrorStateSignature: "Danger Scanning Loop",
    description: "Heightened perception of threat in neutral or safe environments.",
    framework: "Tensor Diagnostics"
  },
  {
    name: "High-Performance Self-Erasure Field",
    severity: "SEVERE",
    brainRegions: ["DLPFC", "vmPFC", "Basal Ganglia"],
    loopDisruptionMethod: "Identity Recovery Protocol",
    mirrorStateSignature: "Achievement-Identity Fusion",
    description: "Loss of identity separate from achievements and performance metrics.",
    framework: "Tensor Diagnostics"
  },
  {
    name: "Cognitive Gravity Delay",
    severity: "SEVERE",
    brainRegions: ["Basal Ganglia", "DLPFC"],
    loopDisruptionMethod: "Executive Task Chunking",
    mirrorStateSignature: "Loop Delay Overload",
    description: "Decision fatigue that increases with every choice, creating progressive mental fog.",
    framework: "Tensor Diagnostics"
  },
  {
    name: "Survival Freeze Loop",
    severity: "SEVERE",
    brainRegions: ["PAG", "Hypothalamus", "Amygdala"],
    loopDisruptionMethod: "Body Activation Protocol",
    mirrorStateSignature: "Immobilization Matrix",
    description: "Involuntary immobilization response triggered by perceived threats.",
    framework: "MPHM"
  },
  {
    name: "Mirror-State Alienation Syndrome",
    severity: "SEVERE",
    brainRegions: ["STS", "TPJ", "Mirror Neuron System"],
    loopDisruptionMethod: "Self-Recognition Protocol",
    mirrorStateSignature: "Self-Other Disconnect",
    description: "Profound sense of disconnect from one's reflection and social identity.",
    framework: "Loop Matrix"
  },
  {
    name: "Forgotten Self Syndrome",
    severity: "SEVERE",
    brainRegions: ["DMN", "mPFC", "Cerebellum Vermis"],
    loopDisruptionMethod: "Conscious Recall Exercise, Tensor Mapping",
    mirrorStateSignature: "Self-Absence Mirror",
    description: "Loss of connection to authentic desires and needs due to chronic people-pleasing.",
    framework: "BUCP-DT"
  },
  {
    name: "Jivanuparivartana Field",
    severity: "SEVERE",
    brainRegions: ["DMN", "Insula", "Precuneus"],
    loopDisruptionMethod: "Soul Restoration Protocol",
    mirrorStateSignature: "Existential Vacuum",
    description: "Profound disconnection from meaning, purpose and spiritual identity.",
    framework: "Quantum Cognition Extensions"
  },
  {
    name: "Soul-Vector Displacement Field",
    severity: "SEVERE",
    brainRegions: ["Precuneus", "mPFC", "Posterior Cingulate"],
    loopDisruptionMethod: "Existential Realignment",
    mirrorStateSignature: "Purpose Disconnection",
    description: "Misalignment between deepest values and current life direction.",
    framework: "Quantum Cognition Extensions"
  },
  {
    name: "Belief Fracture Zones",
    severity: "SEVERE",
    brainRegions: ["DLPFC", "Temporal Cortex", "ACC"],
    loopDisruptionMethod: "Cognitive Integration",
    mirrorStateSignature: "Contradictory Belief Maps",
    description: "Holding mutually exclusive beliefs creating internal conflict and confusion.",
    framework: "Tensor Diagnostics"
  },
  {
    name: "Hypervigilance Perception Grid",
    severity: "SEVERE",
    brainRegions: ["Amygdala", "Thalamus", "Visual Cortex"],
    loopDisruptionMethod: "Safety Signal Restoration",
    mirrorStateSignature: "Threat Scanning Loop",
    description: "Constant scanning for danger depleting cognitive resources and emotional stability.",
    framework: "MPHM"
  },
  {
    name: "Self-Loop Activation",
    severity: "SEVERE",
    brainRegions: ["Medial PFC", "Subgenual ACC"],
    loopDisruptionMethod: "Fractal Breath Re-sync, Mirror Reversal",
    mirrorStateSignature: "Recursive Reflection Trap",
    description: "Self-reinforcing negative thought patterns that intensify with attention.",
    framework: "Loop Matrix"
  },
  
  // MODERATE PATTERNS
  {
    name: "Choice Tensor Inertia",
    severity: "MODERATE",
    brainRegions: ["Basal Ganglia", "DLPFC", "OFC"],
    loopDisruptionMethod: "Decision Matrix Exercise",
    mirrorStateSignature: "Option Paralysis",
    description: "Difficulty making decisions due to overanalysis of potential outcomes.",
    framework: "Tensor Diagnostics"
  },
  {
    name: "Reflective Overload Vector",
    severity: "MODERATE",
    brainRegions: ["Medial PFC", "Insula", "Precuneus"],
    loopDisruptionMethod: "Expressive Writing, Loop Timeout Ritual",
    mirrorStateSignature: "Hyper-Mirror",
    description: "Excessive self-reflection creating analysis paralysis and emotional distance.",
    framework: "Loop Matrix"
  },
  {
    name: "Perfectionism Feedback Loop",
    severity: "MODERATE",
    brainRegions: ["DLPFC", "OFC"],
    loopDisruptionMethod: "Thought Challenging + Cognitive Reframe",
    mirrorStateSignature: "Ideal Mirror Conflict",
    description: "Rigid standards creating chronic dissatisfaction and fear of failure.",
    framework: "Loop Matrix"
  },
  {
    name: "Emotional Enmeshment Loop",
    severity: "MODERATE",
    brainRegions: ["Amygdala", "ACC", "Insula"],
    loopDisruptionMethod: "Emotional Boundary Setting",
    mirrorStateSignature: "Boundary Dissolution",
    description: "Difficulty distinguishing your emotions from others, creating emotional confusion.",
    framework: "BUCP-DT"
  },
  {
    name: "Neglect Imprint Loop",
    severity: "MODERATE",
    brainRegions: ["Hippocampus", "Amygdala"],
    loopDisruptionMethod: "Inner Child Reparenting",
    mirrorStateSignature: "Invisible Self Pattern",
    description: "Deep-seated belief in your own unworthiness stemming from childhood neglect.",
    framework: "MPHM"
  },
  {
    name: "Narrative Paralysis Loop",
    severity: "MODERATE",
    brainRegions: ["Broca's Area", "Hippocampus"],
    loopDisruptionMethod: "Story Reauthoring",
    mirrorStateSignature: "Frozen Self-Narrative",
    description: "Inability to update your self-story, keeping you stuck in outdated patterns.",
    framework: "BUCP-DT"
  },
  {
    name: "Emotional Noise Suppression Zone",
    severity: "MODERATE",
    brainRegions: ["ACC", "PFC"],
    loopDisruptionMethod: "Emotional Literacy Training",
    mirrorStateSignature: "Flat Affect Mirror",
    description: "Chronic emotional numbness to protect from potential pain and rejection.",
    framework: "MPHM"
  },
  {
    name: "Quantum Thought Fragmentation",
    severity: "MODERATE",
    brainRegions: ["Parietal Cortex", "DLPFC"],
    loopDisruptionMethod: "Loop Isolation + Focus Anchoring",
    mirrorStateSignature: "Split Thought Stream",
    description: "Racing, disconnected thoughts that create mental fog and decision fatigue.",
    framework: "Quantum Cognition Extensions"
  },
  {
    name: "Thought Resonance Shift Field",
    severity: "MODERATE",
    brainRegions: ["DMN", "Precuneus"],
    loopDisruptionMethod: "Reality Testing Protocol",
    mirrorStateSignature: "Reality Distortion Field",
    description: "Cognitive bias that filters evidence to support negative self-beliefs.",
    framework: "Quantum Cognition Extensions"
  },
  {
    name: "Mirror Identity Fracture",
    severity: "MODERATE",
    brainRegions: ["Mirror Neurons", "STS"],
    loopDisruptionMethod: "Identity Restoration Narrative",
    mirrorStateSignature: "Broken External Mirror Path",
    description: "Misalignment between self-image and how others perceive you.",
    framework: "Loop Matrix"
  },
  {
    name: "Interpersonal Conflict Nodes",
    severity: "MODERATE",
    brainRegions: ["TPJ", "ACC", "OFC"],
    loopDisruptionMethod: "Interpersonal Bridge Building",
    mirrorStateSignature: "Relational Fracture Points",
    description: "Recurring conflict patterns that emerge in multiple relationships.",
    framework: "Tensor Diagnostics"
  },
  {
    name: "Internal Narrative Collapse",
    severity: "MODERATE",
    brainRegions: ["mPFC", "Hippocampus", "Temporal Cortex"],
    loopDisruptionMethod: "Narrative Reconstruction",
    mirrorStateSignature: "Story Dissolution",
    description: "Loss of coherent self-narrative that organizes past experiences.",
    framework: "BUCP-DT"
  },
  {
    name: "Meaning Collapse Cascade",
    severity: "MODERATE",
    brainRegions: ["DMN", "Temporal Cortex"],
    loopDisruptionMethod: "Existential Rescripting",
    mirrorStateSignature: "Mirror Drain",
    description: "Progressive loss of meaning and purpose in activities and relationships.",
    framework: "Quantum Cognition Extensions"
  },
  
  // MILD PATTERNS
  {
    name: "Approval-Seeking Overdrive",
    severity: "MILD",
    brainRegions: ["vmPFC", "Reward Circuitry"],
    loopDisruptionMethod: "Self-Validation Training",
    mirrorStateSignature: "External Mirror Validation",
    description: "Excessive need for external validation and approval from others.",
    framework: "Loop Matrix"
  },
  {
    name: "Social Comparison Vortex",
    severity: "MILD",
    brainRegions: ["PCC", "TPJ"],
    loopDisruptionMethod: "Cognitive Defusion",
    mirrorStateSignature: "Externalized Mirror Trigger",
    description: "Constant evaluation of self against others, driving insecurity and validation-seeking.",
    framework: "BUCP-DT"
  },
  {
    name: "Symbolic Emotional Looping",
    severity: "MILD",
    brainRegions: ["Limbic System", "Temporal Cortex"],
    loopDisruptionMethod: "Symbol Reframing Exercise",
    mirrorStateSignature: "Symbolic Trigger Cascade",
    description: "Emotional reactions triggered by symbolic representations rather than present reality.",
    framework: "Quantum Cognition Extensions"
  },
  {
    name: "False-Role Enactment Syndrome",
    severity: "MILD",
    brainRegions: ["mPFC", "TPJ", "STS"],
    loopDisruptionMethod: "Authentic Expression Training",
    mirrorStateSignature: "Social Mask Attachment",
    description: "Habitually adopting inauthentic social roles to gain acceptance.",
    framework: "BUCP-DT"
  },
  {
    name: "Paradoxical Gratitude Guilt",
    severity: "MILD",
    brainRegions: ["vmPFC", "ACC", "Insula"],
    loopDisruptionMethod: "Deserving Matrix Exercise",
    mirrorStateSignature: "Reward Rejection Pattern",
    description: "Difficulty accepting positive experiences due to underlying unworthiness beliefs.",
    framework: "Tensor Diagnostics"
  },
  {
    name: "Intuitive Block Field",
    severity: "MILD",
    brainRegions: ["Insula", "Anterior Cingulate", "Basal Ganglia"],
    loopDisruptionMethod: "Somatic Intuition Training",
    mirrorStateSignature: "Body-Mind Disconnect",
    description: "Disconnection from intuitive gut feelings and body signals.",
    framework: "MPHM"
  },
  {
    name: "Loop Anticipation Anxiety",
    severity: "MILD",
    brainRegions: ["ACC", "Anterior Insula", "vmPFC"],
    loopDisruptionMethod: "Present Moment Anchoring",
    mirrorStateSignature: "Future Fear Projection",
    description: "Anxiety about potentially entering negative emotional loops in the future.",
    framework: "Loop Matrix"
  }
];

// Helper function to get tensor patterns by severity level
export function getTensorPatternsBySeverity(severity: 'MILD' | 'MODERATE' | 'SEVERE'): TensorPattern[] {
  return tensorPatterns.filter(pattern => pattern.severity === severity);
}

// Helper function to get tensor patterns by brain region
export function getTensorPatternsByBrainRegion(regionName: string): TensorPattern[] {
  return tensorPatterns.filter(pattern => 
    pattern.brainRegions.some(region => region.includes(regionName))
  );
}

// Helper function to get tensor patterns by framework
export function getTensorPatternsByFramework(framework: string): TensorPattern[] {
  return tensorPatterns.filter(pattern => pattern.framework === framework);
}

// Define healing protocol for each tensor pattern type
export interface HealingProtocol {
  tensorPatternName: string;
  steps: string[];
  neurochemistry?: string;
  duration?: string;
}

export const healingProtocols: HealingProtocol[] = [
  {
    tensorPatternName: "Guilt-Reinforcement Axis",
    steps: [
      "Self-Compassion Visualization",
      "Tensor Journaling Ritual",
      "Inner Critic Dialogue",
      "Compassionate Redirection"
    ],
    neurochemistry: "Oxytocin and Serotonin Release",
    duration: "21-Day Protocol"
  },
  {
    tensorPatternName: "Mirror Identity Fracture",
    steps: [
      "Eye-Gazing Exercise",
      "Visual Integration Task",
      "Interpersonal Reflection Mapping",
      "Identity Anchor Building"
    ],
    neurochemistry: "GABA Upregulation",
    duration: "14-Day Protocol"
  },
  {
    tensorPatternName: "Trust Dissolution Field",
    steps: [
      "Micro-Trust Challenge",
      "Rejection Resilience Drill",
      "Safe Person Visualization",
      "Boundary Reinforcement"
    ],
    neurochemistry: "Dopamine and Oxytocin Rebalancing",
    duration: "28-Day Protocol"
  },
  {
    tensorPatternName: "Perfectionism Feedback Loop",
    steps: [
      "Thought Reversal Task",
      "Reflective Failure Narrative",
      "Deliberate Imperfection Exercise",
      "Recalibration of Standards"
    ],
    neurochemistry: "Cortisol Reduction",
    duration: "14-Day Protocol"
  }
];