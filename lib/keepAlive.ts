/**
 * Client-side keep-alive service for ADVANCED BHARADWAJ TENSOR INTERFACE v.MaxMind
 * This service helps keep the application running by periodically sending health check requests
 */

// Interval in milliseconds (10 minutes)
const KEEP_ALIVE_INTERVAL = 10 * 60 * 1000;

/**
 * Starts the client-side keep-alive service
 */
export function startClientKeepAlive() {
  console.log('Starting client-side keep-alive service...');
  
  // Run the first health check after 1 minute
  setTimeout(() => {
    performHealthCheck();
    
    // Then run every KEEP_ALIVE_INTERVAL
    setInterval(performHealthCheck, KEEP_ALIVE_INTERVAL);
  }, 60 * 1000);
}

/**
 * Performs a health check by sending a request to the server's health endpoint
 */
async function performHealthCheck() {
  try {
    const startTime = Date.now();
    const response = await fetch('/health');
    const responseTime = Date.now() - startTime;
    
    if (response.ok) {
      const data = await response.json();
      console.log(`Health check successful (${responseTime}ms): ${data.message}`);
    } else {
      console.warn(`Health check failed with status: ${response.status}`);
    }
  } catch (error) {
    console.error('Health check error:', error);
  }
}