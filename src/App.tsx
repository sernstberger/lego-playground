import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { InstructionViewer } from '@/components/viewer/InstructionViewer'
import { SetBrowser } from '@/components/browser/SetBrowser'
import { KanbanBoard } from '@/components/kanban/KanbanBoard'
import { DocsViewer } from '@/components/docs/DocsViewer'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/viewer" element={<InstructionViewer />} />
          <Route path="/browse" element={<SetBrowser />} />
          <Route path="/kanban" element={<KanbanBoard />} />
          <Route path="/docs" element={<DocsViewer />} />
          <Route path="*" element={<Navigate to="/viewer" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
