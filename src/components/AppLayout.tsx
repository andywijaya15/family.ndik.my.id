import { AppSidebar } from "@/components/AppSidebar";
import Layout from "@/components/layouts/Layout";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router";

export default function AppLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <Layout>
        <Outlet />
      </Layout>
    </SidebarProvider>
  );
}
