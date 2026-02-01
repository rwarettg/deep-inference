import React from 'react';

function GpuCard({ gpu }) {
  const memoryPercent = (gpu.memory_used / gpu.memory_total) * 100;
  const isHighMemory = memoryPercent > 80;
  
  // Temperature color class
  const getTempClass = (temp) => {
    if (temp >= 80) return 'hot';
    if (temp >= 60) return 'warm';
    return '';
  };

  // Format memory in GB for cleaner display
  const formatMemory = (mb) => {
    return (mb / 1024).toFixed(1);
  };

  return (
    <div className="gpu-card">
      <div className="gpu-header">
        <span className="gpu-name">{gpu.name}</span>
        <span className="gpu-index">GPU {gpu.index}</span>
      </div>
      
      <div className={`gpu-model ${!gpu.model ? 'idle' : ''}`}>
        {gpu.model || 'No model loaded'}
      </div>
      
      <div className="gpu-stats">
        <div className="stat">
          <span className="stat-label">Temperature</span>
          <span className={`stat-value temp ${getTempClass(gpu.temp)}`}>
            {gpu.temp}°C
          </span>
        </div>
        
        <div className="stat">
          <span className="stat-label">Utilization</span>
          <span className="stat-value">{gpu.util}%</span>
        </div>
        
        <div className="memory-bar-container">
          <div className="memory-bar-header">
            <span className="memory-bar-label">VRAM</span>
            <span className="memory-bar-value">
              {formatMemory(gpu.memory_used)} / {formatMemory(gpu.memory_total)} GB
            </span>
          </div>
          <div className="memory-bar">
            <div 
              className={`memory-bar-fill ${isHighMemory ? 'high' : ''}`}
              style={{ width: `${memoryPercent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default GpuCard;
