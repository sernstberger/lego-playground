import {
  WebGLRenderer,
  Scene,
  OrthographicCamera,
  Box3,
  Vector3,
  Group,
  Object3D,
  Mesh,
  Material,
} from 'three'
import { INSTRUCTION_DIRECTION } from './camera-math'

// Singleton offscreen renderer — created once, reused for all thumbnails
let renderer: WebGLRenderer | null = null
const scene = new Scene()
const camera = new OrthographicCamera()
scene.background = null // transparent

function getRenderer(size: number): WebGLRenderer {
  if (!renderer) {
    renderer = new WebGLRenderer({ antialias: true, alpha: true })
    renderer.setClearColor(0x000000, 0)
  }
  renderer.setSize(size, size)
  return renderer
}

// Cache: "partId:colorCode" → data URL
const thumbnailCache = new Map<string, string>()

export function clearThumbnailCache() {
  thumbnailCache.clear()
}

/**
 * Render a part Group into a small PNG data URL using an offscreen renderer.
 * Results are cached by cacheKey.
 *
 * The part object lives deep in the scene tree with accumulated ancestor
 * transforms (including the root Math.PI X rotation). We bake the world
 * matrix into the clone so it renders with the correct orientation
 * standalone, without needing the original parent hierarchy.
 */
export function renderPartThumbnail(
  partGroup: Object3D,
  cacheKey: string,
  size = 128,
): string {
  const cached = thumbnailCache.get(cacheKey)
  if (cached) return cached

  const gl = getRenderer(size)

  // Ensure world matrices are up to date on the source object
  partGroup.updateWorldMatrix(true, true)

  // Clone the part and set its local transform = the original's world transform.
  // This bakes in all ancestor rotations/translations so the clone renders
  // correctly when placed directly in our flat offscreen scene.
  const clone = partGroup.clone(true)
  clone.matrix.copy(partGroup.matrixWorld)
  clone.matrix.decompose(clone.position, clone.quaternion, clone.scale)

  // Force all descendants visible and fully opaque — the source part may be
  // hidden by step visibility or ghosted (opacity 0.3) in the main scene.
  clone.traverse((child) => {
    child.visible = true
    if (child instanceof Mesh) {
      const mats = Array.isArray(child.material) ? child.material : [child.material]
      for (const m of mats) {
        const mat = m as Material & { opacity: number; transparent: boolean }
        mat.opacity = 1
        mat.transparent = false
      }
    }
  })
  clone.updateMatrixWorld(true)

  // Wrap in a Group so we can shift position to center without mutating the clone
  const wrapper = new Group()
  wrapper.add(clone)
  wrapper.updateMatrixWorld(true)

  // Compute bounding box
  const box = new Box3().setFromObject(wrapper)

  if (box.isEmpty()) {
    thumbnailCache.set(cacheKey, '')
    return ''
  }

  // Center the part at the origin
  const center = new Vector3()
  box.getCenter(center)
  wrapper.position.sub(center)
  wrapper.updateMatrixWorld(true)

  scene.add(wrapper)

  // Frame with orthographic camera
  const boxSize = new Vector3()
  box.getSize(boxSize)
  const maxDim = Math.max(boxSize.x, boxSize.y, boxSize.z)
  const halfSize = maxDim * 0.65

  camera.left = -halfSize
  camera.right = halfSize
  camera.top = halfSize
  camera.bottom = -halfSize
  camera.near = -maxDim * 10
  camera.far = maxDim * 10

  // Position camera from instruction 3/4 angle
  const camPos = INSTRUCTION_DIRECTION.clone().multiplyScalar(maxDim * 2)
  camera.position.copy(camPos)
  camera.lookAt(0, 0, 0)
  camera.updateProjectionMatrix()

  gl.render(scene, camera)
  const dataUrl = gl.domElement.toDataURL('image/png')

  scene.remove(wrapper)

  thumbnailCache.set(cacheKey, dataUrl)
  return dataUrl
}
