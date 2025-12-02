"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
  SidebarMenuSub,
  SidebarMenuSubButton,
  useSidebar,
} from "./ui/sidebar";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";

import {
  ChevronDown,
  FileText,
  Home,
  User2,
  LogOut,
  Moon,
  Sun,
  ChevronUp,
  Menu,
  Settings,
  Settings2,
  LayoutTemplate,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { signOut } from "next-auth/react";

export default function AppSidebar() {
  const { open } = useSidebar();
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState(null);
  const [siteName, setSiteName] = useState("Dashboard");
  const [logoUrl, setLogoUrl] = useState("/logo.svg");

  // Posts collapsible open state
  const [isPostsOpen, setIsPostsOpen] = useState(
    pathname?.startsWith("/backoffice/posts") ||
    pathname?.startsWith("/backoffice/categories") ||
    pathname?.startsWith("/backoffice/tags")
  );

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/users/me", {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch user");

        const data = await res.json();
        setCurrentUser(data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const data = await res.json();
          if (data.siteName) setSiteName(data.siteName);
          if (data.logoUrl) setLogoUrl(data.logoUrl);
        }
      } catch (error) {
        console.error("Failed to fetch settings:", error);
      }
    };

    fetchUser();
    fetchSettings();
  }, []);

  const isActive = (path) => pathname === path;
  const isParentActive = (basePath) => pathname?.startsWith(basePath);

  const hasPermission = (menuId) => {
    if (!currentUser) return false;
    if (currentUser.role === "admin") return true;
    return currentUser.permissions?.includes(menuId);
  };

  return (
    <Sidebar collapsible="icon">
      {/* Header */}
      <SidebarHeader>
        <div className="flex items-center">
          <img src={logoUrl} alt="logo" className="size-12 object-contain" />
          <span
            className={`text-xl font-bold transition-all duration-300 ml-2 truncate ${open
              ? "opacity-100 translate-x-0 w-auto block"
              : "opacity-0 -translate-x-4 w-0 overflow-hidden hidden"
              }`}
          >
            {siteName}
          </span>
        </div>
      </SidebarHeader>

      {/* Sidebar Content */}
      <SidebarContent>
        {/* General Group */}
        <SidebarGroup>
          <SidebarGroupLabel>General</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Home */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/backoffice")}>
                  <Link href="/backoffice">
                    <Home />
                    <span>Home</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Content Management Group */}
        <SidebarGroup>
          <SidebarGroupLabel>Content Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Posts Collapsible */}
              {hasPermission("posts") && (
                <Collapsible defaultOpen={true}>
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton className="flex-1 justify-between">
                        <Link
                          href={"/backoffice/posts"}
                          className="flex items-center gap-2"
                        >
                          <FileText size={16} />
                          <span>Posts</span>
                        </Link>
                        <ChevronDown
                          className={`transition-transform duration-200 ${isPostsOpen ? "rotate-180" : ""
                            }`}
                        />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>

                    <CollapsibleContent className="mt-1">
                      <SidebarMenuSub>
                        <SidebarMenuSubButton
                          asChild
                          isActive={isActive("/backoffice/posts")}
                        >
                          <Link href="/backoffice/posts">
                            <span>All Posts</span>
                          </Link>
                        </SidebarMenuSubButton>

                        <SidebarMenuSubButton
                          asChild
                          isActive={isActive("/backoffice/posts/create")}
                        >
                          <Link href="/backoffice/posts/create">
                            <span>Add Post</span>
                          </Link>
                        </SidebarMenuSubButton>

                        <SidebarMenuSubButton
                          asChild
                          isActive={isActive("/backoffice/categories")}
                        >
                          <Link href="/backoffice/categories">
                            <span>Categories</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              )}

              {/* Pages */}
              {hasPermission("pages") && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive("/backoffice/pages")}
                  >
                    <Link href="/backoffice/pages">
                      <LayoutTemplate />
                      <span>Pages</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}

              {/* Services */}
              {hasPermission("services") && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive("/backoffice/services")}
                  >
                    <Link href="/backoffice/services">
                      <LayoutTemplate />
                      <span>Services</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* System & Settings Group */}
        <SidebarGroup>
          <SidebarGroupLabel>System & Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Menus */}
              {hasPermission("menus") && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive("/backoffice/menus")}
                  >
                    <Link href="/backoffice/menus">
                      <Menu />
                      <span>Menus</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}

              {/* Users */}
              {hasPermission("users") && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive("/backoffice/users")}
                  >
                    <Link href="/backoffice/users">
                      <User2 />
                      <span>Users</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}

              {/* Settings */}
              {hasPermission("settings") && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive("/backoffice/settings")}
                  >
                    <Link href="/backoffice/settings">
                      <Settings2 />
                      <span>Settings</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
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
                  <Avatar className="h-6 w-6 mr-2">
                    {currentUser?.avatarUrl ? (
                      <AvatarImage
                        src={currentUser.avatarUrl}
                        alt={currentUser.fullName}
                      />
                    ) : (
                      <AvatarFallback className="bg-blue-200 text-blue-600">
                        {currentUser?.fullName?.charAt(0) || "U"}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <span>{currentUser?.fullName || "Username"}</span>
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                side="top"
                className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-[200px]"
                align="start"
              >
                {/* Account */}
                <DropdownMenuItem asChild>
                  <Link href="/backoffice/settings" className="cursor-pointer">
                    <User2 />
                    <span>Account</span>
                  </Link>
                </DropdownMenuItem>

                {/* Logout */}
                <DropdownMenuItem
                  onClick={() => signOut({ callbackUrl: "/login" })}
                >
                  <LogOut />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
