'use client'

import Image from 'next/image'
import { use, useEffect, useMemo, useRef, useState } from 'react'

import { IKunBadge } from '@/components/ikun-badge'
import { TalkBubble } from '@/components/talk-bubble'
import { TalkSelect } from '@/components/talk-select'
import { uniqueId } from '@/utils/unique-id'
import { questions } from './questions'
import { TalkInput } from '@/components/talk-input'
import type { AudioMessage, Message } from '@/types/message'
import { TalkAudio } from '@/components/talk-audio'

export function Talk() {
  const voiceListPromise = useMemo(() => {
    if (typeof window !== 'undefined') {
      return fetch('/api/voice').then(async (res) => {
        return await res.json()
      })
    }

    return Promise.resolve({})
  }, [])
  const voiceList = use(voiceListPromise)

  questions[questions.length - 1][1] = voiceList

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
    if (
      lastNode &&
      !lastNode.isBot &&
      typeof lastNode.data === 'string' &&
      /我要听故事/.test(lastNode.data)
    ) {
      setMessage((v) => [...v, ...questions[0]])
      setChosedSelectIds([])
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
        fetch('/api/story', {
          method: 'post',
          body: JSON.stringify({ options: chosedSelectIds }),
        }).then(async (res) => {
          const data = (await res.json()) as AudioMessage

          setMessage((v) => [...v, data])
        })
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
          <p className="text-center text-xs text-gray-500">助理小鸡哥 进入会话为你服务</p>
        </div>

        <div className="flex flex-col gap-3 w-full">
          {messages.map((message) => {
            switch (message.type) {
              case 'text':
                return message.isBot ? (
                  <div key={uniqueId()} className="flex gap-2">
                    <Image src="/logo.svg" alt="坤坤" width={24} height={24} priority />
                    <TalkBubble facing="left" className="rounded-tl-lg bg-gray-700">
                      {message.data}
                    </TalkBubble>
                  </div>
                ) : (
                  <TalkBubble
                    key={uniqueId()}
                    facing="right"
                    className="ml-auto max-w-full rounded-tr-lg bg-orange-400 text-gray-800"
                  >
                    {message.data}
                  </TalkBubble>
                )

              case 'select':
                return (
                  <TalkSelect
                    key={uniqueId()}
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
                      setChosedSelectIds((v) => [...v, option.value])
                    }}
                  />
                )

              case 'audio':
                return (
                  <div key={uniqueId()} className="flex gap-2">
                    <Image src="/logo.svg" alt="坤坤" width={24} height={24} priority />
                    <TalkAudio src={message.data} facing="left" className="rounded-tl-lg bg-gray-700" />
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
