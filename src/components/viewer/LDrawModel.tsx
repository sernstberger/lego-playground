import type { Group } from 'three'

interface Props {
  model: Group
}

export function LDrawModel({ model }: Props) {
  return <primitive object={model} />
}
