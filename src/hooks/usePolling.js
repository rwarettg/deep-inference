import { useState, useEffect, useCallback, useRef } from 'react';

const DEFAULT_INTERVAL = 3000;

export function usePolling(url, interval = DEFAULT_INTERVAL) {
  const [status, setStatus] = useState(null);
  const [connectionState, setConnectionState] = useState('connecting');
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);
  const abortControllerRef = useRef(null);
  const hasConnected = useRef(false);

  const fetchStatus = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    
    try {
      const response = await fetch(url, {
        signal: abortControllerRef.current.signal,
        headers: { 'Accept': 'application/json' }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      setStatus(data);
      setError(null);
      hasConnected.current = true;
      
      // Restore to connected (handles reconnection after offline)
      setConnectionState('connected');
    } catch (e) {
      if (e.name === 'AbortError') return;
      
      console.error('Poll failed:', e);
      setError(e.message);
      
      // Show disconnected after we've been connected and now failed
      if (hasConnected.current) {
        setConnectionState('disconnected');
      }
    }
  }, [url]);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  useEffect(() => {
    hasConnected.current = false;
    setConnectionState('connecting');
    
    fetchStatus();
    intervalRef.current = setInterval(fetchStatus, interval);
    
    return () => stopPolling();
  }, [fetchStatus, interval, stopPolling]);

  return { status, connectionState, error };
}

export default usePolling;
