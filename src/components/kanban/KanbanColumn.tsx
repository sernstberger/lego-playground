import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { ScrollArea } from '@/components/ui/scroll-area'
import { KanbanCard } from './KanbanCard'
import type { KanbanColumn as KanbanColumnType } from '@/types/kanban'

interface Props {
  column: KanbanColumnType
}

export function KanbanColumn({ column }: Props) {
  const { setNodeRef } = useDroppable({ id: column.id })

  return (
    <div className="flex w-80 flex-col rounded-lg border bg-muted/50">
      <div className="flex items-center justify-between p-3 pb-2">
        <h3 className="text-sm font-semibold">{column.title}</h3>
        <span className="text-xs text-muted-foreground">{column.cards.length}</span>
      </div>
      <ScrollArea className="flex-1 px-3 pb-3">
        <SortableContext
          items={column.cards.map((c) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          <div ref={setNodeRef} className="flex min-h-[40px] flex-col gap-2">
            {column.cards.map((card) => (
              <KanbanCard key={card.id} card={card} />
            ))}
          </div>
        </SortableContext>
      </ScrollArea>
    </div>
  )
}
