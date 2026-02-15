# Use Zustand for State Management

- Status: accepted
- Date: 2026-02-15

## Context and Problem Statement

We need state management for the viewer (current step, model, playback) and the kanban board (columns, cards, persistence). The solution must work well with React Three Fiber's render loop.

## Decision Drivers

- R3F compatibility — need `getState()` for frame-level reads without re-renders
- Simple API with minimal boilerplate
- Selector-based re-renders for performance
- IndexedDB persistence for kanban data

## Considered Options

1. Zustand
2. React Context + useReducer
3. Jotai
4. Redux Toolkit

## Decision Outcome

Chosen option: "Zustand", because it's from the same ecosystem as R3F (pmndrs), provides `getState()` for imperative reads in animation loops, has selector-based rendering to avoid unnecessary re-renders, and supports middleware for persistence.

### Consequences

- Good, because `getState()` avoids re-render overhead in R3F frame callbacks
- Good, because selectors prevent unnecessary component re-renders
- Good, because minimal API surface — just `create()` and hooks
- Bad, because another dependency (though very small, ~1KB)
