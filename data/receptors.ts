export interface Receptor {
  id: string;
  name: string;
  symbol: string;
  color: string;
  description: string;
  tests: string[];
  function: string;
}

export const receptors: Receptor[] = [
  {
    id: "dopamine",
    name: "Dopamine",
    symbol: "D",
    color: "#6E44FF",
    description: "Regulates motivation, reward, and the strength of identity-based emotional loops.",
    tests: ["BUCP-DT", "QEF", "EEQF", "NP-QS"],
    function: "Controls emotional attachment to repetitive thoughts and feedback loop strength."
  },
  {
    id: "serotonin",
    name: "Serotonin",
    symbol: "5-HT",
    color: "#00D1FF",
    description: "Modulates mood stability, cognitive flexibility, and identity consistency.",
    tests: ["MPHM", "QCFL", "SIPT", "SPN"],
    function: "Enables emotional regulation, belief stability, and narrative coherence."
  },
  {
    id: "gaba",
    name: "GABA",
    symbol: "GABA",
    color: "#FF3D71",
    description: "Primary inhibitory neurotransmitter that regulates anxiety and cognitive limitation patterns.",
    tests: ["BUCP-DT", "EEQF", "ICRT", "NP-QS"],
    function: "Manages anxiety during cognitive restructuring and limits emotional overflow."
  },
  {
    id: "nmda",
    name: "NMDA",
    symbol: "NMDA",
    color: "#00E096",
    description: "Glutamate receptor involved in memory formation, learning, and belief plasticity.",
    tests: ["QEF", "EEAC", "SIPEX", "MRT"],
    function: "Facilitates memory reconsolidation and belief restructuring during cognitive reprogramming."
  },
  {
    id: "oxytocin",
    name: "Oxytocin",
    symbol: "OT",
    color: "#6E44FF",
    description: "Regulates social bonding, mirroring, and attachment-based identity formation.",
    tests: ["MPHM", "ARC"],
    function: "Mediates social reflection-based identity formation and mirror neuron activation."
  },
  {
    id: "cortisol",
    name: "Cortisol",
    symbol: "CORT",
    color: "#FF9F43",
    description: "Stress hormone that affects memory encoding, emotional reactivity, and trauma loops.",
    tests: ["QEF", "MRT", "ICRT", "QTR"],
    function: "Maps emotional charge of memories and calibrates loop intensity based on stress response."
  }
];
