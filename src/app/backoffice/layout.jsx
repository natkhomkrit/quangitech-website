import AppSidebar from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { cookies } from "next/headers";
import React from "react";

export default async function Layout({ children }) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";
  const siteName = "Dashboard";
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <SidebarInset>
        <main className="flex flex-col h-screen ">
          <header className="flex items-center justify-between px-4 py-2 border-b">
            <div className="flex items-center gap-2 ">
              <SidebarTrigger />
              {/* <span className="font-semibold text-lg">{siteName}</span> */}
            </div>
          </header>

          <div className="flex-1 p-4 overflow-y-auto w-full">
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
