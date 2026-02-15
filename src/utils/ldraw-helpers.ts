import { Box3, Vector3, Mesh } from 'three'
import type { Group, Object3D, Material } from 'three'

/** Center the model at the origin based on its bounding box */
export function centerModel(group: Group) {
  const box = new Box3().setFromObject(group)
  const center = new Vector3()
  box.getCenter(center)
  group.position.sub(center)
}

/** Update visibility of parts based on the current building step */
export function updateStepVisibility(group: Group, currentStep: number) {
  group.traverse((child: Object3D) => {
    if (child.userData.buildingStep !== undefined) {
      child.visible = child.userData.buildingStep <= currentStep
    }
  })
}

/**
 * Find the buildingStep assigned to an object or its nearest ancestor.
 */
function getEffectiveStep(obj: Object3D): number | undefined {
  let current: Object3D | null = obj
  while (current) {
    if (current.userData.buildingStep !== undefined) {
      return current.userData.buildingStep as number
    }
    current = current.parent
  }
  return undefined
}

/**
 * Highlight current step parts (full opacity) and ghost previous steps.
 *
 * LDrawLoader puts buildingStep on Group nodes (not Meshes).
 * Pass 1: show/hide groups by step.
 * Pass 2: adjust mesh opacity for ghosting based on ancestor step.
 */
export function highlightCurrentStep(group: Group, currentStep: number, ghost: boolean) {
  // Pass 1: visibility on step groups
  group.traverse((child: Object3D) => {
    if (child.userData.buildingStep !== undefined) {
      child.visible = child.userData.buildingStep <= currentStep
    }
  })

  // Pass 2: adjust mesh opacity (ghost previous steps or restore full opacity)
  group.traverse((child: Object3D) => {
    if (!(child instanceof Mesh)) return

    const step = getEffectiveStep(child)
    if (step === undefined || step > currentStep) return

    // Clone material(s) once to avoid shared-material side effects
    if (!child.userData._materialCloned) {
      if (Array.isArray(child.material)) {
        child.material = child.material.map((m: Material) => m.clone())
        child.userData._originalOpacity = child.material.map((m: Material) => (m as Material & { opacity: number }).opacity)
      } else {
        child.material = (child.material as Material).clone()
        child.userData._originalOpacity = (child.material as Material & { opacity: number }).opacity
      }
      child.userData._materialCloned = true
    }

    const shouldGhost = ghost && step < currentStep
    if (Array.isArray(child.material)) {
      child.material.forEach((m: Material, i: number) => {
        const mat = m as Material & { opacity: number; transparent: boolean }
        if (shouldGhost) {
          mat.opacity = 0.3
          mat.transparent = true
        } else {
          mat.opacity = child.userData._originalOpacity?.[i] ?? 1
          mat.transparent = mat.opacity < 1
        }
      })
    } else {
      const mat = child.material as Material & { opacity: number; transparent: boolean }
      if (shouldGhost) {
        mat.opacity = 0.3
        mat.transparent = true
      } else {
        mat.opacity = child.userData._originalOpacity ?? 1
        mat.transparent = mat.opacity < 1
      }
    }
  })
}

/** Get the bounding box radius of the model (for camera distance) */
export function getModelRadius(group: Group): number {
  const box = new Box3().setFromObject(group)
  const size = new Vector3()
  box.getSize(size)
  return size.length() / 2
}
