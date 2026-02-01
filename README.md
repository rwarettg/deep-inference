# LLM Rig Dashboard

Real-time monitoring dashboard for the LLM rig. Displays GPU stats, memory usage, temperatures, and running model services via WebSocket.

![Dashboard Preview](docs/preview.png)

## Features

- **Real-time Updates** — Live data via WebSocket connection
- **Auto-reconnect** — Automatically reconnects if the connection drops
- **GPU Monitoring** — Memory usage bars, temperature, utilization per GPU
- **Service List** — All running models with ports, types, health status, and aliases
- **Dark Theme** — Clean, modern UI optimized for monitoring
- **Configurable URL** — Change WebSocket endpoint via UI or environment variable
- **Responsive** — Works on desktop and mobile

## Quick Start

### Development

```bash
# Install dependencies
npm install

# Start dev server (default: http://localhost:5173)
npm run dev
```

### Production Build

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview
```

The production build outputs to `dist/` — static files ready for any web host.

## Configuration

### WebSocket URL

The dashboard connects to `ws://localhost:8000/ws/status` by default.

**Option 1: Environment Variable**

Create a `.env` file (copy from `.env.example`):

```bash
VITE_WS_URL=wss://your-tunnel.domain/ws/status
```

**Option 2: Runtime Configuration**

Click the ⚙️ Settings button in the UI to change the WebSocket URL. This is saved to localStorage and persists across sessions.

## Deployment

### Static Hosting (GitHub Pages, Vercel, Netlify, etc.)

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy the `dist/` folder to your preferred static host.

### Docker (Optional)

```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG VITE_WS_URL
ENV VITE_WS_URL=$VITE_WS_URL
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Build and run:
```bash
docker build --build-arg VITE_WS_URL=wss://your-domain/ws/status -t llm-dashboard .
docker run -p 8080:80 llm-dashboard
```

## Expected Data Format

The WebSocket server should push JSON in this format:

```json
{
  "gpus": [
    {
      "index": 0,
      "name": "RTX 3060",
      "memory_used": 9707,
      "memory_total": 12288,
      "temp": 37,
      "util": 0,
      "model": "Qwen/Qwen2.5-14B-Instruct-AWQ"
    }
  ],
  "services": [
    {
      "port": 8001,
      "model": "Qwen/Qwen2.5-14B-Instruct-AWQ",
      "type": "llm",
      "gpus": [0],
      "status": "healthy",
      "aliases": ["qwen14b"]
    }
  ],
  "timestamp": "2025-01-31T17:30:00Z"
}
```

## Project Structure

```
dashboard/
├── src/
│   ├── components/
│   │   ├── GpuCard.jsx      # Individual GPU display card
│   │   └── ServicesList.jsx # Services table component
│   ├── hooks/
│   │   └── useWebSocket.js  # WebSocket connection hook
│   ├── App.jsx              # Main application
│   ├── App.css              # Component styles
│   ├── index.css            # Global styles
│   └── main.jsx             # Entry point
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Development Notes

- Built with [Vite](https://vitejs.dev/) + React
- No additional dependencies required (vanilla React)
- Fonts: Inter (UI) and JetBrains Mono (code/ports)
- WebSocket reconnection uses exponential backoff (3s → 30s max)

## License

MIT
