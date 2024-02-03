import { SelectMessage, SelectOption } from '@/types/message'
import { getVoiceList } from './get_voice_list'
import { log } from 'console'

function sleep(time: number) {
  return new Promise<boolean>((resovle) => {
    setTimeout(() => {
      resovle(true)
    }, time)
  })
}

export async function GET(request: Request) {
  const voiceList = await getVoiceList()

  if (voiceList) {
    const res = await voiceList.json()
    const data: SelectOption<string>[] = res.data.map((d: { name: any; id: any }) => ({
      label: d.name,
      value: d.id,
    }))
    const select: SelectMessage = {
      type: 'select',
      id: crypto.randomUUID(),
      data,
      isBot: true,
    }

    // await sleep(100000)

    return Response.json(select)
  }
  return Response.json({ message: 'not found voice' })
}
