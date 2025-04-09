import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { PiBrain, PiGameController, PiLightbulb, PiHeartbeat } from 'react-icons/pi';
import { FaBrain, FaGem, FaChartLine, FaTrophy } from 'react-icons/fa';

// Define the game challenge structure
interface Challenge {
  id: string;
  title: string;
  description: string;
  choices: {
    id: string;
    text: string;
    outcome: {
      type: 'positive' | 'negative' | 'neutral';
      description: string;
      effect: string;
      scoreChange: number;
      unlocks?: string;
    };
  }[];
  brainRegions: string[];
}

// The available challenges in the game
const challenges: Challenge[] = [
  {
    id: 'procrastination',
    title: 'Procrastination Loop – Level 1',
    description: 'You stare at the blank screen. You know what needs to be done. But the mind says "Just 5 more minutes." Your heart sinks deeper. A familiar inner critic whispers, "You\'re never consistent anyway."',
    choices: [
      {
        id: 'guilt',
        text: 'Attack It With Guilt',
        outcome: {
          type: 'negative',
          description: 'You failed again. Just like yesterday.',
          effect: 'Emotional Density Meter increases',
          scoreChange: -5,
          unlocks: 'Loop Amplified – Level 2 Appears Immediately'
        }
      },
      {
        id: 'mirror',
        text: 'Use MPHM to Mirror the Thought Silently',
        outcome: {
          type: 'neutral',
          description: 'Observe without judgment. Don\'t force. Just reflect.',
          effect: 'Loop intensity drops 15%',
          scoreChange: 3,
          unlocks: 'Mirror Strategy Mini Practice'
        }
      },
      {
        id: 'interrupt',
        text: 'Use BUCP-DT Module 6: Self-Sabotage Interrupt',
        outcome: {
          type: 'positive',
          description: 'Your brain is stuck between high inhibition (fear) and reward-seeking failure.',
          effect: 'Progression to next tile unlocked',
          scoreChange: 7,
          unlocks: 'Loop Reversal Prompt'
        }
      },
      {
        id: 'mindfulness',
        text: 'Let the Loop Pass – Mindfulness Only Mode',
        outcome: {
          type: 'neutral',
          description: 'I am safe. I can return to this later.',
          effect: 'Player avoids escalation, but doesn\'t confront loop source',
          scoreChange: 1,
          unlocks: 'Mindfulness Safe Zone Badge'
        }
      }
    ],
    brainRegions: ['Prefrontal Cortex', 'Striatum', 'Default Mode Network']
  },
  {
    id: 'trust-dissolution',
    title: 'Trust Dissolution Field – Level 2',
    description: 'A memory flashes - someone you trusted betrayed you. Your heart races. The familiar tension returns to your shoulders. "Everyone eventually disappoints you," whispers the mind. The field expands, projecting this pattern onto new relationships.',
    choices: [
      {
        id: 'generalize',
        text: 'Reinforce the Pattern: "Everyone is Untrustworthy"',
        outcome: {
          type: 'negative',
          description: 'The field strengthens. New relationships become filtered through this lens.',
          effect: 'Trust Dissolution Field expands by 30%',
          scoreChange: -7,
          unlocks: 'Tensor Field Analysis: Trust Collapse'
        }
      },
      {
        id: 'analyze',
        text: 'Analyze Individual Case vs. Pattern Recognition',
        outcome: {
          type: 'positive',
          description: 'The field weakens as you distinguish specific case from universal pattern.',
          effect: 'Field intensity reduced by 40%',
          scoreChange: 8,
          unlocks: 'Tensor Realignment Tool'
        }
      },
      {
        id: 'visualize',
        text: 'Safe Place Visualization with Trusted Figures',
        outcome: {
          type: 'neutral',
          description: 'The field temporarily stabilizes but remains intact.',
          effect: 'Temporary field stabilization',
          scoreChange: 3,
          unlocks: 'Safe Memory Repository'
        }
      },
      {
        id: 'exposure',
        text: 'Micro-Trust Challenge: Small Exposure Exercise',
        outcome: {
          type: 'positive',
          description: 'The field begins to recalibrate with new counter-evidence.',
          effect: 'Field disruption begins',
          scoreChange: 6,
          unlocks: 'Rejection Resilience Protocol'
        }
      }
    ],
    brainRegions: ['Anterior Insula', 'TPJ', 'Basolateral Amygdala']
  },
  {
    id: 'identity-erosion',
    title: 'Identity Erosion Field – Level 3',
    description: 'You notice yourself becoming a chameleon in different social contexts. "Who am I really?" you wonder. The familiar emptiness returns. Your core sense of self feels increasingly hollow, shifted by external validation and others\' expectations.',
    choices: [
      {
        id: 'please',
        text: 'Continue People-Pleasing Adaptation',
        outcome: {
          type: 'negative',
          description: 'Identity continues to fragment across contexts.',
          effect: 'Identity Consistency drops by 25%',
          scoreChange: -6,
          unlocks: 'Social Mirror Analysis'
        }
      },
      {
        id: 'journal',
        text: 'Practice Mirror-State Journaling',
        outcome: {
          type: 'positive',
          description: 'Core identity elements begin to crystallize and stabilize.',
          effect: 'Self-concept coherence increases by 30%',
          scoreChange: 8,
          unlocks: 'Core Identity Protocol'
        }
      },
      {
        id: 'boundaries',
        text: 'Implement Identity Boundaries Exercise',
        outcome: {
          type: 'positive',
          description: 'The ability to maintain consistent self improves across contexts.',
          effect: 'Identity field strengthens in high-pressure social situations',
          scoreChange: 7,
          unlocks: 'Boundary Navigation Tool'
        }
      },
      {
        id: 'observe',
        text: 'Just Observe the Shifting Identities',
        outcome: {
          type: 'neutral',
          description: 'You gain awareness but the pattern remains unchanged.',
          effect: 'Self-awareness increases without changing the pattern',
          scoreChange: 2,
          unlocks: 'Identity Mapping System'
        }
      }
    ],
    brainRegions: ['Posterior Cingulate Cortex', 'Default Mode Network', 'Hippocampus']
  }
];

