import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, PageHeader, ToolPage } from "@/components/tool-page";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — Pulse" },
      { name: "description", content: "Summarise topics or articles and get insights and recommendations." },
      { property: "og:title", content: "AI Research Assistant — Pulse" },
      { property: "og:description", content: "Faster research with AI summaries and insights." },
    ],
  }),
  component: ResearchPage,
});

function ResearchPage() {
  const [topic, setTopic] = useState("");
  const [article, setArticle] = useState("");
  const [goal, setGoal] = useState("");
  return (
    <ToolPage
      tool="research"
      cta="Research"
      canSubmit={topic.trim().length > 2 || article.trim().length > 20}
      buildPrompt={() =>
        `Topic: ${topic || "(see article)"}\nMy goal: ${goal || "General understanding"}\n${article ? `Article text to summarise:\n${article}` : ""}`
      }
      header={<PageHeader icon={<Search className="size-5" />} title="AI Research Assistant" desc="Summarise a topic or article and get actionable insights." />}
    >
      <Field label="Topic or question">
        <Input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. Benefits of a 4-day work week" />
      </Field>
      <Field label="Your goal (optional)">
        <Input value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="e.g. Pitch to leadership" />
      </Field>
      <Field label="Article text (optional)" hint="Paste an article to summarise it instead of a general topic.">
        <Textarea rows={9} value={article} onChange={(e) => setArticle(e.target.value)} placeholder="Paste article content here…" />
      </Field>
    </ToolPage>
  );
}
