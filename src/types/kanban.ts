export interface KanbanCard {
  id: string
  title: string
  description?: string
  phase?: string
  labels?: string[]
}

export interface KanbanColumn {
  id: string
  title: string
  cards: KanbanCard[]
}

export interface KanbanBoard {
  columns: KanbanColumn[]
}
