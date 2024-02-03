import { getVoiceList } from "./get_voice_list";

export async function GET(request: Request) {
  const voiceList = await getVoiceList();

  if(voiceList) {
    return voiceList
  }
  return Response.json({message: "not found voice"})
}
