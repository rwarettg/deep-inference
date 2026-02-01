import React, { useMemo, useState } from 'react';
import useWebSocket from './hooks/useWebSocket';
import GpuTile from './components/GpuTile';
import './App.css';

const WS_URL = 'wss://chatbot-backend.ttgteams.com/ws/status';

function App() {
  const { status, connectionState } = useWebSocket(WS_URL);
  const [showToast, setShowToast] = useState(false);

  const gpuRows = useMemo(() => {
    if (!status) return [];

    const gpus = status.gpus || [];
    const services = status.services || [];
    
    const gpuServiceMap = new Map();
    services.forEach(service => {
      if (service.gpus?.length > 0) {
        service.gpus.forEach(gpuIdx => {
          if (!gpuServiceMap.has(gpuIdx)) {
            gpuServiceMap.set(gpuIdx, service);
          }
        });
      }
    });

    return gpus.map(gpu => ({
      gpu,
      service: gpuServiceMap.get(gpu.index) || null
    }));
  }, [status]);

  const activeCount = gpuRows.filter(r => r.service).length;

  const handleCopy = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <div className="app">
      {showToast && (
        <div className="toast">
          ✓ Copied to clipboard
        </div>
      )}
      
      <header className="header">
        <h1>Deep Inference</h1>
        <div className="header-right">
          <div className={`connection-badge ${connectionState}`}>
            <span className="status-dot" />
            {connectionState === 'connected' ? 'Live' : 
             connectionState === 'connecting' ? '...' : 'Offline'}
          </div>
          <span className="header-stats">{activeCount} of {gpuRows.length} GPUs active</span>
        </div>
      </header>

      <div className="gpu-list">
        {gpuRows.map(({ gpu, service }) => (
          <GpuTile key={gpu.index} gpu={gpu} service={service} onCopy={handleCopy} />
        ))}
      </div>
    </div>
  );
}

export default App;
