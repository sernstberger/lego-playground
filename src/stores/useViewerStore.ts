import { create } from 'zustand'
import type { ViewerMode } from '@/types/viewer'

interface ViewerStore {
  currentSetId: string | null
  currentStep: number
  totalSteps: number
  mode: ViewerMode
  isPlaying: boolean
  playbackSpeed: number
  ghostPreviousSteps: boolean
  setCurrentSet: (id: string | null) => void
  setCurrentStep: (step: number) => void
  setTotalSteps: (total: number) => void
  setMode: (mode: ViewerMode) => void
  setIsPlaying: (playing: boolean) => void
  setPlaybackSpeed: (speed: number) => void
  setGhostPreviousSteps: (ghost: boolean) => void
  nextStep: () => void
  prevStep: () => void
  reset: () => void
}

export const useViewerStore = create<ViewerStore>((set, get) => ({
  currentSetId: null,
  currentStep: 1,
  totalSteps: 0,
  mode: 'step',
  isPlaying: false,
  playbackSpeed: 1,
  ghostPreviousSteps: true,
  setCurrentSet: (id) => set({ currentSetId: id, currentStep: 1 }),
  setCurrentStep: (step) => set({ currentStep: step }),
  setTotalSteps: (total) => set({ totalSteps: total }),
  setMode: (mode) => set({ mode }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setPlaybackSpeed: (speed) => set({ playbackSpeed: speed }),
  setGhostPreviousSteps: (ghost) => set({ ghostPreviousSteps: ghost }),
  nextStep: () => {
    const { currentStep, totalSteps } = get()
    if (currentStep < totalSteps) set({ currentStep: currentStep + 1 })
  },
  prevStep: () => {
    const { currentStep } = get()
    if (currentStep > 1) set({ currentStep: currentStep - 1 })
  },
  reset: () =>
    set({
      currentSetId: null,
      currentStep: 1,
      totalSteps: 0,
      mode: 'step',
      isPlaying: false,
    }),
}))
