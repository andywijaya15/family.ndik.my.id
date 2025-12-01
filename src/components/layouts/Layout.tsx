// Layout.tsx
import { ModeToggle } from "../ModeToggle";
import { SidebarTrigger } from "../ui/sidebar";
import { Toaster } from "../ui/sonner";

export default function Layout({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <>
      <Toaster position="top-right" />

      {/* Main content */}
      <main className="w-full max-w-full px-4 py-4 pb-24 md:px-6 md:pb-4">
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          {/* HIDE on mobile, SHOW on desktop */}
          <SidebarTrigger className="hidden md:inline-flex" />

          {title && <h1 className="text-xl font-bold">{title}</h1>}

          <div className="ml-auto">
            <ModeToggle />
          </div>
        </div>

        {children}
      </main>
    </>
  );
}
