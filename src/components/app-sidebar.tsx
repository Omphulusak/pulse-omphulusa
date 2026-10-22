import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Mail, NotebookPen, CalendarClock, Search, MessagesSquare, Zap } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export const tools = [
  { title: "Email Generator", url: "/email", icon: Mail, desc: "Draft polished emails in any tone." },
  { title: "Meeting Summarizer", url: "/notes", icon: NotebookPen, desc: "Decisions, actions and deadlines." },
  { title: "Task Planner", url: "/planner", icon: CalendarClock, desc: "Prioritised daily or weekly plans." },
  { title: "Research Assistant", url: "/research", icon: Search, desc: "Summaries, insights, next steps." },
  { title: "AI Assistant", url: "/chat", icon: MessagesSquare, desc: "Chat about any work task." },
] as const;

export function AppSidebar() {
  const path = useRouterState({ select: (r) => r.location.pathname });
  const { state, setOpenMobile } = useSidebar();
  const collapsed = state === "collapsed";

  const item = (t: { title: string; url: string; icon: typeof Mail }) => (
    <SidebarMenuItem key={t.url}>
      <SidebarMenuButton asChild isActive={path === t.url} tooltip={t.title}>
        <Link to={t.url} onClick={() => setOpenMobile(false)}>
          <t.icon />
          <span>{t.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2.5 px-1 py-2">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground shadow-glow">
            <Zap className="size-4" />
          </div>
          {!collapsed && (
            <div className="leading-tight">
              <div className="font-display text-base font-semibold text-sidebar-accent-foreground">Pulse</div>
              <div className="text-xs text-sidebar-foreground/70">AI Workspace</div>
            </div>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Overview</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{item({ title: "Dashboard", url: "/", icon: LayoutDashboard })}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>AI Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{tools.map(item)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {!collapsed && (
        <SidebarFooter>
          <p className="rounded-md bg-sidebar-accent p-3 text-xs leading-relaxed text-sidebar-foreground/80">
            AI output can be inaccurate. Always review before using.
          </p>
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
