import { AudioMessage, reqType } from '@/types/message'

import { getOpenaiStory } from './get_openai_story'
import { getStory } from './get_story'

export async function POST(request: Request) {
  const req = await request.json()
  const reqOptions: reqType = req.options
  const story = reqOptions[0] == 1 ? await getOpenaiStory(reqOptions[1]) : getStory(reqOptions[1])

  const options = {
    method: 'POST',
    headers: {
      Authorization: 'Bearer sk-5978dd2aaa17d801970a15ccac064fb3',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'reecho-neural-voice-001',
      randomness: 97,
      stability_boost: 0,
      contents: splitTextIntoParagraphs(story!, reqOptions[2]),
    }),
  }

  try {
    const voiceRes = await fetch('https://v1.reecho.cn/api/tts/generate', options).then((response) =>
      response.json()
    )

    return Response.json({ id: voiceRes.data.id })
  } catch (err) {
    throw Response.json({
      message: (err as any).message,
    })
  }
}

export async function GET(request: Request) {
  const id = new URL(request.url).searchParams.get('id')
  console.log(id, 'caugusbiabnciabcnaoncbjancoianciancn')

  try {
    return fetch(`https://v1.reecho.cn/api/tts/generate/${id}`, {
      method: 'GET',
      headers: { Authorization: 'Bearer sk-5978dd2aaa17d801970a15ccac064fb3' },
    }).then(async (response) => {
      const { data } = await response.json()

      if (data.status === 'generated') {
        return Response.json({
          type: 'audio',
          id: crypto.randomUUID(),
          data: data.metadata.contents.map((d: { audio: string }) => d.audio),
          isBot: true,
        } as AudioMessage)
      }

      return Response.json({
        status: "pending",
      });
    })
  } catch (error) {
    throw Response.json({})
  }
}

function splitTextIntoParagraphs(
  inputText: string,
  voiceId: string
): Array<{ text: string; voiceId: string }> {
  const paragraphs = inputText.split(/\n\s*\n/).filter((paragraph) => paragraph.trim() !== '')
  return paragraphs.map((paragraph) => ({
    text: paragraph.trim(),
    voiceId: voiceId,
  }))
}
