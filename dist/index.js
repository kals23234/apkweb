// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";
import { WebSocketServer, WebSocket } from "ws";

// server/storage.ts
var MemStorage = class {
  users;
  testResponses;
  neurofeedbackEvents;
  achievements;
  currentUserId;
  currentTestResponseId;
  currentNeurofeedbackEventId;
  currentAchievementId;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.testResponses = /* @__PURE__ */ new Map();
    this.neurofeedbackEvents = /* @__PURE__ */ new Map();
    this.achievements = /* @__PURE__ */ new Map();
    this.currentUserId = 1;
    this.currentTestResponseId = 1;
    this.currentNeurofeedbackEventId = 1;
    this.currentAchievementId = 1;
  }
  // User methods
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  async createUser(insertUser) {
    const id = this.currentUserId++;
    const user = {
      ...insertUser,
      id,
      email: insertUser.email || null
    };
    this.users.set(id, user);
    return user;
  }
  // Test response methods
  async getTestResponses(userId) {
    return Array.from(this.testResponses.values()).filter(
      (response) => response.userId === userId
    );
  }
  async getTestResponseById(id) {
    return this.testResponses.get(id);
  }
  async createTestResponse(testResponse) {
    const id = this.currentTestResponseId++;
    const timestamp2 = /* @__PURE__ */ new Date();
    const newTestResponse = {
      ...testResponse,
      id,
      timestamp: timestamp2,
      userId: testResponse.userId || null,
      brainRegions: testResponse.brainRegions || null,
      intensity: testResponse.intensity || null
    };
    this.testResponses.set(id, newTestResponse);
    return newTestResponse;
  }
  // Neurofeedback events methods
  async getNeurofeedbackEvents(userId) {
    return Array.from(this.neurofeedbackEvents.values()).filter(
      (event) => event.userId === userId
    );
  }
  async getNeurofeedbackEventById(id) {
    return this.neurofeedbackEvents.get(id);
  }
  async createNeurofeedbackEvent(event) {
    const id = this.currentNeurofeedbackEventId++;
    const timestamp2 = /* @__PURE__ */ new Date();
    const newEvent = {
      ...event,
      id,
      timestamp: timestamp2,
      userId: event.userId || null,
      intensity: event.intensity || null,
      testResponseId: event.testResponseId || null,
      duration: event.duration || null,
      metadata: event.metadata || {}
    };
    this.neurofeedbackEvents.set(id, newEvent);
    return newEvent;
  }
  async getRecentNeurofeedbackEvents(userId, limit) {
    const events = await this.getNeurofeedbackEvents(userId);
    return events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, limit);
  }
  // Achievement methods
  async getAchievements(userId) {
    return Array.from(this.achievements.values()).filter(
      (achievement) => achievement.userId === userId
    );
  }
  async getAchievementById(id) {
    return this.achievements.get(id);
  }
  async getAchievementByShareHash(shareHash) {
    return Array.from(this.achievements.values()).find(
      (achievement) => achievement.shareHash === shareHash && achievement.isPublic
    );
  }
  async createAchievement(achievement) {
    const id = this.currentAchievementId++;
    const achievedAt = /* @__PURE__ */ new Date();
    const defaultMetadata = {
      details: "",
      stats: {}
    };
    const metadata = achievement.metadata ? {
      details: typeof achievement.metadata === "object" && "details" in achievement.metadata ? String(achievement.metadata.details || "") : "",
      stats: typeof achievement.metadata === "object" && "stats" in achievement.metadata ? achievement.metadata.stats || {} : {}
    } : defaultMetadata;
    const newAchievement = {
      ...achievement,
      id,
      achievedAt,
      userId: achievement.userId || null,
      metadata,
      isPublic: achievement.isPublic || false
    };
    this.achievements.set(id, newAchievement);
    return newAchievement;
  }
  async updateAchievementVisibility(id, isPublic) {
    const achievement = await this.getAchievementById(id);
    if (!achievement) return void 0;
    const updatedAchievement = {
      ...achievement,
      isPublic
    };
    this.achievements.set(id, updatedAchievement);
    return updatedAchievement;
  }
  async getPublicAchievements(limit) {
    const publicAchievements = Array.from(this.achievements.values()).filter((achievement) => achievement.isPublic).sort((a, b) => b.achievedAt.getTime() - a.achievedAt.getTime());
    return limit ? publicAchievements.slice(0, limit) : publicAchievements;
  }
};
var storage = new MemStorage();

