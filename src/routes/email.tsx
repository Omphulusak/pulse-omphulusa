import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, PageHeader, ToolPage } from "@/components/tool-page";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — Pulse" },
      { name: "description", content: "Generate professional emails in formal, friendly or persuasive tones." },
      { property: "og:title", content: "Smart Email Generator — Pulse" },
      { property: "og:description", content: "Professional emails in seconds with AI." },
    ],
  }),
  component: EmailPage,
});

const TONES = ["Formal", "Friendly", "Persuasive"] as const;

function EmailPage() {
  const [recipient, setRecipient] = useState("");
  const [purpose, setPurpose] = useState("");
  const [points, setPoints] = useState("");
  const [tone, setTone] = useState<(typeof TONES)[number]>("Formal");

  return (
    <ToolPage
      tool="email"
      cta="Generate email"
      canSubmit={purpose.trim().length > 3}
      buildPrompt={() =>
        `Tone: ${tone}\nRecipient: ${recipient || "Not specified"}\nPurpose: ${purpose}\nKey points:\n${points || "None"}`
      }
      header={<PageHeader icon={<Mail className="size-5" />} title="Smart Email Generator" desc="Generate professional emails in the tone you need." />}
    >
      <Field label="Tone">
        <div className="grid grid-cols-3 gap-2">
          {TONES.map((t) => (
            <button
              type="button"
              key={t}
              onClick={() => setTone(t)}
              className={cn(
                "rounded-md border px-3 py-2 text-sm font-medium transition",
                tone === t ? "border-primary bg-accent text-accent-foreground" : "hover:bg-muted",
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </Field>
      <Field label="Recipient">
        <Input value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="e.g. Client, my manager, HR team" />
      </Field>
      <Field label="Purpose">
        <Input value={purpose} onChange={(e) => setPurpose(e.target.value)} placeholder="e.g. Follow up on project proposal" />
      </Field>
      <Field label="Key points (optional)">
        <Textarea rows={6} value={points} onChange={(e) => setPoints(e.target.value)} placeholder="- Budget approved&#10;- Need sign-off by Friday" />
      </Field>
    </ToolPage>
  );
}
