export async function streamAI(
  payload: { tool: string; prompt?: string; messages?: { role: "user" | "assistant"; content: string }[] },
  onChunk: (full: string) => void,
  signal?: AbortSignal,
) {
  const res = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal,
  });
  if (!res.ok || !res.body) throw new Error((await res.text()) || "Request failed");
  const reader = res.body.getReader();
  const dec = new TextDecoder();
  let full = "";
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    full += dec.decode(value, { stream: true });
    onChunk(full);
  }
  if (!full.trim()) throw new Error("The AI returned an empty response. Please try again.");
  return full;
}
