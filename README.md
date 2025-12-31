# qbitwebui

A modern web interface for qBittorrent.

![screenshot](screenshot.png)

## Features

- Real-time torrent monitoring with auto-refresh
- Add torrents via magnet links or .torrent files
- Detailed torrent view (general info, trackers, peers, files)
- Filter by status (all, downloading, seeding, active, stopped)
- Multi-select with bulk actions (start, stop, delete)
- Dark theme

## Docker

```yaml
services:
  qbitwebui:
    image: ghcr.io/maciejonos/qbitwebui:latest
    ports:
      - "8080:80"
    environment:
      - QBITTORRENT_URL=http://localhost:8080
    restart: unless-stopped
```

Or build locally:

```bash
docker compose up -d
```

## Development

```bash
# Set qBittorrent backend URL
export QBITTORRENT_URL=http://localhost:8080

# Install and run
npm install
npm run dev
```

## Tech Stack

React 19, TypeScript, Tailwind CSS v4, Vite, TanStack Query
