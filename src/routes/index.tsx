import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Clock, ShieldCheck, Sparkles as Spark } from "lucide-react";
import { tools } from "@/components/app-sidebar";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Pulse AI Workspace" },
      { name: "description", content: "Your AI productivity hub: emails, meeting summaries, planning, research and chat." },
      { property: "og:title", content: "Dashboard — Pulse AI Workspace" },
      { property: "og:description", content: "Automate everyday workplace tasks with AI." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <section className="relative overflow-hidden rounded-2xl bg-sidebar p-6 text-sidebar-accent-foreground md:p-10">
        <div className="absolute -right-20 -top-20 size-72 rounded-full bg-gradient-primary opacity-30 blur-3xl" />
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-sidebar-primary">Welcome back</p>
        <h1 className="max-w-2xl font-display text-2xl font-semibold tracking-tight md:text-4xl">
          Automate the busywork. Focus on what matters.
        </h1>
        <p className="mt-3 max-w-xl text-sm text-sidebar-foreground md:text-base">
          Five AI tools for writing, summarising, planning and researching — all in one workspace.
        </p>
        <Link
          to="/chat"
          className="mt-6 inline-flex items-center gap-2 rounded-md bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow"
        >
          Ask the assistant <ArrowRight className="size-4" />
        </Link>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {[
          { icon: Clock, k: "~5 hrs", v: "saved per week on routine tasks" },
          { icon: Spark, k: "5 tools", v: "powered by Lovable AI" },
          { icon: ShieldCheck, k: "Human-in-loop", v: "you review every output" },
        ].map((s) => (
          <div key={s.k} className="flex items-center gap-4 rounded-xl border bg-card p-5 shadow-card">
            <s.icon className="size-6 text-primary" />
            <div>
              <div className="font-display text-lg font-semibold">{s.k}</div>
              <div className="text-xs text-muted-foreground">{s.v}</div>
            </div>
          </div>
        ))}
      </section>

      <section>
        <h2 className="mb-4 font-display text-lg font-semibold">AI Tools</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((t) => (
            <Link
              key={t.url}
              to={t.url}
              className="group rounded-xl border bg-card p-5 shadow-card transition hover:-translate-y-0.5 hover:border-primary/40"
            >
              <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <t.icon className="size-5" />
              </div>
              <h3 className="font-display font-semibold">{t.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{t.desc}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                Open <ArrowRight className="size-4 transition group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
