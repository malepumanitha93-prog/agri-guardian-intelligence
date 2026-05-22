import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Leaf, Bot, Wind, Sparkles } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const items = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Disease Detection", url: "/disease", icon: Leaf },
  { title: "AI Assistant", url: "/assistant", icon: Bot },
  { title: "Environment", url: "/environment", icon: Wind },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-3 px-2 py-3">
          <div className="relative">
            <div className="h-9 w-9 rounded-xl gradient-primary flex items-center justify-center animate-pulse-glow">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
          </div>
          {!collapsed && (
            <div className="flex flex-col leading-tight">
              <span className="font-display font-bold text-sidebar-foreground tracking-tight">
                AgroShield
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-sidebar-primary">
                AI · v2.0
              </span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel className="text-sidebar-foreground/50 text-[10px] uppercase tracking-[0.18em]">
              Modules
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const active = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      className="data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-primary data-[active=true]:shadow-[inset_3px_0_0_0_var(--color-sidebar-primary)] h-11 transition-all"
                    >
                      <Link to={item.url} className="flex items-center gap-3">
                        <item.icon className="h-[18px] w-[18px]" />
                        {!collapsed && <span className="font-medium">{item.title}</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {!collapsed && (
        <SidebarFooter className="border-t border-sidebar-border p-4">
          <div className="rounded-xl bg-sidebar-accent/50 p-3 text-xs text-sidebar-foreground/70">
            <div className="font-medium text-sidebar-foreground mb-1">🌱 Eco Tip</div>
            Mulching saves up to 70% irrigation water.
          </div>
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
