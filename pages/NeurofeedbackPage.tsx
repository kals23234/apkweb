import React, { useState } from 'react';
import { Link } from 'wouter';
import NeurofeedbackVisualizer from '@/components/NeurofeedbackVisualizer';
import MindGridGame from '@/components/MindGridGame';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { FaBrain, FaDatabase, FaPlugCircleBolt, FaCircleNodes, FaGamepad } from 'react-icons/fa6';
import { FaSyncAlt, FaSync } from 'react-icons/fa';

export default function NeurofeedbackPage() {
  const [demoMode, setDemoMode] = useState(true);
  const [userId, setUserId] = useState<number | null>(1); // Default to user ID 1
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-4xl font-bold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
            Live Neurofeedback Simulator
          </h1>
          <p className="text-center text-lg opacity-80 max-w-3xl mx-auto">
            Visualize real-time brain activity based on cognitive tests using EEG-like simulation.
            Watch as different regions of the brain activate in response to test answers.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card className="border-gray-800 bg-black/40 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle>Brain Activity Visualization</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant={demoMode ? 'default' : 'outline'}>
                      {demoMode ? 'Demo Mode' : 'Live Mode'}
                    </Badge>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setDemoMode(!demoMode)}
                    >
                      Toggle Mode
                    </Button>
                  </div>
                </div>
                <CardDescription>
                  3D visualization of brain region activations through neurofeedback
                </CardDescription>
              </CardHeader>
              <CardContent>
                <NeurofeedbackVisualizer userId={userId} demoMode={demoMode} />
              </CardContent>
              <CardFooter className="border-t border-gray-800 flex justify-between text-sm text-gray-400 pt-4">
                <div>
                  <span className="mr-4">Current User ID: {userId || 'None'}</span>
                  {demoMode && <span>Use the trigger button to simulate random brain activations</span>}
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/brain-map">View Brain Map</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div>
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="how-it-works">How It Works</TabsTrigger>
              </TabsList>
              
              <TabsContent value="about" className="mt-0">
                <Card className="border-gray-800 bg-black/40 backdrop-blur-sm h-full">
                  <CardHeader>
                    <CardTitle>Neurofeedback System</CardTitle>
                    <CardDescription>The Bharadwaj Framework's realtime cognitive visualization</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 p-2 rounded-full bg-blue-950/50">
                        <FaBrain className="text-blue-500 w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Cognitive Mapping</h4>
                        <p className="text-sm opacity-80">
                          Maps test responses to specific brain regions based on neurological correlations
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="mt-1 p-2 rounded-full bg-purple-950/50">
                        <FaPlugCircleBolt className="text-purple-500 w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Real-time Processing</h4>
                        <p className="text-sm opacity-80">
                          Uses WebSocket technology to stream brain activity data with minimal latency
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="mt-1 p-2 rounded-full bg-indigo-950/50">
                        <FaCircleNodes className="text-indigo-500 w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Neural Network Visualization</h4>
                        <p className="text-sm opacity-80">
                          Visually represents the complex interconnections between brain regions
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="how-it-works" className="mt-0">
                <Card className="border-gray-800 bg-black/40 backdrop-blur-sm h-full">
                  <CardHeader>
                    <CardTitle>How It Works</CardTitle>
                    <CardDescription>Technical implementation overview</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold">1. Test Response Collection</h4>
                      <p className="text-sm opacity-80">
                        User responses to cognitive tests are collected and analyzed
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-semibold">2. Brain Region Mapping</h4>
                      <p className="text-sm opacity-80">
                        Responses are mapped to specific brain regions based on test type
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-semibold">3. WebSocket Streaming</h4>
                      <p className="text-sm opacity-80">
                        Activation events are streamed to the client via WebSocket connection
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-semibold">4. 3D Visualization</h4>
                      <p className="text-sm opacity-80">
                        Three.js renders the brain model and animates region activations
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-blue-900/30 border border-blue-500/40 flex items-center justify-center">
                <FaGamepad className="text-blue-400 w-5 h-5" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Tensor Pattern Challenge</h2>
                <p className="text-sm opacity-70">Interactive cognitive pattern training through gamified neurofeedback</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="animate-pulse rounded-full px-3 py-1 bg-blue-900/20 border border-blue-500/30 text-xs font-mono text-blue-400">
                BHARADWAJ ADVANCE TENSOR NEUROFEEDBACK
              </div>
            </div>
          </div>
          
          <MindGridGame />
        </div>

        <Card className="border-gray-800 bg-black/40 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Take a Cognitive Test</CardTitle>
            <CardDescription>
              Complete a test to see your brain activity visualization in real-time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {['BUCP-DT Core', 'Visual Processing', 'Working Memory', 'Executive Function'].map((test, index) => (
                <Card key={index} className="border-gray-700 bg-gray-900/60 hover:bg-gray-900/80 transition-colors cursor-pointer">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{test}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm opacity-70">
                      Experience how this test activates specific brain regions
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" variant="outline">Start Test</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}