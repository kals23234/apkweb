export interface Tensor {
  id: string;
  type: string;
  name: string;
  symbol: string;
  geometry: string;
  description: string;
  activeTests: string[];
}

export const tensors: Tensor[] = [
  {
    id: "identity",
    type: "identity",
    name: "Identity Tensor",
    symbol: "Iᵗ",
    geometry: "3D vector (looped arrow)",
    description: "Represents core personality under tension, mapping the fundamental structure of self-identity.",
    activeTests: ["BUCP-DT", "SPN", "SIPT"]
  },
  {
    id: "emotional-curvature",
    type: "emotional_curvature",
    name: "Emotional Curvature Tensor",
    symbol: "Eᵏ",
    geometry: "Spiral",
    description: "Models bending of thought under emotional gravity, showing how emotions distort cognitive processes.",
    activeTests: ["QEF", "EEQF", "TRMT"]
  },
  {
    id: "loop-field",
    type: "loop_field",
    name: "Loop Field Tensor",
    symbol: "Lᶠ",
    geometry: "Ring (feedback circle)",
    description: "Captures repetitive thought-emotion systems, mapping how patterns reinforce and perpetuate themselves.",
    activeTests: ["BUCP-DT", "MPHM", "QCFL"]
  },
  {
    id: "mirror-reflection",
    type: "mirror_reflection",
    name: "Mirror Reflection Tensor",
    symbol: "Mʳ",
    geometry: "Dual-face mirror",
    description: "Models trauma created by external reflection, showing how we internalize others' perceptions.",
    activeTests: ["MPHM", "SPN", "ARC"]
  },
  {
    id: "collapse",
    type: "collapse",
    name: "Collapse Tensor",
    symbol: "Cᶜ",
    geometry: "Imploding cube",
    description: "Triggered during Shiva Cortex collapse, representing the dissolution of rigid identity structures.",
    activeTests: ["MSE", "TRMT", "SPN"]
  },
  {
    id: "observer",
    type: "observer",
    name: "Observer Tensor",
    symbol: "Oᵗ",
    geometry: "Transparent triangle",
    description: "Used in alien cognition and pure awareness states, representing non-dual consciousness.",
    activeTests: ["ACT", "MSE", "NDTX"]
  },
  {
    id: "reconstruction",
    type: "reconstruction",
    name: "Reconstruction Tensor",
    symbol: "Rⁱ",
    geometry: "Flower of life fractal",
    description: "Used post-collapse to rebuild identity structure, representing the emergence of new patterns.",
    activeTests: ["NP-QS", "NP-ER", "ICRT"]
  }
];
