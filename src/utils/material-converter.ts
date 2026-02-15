import { Mesh, MeshBasicMaterial, type Material, type Color, LineBasicMaterial } from 'three'
import type { Group } from 'three'

/**
 * Convert all mesh materials in a group to MeshBasicMaterial
 * for a flat, instruction-manual look (no lighting/shadows).
 * Clones materials per-mesh to avoid shared-material side effects.
 */
export function convertToFlatMaterials(group: Group) {
  group.traverse((obj) => {
    if (!(obj instanceof Mesh)) return
    const mat = obj.material as Material & {
      color?: { clone: () => unknown }
      opacity?: number
      transparent?: boolean
    }
    if (mat instanceof MeshBasicMaterial || mat instanceof LineBasicMaterial) return

    if (mat.color) {
      obj.material = new MeshBasicMaterial({
        color: (mat.color as { clone: () => Color }).clone(),
        opacity: mat.opacity ?? 1,
        transparent: mat.transparent ?? false,
      })
    }
  })
}
