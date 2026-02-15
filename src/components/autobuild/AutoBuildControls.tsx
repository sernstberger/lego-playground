import { Play, Pause, RotateCcw, Ghost } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { useAutoPlay } from '@/hooks/useAutoPlay'
import { useViewerStore } from '@/stores/useViewerStore'

export function AutoBuildControls() {
  const { isPlaying, playbackSpeed, togglePlay, restart, setPlaybackSpeed } = useAutoPlay()
  const ghostPreviousSteps = useViewerStore((s) => s.ghostPreviousSteps)
  const setGhostPreviousSteps = useViewerStore((s) => s.setGhostPreviousSteps)

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="icon" className="h-8 w-8" onClick={togglePlay}>
        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </Button>
      <Button variant="outline" size="icon" className="h-8 w-8" onClick={restart}>
        <RotateCcw className="h-4 w-4" />
      </Button>
      <Button
        variant={ghostPreviousSteps ? 'default' : 'outline'}
        size="icon"
        className="h-8 w-8"
        onClick={() => setGhostPreviousSteps(!ghostPreviousSteps)}
        title={ghostPreviousSteps ? 'Disable ghost mode' : 'Enable ghost mode'}
      >
        <Ghost className="h-4 w-4" />
      </Button>
      <div className="flex items-center gap-1 min-w-[100px]">
        <Slider
          value={[playbackSpeed]}
          min={0.25}
          max={4}
          step={0.25}
          onValueChange={([v]) => setPlaybackSpeed(v)}
          className="flex-1"
        />
        <span className="text-xs font-mono tabular-nums whitespace-nowrap w-8 text-right">
          {playbackSpeed}x
        </span>
      </div>
    </div>
  )
}
