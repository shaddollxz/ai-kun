import { SelectMessage, SelectOption } from "@/types/message";
import { getVoiceList } from "./get_voice_list";
import { log } from "console";

export async function GET(request: Request) {
  const voiceList = await getVoiceList();

  if (voiceList) {
    const res = await voiceList.json();
    const data: SelectOption<string>[] = res.data.map((
      d: { name: any; id: any },
    ) => ({ label: d.name, value: d.id }));
    const select: SelectMessage = {
      type: "select",
      id: crypto.randomUUID(),
      data,
      isBot: true,
    };

    return Response.json(select);
  }
  return Response.json({ message: "not found voice" });
}
