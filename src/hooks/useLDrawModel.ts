import { useState, useEffect, useMemo } from 'react'
import { LDrawLoader } from 'three/examples/jsm/loaders/LDrawLoader.js'
import { LDrawConditionalLineMaterial } from 'three/examples/jsm/materials/LDrawConditionalLineMaterial.js'
import type { Group } from 'three'
import { LDRAW_PARTS_CDN } from '@/services/ldraw'
import { convertToFlatMaterials } from '@/utils/material-converter'
import { centerModel } from '@/utils/ldraw-helpers'

export interface LDrawModelResult {
  model: Group | null
  numBuildingSteps: number
  loading: boolean
  error: string | null
}

/**
 * Load an LDraw model from a URL, resolving parts from CDN.
 * Handles the async preloadMaterials + load sequence that
 * R3F's synchronous useLoader config callback can't do.
 */
export function useLDrawModel(url: string | null): LDrawModelResult {
  const [model, setModel] = useState<Group | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loader = useMemo(() => {
    const l = new LDrawLoader()
    l.setPartsLibraryPath(LDRAW_PARTS_CDN)
    l.setConditionalLineMaterial(LDrawConditionalLineMaterial)
    l.smoothNormals = false // flat instruction look
    return l
  }, [])

  useEffect(() => {
    if (!url) {
      setModel(null)
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)

    async function load() {
      try {
        // Preload color definitions from the CDN
        await loader.preloadMaterials(LDRAW_PARTS_CDN + 'LDConfig.ldr')

        const group = await new Promise<Group>((resolve, reject) => {
          loader.load(url!, resolve, undefined, reject)
        })

        if (cancelled) return

        // Fix LDraw -Y up coordinate system
        group.rotation.x = Math.PI

        // Convert to flat materials for instruction look
        convertToFlatMaterials(group)

        // Center the model at origin
        centerModel(group)

        setModel(group)
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load model')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [url, loader])

  const numBuildingSteps = model?.userData?.numBuildingSteps ?? 0

  return { model, numBuildingSteps, loading, error }
}
