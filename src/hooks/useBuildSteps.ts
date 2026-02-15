import { useCallback, useEffect } from 'react'
import { useViewerStore } from '@/stores/useViewerStore'
import { highlightCurrentStep } from '@/utils/ldraw-helpers'
import type { Group } from 'three'

/**
 * Manages build step state and syncs visibility on the 3D model.
 */
export function useBuildSteps(model: Group | null, numBuildingSteps: number) {
  const currentStep = useViewerStore((s) => s.currentStep)
  const setTotalSteps = useViewerStore((s) => s.setTotalSteps)
  const nextStep = useViewerStore((s) => s.nextStep)
  const prevStep = useViewerStore((s) => s.prevStep)
  const setCurrentStep = useViewerStore((s) => s.setCurrentStep)
  const ghostPreviousSteps = useViewerStore((s) => s.ghostPreviousSteps)

  // Set total steps when model loads
  useEffect(() => {
    if (numBuildingSteps > 0) {
      setTotalSteps(numBuildingSteps)
      setCurrentStep(numBuildingSteps) // Show complete model initially
    }
  }, [numBuildingSteps, setTotalSteps, setCurrentStep])

  // Update visibility + highlighting when step changes
  useEffect(() => {
    if (model) {
      highlightCurrentStep(model, currentStep, ghostPreviousSteps)
    }
  }, [model, currentStep, ghostPreviousSteps])

  // Keyboard navigation
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault()
        nextStep()
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault()
        prevStep()
      } else if (e.key === 'Home') {
        e.preventDefault()
        setCurrentStep(1)
      } else if (e.key === 'End') {
        e.preventDefault()
        setCurrentStep(numBuildingSteps)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [nextStep, prevStep, setCurrentStep, numBuildingSteps])

  const goToStep = useCallback(
    (step: number) => {
      const clamped = Math.max(1, Math.min(step, numBuildingSteps))
      setCurrentStep(clamped)
    },
    [setCurrentStep, numBuildingSteps],
  )

  return { currentStep, totalSteps: numBuildingSteps, nextStep, prevStep, goToStep }
}
