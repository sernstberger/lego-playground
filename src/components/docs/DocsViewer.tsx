import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MarkdownRenderer } from './MarkdownRenderer'

interface DocEntry {
  slug: string
  title: string
  content: string
  type: 'adr' | 'devlog'
}

// Static imports of doc files — Vite's import.meta.glob
const adrFiles = import.meta.glob('/docs/decisions/*.md', {
  query: '?raw',
  import: 'default',
})
const devlogFiles = import.meta.glob('/docs/devlog/*.md', {
  query: '?raw',
  import: 'default',
})

function extractTitle(content: string): string {
  const match = content.match(/^#\s+(.+)$/m)
  return match ? match[1] : 'Untitled'
}

export function DocsViewer() {
  const [docs, setDocs] = useState<DocEntry[]>([])
  const [selected, setSelected] = useState<DocEntry | null>(null)
  const [activeTab, setActiveTab] = useState<'adr' | 'devlog'>('adr')

  useEffect(() => {
    async function loadDocs() {
      const entries: DocEntry[] = []

      for (const [path, loader] of Object.entries(adrFiles)) {
        if (path.includes('template')) continue
        const content = (await loader()) as string
        const slug = path.split('/').pop()?.replace('.md', '') ?? ''
        entries.push({ slug, title: extractTitle(content), content, type: 'adr' })
      }

      for (const [path, loader] of Object.entries(devlogFiles)) {
        const content = (await loader()) as string
        const slug = path.split('/').pop()?.replace('.md', '') ?? ''
        entries.push({ slug, title: extractTitle(content), content, type: 'devlog' })
      }

      setDocs(entries)
    }
    loadDocs()
  }, [])

  const filtered = docs.filter((d) => d.type === activeTab)

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold">Documentation</h1>
      <div className="flex gap-2 mb-4">
        <Badge
          variant={activeTab === 'adr' ? 'default' : 'outline'}
          className="cursor-pointer"
          onClick={() => {
            setActiveTab('adr')
            setSelected(null)
          }}
        >
          Architecture Decisions
        </Badge>
        <Badge
          variant={activeTab === 'devlog' ? 'default' : 'outline'}
          className="cursor-pointer"
          onClick={() => {
            setActiveTab('devlog')
            setSelected(null)
          }}
        >
          Dev Log
        </Badge>
      </div>

      {selected ? (
        <div>
          <button
            onClick={() => setSelected(null)}
            className="text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            &larr; Back to list
          </button>
          <MarkdownRenderer content={selected.content} />
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map((doc) => (
            <Card
              key={doc.slug}
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => setSelected(doc)}
            >
              <CardHeader className="p-4 pb-1">
                <CardTitle className="text-sm">{doc.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <span className="text-xs text-muted-foreground">{doc.slug}</span>
              </CardContent>
            </Card>
          ))}
          {filtered.length === 0 && (
            <p className="text-sm text-muted-foreground">No documents found.</p>
          )}
        </div>
      )}
    </div>
  )
}