// shared/schema.ts
import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email")
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true
});
var testResponses = pgTable("test_responses", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  testCode: text("test_code").notNull(),
  questionId: text("question_id").notNull(),
  response: text("response").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  brainRegions: text("brain_regions").array(),
  intensity: integer("intensity").default(5)
});
var neurofeedbackEvents = pgTable("neurofeedback_events", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  testResponseId: integer("test_response_id").references(() => testResponses.id),
  brainRegionId: text("brain_region_id").notNull(),
  intensity: integer("intensity").default(5),
  duration: integer("duration").default(3e3),
  // milliseconds
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  metadata: jsonb("metadata")
});
var insertTestResponseSchema = createInsertSchema(testResponses).pick({
  userId: true,
  testCode: true,
  questionId: true,
  response: true,
  brainRegions: true,
  intensity: true
});
var insertNeurofeedbackEventSchema = createInsertSchema(neurofeedbackEvents).pick({
  userId: true,
  testResponseId: true,
  brainRegionId: true,
  intensity: true,
  duration: true,
  metadata: true
});
var achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  achievedAt: timestamp("achieved_at").defaultNow().notNull(),
  type: text("type").notNull(),
  // e.g., "test_completion", "brain_region_mastery", "tensor_pattern"
  metadata: jsonb("metadata").$type().default({}).notNull(),
  // Flexible field for achievement-specific data
  shareHash: text("share_hash").notNull(),
  // Unique hash for sharing without exposing user ID
  isPublic: boolean("is_public").default(false).notNull()
});
var insertAchievementSchema = createInsertSchema(achievements).pick({
  userId: true,
  title: true,
  description: true,
  type: true,
  metadata: true,
  shareHash: true,
  isPublic: true
});

