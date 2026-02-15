/**
 * Minimal lighting setup. With MeshBasicMaterial (flat look),
 * lights don't affect meshes — but they're needed for any
 * future MeshStandard materials and for environment reflections.
 */
export function SceneLighting() {
  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[10, 20, 10]} intensity={0.6} />
    </>
  )
}