const MindGridGame: React.FC = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [showOutcome, setShowOutcome] = useState(false);
  const [playerScore, setPlayerScore] = useState(0);
  const [mentalResilienceScore, setMentalResilienceScore] = useState(0);
  const [consecutiveCorrectAnswers, setConsecutiveCorrectAnswers] = useState(0);
  const [showMasteryTile, setShowMasteryTile] = useState(false);
  const [unlockedItems, setUnlockedItems] = useState<string[]>([]);
  
  const currentChallenge = challenges[currentChallengeIndex];
  
  // Handle starting the game
  const handleStartGame = () => {
    setGameStarted(true);
    setPlayerScore(0);
    setMentalResilienceScore(0);
    setCurrentChallengeIndex(0);
    setConsecutiveCorrectAnswers(0);
    setUnlockedItems([]);
  };
  
  // Handle choosing an option
  const handleChoiceSelect = (choiceId: string) => {
    if (showOutcome) return; // Prevent selection during outcome display
    
    setSelectedChoice(choiceId);
    setShowOutcome(true);
    
    const choice = currentChallenge.choices.find(c => c.id === choiceId);
    if (!choice) return;
    
    // Update scores
    setPlayerScore(prev => prev + choice.outcome.scoreChange);
    
    // Handle consecutive correct answers
    if (choice.outcome.type === 'positive') {
      const newConsecutive = consecutiveCorrectAnswers + 1;
      setConsecutiveCorrectAnswers(newConsecutive);
      
      // Add to mental resilience score for positive outcomes
      setMentalResilienceScore(prev => prev + Math.max(2, choice.outcome.scoreChange));
      
      // Show mastery tile if player gets two correct answers in a row
      if (newConsecutive >= 2) {
        setShowMasteryTile(true);
      }
    } else {
      setConsecutiveCorrectAnswers(0);
    }
    
    // Track unlocked items
    if (choice.outcome.unlocks) {
      setUnlockedItems(prev => [...prev, choice.outcome.unlocks!]);
    }
  };
  
  // Handle moving to next challenge
  const handleNextChallenge = () => {
    if (currentChallengeIndex < challenges.length - 1) {
      setCurrentChallengeIndex(prev => prev + 1);
    } else {
      // Game completed
      // Could reset or show completion screen
    }
    
    setSelectedChoice(null);
    setShowOutcome(false);
    setShowMasteryTile(false);
  };
  
  // Reset the game
  const handleReset = () => {
    setGameStarted(false);
    setCurrentChallengeIndex(0);
    setSelectedChoice(null);
    setShowOutcome(false);
    setPlayerScore(0);
    setMentalResilienceScore(0);
    setConsecutiveCorrectAnswers(0);
    setShowMasteryTile(false);
    setUnlockedItems([]);
  };
  
  // Determine the background color based on the outcome type
  const getOutcomeColor = (type: 'positive' | 'negative' | 'neutral') => {
    switch (type) {
      case 'positive':
        return 'bg-green-900/40 border-green-500/40';
      case 'negative':
        return 'bg-red-900/40 border-red-500/40';
      case 'neutral':
        return 'bg-blue-900/40 border-blue-500/40';
      default:
        return 'bg-blue-900/40 border-blue-500/40';
    }
  };
  
  // Render the game UI
  if (!gameStarted) {
    return (
      <div className="relative overflow-hidden rounded-xl border border-blue-900/40 bg-black/40 p-8">
        <div className="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl"></div>
        <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-purple-500/10 blur-3xl"></div>
        
        <div className="relative z-10 text-center">
          <div className="flex justify-center mb-4">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-blue-900/30 border border-blue-500/40">
              <PiGameController className="w-12 h-12 text-blue-400" />
            </div>
          </div>
          
          <h2 className="text-3xl font-bold mb-4">MindGrid Challenge</h2>
          <p className="text-lg opacity-80 mb-8 max-w-2xl mx-auto">
            Navigate through cognitive patterns and emotional loops in this immersive neurofeedback game. Choose your responses to mental challenges and train your brain to recognize and transform tensor patterns.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="p-4 bg-black/30 rounded-lg border border-blue-900/30">
              <div className="flex items-center justify-center text-blue-400 mb-2">
                <PiBrain className="w-8 h-8" />
              </div>
              <h3 className="font-medium mb-1">Tensor Patterns</h3>
              <p className="text-sm opacity-70">Identify emotional and cognitive fields</p>
            </div>
            
            <div className="p-4 bg-black/30 rounded-lg border border-blue-900/30">
              <div className="flex items-center justify-center text-green-400 mb-2">
                <PiLightbulb className="w-8 h-8" />
              </div>
              <h3 className="font-medium mb-1">Neural Training</h3>
              <p className="text-sm opacity-70">Build new neural pathways with each choice</p>
            </div>
            
            <div className="p-4 bg-black/30 rounded-lg border border-blue-900/30">
              <div className="flex items-center justify-center text-purple-400 mb-2">
                <PiHeartbeat className="w-8 h-8" />
              </div>
              <h3 className="font-medium mb-1">Real-time Feedback</h3>
              <p className="text-sm opacity-70">Watch your neural signature evolve</p>
            </div>
            
            <div className="p-4 bg-black/30 rounded-lg border border-blue-900/30">
              <div className="flex items-center justify-center text-amber-400 mb-2">
                <FaTrophy className="w-7 h-7" />
              </div>
              <h3 className="font-medium mb-1">Memory Mastery</h3>
              <p className="text-sm opacity-70">Unlock special abilities and insights</p>
            </div>
          </div>
          
          <Button 
            onClick={handleStartGame}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Begin Neural Challenge
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="relative overflow-hidden rounded-xl border border-blue-900/40 bg-black/40 p-6">
      {/* Background effects */}
      <div className="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl"></div>
      <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-purple-500/10 blur-3xl"></div>
      
      {/* Game stats header */}
      <div className="relative z-10 flex justify-between items-center mb-6 pb-4 border-b border-blue-900/40">
        <div className="flex items-center gap-4">
          <div className="bg-blue-900/20 p-2 rounded-lg">
            <FaBrain className="text-blue-400 w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">MindGrid Challenge</h2>
            <div className="text-sm opacity-70">Level {currentChallengeIndex + 1}/{challenges.length}</div>
          </div>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-black/30 rounded-lg p-2 border border-blue-900/30">
            <div className="text-xs opacity-70">Player Score</div>
            <div className="font-bold text-blue-400">{playerScore}</div>
          </div>
          
          <div className="bg-black/30 rounded-lg p-2 border border-blue-900/30">
            <div className="text-xs opacity-70">Mental Resilience</div>
            <div className="font-bold text-green-400">{mentalResilienceScore}</div>
          </div>
        </div>
      </div>
      
      {/* Main challenge */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          {/* Challenge card */}
          <motion.div 
            className="bg-black/50 rounded-xl border border-blue-900/30 p-6 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-sm text-blue-400 mb-2 font-mono">CHALLENGE TILE</div>
            <h3 className="text-xl font-bold mb-4">{currentChallenge.title}</h3>
            <p className="opacity-80 italic mb-6">"{currentChallenge.description}"</p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {currentChallenge.brainRegions.map((region, index) => (
                <div key={index} className="bg-blue-900/20 text-xs px-2 py-1 rounded-full">
                  {region}
                </div>
              ))}
            </div>
          </motion.div>
          
          {/* Choices */}
          {!showOutcome ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentChallenge.choices.map((choice) => (
                <motion.div
                  key={choice.id}
                  className={`bg-black/30 rounded-xl border border-blue-900/30 p-4 cursor-pointer transition-all hover:bg-blue-900/20 hover:border-blue-500/40 ${
                    selectedChoice === choice.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => handleChoiceSelect(choice.id)}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 * currentChallenge.choices.indexOf(choice) }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <h4 className="font-bold mb-2">{choice.text}</h4>
                  <div className="text-xs opacity-70">
                    {choice.id === 'mirror' && 'Mirror Pathway Route – Slow Non-Verbal Therapy'}
                    {choice.id === 'interrupt' && 'Cognitive Dissection Route – Direct Approach'}
                    {choice.id === 'guilt' && 'Reinforcement Loop – Negative Outcome'}
                    {choice.id === 'mindfulness' && 'Passive Observation Route – Neutral Outcome'}
                    {choice.id === 'generalize' && 'Field Reinforcement – Negative Pattern'}
                    {choice.id === 'analyze' && 'Pattern Breaking – Analytical Approach'}
                    {choice.id === 'visualize' && 'Safe Place Protocol – Temporary Relief'}
                    {choice.id === 'exposure' && 'Microdosing Approach – Gradual Recalibration'}
                    {choice.id === 'please' && 'External Validation Path – Identity Diffusion'}
                    {choice.id === 'journal' && 'Mirror-State Method – Core Identity Work'}
                    {choice.id === 'boundaries' && 'Boundary Setting Protocol – Self Preservation'}
                    {choice.id === 'observe' && 'Mindful Awareness – Observer Perspective'}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            // Outcome display
            <motion.div
              className={`rounded-xl border p-6 mb-6 ${
                getOutcomeColor(currentChallenge.choices.find(c => c.id === selectedChoice)?.outcome.type || 'neutral')
              }`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Outcome</h3>
                <div className={`px-3 py-1 rounded-full text-xs ${
                  selectedChoice && currentChallenge.choices.find(c => c.id === selectedChoice)?.outcome.type === 'positive' 
                    ? 'bg-green-900/40 text-green-400' 
                    : selectedChoice && currentChallenge.choices.find(c => c.id === selectedChoice)?.outcome.type === 'negative'
                      ? 'bg-red-900/40 text-red-400'
                      : 'bg-blue-900/40 text-blue-400'
                }`}>
                  {selectedChoice && currentChallenge.choices.find(c => c.id === selectedChoice)?.outcome.type === 'positive' 
                    ? 'Positive Outcome' 
                    : selectedChoice && currentChallenge.choices.find(c => c.id === selectedChoice)?.outcome.type === 'negative'
                      ? 'Negative Outcome'
                      : 'Neutral Outcome'}
                </div>
              </div>
              
              <p className="text-lg italic mb-4">
                "{selectedChoice && currentChallenge.choices.find(c => c.id === selectedChoice)?.outcome.description}"
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-black/30 rounded-lg p-3 border border-blue-900/30">
                  <div className="text-xs opacity-70 mb-1">Effect</div>
                  <div className="font-medium">
                    {selectedChoice && currentChallenge.choices.find(c => c.id === selectedChoice)?.outcome.effect}
                  </div>
                </div>
                
                <div className="bg-black/30 rounded-lg p-3 border border-blue-900/30">
                  <div className="text-xs opacity-70 mb-1">Unlocked</div>
                  <div className="font-medium">
                    {selectedChoice && currentChallenge.choices.find(c => c.id === selectedChoice)?.outcome.unlocks}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between">
                <Button variant="outline" onClick={handleReset}>
                  Reset Game
                </Button>
                
                <Button onClick={handleNextChallenge}>
                  {currentChallengeIndex < challenges.length - 1 ? 'Next Challenge' : 'Complete Game'}
                </Button>
              </div>
            </motion.div>
          )}
        </div>
        
        {/* Side panel - Neural visualization and stats */}
        <div className="space-y-6">
          {/* Neural activation */}
          <motion.div 
            className="bg-black/50 rounded-xl border border-blue-900/30 p-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-sm font-medium mb-3 flex items-center">
              <FaBrain className="mr-2 text-blue-400" /> Neural Activation
            </h3>
            
            <div className="relative h-40 rounded-lg overflow-hidden mb-3 bg-black/40">
              {/* Neural visualization placeholder - would be dynamic based on choices */}
              <div className="absolute inset-0">
                <div className="w-full h-full relative">
                  {Array.from({ length: 20 }).map((_, idx) => (
                    <motion.div
                      key={idx}
                      className="absolute rounded-full"
                      style={{
                        width: 4 + Math.random() * 10,
                        height: 4 + Math.random() * 10,
                        backgroundColor: `hsl(${210 + idx * 5}, ${70 + Math.random() * 30}%, ${40 + Math.random() * 30}%)`,
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                      }}
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.7, 1, 0.7],
                      }}
                      transition={{
                        duration: 2 + Math.random() * 3,
                        repeat: Infinity,
                        delay: Math.random() * 2,
                      }}
                    />
                  ))}
                  
                  {/* Connections between nodes */}
                  <svg className="absolute w-full h-full">
                    {Array.from({ length: 15 }).map((_, idx) => {
                      const x1 = `${Math.random() * 90 + 5}%`;
                      const y1 = `${Math.random() * 90 + 5}%`;
                      const x2 = `${Math.random() * 90 + 5}%`;
                      const y2 = `${Math.random() * 90 + 5}%`;
                      
                      return (
                        <motion.line
                          key={idx}
                          x1={x1}
                          y1={y1}
                          x2={x2}
                          y2={y2}
                          stroke={`hsl(${210 + idx * 10}, 70%, 60%)`}
                          strokeWidth="0.5"
                          strokeOpacity="0.3"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ 
                            duration: 2, 
                            repeat: Infinity,
                            repeatType: "reverse" 
                          }}
                        />
                      );
                    })}
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="text-xs uppercase tracking-wider opacity-70 mb-1">Active Brain Regions</div>
            <div className="space-y-2">
              {currentChallenge.brainRegions.map((region, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm">{region}</span>
                  <div className="w-24 h-1.5 bg-black/40 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-blue-500" 
                      initial={{ width: "0%" }}
                      animate={{ width: `${65 + Math.random() * 30}%` }}
                      transition={{ duration: 1, delay: 0.1 * index }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          
          {/* Unlocked items */}
          <motion.div 
            className="bg-black/50 rounded-xl border border-blue-900/30 p-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="text-sm font-medium mb-3 flex items-center">
              <FaGem className="mr-2 text-purple-400" /> Unlocked Items
            </h3>
            
            {unlockedItems.length > 0 ? (
              <div className="space-y-2">
                {unlockedItems.map((item, index) => (
                  <div key={index} className="bg-purple-900/20 text-sm px-3 py-2 rounded-md border border-purple-900/30 flex items-center">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mr-2"></div>
                    {item}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm opacity-70 bg-black/30 p-3 rounded-lg border border-blue-900/20">
                Complete challenges to unlock special items and abilities
              </div>
            )}
          </motion.div>
          
          {/* Progress metrics */}
          <motion.div 
            className="bg-black/50 rounded-xl border border-blue-900/30 p-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h3 className="text-sm font-medium mb-3 flex items-center">
              <FaChartLine className="mr-2 text-green-400" /> Brain Training Metrics
            </h3>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Mental Resilience</span>
                  <span>{mentalResilienceScore} points</span>
                </div>
                <div className="h-1.5 bg-black/40 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-green-500" 
                    initial={{ width: "0%" }}
                    animate={{ width: `${Math.min(100, mentalResilienceScore * 5)}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Pattern Recognition</span>
                  <span>{Math.floor(playerScore / 3)} points</span>
                </div>
                <div className="h-1.5 bg-black/40 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-blue-500" 
                    initial={{ width: "0%" }}
                    animate={{ width: `${Math.min(100, (playerScore / 3) * 10)}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Consecutive Insights</span>
                  <span>{consecutiveCorrectAnswers}/2</span>
                </div>
                <div className="h-1.5 bg-black/40 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-amber-500" 
                    initial={{ width: "0%" }}
                    animate={{ width: `${(consecutiveCorrectAnswers / 2) * 100}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Mastery Tile - appears after two consecutive correct answers */}
      {showMasteryTile && (
        <motion.div
          className="mt-6 bg-amber-900/30 rounded-xl border border-amber-500/40 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-amber-400">COGNITIVE MASTERY UNLOCKED</h3>
            <div className="bg-amber-900/40 px-3 py-1 rounded-full text-xs text-amber-400">
              SPECIAL ABILITY
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-black/30 rounded-lg p-3 border border-amber-900/30">
              <h4 className="text-sm font-medium mb-2 text-amber-400">TRMT-Based Visualization</h4>
              <p className="text-xs opacity-70">Unlock Tensor Resonance Mapping Technique for advanced pattern recognition</p>
            </div>
            
            <div className="bg-black/30 rounded-lg p-3 border border-amber-900/30">
              <h4 className="text-sm font-medium mb-2 text-amber-400">Emotional Field Mapping</h4>
              <p className="text-xs opacity-70">Gain ability to visualize emotional tensors in real-time decision making</p>
            </div>
            
            <div className="bg-black/30 rounded-lg p-3 border border-amber-900/30">
              <h4 className="text-sm font-medium mb-2 text-amber-400">Personal Insight Journal</h4>
              <p className="text-xs opacity-70">AI-guided tensor pattern analysis based on your unique neural signature</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default MindGridGame;