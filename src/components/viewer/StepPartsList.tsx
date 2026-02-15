import type { StepPart } from '@/utils/ldraw-helpers'

interface Props {
  parts: StepPart[]
  thumbnails: Map<string, string>
}

export function StepPartsList({ parts, thumbnails }: Props) {
  if (parts.length === 0) return null

  return (
    <div className="absolute top-0 left-0 p-4 pointer-events-none z-10">
      <div className="rounded-md bg-background/90 border px-2 py-2 pointer-events-auto">
        <div className="flex flex-wrap gap-1">
          {parts.map((part) => {
            const key = `${part.partId}:${part.colorCode}`
            const src = thumbnails.get(key)
            return (
              <div key={key} className="relative w-[60px] h-[60px]">
                {src ? (
                  <img
                    src={src}
                    alt={part.partId}
                    className="w-full h-full object-contain"
                    draggable={false}
                  />
                ) : (
                  <div
                    className="w-full h-full rounded flex items-center justify-center"
                    style={{ backgroundColor: part.colorHex + '33' }}
                  >
                    <span
                      className="inline-block h-4 w-4 rounded-full border border-foreground/20"
                      style={{ backgroundColor: part.colorHex }}
                    />
                  </div>
                )}
                {part.quantity > 1 && (
                  <span className="absolute bottom-0 right-0 bg-foreground text-background text-[10px] font-bold leading-none px-1 py-0.5 rounded-sm">
                    {part.quantity}×
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
