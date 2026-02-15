# Use LDraw Format with CDN Parts Library

- Status: accepted
- Date: 2026-02-15

## Context and Problem Statement

We need a 3D model format for LEGO sets that includes building step information. The format must support step-by-step assembly visualization.

## Decision Drivers

- Must encode building steps (not just final geometry)
- Large library of existing official LEGO set models
- Compatible with Three.js loading pipeline
- No server-side processing required

## Considered Options

1. LDraw format (.mpd/.ldr) with GitHub CDN parts library
2. glTF/GLB pre-converted models
3. Custom format with step metadata

## Decision Outcome

Chosen option: "LDraw format with CDN parts library", because LDraw is the standard format for LEGO digital models, has 10,000+ brick definitions available via CDN, Three.js has a built-in LDrawLoader that parses step commands, and the Official Model Repository (OMR) provides hundreds of real LEGO sets.

### Consequences

- Good, because Three.js LDrawLoader handles parsing, step detection, and part resolution
- Good, because parts are fetched from CDN and browser-cached (no local storage needed)
- Good, because OMR provides real, verified LEGO set models
- Bad, because initial load fetches many small part files (mitigated by browser caching)
- Bad, because LDraw coordinate system is inverted (-Y up) requiring rotation correction
