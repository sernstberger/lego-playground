import type { SetInfo } from '@/types/ldraw'

export const LDRAW_PARTS_CDN =
  'https://raw.githubusercontent.com/gkjohnson/ldraw-parts-library/master/complete/ldraw/'

export const MODEL_CATALOG: SetInfo[] = [
  {
    id: '889-1',
    name: 'Radar Truck',
    setNumber: '889-1',
    fileName: '889-1-radar-truck.mpd',
    partCount: 29,
    theme: 'Classic Space',
  },
  {
    id: '6835-1',
    name: 'Saucer Scout',
    setNumber: '6835-1',
    fileName: '6835-saucer-scout.mpd',
    partCount: 47,
    theme: 'Classic Space',
  },
  {
    id: '1713-1',
    name: 'Shipwrecked Pirate',
    setNumber: '1713-1',
    fileName: '1713-shipwrecked-pirate.mpd',
    partCount: 23,
    theme: 'Pirates',
  },
]

export function getModelUrl(fileName: string): string {
  return `/models/${fileName}`
}
