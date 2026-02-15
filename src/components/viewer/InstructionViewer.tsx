import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Loader2, Box } from 'lucide-react'
import { useLDrawModel } from '@/hooks/useLDrawModel'
import { useBuildSteps } from '@/hooks/useBuildSteps'
import { usePartThumbnails } from '@/hooks/usePartThumbnails'
import { getModelUrl, MODEL_CATALOG } from '@/services/ldraw'
import { getStepParts } from '@/utils/ldraw-helpers'
import { ViewerCanvas } from './ViewerCanvas'
import { LDrawModel } from './LDrawModel'
import { InstructionCamera } from './InstructionCamera'
import { ViewerOverlay } from './ViewerOverlay'
import { StepPartsList } from './StepPartsList'

export function InstructionViewer() {
  const [searchParams] = useSearchParams()
  const setId = searchParams.get('set')

  const setInfo = MODEL_CATALOG.find((s) => s.id === setId)
  const modelUrl = setInfo ? getModelUrl(setInfo.fileName) : null

  const { model, numBuildingSteps, loading, error } = useLDrawModel(modelUrl)
  const { currentStep, totalSteps, nextStep, prevStep, goToStep } = useBuildSteps(
    model,
    numBuildingSteps,
  )

  const stepParts = useMemo(
    () => (model ? getStepParts(model, currentStep) : []),
    [model, currentStep],
  )
  const thumbnails = usePartThumbnails(stepParts)

  if (!setId) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        <div className="text-center">
          <Box className="mx-auto mb-4 h-16 w-16 opacity-20" />
          <h2 className="text-lg font-medium mb-2">3D Instruction Viewer</h2>
          <p className="text-sm">Select a set from Browse to get started.</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center text-destructive">
        <div className="text-center">
          <p className="font-medium">Failed to load model</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-full">
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Loading {setInfo?.name ?? 'model'}...</span>
          </div>
        </div>
      )}
      <ViewerCanvas>
        {model && (
          <>
            <LDrawModel model={model} />
            <InstructionCamera model={model} currentStep={currentStep} />
          </>
        )}
      </ViewerCanvas>
      {model && totalSteps > 0 && <StepPartsList parts={stepParts} thumbnails={thumbnails} />}
      {model && totalSteps > 0 && (
        <ViewerOverlay
          currentStep={currentStep}
          totalSteps={totalSteps}
          setName={setInfo?.name ?? ''}
          onPrev={prevStep}
          onNext={nextStep}
          onGoToStep={goToStep}
        />
      )}
    </div>
  )
}
