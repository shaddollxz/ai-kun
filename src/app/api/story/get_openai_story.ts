import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: "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",
});
export async function getOpenaiStory(storyType: string) {
  const contentStory = `生成一个200字的${storyType}`;

  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: "你是一个生成故事的助手." }, {
      "role": "user",
      "content": contentStory,
    }],
    model: "gpt-3.5-turbo",
  });

  return completion.choices[0].message.content;
}
