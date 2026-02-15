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

/** Part entry for a single step's parts list */
export interface StepPart {
  partId: string    // e.g., "3023"
  colorCode: string // e.g., "7"
  colorHex: string  // e.g., "#1b2a34"
  quantity: number
  object: Object3D  // reference to one instance of this part in the model tree
}

/**
 * Get the list of parts introduced at a specific building step.
 *
 * LDrawLoader nests parts as: root → .ldr sub-model → .dat brick → sub-parts.
 * A top-level brick is a .dat Group whose parent is either an .ldr sub-model
 * or has a different buildingStep. Sub-parts (nested .dat inside .dat) share
 * the same step as their parent .dat and should be excluded.
 */
export function getStepParts(group: Group, step: number): StepPart[] {
  const counts = new Map<string, StepPart>()

  group.traverse((child: Object3D) => {
    if (child.userData.buildingStep !== step) return

    // Only include .dat files (actual brick parts)
    const fileName: string | undefined = child.userData.fileName
    if (!fileName || !fileName.toLowerCase().endsWith('.dat')) return

    // Entry-point check: skip sub-parts nested inside another .dat part
    const parentFileName: string | undefined = child.parent?.userData.fileName
    if (parentFileName?.toLowerCase().endsWith('.dat')) return

    const colorCode: string = child.userData.colorCode ?? '0'

    // Extract color hex from the first mesh child's material
    let colorHex = '#888888'
    child.traverse((descendant: Object3D) => {
      if (colorHex !== '#888888') return
      if (descendant instanceof Mesh && descendant.material) {
        const mat = Array.isArray(descendant.material) ? descendant.material[0] : descendant.material
        if (mat?.color) {
          colorHex = '#' + mat.color.getHexString()
        }
      }
    })

    // Strip path and extension for display: "3023.dat" → "3023"
    const partId = fileName.replace(/^.*[\\/]/, '').replace(/\.dat$/i, '')
    const key = `${partId}:${colorCode}`

    const existing = counts.get(key)
    if (existing) {
      existing.quantity++
    } else {
      counts.set(key, { partId, colorCode, colorHex, quantity: 1, object: child })
    }
  })

  // Sort by quantity descending
  return Array.from(counts.values()).sort((a, b) => b.quantity - a.quantity)
}

/** Get the bounding box radius of the model (for camera distance) */
export function getModelRadius(group: Group): number {
  const box = new Box3().setFromObject(group)
  const size = new Vector3()
  box.getSize(size)
  return size.length() / 2
}
