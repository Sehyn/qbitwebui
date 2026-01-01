# qbitwebui

A modern lightweight web interface for qBittorrent, built with Vite.

[More images below](#preview)
<img width="1798" height="1080" alt="demo_new" src="https://github.com/user-attachments/assets/4d8acb4b-a474-4c31-8ece-edd3a88cee7d" />

## Features

- Real-time torrent monitoring with auto-refresh
- Add torrents via magnet links or .torrent files
- Detailed torrent view (general info, trackers, peers, files)
- Filter by status (all, downloading, seeding, active, stopped), filter by tracker or category.
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

## Preview
<table>
  <tr>
    <td><img src="https://github.com/user-attachments/assets/b2aa1367-00ad-4ddb-ae5f-0f364046a435" alt="demo3" /></td>
    <td><img src="https://github.com/user-attachments/assets/048245a9-e751-4965-9ad9-862570079019" alt="demo4" /></td>
  </tr>
</table>
