import { useState, useEffect, useRef, useCallback } from 'react';

export type NeurofeedbackEvent = {
  id: number;
  userId: number | null;
  timestamp: Date;
  brainRegionId: string;
  intensity: number | null;
  testResponseId: number | null;
  duration: number | null;
  metadata: {
    brainRegionName?: string;
    brainRegionColor?: string;
    questionId?: string;
    testCode?: string;
    simulated?: boolean;
    [key: string]: any;
  };
};

type WebSocketMessage = 
  | { type: 'neurofeedback'; data: NeurofeedbackEvent }
  | { type: 'registered'; success: boolean }
  | { type: 'error'; message: string };

type UseNeurofeedbackOptions = {
  userId: number | null;
  onEvent?: (event: NeurofeedbackEvent) => void;
  autoConnect?: boolean;
};

export function useNeurofeedback({ 
  userId, 
  onEvent,
  autoConnect = true
}: UseNeurofeedbackOptions) {
  const [isConnected, setIsConnected] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [events, setEvents] = useState<NeurofeedbackEvent[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const socketRef = useRef<WebSocket | null>(null);

  // Connect to the WebSocket server
  const connect = useCallback(() => {
    if (!userId) {
      setError('User ID is required to establish a neurofeedback connection');
      return;
    }
    
    // Close any existing connection
    if (socketRef.current) {
      socketRef.current.close();
    }
    
    // Create WebSocket connection
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    try {
      const socket = new WebSocket(wsUrl);
      socketRef.current = socket;
      
      socket.onopen = () => {
        setIsConnected(true);
        setError(null);
        
        // Register with user ID
        socket.send(JSON.stringify({ 
          type: 'register', 
          userId 
        }));
      };
      
      socket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data) as WebSocketMessage;
          
          switch (message.type) {
            case 'registered':
              setIsRegistered(message.success);
              if (!message.success) {
                setError('Failed to register for neurofeedback events');
              }
              break;
              
            case 'neurofeedback':
              // Process incoming neurofeedback event
              const newEvent = {
                ...message.data,
                // Convert timestamp string to Date object if needed
                timestamp: new Date(message.data.timestamp)
              };
              
              // Update events state
              setEvents(prev => [newEvent, ...prev].slice(0, 20)); // Keep last 20 events
              
              // Call the onEvent callback if provided
              if (onEvent) {
                onEvent(newEvent);
              }
              break;
              
            case 'error':
              setError(message.message);
              break;
              
            default:
              console.warn('Unknown message type received:', message);
          }
        } catch (err) {
          console.error('Error parsing WebSocket message:', err);
        }
      };
      
      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        setError('NEURSYS LAB MODEL');
        setIsConnected(false);
        setIsRegistered(false);
      };
      
      socket.onclose = () => {
        setIsConnected(false);
        setIsRegistered(false);
      };
    } catch (err) {
      console.error('Failed to create WebSocket connection:', err);
      setError('NEURSYS LAB MODEL');
    }
  }, [userId, onEvent]);
  
  // Disconnect from the WebSocket server
  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
  }, []);
  
  // Simulate a neurofeedback event (for testing/demo purposes)
  const simulateEvent = useCallback(async (brainRegionId: string, intensity?: number) => {
    if (!userId) {
      setError('User ID is required to simulate neurofeedback');
      return;
    }
    
    try {
      const response = await fetch('/api/simulate-neurofeedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          brainRegionId,
          intensity,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to simulate neurofeedback event');
      }
      
      return await response.json();
    } catch (err) {
      console.error('Error simulating neurofeedback:', err);
      setError(err instanceof Error ? err.message : 'Unknown error simulating neurofeedback');
      return null;
    }
  }, [userId]);
  
  // Connect on mount if autoConnect is true
  useEffect(() => {
    if (autoConnect && userId) {
      connect();
    }
    
    // Cleanup on unmount
    return () => {
      disconnect();
    };
  }, [autoConnect, userId, connect, disconnect]);
  
  return {
    isConnected,
    isRegistered,
    events,
    error,
    connect,
    disconnect,
    simulateEvent,
  };
}