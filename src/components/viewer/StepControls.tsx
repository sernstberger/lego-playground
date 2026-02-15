import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'

interface Props {
  currentStep: number
  totalSteps: number
  onPrev: () => void
  onNext: () => void
  onGoToStep: (step: number) => void
}

export function StepControls({ currentStep, totalSteps, onPrev, onNext, onGoToStep }: Props) {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={() => onGoToStep(1)}
        disabled={currentStep <= 1}
      >
        <ChevronsLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={onPrev}
        disabled={currentStep <= 1}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <div className="flex items-center gap-2 min-w-[200px]">
        <Slider
          value={[currentStep]}
          min={1}
          max={totalSteps}
          step={1}
          onValueChange={([v]) => onGoToStep(v)}
          className="flex-1"
        />
        <span className="text-sm font-mono tabular-nums whitespace-nowrap">
          {currentStep}/{totalSteps}
        </span>
      </div>
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={onNext}
        disabled={currentStep >= totalSteps}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={() => onGoToStep(totalSteps)}
        disabled={currentStep >= totalSteps}
      >
        <ChevronsRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
