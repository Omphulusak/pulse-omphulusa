import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowUp, MessagesSquare, RotateCcw, Square, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/tool-page";
import { Markdown } from "@/components/ai-output";
import { streamAI } from "@/lib/ai";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Workplace Assistant — Pulse" },
      { name: "description", content: "Chat with an interactive AI assistant for any workplace task." },
      { property: "og:title", content: "AI Workplace Assistant — Pulse" },
      { property: "og:description", content: "Your interactive AI workplace assistant." },
    ],
  }),
  component: ChatPage,
});

type Msg = { role: "user" | "assistant"; content: string };
const SUGGESTIONS = ["How do I run a more effective standup?", "Write a polite reminder for an overdue invoice", "Ideas to improve team morale remotely"];

function ChatPage() {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const ctrl = useRef<AbortController | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), [msgs, loading]);
  useEffect(() => {
    if (!loading) taRef.current?.focus();
  }, [loading]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    const history: Msg[] = [...msgs, { role: "user", content: text.trim() }];
    setMsgs(history);
    setInput("");
    setError("");
    setLoading(true);
    ctrl.current = new AbortController();
    try {
      await streamAI(
        { tool: "chat", messages: history },
        (full) => setMsgs([...history, { role: "assistant", content: full }]),
        ctrl.current.signal,
      );
    } catch (e) {
      if ((e as Error).name !== "AbortError") setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const waiting = loading && msgs[msgs.length - 1]?.role === "user";

  return (
    <div className="mx-auto flex h-[calc(100dvh-12rem)] min-h-[480px] max-w-4xl flex-col">
      <div className="flex items-start justify-between gap-4">
        <PageHeader icon={<MessagesSquare className="size-5" />} title="AI Workplace Assistant" desc="Ask anything about your work." />
        {msgs.length > 0 && (
          <Button variant="outline" size="sm" onClick={() => { ctrl.current?.abort(); setMsgs([]); setError(""); }}>
            <RotateCcw /> New chat
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto rounded-xl border bg-card p-4 shadow-card md:p-6">
        {msgs.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
              <Zap className="size-6" />
            </div>
            <p className="font-display font-semibold">Hi, I'm Pulse.</p>
            <p className="mb-6 text-sm text-muted-foreground">How can I help you work smarter today?</p>
            <div className="flex flex-wrap justify-center gap-2">
              {SUGGESTIONS.map((s) => (
                <button key={s} onClick={() => send(s)} className="rounded-full border px-3 py-1.5 text-xs hover:bg-muted">
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {msgs.map((m, i) =>
              m.role === "user" ? (
                <div key={i} className="flex justify-end">
                  <div className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground">
                    {m.content}
                  </div>
                </div>
              ) : (
                <div key={i} className="flex gap-3">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground">
                    <Zap className="size-3.5" />
                  </div>
                  <div className="min-w-0 flex-1 pt-0.5">
                    <Markdown>{m.content}</Markdown>
                  </div>
                </div>
              ),
            )}
            {waiting && (
              <div className="flex gap-3">
                <div className="flex size-7 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground">
                  <Zap className="size-3.5" />
                </div>
                <div className="flex items-center gap-1 pt-2">
                  {[0, 150, 300].map((d) => (
                    <span key={d} className="size-1.5 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: `${d}ms` }} />
                  ))}
                </div>
              </div>
            )}
            {error && <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
            <div ref={endRef} />
          </div>
        )}
      </div>

      <form
        className="mt-4 flex items-end gap-2 rounded-xl border bg-card p-2 shadow-card focus-within:ring-1 focus-within:ring-ring"
        onSubmit={(e) => { e.preventDefault(); send(input); }}
      >
        <Textarea
          ref={taRef}
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); }
          }}
          placeholder="Message Pulse…"
          className="max-h-40 min-h-10 resize-none border-0 shadow-none focus-visible:ring-0"
        />
        {loading ? (
          <Button type="button" size="icon" variant="outline" onClick={() => ctrl.current?.abort()} aria-label="Stop">
            <Square />
          </Button>
        ) : (
          <Button type="submit" size="icon" variant="hero" disabled={!input.trim()} aria-label="Send">
            <ArrowUp />
          </Button>
        )}
      </form>
    </div>
  );
}
