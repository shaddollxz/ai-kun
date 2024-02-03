export async function getVoiceList(): Promise<void | Response> {
  return fetch("https://v1.reecho.cn/api/tts/voice", {
    method: "GET",
    headers: { Authorization: "Bearer sk-5978dd2aaa17d801970a15ccac064fb3" },
    cache: "no-cache",
  })
    .then((response) => response)
    .catch((err) => console.error(err));
}
