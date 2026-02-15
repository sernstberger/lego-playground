import { useMemo } from 'react'
import type { StepPart } from '@/utils/ldraw-helpers'
import { renderPartThumbnail } from '@/utils/part-thumbnails'

/**
 * Generate thumbnail data URLs for each unique part in the step.
 * Returns a Map of "partId:colorCode" → data URL string.
 */
export function usePartThumbnails(parts: StepPart[]): Map<string, string> {
  return useMemo(() => {
    const map = new Map<string, string>()
    for (const part of parts) {
      const key = `${part.partId}:${part.colorCode}`
      if (!map.has(key)) {
        map.set(key, renderPartThumbnail(part.object, key))
      }
    }
    return map
  }, [parts])
}
