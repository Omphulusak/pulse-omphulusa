import { createFileRoute } from "@tanstack/react-router";
import { createOpenAI } from "@ai-sdk/openai";
import { streamText, type ModelMessage } from "ai";

const SYSTEM: Record<string, string> = {
  email:
    "You are an expert business writer. Write a complete, ready-to-send professional email in the requested tone. Start with 'Subject:' on the first line, then the email body. Use markdown sparingly.",
  notes:
    "You summarize meeting notes. Output markdown with sections: '## Summary' (3-5 sentences), '## Key Decisions' (bullets), '## Action Items' (table: Task | Owner | Deadline; use 'Unassigned'/'Not specified' when missing), '## Deadlines' (bullets). Never invent facts not in the notes.",
  planner:
    "You are a productivity coach. Build a realistic schedule in markdown. First a '## Priorities' section ranking tasks (Eisenhower: urgent/important) with a one-line reason. Then '## Schedule' as a table (Time | Task | Priority) for a daily plan, or per-day tables for weekly. Include breaks. End with '## Tips' (2-3 bullets).",
  research:
    "You are a research analyst. Output markdown: '## Overview', '## Key Points' (bullets), '## Insights', '## Recommendations' (numbered, actionable). If you are unsure about facts, say so. Note that information may not reflect the latest developments.",
  chat:
    "You are Pulse, a concise, friendly workplace assistant. Help with emails, planning, summaries, research and general work questions. Use markdown when helpful.",
};

export const Route = createFileRoute("/api/ai")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const key = process.env["LOVABLE_API_KEY"];
        if (!key) return new Response("AI is not configured.", { status: 500 });
        const body = (await request.json()) as {
          tool: string;
          prompt?: string;
          messages?: { role: "user" | "assistant"; content: string }[];
        };
        const system = SYSTEM[body.tool];
        if (!system) return new Response("Unknown tool", { status: 400 });
        const messages: ModelMessage[] =
          body.tool === "chat" && body.messages
            ? body.messages.slice(-30)
            : [{ role: "user", content: String(body.prompt ?? "").slice(0, 30000) }];

        let runId: string | undefined;
        const openai = createOpenAI({
          baseURL: "https://ai.gateway.lovable.dev/v1",
          apiKey: key,
          headers: { "Lovable-API-Key": key, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
          fetch: async (input, init) => {
            const headers = new Headers(init?.headers);
            if (runId) headers.set("X-Lovable-AIG-Run-ID", runId);
            const res = await fetch(input, { ...init, headers });
            runId ??= res.headers.get("X-Lovable-AIG-Run-ID") ?? undefined;
            if (!res.ok) {
              const text = await res.clone().text();
              throw Object.assign(new Error(text || res.statusText), { status: res.status });
            }
            return res;
          },
        });

        try {
          const result = streamText({
            model: openai.responses("openai/gpt-6-astra"),
            system,
            messages,
            abortSignal: request.signal,
            providerOptions: {
              openai: {
                forceReasoning: true,
                reasoningEffort: "low",
                reasoningSummary: "auto",
                store: false,
                include: ["reasoning.encrypted_content"],
              },
            },
          });
          return result.toTextStreamResponse();
        } catch (e) {
          const status = (e as { status?: number }).status ?? 500;
          const msg =
            status === 429
              ? "Too many requests — please wait a moment and try again."
              : status === 402
                ? "AI credits are used up. Please add credits to continue."
                : "The AI service failed. Please try again.";
          return new Response(msg, { status });
        }
      },
    },
  },
});
