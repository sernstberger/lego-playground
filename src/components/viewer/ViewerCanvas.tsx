import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import type { ReactNode } from 'react'
import { SceneLighting } from './SceneLighting'

interface Props {
  children: ReactNode
}

export function ViewerCanvas({ children }: Props) {
  return (
    <Canvas
      camera={{ position: [0, 100, 200], fov: 45, near: 1, far: 10000 }}
      gl={{ antialias: true }}
      className="!h-full"
    >
      <color attach="background" args={['#f8f8f8']} />
      <SceneLighting />
      {children}
      <OrbitControls makeDefault enableDamping dampingFactor={0.1} />
    </Canvas>
  )
}