// client/src/data/frameworks.ts
var frameworks = [
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

// client/src/data/tests.ts
var tests = [
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

// client/src/data/brainRegions.ts
var brainRegions = [
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

// client/src/data/tensors.ts
var tensors = [
  {
    id: "identity",
    type: "identity",
    name: "Identity Tensor",
    symbol: "I\u1D57",
    geometry: "3D vector (looped arrow)",
    description: "Represents core personality under tension, mapping the fundamental structure of self-identity.",
    activeTests: ["BUCP-DT", "SPN", "SIPT"]
  },
  {
    id: "emotional-curvature",
    type: "emotional_curvature",
    name: "Emotional Curvature Tensor",
    symbol: "E\u1D4F",
    geometry: "Spiral",
    description: "Models bending of thought under emotional gravity, showing how emotions distort cognitive processes.",
    activeTests: ["QEF", "EEQF", "TRMT"]
  },
  {
    id: "loop-field",
    type: "loop_field",
    name: "Loop Field Tensor",
    symbol: "L\u1DA0",
    geometry: "Ring (feedback circle)",
    description: "Captures repetitive thought-emotion systems, mapping how patterns reinforce and perpetuate themselves.",
    activeTests: ["BUCP-DT", "MPHM", "QCFL"]
  },
  {
    id: "mirror-reflection",
    type: "mirror_reflection",
    name: "Mirror Reflection Tensor",
    symbol: "M\u02B3",
    geometry: "Dual-face mirror",
    description: "Models trauma created by external reflection, showing how we internalize others' perceptions.",
    activeTests: ["MPHM", "SPN", "ARC"]
  },
  {
    id: "collapse",
    type: "collapse",
    name: "Collapse Tensor",
    symbol: "C\u1D9C",
    geometry: "Imploding cube",
    description: "Triggered during Shiva Cortex collapse, representing the dissolution of rigid identity structures.",
    activeTests: ["MSE", "TRMT", "SPN"]
  },
  {
    id: "observer",
    type: "observer",
    name: "Observer Tensor",
    symbol: "O\u1D57",
    geometry: "Transparent triangle",
    description: "Used in alien cognition and pure awareness states, representing non-dual consciousness.",
    activeTests: ["ACT", "MSE", "NDTX"]
  },
  {
    id: "reconstruction",
    type: "reconstruction",
    name: "Reconstruction Tensor",
    symbol: "R\u2071",
    geometry: "Flower of life fractal",
    description: "Used post-collapse to rebuild identity structure, representing the emergence of new patterns.",
    activeTests: ["NP-QS", "NP-ER", "ICRT"]
  }
];

// client/src/data/receptors.ts
var receptors = [
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

// server/routes.ts
var activeConnections = /* @__PURE__ */ new Map();
function broadcastNeurofeedbackEvent(userId, event) {
  if (userId === null) return;
  const connections = activeConnections.get(userId);
  if (connections) {
    const message = JSON.stringify({
      type: "neurofeedback",
      data: event
    });
    connections.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }
}
async function registerRoutes(app2) {
  const apiPath = "/api";
  app2.get("/health", (req, res) => {
    res.status(200).json({ status: "OK", message: "ADVANCED BHARADWAJ TENSOR INTERFACE v.MaxMind - System operational", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
  });
  app2.get(`${apiPath}/frameworks`, (req, res) => {
    res.json(frameworks);
  });
  app2.get(`${apiPath}/frameworks/:id`, (req, res) => {
    const framework = frameworks.find((f) => f.id === req.params.id);
    if (framework) {
      res.json(framework);
    } else {
      res.status(404).json({ message: "Framework not found" });
    }
  });
  app2.get(`${apiPath}/tests`, (req, res) => {
    res.json(tests);
  });
  app2.get(`${apiPath}/frameworks/:id/tests`, (req, res) => {
    const framework = frameworks.find((f) => f.id === req.params.id);
    if (!framework) {
      return res.status(404).json({ message: "Framework not found" });
    }
    const frameworkTests = tests.filter((test) => framework.tests.includes(test.code));
    res.json(frameworkTests);
  });
  app2.get(`${apiPath}/brain-regions`, (req, res) => {
    res.json(brainRegions);
  });
  app2.get(`${apiPath}/tensors`, (req, res) => {
    res.json(tensors);
  });
  app2.get(`${apiPath}/receptors`, (req, res) => {
    res.json(receptors);
  });
  app2.post(`${apiPath}/test-responses`, async (req, res) => {
    try {
      const validatedData = insertTestResponseSchema.parse(req.body);
      const testResponse = await storage.createTestResponse(validatedData);
      const test = tests.find((t) => t.code === testResponse.testCode);
      if (test && test.brainRegions.length > 0) {
        const relatedBrainRegions = brainRegions.filter(
          (region) => test.brainRegions.includes(region.acronym)
        );
        for (const region of relatedBrainRegions) {
          const neurofeedbackEvent = await storage.createNeurofeedbackEvent({
            userId: testResponse.userId,
            testResponseId: testResponse.id,
            brainRegionId: region.id,
            intensity: testResponse.intensity || Math.floor(Math.random() * 5) + 3,
            // Random intensity between 3-7 if not provided
            duration: 3e3 + Math.floor(Math.random() * 2e3),
            // Between 3-5 seconds
            metadata: {
              questionId: testResponse.questionId,
              testCode: testResponse.testCode,
              brainRegionName: region.name,
              brainRegionColor: region.color
            }
          });
          broadcastNeurofeedbackEvent(testResponse.userId, neurofeedbackEvent);
        }
      }
      res.status(201).json(testResponse);
    } catch (error) {
      console.error("Error processing test response:", error);
      res.status(400).json({ message: "Invalid test response data", error });
    }
  });
  app2.get(`${apiPath}/users/:userId/neurofeedback`, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const limit = parseInt(req.query.limit || "10");
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      const events = await storage.getRecentNeurofeedbackEvents(userId, limit);
      res.json(events);
    } catch (error) {
      console.error("Error retrieving neurofeedback events:", error);
      res.status(500).json({ message: "Failed to retrieve neurofeedback events" });
    }
  });
  app2.post(`${apiPath}/simulate-neurofeedback`, async (req, res) => {
    try {
      const { userId, brainRegionId, intensity } = req.body;
      if (!userId || !brainRegionId) {
        return res.status(400).json({ message: "userId and brainRegionId are required" });
      }
      const region = brainRegions.find((r) => r.id === brainRegionId);
      if (!region) {
        return res.status(404).json({ message: "Brain region not found" });
      }
      const neurofeedbackEvent = await storage.createNeurofeedbackEvent({
        userId,
        testResponseId: null,
        brainRegionId,
        intensity: intensity || 5,
        duration: 3e3,
        metadata: {
          brainRegionName: region.name,
          brainRegionColor: region.color,
          simulated: true
        }
      });
      broadcastNeurofeedbackEvent(userId, neurofeedbackEvent);
      res.status(201).json(neurofeedbackEvent);
    } catch (error) {
      console.error("Error simulating neurofeedback:", error);
      res.status(500).json({ message: "Failed to simulate neurofeedback" });
    }
  });
  const httpServer = createServer(app2);
  const wss = new WebSocketServer({ server: httpServer, path: "/ws" });
  wss.on("connection", (ws) => {
    console.log("WebSocket client connected");
    let userId = null;
    ws.on("message", (message) => {
      try {
        const data = JSON.parse(message.toString());
        if (data.type === "register" && data.userId) {
          userId = parseInt(data.userId);
          if (isNaN(userId)) {
            console.error("Invalid userId in WebSocket registration");
            ws.send(JSON.stringify({ type: "error", message: "Invalid userId" }));
            return;
          }
          if (!activeConnections.has(userId)) {
            activeConnections.set(userId, /* @__PURE__ */ new Set());
          }
          const connections = activeConnections.get(userId);
          if (connections) {
            connections.add(ws);
          }
          ws.send(JSON.stringify({ type: "registered", success: true }));
        }
      } catch (error) {
        console.error("Error processing WebSocket message:", error);
      }
    });
    ws.on("close", () => {
      if (userId !== null) {
        const connections = activeConnections.get(userId);
        if (connections) {
          connections.delete(ws);
          if (connections.size === 0) {
            activeConnections.delete(userId);
          }
        }
      }
      console.log("WebSocket client disconnected");
    });
  });
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/keep-alive.ts
import http from "http";
var INTERVAL_MS = 5 * 60 * 1e3;
var SERVER_URL = "http://localhost:5000/health";
function startKeepAliveService() {
  log("Starting Keep-Alive service for ADVANCED BHARADWAJ TENSOR INTERFACE v.MaxMind");
  setTimeout(() => {
    pingServer();
    setInterval(pingServer, INTERVAL_MS);
  }, 1e4);
}
function pingServer() {
  http.get(SERVER_URL, (res) => {
    if (res.statusCode === 200) {
      log(`Keep-alive ping successful! Server is running.`);
    } else {
      log(`Keep-alive ping received status code: ${res.statusCode}`);
    }
    let data = "";
    res.on("data", (chunk) => {
      data += chunk;
    });
    res.on("end", () => {
      try {
        const parsedData = JSON.parse(data);
        log(`System status: ${parsedData.status} - ${parsedData.message}`);
      } catch (e) {
        log("Could not parse health check response");
      }
    });
  }).on("error", (err) => {
    log(`Keep-alive ping failed: ${err.message}`);
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
    startKeepAliveService();
  });
})();
