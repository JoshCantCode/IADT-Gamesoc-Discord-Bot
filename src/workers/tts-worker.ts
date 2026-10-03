import { mkdir, writeFile } from "node:fs/promises";

export async function getTTSFile(content: string): Promise<void> {
  const res = await fetch(process.env.TTS_URL as string, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "kokoro",
      input: content,
      voice: "af_heart",
      response_format: "mp3",
    }),
  });

  if (!res.ok) throw new Error(`TTS failed: ${res.status}`);

  const audio = Buffer.from(await res.arrayBuffer());
  await mkdir("./temp", { recursive: true });
  return await writeFile("./temp/tts.mp3", audio);
}
