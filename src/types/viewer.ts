export type ViewerMode = 'step' | 'autobuild' | 'free'

export interface ViewerState {
  currentSetId: string | null
  currentStep: number
  totalSteps: number
  mode: ViewerMode
  isPlaying: boolean
  playbackSpeed: number
  ghostPreviousSteps: boolean
}
