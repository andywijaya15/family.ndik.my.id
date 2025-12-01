import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { loadProfile } from "@/lib/loadProfile";
import { supabase } from "@/lib/supabaseClient";
import { ChevronUp, CircleDollarSign, Home, List, User2 } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";

function AppSidebarBase() {
  const [fullName, setFullName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  const items = useMemo(
    () => [
      { title: "Home", url: "/home", icon: Home },
      { title: "Category", url: "/category", icon: List },
      { title: "Transaction", url: "/transaction", icon: CircleDollarSign },
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
      <Sidebar className="hidden md:flex">
        <SidebarHeader />

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => {
                  const active = location.pathname.startsWith(item.url);

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        className={active ? "bg-accent text-accent-foreground" : "text-muted-foreground"}
                      >
                        <Link to={item.url}>
                          <item.icon className="mr-2 h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton>
                    <User2 /> {displayedName} <ChevronUp className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>

                <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
                  <DropdownMenuItem onClick={handleLogout}>Sign Out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      {/* MOBILE NAV */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t md:hidden">
        <div className="flex justify-around items-center py-2">
          {items.map((item) => {
            const active = location.pathname.startsWith(item.url);

            return (
              <Link
                key={item.title}
                to={item.url}
                className={`flex flex-col items-center text-xs ${active ? "text-primary" : "text-muted-foreground"}`}
              >
                <item.icon className="h-5 w-5 mb-1" />
                {item.title}
              </Link>
            );
          })}

          {/* USER */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex flex-col items-center text-xs text-muted-foreground">
                <User2 className="h-5 w-5 mb-1" />
                {displayedName}
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-40">
              <DropdownMenuItem onClick={handleLogout}>Sign Out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
    </>
  );
}

export const AppSidebar = React.memo(AppSidebarBase);
