import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Vector3, Box3 } from 'three'
import type { Group } from 'three'
import { INSTRUCTION_DIRECTION } from '@/utils/camera-math'

const _target = new Vector3()
const _position = new Vector3()
const _box = new Box3()
const _size = new Vector3()
const _center = new Vector3()

/**
 * Smoothly animate the camera to frame the visible parts of the model
 * from a standard LEGO instruction angle each time the step changes.
 */
export function useInstructionCamera(
  model: Group | null,
  currentStep: number,
  enabled = true,
) {
  const { camera } = useThree()
  const prevStep = useRef(currentStep)
  const animating = useRef(false)
  const animProgress = useRef(1)
  const startPos = useRef(new Vector3())
  const targetPos = useRef(new Vector3())
  const startTarget = useRef(new Vector3())
  const targetTarget = useRef(new Vector3())

  // Trigger animation on step change
  if (currentStep !== prevStep.current && model && enabled) {
    prevStep.current = currentStep

    // Compute bounding box of visible parts
    _box.makeEmpty()
    model.traverse((child) => {
      if (child.visible && 'geometry' in child) {
        _box.expandByObject(child)
      }
    })

    if (!_box.isEmpty()) {
      _box.getCenter(_center)
      _box.getSize(_size)
      const radius = _size.length() / 2
      const distance = Math.max(radius * 2.5, 50)

      _position.copy(INSTRUCTION_DIRECTION).multiplyScalar(distance).add(_center)

      startPos.current.copy(camera.position)
      targetPos.current.copy(_position)
      startTarget.current.copy(_target)
      targetTarget.current.copy(_center)
      animProgress.current = 0
      animating.current = true
    }
  }

  useFrame((_, delta) => {
    if (!animating.current) return

    animProgress.current = Math.min(animProgress.current + delta * 3.3, 1) // ~300ms
    const t = easeOut(animProgress.current)

    camera.position.lerpVectors(startPos.current, targetPos.current, t)
    _target.lerpVectors(startTarget.current, targetTarget.current, t)
    camera.lookAt(_target)

    if (animProgress.current >= 1) {
      animating.current = false
    }
  })
}

function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}
