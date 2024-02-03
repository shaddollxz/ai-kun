'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

import { IKunBadge } from '@/components/ikun-badge'
import { TalkBubble } from '@/components/talk-bubble'
import { TalkSelect } from '@/components/talk-select'
import { uniqueId } from '@/utils/unique-id'
import { questions } from './questions'
import { TalkInput } from '@/components/talk-input'
import type { Message } from '@/types/message'
import { TalkAudio } from '@/components/talk-audio'

export function Talk() {
  const messageContent = useRef<HTMLDivElement | null>(null)

  const [messages, setMessage] = useState<Message[]>([
    {
      type: 'text',
      id: uniqueId(),
      data: 'Hi~我是你的专属智能助理小鸡哥，你可以对我说我要听故事~',
      isBot: true,
    },
  ])

  const [chosedSelectIds, setChosedSelectIds] = useState<string[]>([])

  useEffect(() => {
    messageContent.current?.scrollTo({
      top: messageContent.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [messages])

  useEffect(() => {
    const lastNode = messages.at(-1)
    if (lastNode && !lastNode.isBot && lastNode.data === '我要听故事' && !chosedSelectIds.length) {
      setMessage((v) => [...v, ...questions[0]])
    }
  }, [messages])

  useEffect(() => {
    const lastNode = messages.at(-1)
    if (lastNode && !lastNode.isBot) {
      const nextQuestion = questions[chosedSelectIds.length]
      if (nextQuestion) {
        setMessage((v) => [...v, ...nextQuestion])
      } else {
        setMessage((v) => [...v, { type: 'text', id: uniqueId(), data: '故事准备中。。。', isBot: true }])
        // TODO: 发送请求
      }
    }
  }, [chosedSelectIds])

  return (
    <div className="flex flex-col h-full">
      <div ref={messageContent} className="flex-grow flex flex-col gap-3 overflow-y-auto">
        <div className="flex flex-col gap-2 items-center justify-center pb-2">
          <IKunBadge className="mx-auto">
            <span className="text-orange-400 mr-1">小鸡哥</span>
            <span>智能助理</span>
          </IKunBadge>
          <p className="text-center text-sm text-gray-500">助理小鸡哥 进入会话为你服务</p>
        </div>

        <div className="flex flex-col gap-3 w-full">
          {messages.map((message) => {
            switch (message.type) {
              case 'text':
                return message.isBot ? (
                  <div key={message.id} className="flex gap-2">
                    <Image
                      src="/vercel.svg"
                      alt="Vercel Logo"
                      className="dark:invert"
                      width={100}
                      height={24}
                      priority
                    />
                    <TalkBubble facing="left" className="rounded-tl-lg bg-gray-600">
                      {message.data}
                    </TalkBubble>
                  </div>
                ) : (
                  <TalkBubble
                    key={message.id}
                    facing="right"
                    className="ml-auto rounded-tr-lg bg-orange-400 text-gray-700"
                  >
                    {message.data}
                  </TalkBubble>
                )

              case 'select':
                return (
                  <TalkSelect
                    key={message.id}
                    options={message.data}
                    onSelect={(option) => {
                      if (chosedSelectIds.includes(message.id)) return

                      setMessage((v) => [
                        ...v,
                        {
                          type: 'text',
                          id: uniqueId(),
                          data: option.label,
                          isBot: false,
                        },
                      ])
                      setChosedSelectIds((v) => [...v, message.id])
                    }}
                  />
                )

              case 'audio':
                return (
                  <div key={message.id} className="flex gap-2">
                    <Image
                      src="/vercel.svg"
                      alt="Vercel Logo"
                      className="dark:invert"
                      width={100}
                      height={24}
                      priority
                    />

                    <TalkAudio src={message.data} facing="left" className="w-48 rounded-tl-lg bg-gray-600" />
                  </div>
                )
            }
          })}
        </div>
      </div>

      <div className="flex-shrink-0 h-[70px] py-4">
        <TalkInput
          onValueChange={(value) => {
            setMessage((v) => [
              ...v,
              {
                type: 'text',
                id: uniqueId(),
                data: value,
                isBot: false,
              },
            ])
          }}
        />
      </div>
    </div>
  )
}
