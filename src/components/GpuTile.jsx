import React, { useState } from 'react';

function GpuTile({ gpu, service, onCopy }) {
  const [expanded, setExpanded] = useState(false);
  
  const memPct = (gpu.memory_used / gpu.memory_total) * 100;
  const formatMem = (mb) => (mb / 1024).toFixed(1);
  
  const getTempClass = (temp) => {
    if (temp >= 80) return 'hot';
    if (temp >= 60) return 'warm';
    return 'cool';
  };

  const getTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'llm': return '🧠';
      case 'stt': return '🎤';
      case 'tts': return '🔊';
      default: return '📦';
    }
  };

  const getShortName = (model) => {
    if (!model) return null;
    const parts = model.split('/');
    return parts[parts.length - 1];
  };

  const formatUptime = (startedAt) => {
    if (!startedAt) return null;
    const start = new Date(startedAt);
    const now = new Date();
    const diffMs = now - start;
    
    const minutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    return `${minutes}m`;
  };

  const formatMaxTokens = (maxTokens) => {
    if (!maxTokens) return null;
    if (maxTokens >= 1024) {
      return `${(maxTokens / 1024).toFixed(0)}K ctx`;
    }
    return `${maxTokens} ctx`;
  };

  const hasModel = service || gpu.model;
  
  const generateExample = () => {
    if (!service) return '';
    
    const modelName = service.model || 'model-name';
    const isSTT = service.type?.toLowerCase() === 'stt';
    const isTTS = service.type?.toLowerCase() === 'tts';
    
    if (isSTT) {
      return [
        'import requests',
        '',
        'url = "https://chatbot-backend.ttgteams.com/v1/audio/transcriptions"',
        'api_key = "(Request from admin)"',
        '',
        '# Audio file to transcribe',
        'files = {',
        '    "file": open("audio.mp3", "rb")',
        '}',
        '',
        'data = {',
        '    "model": "' + modelName + '"',
        '}',
        '',
        'headers = {',
        '    "Authorization": f"Bearer {api_key}"',
        '}',
        '',
        'response = requests.post(url, files=files, data=data, headers=headers)',
        'result = response.json()',
        '',
        'print(f"Status: {response.status_code}")',
        '',
        'if response.status_code == 200:',
        '    print("Transcription:", result["text"])',
        'else:',
        '    print("Error:", result)'
      ].join('\n');
    }
    
    if (isTTS) {
      return [
        'import requests',
        '',
        'url = "https://chatbot-backend.ttgteams.com/v1/audio/speech"',
        'api_key = "(Request from admin)"',
        '',
        'data = {',
        '    "model": "' + modelName + '",',
        '    "input": "Hello, this is a test of text to speech.",',
        '    "voice": "default"',
        '}',
        '',
        'headers = {',
        '    "Authorization": f"Bearer {api_key}",',
        '    "Content-Type": "application/json"',
        '}',
        '',
        'response = requests.post(url, json=data, headers=headers)',
        '',
        'print(f"Status: {response.status_code}")',
        '',
        'if response.status_code == 200:',
        '    with open("output.mp3", "wb") as f:',
        '        f.write(response.content)',
        '    print("Audio saved to output.mp3")',
        'else:',
        '    print("Error:", response.json())'
      ].join('\n');
    }
    
    // Default LLM example
    return [
      'import requests',
      '',
      'url = "https://chatbot-backend.ttgteams.com/v1/chat/completions"',
      'api_key = "(Request from admin)"',
      '',
      'prompt = "Your prompt here"',
      '',
      'data = {',
      '    "model": "' + modelName + '",',
      '    "messages": [{"role": "user", "content": prompt}],',
      '    "max_tokens": 500,',
      '    "temperature": 0.7',
      '}',
      '',
      'headers = {',
      '    "Authorization": f"Bearer {api_key}",',
      '    "Content-Type": "application/json"',
      '}',
      '',
      'response = requests.post(url, json=data, headers=headers)',
      'result = response.json()',
      '',
      'print(f"Status: {response.status_code}")',
      '',
      'if response.status_code == 200:',
      '    print("Response:", result["choices"][0]["message"]["content"])',
      'else:',
      '    print("Error:", result)'
    ].join('\n');
  };

  const handleClick = () => {
    if (service) {
      setExpanded(!expanded);
    }
  };

  const copyToClipboard = (e) => {
    e.stopPropagation();
    const code = generateExample();
    
    // Fallback for non-HTTPS (clipboard API requires secure context)
    const textarea = document.createElement('textarea');
    textarea.value = code;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
      document.execCommand('copy');
      if (onCopy) onCopy();
    } catch (err) {
      console.error('Copy failed:', err);
    }
    
    document.body.removeChild(textarea);
  };

  return (
    <div className={`gpu-row ${hasModel ? 'has-model' : 'idle'} ${expanded ? 'expanded' : ''}`}>
      <div className="gpu-row-main" onClick={handleClick}>
        <div className="gpu-row-left">
          <div className="gpu-identity">
            <span className="gpu-index">GPU {gpu.index}</span>
            <span className="gpu-name">{gpu.name.replace('NVIDIA GeForce ', '')}</span>
          </div>
          
          {service && (
            <div className="gpu-model-info">
              <span className="model-icon">{getTypeIcon(service.type)}</span>
              <span className="model-name">{getShortName(service.model)}</span>
              <span className={`model-type ${service.type}`}>{service.type?.toUpperCase()}</span>
              <span className="model-port">:{service.port}</span>
              {service.type === 'llm' && service.max_tokens && (
                <span className="model-ctx">{formatMaxTokens(service.max_tokens)}</span>
              )}
              {service.started_at && (
                <span className="model-uptime">⏱ {formatUptime(service.started_at)}</span>
              )}
              <span className="expand-hint">{expanded ? '▲' : '▼'}</span>
            </div>
          )}
        </div>
        
        <div className="gpu-row-right">
          <div className="stat-group">
            <div className="stat-item">
              <span className="stat-label">VRAM</span>
              <div className="stat-bar-wrap">
                <div className="stat-bar">
                  <div 
                    className={`stat-bar-fill mem ${memPct > 80 ? 'high' : ''}`}
                    style={{ width: `${memPct}%` }}
                  />
                </div>
                <span className="stat-value">{formatMem(gpu.memory_used)}/{formatMem(gpu.memory_total)} GB</span>
              </div>
            </div>
            
            <div className="stat-item">
              <span className="stat-label">UTIL</span>
              <div className="stat-bar-wrap">
                <div className="stat-bar">
                  <div 
                    className="stat-bar-fill util"
                    style={{ width: `${gpu.util}%` }}
                  />
                </div>
                <span className="stat-value util-val">{gpu.util}%</span>
              </div>
            </div>
          </div>
          
          <div className="stat-temp">
            <span className={`temp-value ${getTempClass(gpu.temp)}`}>{gpu.temp}°C</span>
          </div>
          
          {service && (
            <div className={`health-indicator ${service.status}`} />
          )}
        </div>
      </div>
      
      {expanded && service && (
        <div className="gpu-row-expanded">
          <div className="example-header">
            <span className="example-title">Example Request</span>
            <button className="copy-btn" onClick={copyToClipboard}>
              📋 Copy
            </button>
          </div>
          <pre className="example-code">{generateExample()}</pre>
        </div>
      )}
    </div>
  );
}

export default GpuTile;
