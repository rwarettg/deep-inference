import { useState, useEffect, useCallback, useRef } from 'react';

export function useWebSocket(url) {
  const [status, setStatus] = useState(null);
  const [connectionState, setConnectionState] = useState('connecting');
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttempts = useRef(0);
  const connectRef = useRef(null);

  const connect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
    }

    setConnectionState('connecting');

    try {
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connected');
        setConnectionState('connected');
        reconnectAttempts.current = 0;
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type !== 'ping') {
            setStatus(data);
          }
        } catch (e) {
          console.error('Failed to parse message:', e);
        }
      };

      ws.onerror = (e) => {
        console.error('WebSocket error:', e);
      };

      ws.onclose = () => {
        console.log('WebSocket closed');
        setConnectionState('disconnected');
        wsRef.current = null;

        // Reconnect with backoff
        const delay = Math.min(3000 * Math.pow(1.5, reconnectAttempts.current), 30000);
        reconnectAttempts.current += 1;
        console.log(`Reconnecting in ${delay}ms`);
        reconnectTimeoutRef.current = setTimeout(() => connectRef.current?.(), delay);
      };
    } catch (e) {
      console.error('Failed to create WebSocket:', e);
      setConnectionState('disconnected');
    }
  }, [url]);

  // Keep connectRef in sync with the latest connect function
  useEffect(() => {
    connectRef.current = connect;
  }, [connect]);

  useEffect(() => {
    // Use queueMicrotask to avoid synchronous setState in effect body
    queueMicrotask(() => {
      connect();
    });
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect]);

  return { status, connectionState };
}

export default useWebSocket;
