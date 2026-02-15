import { create } from 'zustand'
import type { KanbanCard, KanbanColumn } from '@/types/kanban'
import { getItem, setItem } from '@/services/indexeddb'

const STORAGE_KEY = 'kanban-board'

const DEFAULT_COLUMNS: KanbanColumn[] = [
  {
    id: 'backlog',
    title: 'Backlog',
    cards: [
      {
        id: 'p1-load-model',
        title: 'Load + render real LEGO set',
        description: 'Display a small OMR model in R3F Canvas with orbit controls',
        phase: 'Phase 1',
        labels: ['3d', 'core'],
      },
      {
        id: 'p2-step-nav',
        title: 'Step-by-step navigation',
        description: 'Prev/next buttons, slider, step counter, arrow keys',
        phase: 'Phase 2',
        labels: ['ui', 'core'],
      },
      {
        id: 'p3-camera-highlight',
        title: 'Instruction camera + highlighting',
        description: 'Auto-camera per step, ghost previous parts',
        phase: 'Phase 3',
        labels: ['3d', 'ux'],
      },
      {
        id: 'p4-browser',
        title: 'Set browser',
        description: 'Browse curated model list, click to open in viewer',
        phase: 'Phase 4',
        labels: ['ui'],
      },
      {
        id: 'p5-autobuild',
        title: 'Auto-build animation',
        description: 'Play/pause auto-step with speed control',
        phase: 'Phase 5',
        labels: ['animation'],
      },
    ],
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    cards: [],
  },
  {
    id: 'done',
    title: 'Done',
    cards: [
      {
        id: 'p0-scaffold',
        title: 'Project scaffolding + tooling + docs',
        description: 'Vite, React, TS, shadcn, kanban, docs infrastructure',
        phase: 'Phase 0',
        labels: ['infra'],
      },
    ],
  },
]

interface KanbanStore {
  columns: KanbanColumn[]
  loaded: boolean
  load: () => Promise<void>
  moveCard: (
    cardId: string,
    fromColumnId: string,
    toColumnId: string,
    toIndex: number,
  ) => void
  addCard: (columnId: string, card: KanbanCard) => void
  removeCard: (columnId: string, cardId: string) => void
  reorderCard: (columnId: string, fromIndex: number, toIndex: number) => void
}

export const useKanbanStore = create<KanbanStore>((set, get) => ({
  columns: DEFAULT_COLUMNS,
  loaded: false,

  load: async () => {
    const saved = await getItem<KanbanColumn[]>('kanban', STORAGE_KEY)
    if (saved) {
      set({ columns: saved, loaded: true })
    } else {
      set({ loaded: true })
      await setItem('kanban', STORAGE_KEY, get().columns)
    }
  },

  moveCard: (cardId, fromColumnId, toColumnId, toIndex) => {
    const columns = get().columns.map((col) => ({ ...col, cards: [...col.cards] }))
    const fromCol = columns.find((c) => c.id === fromColumnId)
    const toCol = columns.find((c) => c.id === toColumnId)
    if (!fromCol || !toCol) return

    const cardIndex = fromCol.cards.findIndex((c) => c.id === cardId)
    if (cardIndex === -1) return

    const [card] = fromCol.cards.splice(cardIndex, 1)
    toCol.cards.splice(toIndex, 0, card)

    set({ columns })
    setItem('kanban', STORAGE_KEY, columns)
  },

  addCard: (columnId, card) => {
    const columns = get().columns.map((col) =>
      col.id === columnId ? { ...col, cards: [...col.cards, card] } : col,
    )
    set({ columns })
    setItem('kanban', STORAGE_KEY, columns)
  },

  removeCard: (columnId, cardId) => {
    const columns = get().columns.map((col) =>
      col.id === columnId
        ? { ...col, cards: col.cards.filter((c) => c.id !== cardId) }
        : col,
    )
    set({ columns })
    setItem('kanban', STORAGE_KEY, columns)
  },

  reorderCard: (columnId, fromIndex, toIndex) => {
    const columns = get().columns.map((col) => {
      if (col.id !== columnId) return col
      const cards = [...col.cards]
      const [card] = cards.splice(fromIndex, 1)
      cards.splice(toIndex, 0, card)
      return { ...col, cards }
    })
    set({ columns })
    setItem('kanban', STORAGE_KEY, columns)
  },
}))
