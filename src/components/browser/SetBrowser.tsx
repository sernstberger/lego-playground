import { MODEL_CATALOG } from '@/services/ldraw'
import { SetCard } from './SetCard'

export function SetBrowser() {
  return (
    <div className="p-6">
      <h1 className="mb-2 text-2xl font-bold">Browse Sets</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Select a set to view its building instructions in 3D.
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MODEL_CATALOG.map((set) => (
          <SetCard key={set.id} set={set} />
        ))}
      </div>
    </div>
  )
}
