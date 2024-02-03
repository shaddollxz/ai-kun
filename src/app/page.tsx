import { Suspense } from 'react'
import Image from 'next/image'
import { NoSSR } from '@/components/no-ssr'
import { Talk } from './_components/talk'

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center gap-9 h-full pt-[240px] bg-white">
          <Image src="/loading.png" alt="loading..." width={215} height={215}></Image>
          <Image src="/slogan.png" alt="slogan" width={171} height={71} />
        </div>
      }
    >
      <header className="h-12 w-full p-2 bg-gray-900">
        <h1 className="text-2xl font-medium">听故事</h1>
      </header>
      <main className="flex-1 w-full p-2 bg-gray-900 overflow-hidden">
        <NoSSR>
          <Talk />
        </NoSSR>
      </main>
    </Suspense>
  )
}
