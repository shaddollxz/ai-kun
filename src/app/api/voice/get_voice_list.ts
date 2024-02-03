export async function getVoiceList(): Promise<void | Response> {
    const options = {
      method: "GET",
      headers: { Authorization: "Bearer sk-5978dd2aaa17d801970a15ccac064fb3" },
    };

    return fetch("https://v1.reecho.cn/api/tts/voice", options)
      .then((response) => response)
      .catch((err) => console.error(err));
}
