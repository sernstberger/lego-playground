import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { KanbanCard as KanbanCardType } from '@/types/kanban'

interface Props {
  card: KanbanCardType
}

export function KanbanCard({ card }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: card.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <Card ref={setNodeRef} style={style} {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
      <CardHeader className="p-3 pb-1">
        <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        {card.description && (
          <p className="text-xs text-muted-foreground mb-2">{card.description}</p>
        )}
        <div className="flex flex-wrap gap-1">
          {card.phase && (
            <Badge variant="outline" className="text-xs">
              {card.phase}
            </Badge>
          )}
          {card.labels?.map((label) => (
            <Badge key={label} variant="secondary" className="text-xs">
              {label}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
