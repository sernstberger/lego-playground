import type { Group } from 'three'

export interface LDrawModelData {
  model: Group
  numBuildingSteps: number
}

export interface SetInfo {
  id: string
  name: string
  setNumber: string
  fileName: string
  partCount?: number
  theme?: string
  thumbnail?: string
}
