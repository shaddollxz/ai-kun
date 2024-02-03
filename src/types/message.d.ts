export interface SelectOption<T> {
  label: string
  value: T
}
export type TextMessage = {
  type: 'text'
  id: string
  data: string
  isBot: boolean
}

export type AudioMessage = {
  type: 'audio'
  id: string
  data: string[]
  isBot: boolean
}

export type SelectMessage = {
  type: 'select'
  id: string
  data: SelectOption<string>[]
  isBot: boolean
}

export type reqType = [storyModel: 0 | 1, storyType: string, storyVoice: string]

export type Message = TextMessage | AudioMessage | SelectMessage
