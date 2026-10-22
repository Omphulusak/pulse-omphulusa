import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Copy, Check, Sparkle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Markdown({ children }: { children: string }) {
  return (
    <div className="prose-ai">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    </div>
  );
}

export function OutputPanel({ text, loading, error }: { text: string; loading: boolean; error: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <section className="flex min-h-[420px] flex-col rounded-xl border bg-card shadow-card">
      <header className="flex items-center justify-between border-b px-5 py-3">
        <h2 className="flex items-center gap-2 font-display text-sm font-semibold">
          {loading ? <Loader2 className="size-4 animate-spin text-primary" /> : <Sparkle className="size-4 text-primary" />}
          AI Output
        </h2>
        <Button
          size="sm"
          variant="ghost"
          disabled={!text || loading}
          onClick={() => {
            navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
        >
          {copied ? <Check /> : <Copy />} {copied ? "Copied" : "Copy"}
        </Button>
      </header>
      <div className="flex-1 overflow-auto px-5 py-4">
        {error ? (
          <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</p>
        ) : text ? (
          <Markdown>{text}</Markdown>
        ) : loading ? (
          <div className="space-y-3">
            {[90, 75, 82, 60].map((w) => (
              <div key={w} className="h-3 animate-pulse rounded bg-muted" style={{ width: `${w}%` }} />
            ))}
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-center text-sm text-muted-foreground">
            <Sparkle className="mb-3 size-8 text-primary/40" />
            Your AI-generated result will appear here.
          </div>
        )}
      </div>
    </section>
  );
}
