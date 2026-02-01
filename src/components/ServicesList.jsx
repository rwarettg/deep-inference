import React from 'react';

function ServicesList({ services }) {
  if (!services || services.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📦</div>
        <div>No services running</div>
      </div>
    );
  }

  const getHealthClass = (status) => {
    if (status === 'healthy') return 'healthy';
    if (status === 'unhealthy') return 'unhealthy';
    return 'unknown';
  };

  const getTypeClass = (type) => {
    return type?.toLowerCase() || 'unknown';
  };

  return (
    <div className="services-container">
      <table className="services-table">
        <thead>
          <tr>
            <th>Port</th>
            <th>Model</th>
            <th>Type</th>
            <th>GPUs</th>
            <th>Status</th>
            <th>Aliases</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service, index) => (
            <tr key={service.port || index}>
              <td>
                <span className="port-badge">:{service.port}</span>
              </td>
              <td>
                <span className="model-name" title={service.model}>
                  {service.model}
                </span>
              </td>
              <td>
                <span className={`type-badge ${getTypeClass(service.type)}`}>
                  {service.type}
                </span>
              </td>
              <td>
                <div className="gpu-list">
                  {service.gpus?.map((gpuIndex) => (
                    <span key={gpuIndex} className="gpu-chip">
                      {gpuIndex}
                    </span>
                  ))}
                </div>
              </td>
              <td>
                <div className="health-indicator">
                  <span className={`health-dot ${getHealthClass(service.status)}`} />
                  <span>{service.status}</span>
                </div>
              </td>
              <td>
                <div className="aliases">
                  {service.aliases?.map((alias, i) => (
                    <span key={i} className="alias-tag">
                      {alias}
                    </span>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ServicesList;
