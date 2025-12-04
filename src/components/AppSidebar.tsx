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
} from "@/components/ui/sidebar";
import { loadProfile } from "@/lib/loadProfile";
import { supabase } from "@/lib/supabaseClient";
import { ChevronUp, CircleDollarSign, Home, List, LogOut, User2, Wallet } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Separator } from "./ui/separator";

function AppSidebarBase() {
  const [fullName, setFullName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  const items = useMemo(
    () => [
      { title: "Home", url: "/home", icon: Home, description: "Dashboard overview" },
      { title: "Category", url: "/category", icon: List, description: "Manage categories" },
      { title: "Transaction", url: "/transaction", icon: CircleDollarSign, description: "Track expenses" },
    ],
    []
  );

  useEffect(() => {
    let mounted = true;

    const fetch = async () => {
      const { profile, user } = await loadProfile();
      if (!mounted) return;

      setFullName(profile?.full_name || user?.email || "User");
      setIsLoading(false);
    };

    fetch();

    return () => {
      mounted = false;
    };
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) navigate("/login");
  };

  const displayedName = isLoading ? <span className="opacity-0">Loading</span> : fullName;

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <Sidebar className="hidden border-r md:flex">
        <SidebarHeader className="border-b p-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary text-primary-foreground flex size-10 items-center justify-center rounded-xl shadow-lg shadow-primary/20">
              <Wallet className="size-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold">Family Plan</span>
              <span className="text-muted-foreground text-xs">Financial Manager</span>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent className="p-4">
          <SidebarGroup>
            <SidebarGroupLabel className="text-muted-foreground mb-2 px-2 text-xs font-semibold uppercase tracking-wider">
              Navigation
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {items.map((item) => {
                  const active = location.pathname.startsWith(item.url);

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        className={`group relative overflow-hidden transition-all ${
                          active
                            ? "bg-primary text-primary-foreground shadow-md hover:bg-primary/90"
                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3 px-3 py-2.5">
                          {active && (
                            <div className="bg-primary-foreground/20 absolute inset-0 animate-pulse" />
                          )}
                          <item.icon className={`relative size-5 shrink-0 ${active ? "animate-in zoom-in-50" : ""}`} />
                          <span className="relative font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t p-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton className="hover:bg-accent group w-full transition-all">
                    <div className="bg-primary/10 text-primary flex size-9 items-center justify-center rounded-lg transition-transform group-hover:scale-110">
                      <User2 className="size-4" />
                    </div>
                    <div className="flex flex-1 flex-col items-start overflow-hidden">
                      <span className="truncate text-sm font-medium">{displayedName}</span>
                      <span className="text-muted-foreground text-xs">Account settings</span>
                    </div>
                    <ChevronUp className="text-muted-foreground ml-auto size-4 transition-transform group-hover:rotate-180" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>

                <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                    <LogOut className="mr-2 size-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      {/* MOBILE NAV */}
      <nav className="bg-background/95 fixed bottom-0 left-0 right-0 z-50 border-t backdrop-blur-sm md:hidden">
        <div className="flex justify-around items-center px-2 py-3">
          {items.map((item) => {
            const active = location.pathname.startsWith(item.url);

            return (
              <Link
                key={item.title}
                to={item.url}
                className={`group relative flex flex-col items-center gap-1 rounded-lg px-4 py-2 text-xs transition-all ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {active && (
                  <div className="bg-primary/10 absolute inset-0 rounded-lg" />
                )}
                <item.icon className={`relative size-5 transition-transform group-active:scale-90 ${active ? "animate-in zoom-in-50" : ""}`} />
                <span className="relative font-medium">{item.title}</span>
              </Link>
            );
          })}

          {/* USER */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="text-muted-foreground group relative flex flex-col items-center gap-1 rounded-lg px-4 py-2 text-xs transition-all active:scale-95">
                <User2 className="relative size-5" />
                <span className="relative max-w-[60px] truncate font-medium">Profile</span>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent side="top" className="mb-2 w-48">
              <div className="border-b px-3 py-2">
                <p className="truncate text-sm font-medium">{displayedName}</p>
                <p className="text-muted-foreground text-xs">Manage account</p>
              </div>
              <Separator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                <LogOut className="mr-2 size-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
    </>
  );
}

export const AppSidebar = React.memo(AppSidebarBase);
