import { Vector3, Box3 } from 'three'
import type { Group } from 'three'

/** Standard LEGO instruction camera direction: elevated 3/4 view */
export const INSTRUCTION_DIRECTION = new Vector3(-2.3, 1, 2).normalize()

/** Calculate camera position to frame the model at the given step */
export function getCameraPosition(
  group: Group,
  direction: Vector3 = INSTRUCTION_DIRECTION,
  padding = 2.5,
): Vector3 {
  const box = new Box3().setFromObject(group)
  const size = new Vector3()
  box.getSize(size)
  const radius = size.length() / 2
  return direction.clone().multiplyScalar(radius * padding)
}
