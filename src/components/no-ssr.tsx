'use client'

import { ReactNode, useState } from 'react'
import { useEffectOnce } from 'usehooks-ts'

export function NoSSR({ children, fallback = null }: { children: ReactNode; fallback?: ReactNode }) {
  const [isMounted, setIsMounted] = useState(false)

  useEffectOnce(() => {
    setIsMounted(true)
  })

  return isMounted ? children : fallback
}
