import { useRef, useState, type ReactNode } from "react";
import { Wand2, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OutputPanel } from "@/components/ai-output";
import { streamAI } from "@/lib/ai";

export function PageHeader({ icon, title, desc }: { icon: ReactNode; title: string; desc: string }) {
  return (
    <div className="mb-6 flex items-start gap-3">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">{icon}</div>
      <div>
        <h1 className="font-display text-xl font-semibold tracking-tight md:text-2xl">{title}</h1>
        <p className="text-sm text-muted-foreground">{desc}</p>
      </div>
    </div>
  );
}

export function ToolPage({
  tool,
  header,
  children,
  buildPrompt,
  canSubmit,
  cta,
}: {
  tool: string;
  header: ReactNode;
  children: ReactNode;
  buildPrompt: () => string;
  canSubmit: boolean;
  cta: string;
}) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const ctrl = useRef<AbortController | null>(null);

  const run = async () => {
    ctrl.current = new AbortController();
    setLoading(true);
    setError("");
    setText("");
    try {
      await streamAI({ tool, prompt: buildPrompt() }, setText, ctrl.current.signal);
    } catch (e) {
      if ((e as Error).name !== "AbortError") setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl">
      {header}
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border bg-card p-5 shadow-card">
          <h2 className="mb-4 font-display text-sm font-semibold">Input</h2>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (canSubmit && !loading) run();
            }}
          >
            {children}
            {loading ? (
              <Button type="button" variant="outline" className="w-full" onClick={() => ctrl.current?.abort()}>
                <Square /> Stop generating
              </Button>
            ) : (
              <Button type="submit" variant="hero" size="lg" className="w-full" disabled={!canSubmit}>
                <Wand2 /> {cta}
              </Button>
            )}
          </form>
        </section>
        <OutputPanel text={text} loading={loading} error={error} />
      </div>
    </div>
  );
}

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium">{label}</span>
      {children}
      {hint && <span className="block text-xs text-muted-foreground">{hint}</span>}
    </label>
  );
}
