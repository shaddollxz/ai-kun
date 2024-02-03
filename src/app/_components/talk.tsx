'use client'

import Image from 'next/image'
import { use, useEffect, useMemo, useRef, useState } from 'react'

import { IKunBadge } from '@/components/ikun-badge'
import { TalkBubble } from '@/components/talk-bubble'
import { TalkSelect } from '@/components/talk-select'
import { uniqueId } from '@/utils/unique-id'
import { questions } from './questions'
import { TalkInput } from '@/components/talk-input'
import type { Message } from '@/types/message'
import { TalkAudio } from '@/components/talk-audio'

const errorMessage = [
  {
    type: 'text',
    data: '哥哥我尽力了，实在是编不出来',
    id: uniqueId(),
    isBot: true,
  },
  {
    type: 'audio',
    data: ['/error.mp3'],
    id: uniqueId(),
    isBot: true,
  },
] as Message[]

export function Talk() {
  const voiceListPromise = useMemo(() => {
    return fetch('/api/voice').then(async (res) => {
      return await res.json()
    })
  }, [])
  const voiceList = use(voiceListPromise)

  questions[questions.length - 1][1] = voiceList

  const messageContent = useRef<HTMLDivElement | null>(null)
  const [loading, setLoading] = useState(false)

  const [messages, setMessage] = useState<Message[]>([
    {
      type: 'text',
      id: uniqueId(),
      data: 'Hi~我是你的专属智能助理小鸡哥，你可以对我说我要听故事~',
      isBot: true,
    },
  ])

  const [chosedSelectIds, setChosedSelectIds] = useState<{ id: string; value: string }[]>([])

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

    if (
      lastNode &&
      !lastNode.isBot &&
      typeof lastNode.data === 'string' &&
      /我要灵魂故事/.test(lastNode.data)
    ) {
      setTimeout(() => {
        setMessage((v) => [...v, ...errorMessage])
        setChosedSelectIds([])
      }, 5000)
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
        setLoading(true)
        // TODO: 发送请求
        fetch('/api/story', {
          method: 'post',
          body: JSON.stringify({ options: chosedSelectIds.map((item) => item.value) }),
        })
          .then(async (res) => {
            const data = await res.json()
            const intervalId = setInterval(async () => {
              const res = await fetch(`/api/story?id=${data.id}`)
              const resData = await res.json()
console.log(resData,"Ddd");

              if (resData.status === 'pending') return

              clearInterval(intervalId)
              setMessage((v) => [...v, resData])
              setLoading(false)
            }, 3000)
          })
          .catch(() => {
            setMessage((v) => [...v, ...errorMessage])
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
                      if (loading) return

                      if (chosedSelectIds.filter((item) => item.id === message.id).length) {
                        setMessage((v) => [
                          ...v,
                          {
                            type: 'text',
                            id: uniqueId(),
                            data: '开始重新选择故事类型',
                            isBot: true,
                          },
                        ])

                        setChosedSelectIds([])

                        setMessage((v) => [...v, ...questions[0]])

                        return
                      }

                      setMessage((v) => [
                        ...v,
                        {
                          type: 'text',
                          id: uniqueId(),
                          data: option.label,
                          isBot: false,
                        },
                      ])
                      setChosedSelectIds((v) => [...v, { id: message.id, value: option.value }])
                    }}
                  />
                )

              case 'audio':
                return (
                  <div key={uniqueId()} className="flex gap-2">
                    <Image src="/logo.svg" alt="坤坤" width={24} height={24} priority />
                    <TalkAudio urls={message.data} facing="left" className="rounded-tl-lg bg-gray-700" />
                  </div>
                )
            }
          })}
        </div>
      </div>

      <div className="flex-shrink-0 h-[70px] py-4">
        <TalkInput
          onValueChange={(value) => {
            if (loading) return setLoading(false)

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
