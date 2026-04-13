import { Home, FileText, ClipboardList, Brain, Layers, MessageSquare, Bot, LogOut } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,
} from "@/components/ui/sidebar";
import { Activity } from "lucide-react";

const mainItems = [
  { title: "Home", url: "/", icon: Home },
  { title: "Fitness Report", url: "/report", icon: FileText },
  { title: "Daily Log", url: "/daily-log", icon: ClipboardList },
];

const mlItems = [
  { title: "ML Models", url: "/ml-models", icon: Brain },
  { title: "Clustering", url: "/clustering", icon: Layers },
];

const toolItems = [
  { title: "Quick Assistant", url: "/assistant", icon: MessageSquare },
  { title: "AI Chatbot", url: "/chatbot", icon: Bot },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const { profile, signOut } = useAuth();
  const isActive = (path: string) => location.pathname === path;

  const renderGroup = (label: string, items: typeof mainItems) => (
    <SidebarGroup key={label}>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild isActive={isActive(item.url)}>
                <NavLink to={item.url} end className="hover:bg-sidebar-accent/50" activeClassName="bg-sidebar-accent text-sidebar-primary font-medium">
                  <item.icon className="mr-2 h-4 w-4" />
                  {!collapsed && <span>{item.title}</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <div className="p-4 mb-2">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
                <Activity className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <span className="font-bold text-sm text-sidebar-foreground block">FitAssist AI</span>
                {profile && <span className="text-xs text-muted-foreground">{profile.name}</span>}
              </div>
            </div>
          )}
        </div>
        {renderGroup("Main", mainItems)}
        {renderGroup("AI & ML", mlItems)}
        {renderGroup("Tools", toolItems)}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={signOut} className="hover:bg-sidebar-accent/50 text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  {!collapsed && <span>Sign Out</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
