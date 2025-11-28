// Layout.tsx
import { AppSidebar } from "../AppSidebar";
import { ModeToggle } from "../ModeToggle";
import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import { Toaster } from "../ui/sonner";

export default function Layout({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <Toaster position="top-right" />
      <main className="w-full max-w-full px-4 py-4 md:px-6">
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <SidebarTrigger />
          {title && <h1 className="text-xl font-bold">{title}</h1>}

          <div className="ml-auto">
            <ModeToggle />
          </div>
        </div>

        {children}
      </main>
    </SidebarProvider>
  );
}
