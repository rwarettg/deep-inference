import React from 'react';

function GpuOverview({ gpus }) {
  if (!gpus || gpus.length === 0) {
    return null;
  }

  const getTempClass = (temp) => {
    if (temp >= 80) return 'hot';
    if (temp >= 60) return 'warm';
    return 'cool';
  };

  const formatMemory = (mb) => (mb / 1024).toFixed(1);

  return (
    <div className="gpu-overview">
      {gpus.map((gpu) => {
        const memPct = (gpu.memory_used / gpu.memory_total) * 100;
        return (
          <div key={gpu.index} className="gpu-mini">
            <div className="gpu-mini-header">
              <span className="gpu-mini-index">GPU {gpu.index}</span>
              <span className="gpu-mini-name">{gpu.name.replace('NVIDIA GeForce ', '')}</span>
            </div>
            <div className="gpu-mini-stats">
              <div className="gpu-mini-bar">
                <div 
                  className={`gpu-mini-bar-fill ${memPct > 80 ? 'high' : ''}`}
                  style={{ width: `${memPct}%` }}
                />
              </div>
              <span className="gpu-mini-mem">
                {formatMemory(gpu.memory_used)}/{formatMemory(gpu.memory_total)}GB
              </span>
              <span className={`gpu-mini-temp ${getTempClass(gpu.temp)}`}>
                {gpu.temp}°C
              </span>
              <span className="gpu-mini-util">{gpu.util}%</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default GpuOverview;
