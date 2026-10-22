import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarClock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, PageHeader, ToolPage } from "@/components/tool-page";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — Pulse" },
      { name: "description", content: "Generate prioritised daily or weekly schedules with AI." },
      { property: "og:title", content: "AI Task Planner — Pulse" },
      { property: "og:description", content: "Smart, prioritised schedules in seconds." },
    ],
  }),
  component: PlannerPage,
});

function PlannerPage() {
  const [mode, setMode] = useState<"Daily" | "Weekly">("Daily");
  const [tasks, setTasks] = useState("");
  const [hours, setHours] = useState("08:00 – 17:00");
  return (
    <ToolPage
      tool="planner"
      cta={`Generate ${mode.toLowerCase()} plan`}
      canSubmit={tasks.trim().length > 3}
      buildPrompt={() => `Plan type: ${mode}\nWorking hours: ${hours}\nTasks (with any deadlines/durations):\n${tasks}`}
      header={<PageHeader icon={<CalendarClock className="size-5" />} title="AI Task Planner" desc="Prioritise your tasks and get a realistic schedule." />}
    >
      <Field label="Plan type">
        <div className="grid grid-cols-2 gap-2">
          {(["Daily", "Weekly"] as const).map((m) => (
            <button
              type="button"
              key={m}
              onClick={() => setMode(m)}
              className={cn(
                "rounded-md border px-3 py-2 text-sm font-medium transition",
                mode === m ? "border-primary bg-accent text-accent-foreground" : "hover:bg-muted",
              )}
            >
              {m}
            </button>
          ))}
        </div>
      </Field>
      <Field label="Working hours">
        <Input value={hours} onChange={(e) => setHours(e.target.value)} />
      </Field>
      <Field label="Tasks" hint="One per line. Add deadlines or estimated time if you know them.">
        <Textarea rows={10} value={tasks} onChange={(e) => setTasks(e.target.value)} placeholder={"Finish Q3 report (due today, 2h)\nReply to client emails\nTeam standup 09:30\nPrepare slides for Thursday"} />
      </Field>
    </ToolPage>
  );
}
