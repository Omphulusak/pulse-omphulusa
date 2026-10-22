import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { NotebookPen } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Field, PageHeader, ToolPage } from "@/components/tool-page";

export const Route = createFileRoute("/notes")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — Pulse" },
      { name: "description", content: "Summarize meeting notes and extract action items, decisions and deadlines." },
      { property: "og:title", content: "Meeting Notes Summarizer — Pulse" },
      { property: "og:description", content: "Turn long meeting notes into clear actions." },
    ],
  }),
  component: NotesPage,
});

const SAMPLE = `Weekly product sync – Mon. Attendees: Thandi, James, Priya.
Discussed Q4 launch. Thandi said marketing assets are 70% done. Agreed to move launch date to Nov 14.
James will fix the checkout bug before Friday. Priya to draft customer email by Wednesday.
Decided to drop the referral feature from v1. Budget review next Tuesday.`;

function NotesPage() {
  const [notes, setNotes] = useState("");
  return (
    <ToolPage
      tool="notes"
      cta="Summarize notes"
      canSubmit={notes.trim().length > 20}
      buildPrompt={() => `Meeting notes:\n${notes}`}
      header={<PageHeader icon={<NotebookPen className="size-5" />} title="Meeting Notes Summarizer" desc="Get a summary plus action items, decisions and deadlines." />}
    >
      <Field label="Meeting notes" hint={`${notes.length.toLocaleString()} characters`}>
        <Textarea rows={14} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Paste your meeting notes or transcript here…" />
      </Field>
      <button type="button" className="text-xs font-medium text-primary hover:underline" onClick={() => setNotes(SAMPLE)}>
        Use sample notes
      </button>
    </ToolPage>
  );
}
