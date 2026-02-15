import { useEffect } from 'react'
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from '@dnd-kit/core'
import { useState } from 'react'
import { useKanbanStore } from '@/stores/useKanbanStore'
import { KanbanColumn } from './KanbanColumn'
import { KanbanCard } from './KanbanCard'
import type { KanbanCard as KanbanCardType } from '@/types/kanban'

export function KanbanBoard() {
  const { columns, loaded, load, moveCard } = useKanbanStore()
  const [activeCard, setActiveCard] = useState<KanbanCardType | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  )

  useEffect(() => {
    if (!loaded) load()
  }, [loaded, load])

  function findColumnByCardId(cardId: string) {
    return columns.find((col) => col.cards.some((c) => c.id === cardId))
  }

  function handleDragStart(event: DragStartEvent) {
    const cardId = event.active.id as string
    const col = findColumnByCardId(cardId)
    const card = col?.cards.find((c) => c.id === cardId)
    if (card) setActiveCard(card)
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event
    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    const fromCol = findColumnByCardId(activeId)
    const toCol = findColumnByCardId(overId) || columns.find((c) => c.id === overId)

    if (!fromCol || !toCol || fromCol.id === toCol.id) return

    const overCardIndex = toCol.cards.findIndex((c) => c.id === overId)
    const toIndex = overCardIndex >= 0 ? overCardIndex : toCol.cards.length

    moveCard(activeId, fromCol.id, toCol.id, toIndex)
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveCard(null)
    if (!over || active.id === over.id) return

    const activeId = active.id as string
    const overId = over.id as string

    const fromCol = findColumnByCardId(activeId)
    const toCol = findColumnByCardId(overId) || columns.find((c) => c.id === overId)

    if (!fromCol || !toCol) return

    if (fromCol.id === toCol.id) {
      const fromIndex = fromCol.cards.findIndex((c) => c.id === activeId)
      const toIndex = toCol.cards.findIndex((c) => c.id === overId)
      if (fromIndex !== toIndex) {
        useKanbanStore.getState().reorderCard(fromCol.id, fromIndex, toIndex)
      }
    }
  }

  if (!loaded) {
    return <div className="p-8 text-muted-foreground">Loading board...</div>
  }

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold">Project Board</h1>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4">
          {columns.map((column) => (
            <KanbanColumn key={column.id} column={column} />
          ))}
        </div>
        <DragOverlay>
          {activeCard ? <KanbanCard card={activeCard} /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}
