# Use React Three Fiber for 3D Rendering

- Status: accepted
- Date: 2026-02-15

## Context and Problem Statement

We need to render LEGO models in 3D in a React web application. The models use the LDraw format, and Three.js has a built-in LDrawLoader. We need to decide how to integrate Three.js with React.

## Decision Drivers

- React-first architecture — components, hooks, state
- Access to Three.js ecosystem (LDrawLoader, OrbitControls, etc.)
- Performance with complex models (thousands of meshes)
- Developer experience and community support

## Considered Options

1. React Three Fiber (@react-three/fiber + @react-three/drei)
2. Vanilla Three.js with React refs
3. Other React 3D libraries (react-three, aframe-react)

## Decision Outcome

Chosen option: "React Three Fiber", because it provides a declarative React API for Three.js, has excellent ecosystem support (drei helpers), and allows us to use React patterns (hooks, suspense, state) while still accessing all of Three.js when needed.

### Consequences

- Good, because we can use React Suspense for loading states
- Good, because useLoader integrates naturally with Three.js loaders
- Good, because drei provides OrbitControls, Environment, and other common needs
- Bad, because some Three.js patterns (imperative mutations) need adaptation for React's declarative model
