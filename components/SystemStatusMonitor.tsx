import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface SystemStatus {
  status: string;
  message: string;
  timestamp: string;
}

/**
 * Component to monitor and display the system status
 * Shows the current server health status, uptime, and last check timestamp
 */
export default function SystemStatusMonitor() {
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Fetch the status every minute
  useEffect(() => {
    const checkStatus = async () => {
      try {
        setLoading(true);
        const response = await fetch('/health');
        
        if (response.ok) {
          const data: SystemStatus = await response.json();
          setStatus(data);
          setError(null);
        } else {
          setError(`Server returned status: ${response.status}`);
        }
      } catch (err) {
        setError('Could not connect to server');
        console.error('Health check failed:', err);
      } finally {
        setLoading(false);
        setLastUpdated(new Date());
      }
    };

    // Check immediately
    checkStatus();
    
    // Then check every minute
    const interval = setInterval(checkStatus, 60000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-4 bg-neutral-dark/90 backdrop-blur-md rounded-lg border border-primary/30 shadow-lg"
      >
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <div className="text-xs text-neutral-light font-mono">SYSTEM STATUS</div>
            <div className="flex items-center gap-2">
              {loading ? (
                <div className="animate-pulse w-3 h-3 rounded-full bg-yellow-500"></div>
              ) : status?.status === 'OK' ? (
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              ) : (
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
              )}
              
              <span className="text-sm font-medium">
                {loading 
                  ? 'Checking...' 
                  : status 
                    ? status.status 
                    : 'Offline'}
              </span>
            </div>
            
            <div className="text-xs text-neutral-light mt-1">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </div>
            
            {error && (
              <div className="text-xs text-red-400 mt-1">{error}</div>
            )}
          </div>
          
          <button 
            onClick={() => window.location.reload()}
            className="ml-auto p-2 rounded hover:bg-primary/20 transition-colors"
            title="Refresh Application"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4 text-primary" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
              />
            </svg>
          </button>
        </div>
      </motion.div>
    </div>
  );
}