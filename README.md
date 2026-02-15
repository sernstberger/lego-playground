# LEGO Playground

Interactive 3D LEGO building instruction viewer. Browse sets, step through instructions, and watch auto-builds.

## Tech Stack

- **Vite** + **React** + **TypeScript**
- **React Three Fiber** + **drei** for 3D rendering
- **shadcn/ui** + **Tailwind CSS** for UI
- **Zustand** for state management
- **LDraw** format with CDN parts library

## Getting Started

```bash
npm install
npm run dev
```

## Project Structure

```
src/
  components/
    layout/     # AppShell, Sidebar
    viewer/     # 3D instruction viewer
    browser/    # Set browsing
    kanban/     # Project tracking board
    docs/       # ADR/devlog viewer
    ui/         # shadcn/ui components
  hooks/        # Custom React hooks
  stores/       # Zustand stores
  services/     # IndexedDB, LDraw CDN
  types/        # TypeScript types
docs/
  decisions/    # Architecture Decision Records
  devlog/       # Development log
```

## Development

- Conventional commits enforced via commitlint + husky
- ADRs in `docs/decisions/` — viewable in-app
- Dev log in `docs/devlog/` — viewable in-app
- Kanban board built into the app (IndexedDB persistence)
