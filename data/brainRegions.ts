export interface BrainRegion {
  id: string;
  name: string;
  acronym: string;
  function: string;
  tests: string[];
  color: string;
  position: [number, number, number];
  size: number;
  shape: "ellipsoid" | "rounded" | "sphere";
}

export const brainRegions: BrainRegion[] = [
  {
    id: "pfc",
    name: "Prefrontal Cortex",
    acronym: "PFC",
    function: "Identity logic, executive narrative, decision making",
    tests: ["BUCP-DT", "ICRT", "QTR", "SPN"],
    color: "#6E44FF",
    position: [0, 1.5, 1.5],
    size: 1.2,
    shape: "ellipsoid"
  },
  {
    id: "acc",
    name: "Anterior Cingulate Cortex",
    acronym: "ACC",
    function: "Conflict monitoring, loop clash detection",
    tests: ["BUCP-DT", "QCFL", "SIPT"],
    color: "#00D1FF",
    position: [0, 0.5, 2],
    size: 0.9,
    shape: "ellipsoid"
  },
  {
    id: "amygdala",
    name: "Amygdala",
    acronym: "AMY",
    function: "Fear/emotion memory echo, emotional response intensity",
    tests: ["MPHM", "MRT", "QEF", "EEQF"],
    color: "#FF3D71",
    position: [1.5, 0, 0.5],
    size: 0.7,
    shape: "sphere"
  },
  {
    id: "hippocampus",
    name: "Hippocampus",
    acronym: "HPC",
    function: "Emotional memory and time anchoring",
    tests: ["MRT", "QEF", "ICRT"],
    color: "#00E096",
    position: [1.2, -0.8, 0],
    size: 0.8,
    shape: "rounded"
  },
  {
    id: "insular-cortex",
    name: "Insular Cortex",
    acronym: "IC",
    function: "Interoception, self-other reflection loop",
    tests: ["MPHM", "MSE", "SIPT"],
    color: "#FF9F43",
    position: [1.8, 0.5, 0.5],
    size: 0.9,
    shape: "ellipsoid"
  },
  {
    id: "basal-ganglia",
    name: "Basal Ganglia",
    acronym: "BG",
    function: "Habit and pattern repetition, motor control",
    tests: ["BUCP-DT", "Loop Matrix"],
    color: "#FF9F43",
    position: [0.8, -0.5, 1],
    size: 1,
    shape: "sphere"
  },
  {
    id: "thalamus",
    name: "Thalamus",
    acronym: "THAL",
    function: "Sensory gating and consciousness routing",
    tests: ["EEAC", "Alien Tests"],
    color: "#00D1FF",
    position: [0, 0, 0],
    size: 0.8,
    shape: "sphere"
  },
  {
    id: "temporal-pole",
    name: "Temporal Pole",
    acronym: "TP",
    function: "Semantic meaning + emotional overlay",
    tests: ["SIPT", "TRMT", "MSE"],
    color: "#6E44FF",
    position: [2, 0, -1],
    size: 0.7,
    shape: "ellipsoid"
  },
  {
    id: "mirror-neuron-system",
    name: "Mirror Neuron System",
    acronym: "MNS",
    function: "Projected reflection mapping",
    tests: ["MPHM", "ARC", "SIPT"],
    color: "#FF3D71",
    position: [1.5, 1, -0.5],
    size: 1.1,
    shape: "ellipsoid"
  },
  {
    id: "dmn",
    name: "Default Mode Network",
    acronym: "DMN",
    function: "Self-narrative shutdown/reset",
    tests: ["Shiva-based Tests", "MSE"],
    color: "#00E096",
    position: [-0.5, 0, 1],
    size: 1.3,
    shape: "ellipsoid"
  },
  {
    id: "parietal-cortex",
    name: "Parietal Cortex",
    acronym: "PAR",
    function: "Spatial reorientation and ego boundary shifts",
    tests: ["Alien Tests", "NP-ER"],
    color: "#00D1FF",
    position: [-1.5, 1, 0],
    size: 1.1,
    shape: "ellipsoid"
  },
  {
    id: "cerebellum",
    name: "Cerebellum",
    acronym: "CER",
    function: "Pattern prediction and timing",
    tests: ["QCFL", "Loop Disruption Matrix"],
    color: "#FF9F43",
    position: [-1.5, -1.5, -1],
    size: 1,
    shape: "ellipsoid"
  },
  {
    id: "orbitofrontal-cortex",
    name: "Orbitofrontal Cortex",
    acronym: "OFC",
    function: "Emotional decision logic",
    tests: ["BUCP-DT", "SPN"],
    color: "#6E44FF",
    position: [0, 1, 0],
    size: 0.8,
    shape: "ellipsoid"
  },
  {
    id: "nucleus-accumbens",
    name: "Nucleus Accumbens",
    acronym: "NAcc",
    function: "Reward/punishment identity shaping",
    tests: ["QEF", "EEQF", "SPN"],
    color: "#FF3D71",
    position: [0.5, -0.2, 0.5],
    size: 0.6,
    shape: "sphere"
  },
  {
    id: "ventromedial-pfc",
    name: "Ventromedial PFC",
    acronym: "vmPFC",
    function: "Moral-emotional integration",
    tests: ["MPHM", "SIPT"],
    color: "#00E096",
    position: [0, 0.8, 1],
    size: 0.7,
    shape: "ellipsoid"
  }
];
