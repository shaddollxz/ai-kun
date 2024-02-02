import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AiKun',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-cn">
      <body className="flex flex-col h-screen md:w-[500px] mx-auto">
        <header className="h-12 w-full p-2 bg-gray-800">
          <h1 className="text-2xl font-medium">听故事</h1>
        </header>
        <main className="flex-1 w-full p-2 bg-gray-800 overflow-hidden">{children}</main>
      </body>
    </html>
  )
}
