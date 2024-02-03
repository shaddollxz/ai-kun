import { AudioMessage, reqType } from "@/types/message";

import { getOpenaiStory } from "./get_openai_story";
import { getStory } from "./get_story";
import { log } from "console";

export async function POST(request: Request) {
  const req = await request.json();
  const reqOptions: reqType = req.options;
  const story = reqOptions[0] == 1
    ? await getOpenaiStory(reqOptions[1])
    : getStory(reqOptions[1]);

    console.log(story);
    

  const options = {
    method: "POST",
    headers: {
      Authorization: "Bearer sk-5978dd2aaa17d801970a15ccac064fb3",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
        model: "reecho-neural-voice-001",
        voiceId: reqOptions[2],
        text: story
    }),
  };

  const voiceRes = await fetch(
    "https://v1.reecho.cn/api/tts/simple-generate",
    options,
  )
    .then((response) => response.json())
    .catch((err) => console.error(err));
    console.log(voiceRes);
    

  const audio = voiceRes.data.audio;

  const res: AudioMessage = {
    type: "audio",
    id: crypto.randomUUID(),
    data: audio,
    isBot: true,
  };

  return Response.json(res);
}
