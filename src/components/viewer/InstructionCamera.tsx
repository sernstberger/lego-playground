import { useInstructionCamera } from '@/hooks/useInstructionCamera'
import type { Group } from 'three'

interface Props {
  model: Group | null
  currentStep: number
}

/**
 * R3F component that drives camera animation per step.
 * Must be rendered inside a <Canvas>.
 */
export function InstructionCamera({ model, currentStep }: Props) {
  useInstructionCamera(model, currentStep)
  return null
}
