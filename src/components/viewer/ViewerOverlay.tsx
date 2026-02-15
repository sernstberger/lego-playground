import { StepControls } from './StepControls'
import { AutoBuildControls } from '@/components/autobuild/AutoBuildControls'

interface Props {
  currentStep: number
  totalSteps: number
  setName: string
  onPrev: () => void
  onNext: () => void
  onGoToStep: (step: number) => void
}

export function ViewerOverlay({
  currentStep,
  totalSteps,
  setName,
  onPrev,
  onNext,
  onGoToStep,
}: Props) {
  return (
    <div className="absolute bottom-0 left-0 right-0 p-4 pointer-events-none">
      <div className="flex items-center justify-between gap-4">
        <div className="rounded-md bg-background/90 px-3 py-1.5 text-sm border pointer-events-auto">
          {setName}
        </div>
        <div className="flex items-center gap-2 rounded-md bg-background/90 px-3 py-1.5 border pointer-events-auto">
          <StepControls
            currentStep={currentStep}
            totalSteps={totalSteps}
            onPrev={onPrev}
            onNext={onNext}
            onGoToStep={onGoToStep}
          />
          <div className="w-px h-6 bg-border mx-1" />
          <AutoBuildControls />
        </div>
      </div>
    </div>
  )
}
