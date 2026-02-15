import { useEffect, useCallback } from 'react'
import { useViewerStore } from '@/stores/useViewerStore'

/**
 * Auto-advance through building steps at a configurable speed.
 */
export function useAutoPlay() {
  const isPlaying = useViewerStore((s) => s.isPlaying)
  const playbackSpeed = useViewerStore((s) => s.playbackSpeed)
  const setIsPlaying = useViewerStore((s) => s.setIsPlaying)
  const setPlaybackSpeed = useViewerStore((s) => s.setPlaybackSpeed)

  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      const { currentStep, totalSteps } = useViewerStore.getState()
      if (currentStep >= totalSteps) {
        useViewerStore.getState().setIsPlaying(false)
      } else {
        useViewerStore.getState().nextStep()
      }
    }, 1500 / playbackSpeed)

    return () => clearInterval(interval)
  }, [isPlaying, playbackSpeed])

  // Space bar toggle
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (e.code === 'Space') {
        e.preventDefault()
        const { isPlaying, totalSteps, currentStep, setCurrentStep } =
          useViewerStore.getState()
        if (!isPlaying && currentStep >= totalSteps) {
          setCurrentStep(1) // Restart from beginning
        }
        useViewerStore.getState().setIsPlaying(!isPlaying)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const togglePlay = useCallback(() => {
    const { isPlaying, totalSteps, currentStep, setCurrentStep } =
      useViewerStore.getState()
    if (!isPlaying && currentStep >= totalSteps) {
      setCurrentStep(1)
    }
    setIsPlaying(!isPlaying)
  }, [setIsPlaying])

  const restart = useCallback(() => {
    useViewerStore.getState().setCurrentStep(1)
    setIsPlaying(true)
  }, [setIsPlaying])

  return { isPlaying, playbackSpeed, togglePlay, restart, setPlaybackSpeed }
}
