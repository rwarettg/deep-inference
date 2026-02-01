import React from 'react';

function ServiceCard({ service }) {
  const getTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'llm': return '🧠';
      case 'stt': return '🎤';
      case 'tts': return '🔊';
      default: return '📦';
    }
  };

  const getHealthClass = (status) => {
    if (status === 'healthy') return 'healthy';
    if (status === 'unhealthy') return 'unhealthy';
    return 'unknown';
  };

  // Extract short model name
  const getShortName = (model) => {
    if (!model) return 'Unknown';
    const parts = model.split('/');
    return parts[parts.length - 1];
  };

  return (
    <div className="service-card">
      <div className="service-header">
        <div className="service-type-icon">{getTypeIcon(service.type)}</div>
        <div className="service-meta">
          <span className={`service-type ${service.type?.toLowerCase()}`}>
            {service.type?.toUpperCase()}
          </span>
          <span className="service-port">:{service.port}</span>
        </div>
        <div className={`service-health ${getHealthClass(service.status)}`}>
          <span className="health-dot" />
        </div>
      </div>

      <div className="service-model">
        {getShortName(service.model)}
      </div>
      
      <div className="service-model-full" title={service.model}>
        {service.model}
      </div>

      {service.container && (
        <div className="service-container">
          <span className="container-icon">🐳</span>
          {service.container}
        </div>
      )}

      {service.aliases?.length > 0 && (
        <div className="service-aliases">
          {service.aliases.map((alias, i) => (
            <span key={i} className="alias-tag">{alias}</span>
          ))}
        </div>
      )}

      {service.gpus?.length > 0 && (
        <div className="service-gpus">
          <span className="gpu-label">GPUs:</span>
          {service.gpus.map((gpuIndex) => (
            <span key={gpuIndex} className="gpu-chip">{gpuIndex}</span>
          ))}
        </div>
      )}
    </div>
  );
}

export default ServiceCard;
