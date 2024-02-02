import type { SelectMessage, TextMessage } from '@/types/message'
import { uniqueId } from '@/utils/unique-id'

export const questions: [TextMessage, SelectMessage][] = [
  [
    { type: 'text', id: uniqueId(), data: '请输入故事模型', isBot: true },
    {
      type: 'select',
      id: uniqueId(),
      data: [
        {
          label: '故事库',
          value: '故事库',
        },
        {
          label: '使用 GPT 生成',
          value: '使用 GPT 生成',
        },
      ],
      isBot: true,
    },
  ],
  [
    { type: 'text', id: uniqueId(), data: '请输入故事类型', isBot: true },
    {
      type: 'select',
      id: uniqueId(),
      data: [
        {
          label: '历史故事',
          value: '历史故事',
        },
        {
          label: '语言故事',
          value: '语言故事',
        },
        {
          label: '儿童故事',
          value: '儿童故事',
        },
      ],
      isBot: true,
    },
  ],
  [
    { type: 'text', id: uniqueId(), data: '请输入人声', isBot: true },
    {
      type: 'select',
      id: uniqueId(),
      data: [
        {
          label: 'AI Kun',
          value: 'AI Kun',
        },
        {
          label: '浑厚男声',
          value: '浑厚男声',
        },
        {
          label: '温柔女声',
          value: '温柔女声',
        },
      ],
      isBot: true,
    },
  ],
]
