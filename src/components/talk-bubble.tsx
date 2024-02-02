import { clsx, type ClassValue } from 'clsx'
import type { ReactNode } from 'react'

export function TalkBubble({
  facing,
  className,
  children,
}: {
  facing: 'left' | 'right'
  children: ReactNode
  className?: ClassValue
}) {
  return <div className={clsx('w-max py-2 px-4 rounded-3xl', className)}>{children}</div>
}
