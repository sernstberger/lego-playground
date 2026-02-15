import { useNavigate } from 'react-router-dom'
import { Box } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { SetInfo } from '@/types/ldraw'

interface Props {
  set: SetInfo
}

export function SetCard({ set }: Props) {
  const navigate = useNavigate()

  return (
    <Card
      className="cursor-pointer hover:bg-muted/50 transition-colors"
      onClick={() => navigate(`/viewer?set=${set.id}`)}
    >
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-md bg-muted">
            <Box className="h-6 w-6 text-muted-foreground" />
          </div>
          <div>
            <CardTitle className="text-sm">{set.name}</CardTitle>
            <p className="text-xs text-muted-foreground">Set #{set.setNumber}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex gap-1.5">
          {set.theme && (
            <Badge variant="outline" className="text-xs">
              {set.theme}
            </Badge>
          )}
          {set.partCount && (
            <Badge variant="secondary" className="text-xs">
              {set.partCount} parts
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
