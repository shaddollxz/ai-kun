import type { ReactNode } from 'react'
import { clsx, type ClassValue } from 'clsx'
import Image from 'next/image'

export function IKunBadge({ children, className }: { children: ReactNode; className?: ClassValue }) {
  return (
    <div className={clsx('relative w-[150px] py-2 px-5 mt-3 bg-gray-700 rounded-full', className)}>
      <div className="absolute left-1/2 -translate-x-1/2 bottom-1/2 -translate-y-1/5 flex items-center p-1 w-9 aspect-square bg-gray-700 rounded-full">
        <Image src="/logo.svg" alt="坤坤" width={30} height={30} priority />{' '}
      </div>

      <div className="pt-3 text-sm text-center">{children}</div>
    </div>
  )
}
