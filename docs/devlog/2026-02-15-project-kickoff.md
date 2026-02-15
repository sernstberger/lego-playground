# Project Kickoff

**Date:** 2026-02-15

## What was built

- Initialized Vite + React + TypeScript project
- Set up Tailwind CSS v4 with shadcn/ui components
- Configured commitlint + husky for conventional commits
- Created app shell with sidebar navigation (react-router-dom)
- Built kanban board with drag-and-drop (@dnd-kit) and IndexedDB persistence
- Added in-app documentation viewer for ADRs and devlog entries
- Wrote initial Architecture Decision Records (ADRs 0001-0003)
- Established project structure following the implementation plan

## Key decisions

- React Three Fiber for 3D rendering (ADR-0001)
- LDraw format with CDN parts library (ADR-0002)
- Zustand for state management (ADR-0003)
- shadcn/ui + Tailwind for styling
- IndexedDB for kanban persistence (no backend)

## What's next

- Phase 1: Load and render a real LEGO set from the Official Model Repository
- Find a small OMR model (<100 parts) for initial development
- Implement LDrawLoader integration with R3F useLoader
