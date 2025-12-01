import { useState } from "react";
import { Outlet } from "react-router";
import { AppSidebar } from "./AppSidebar";
import Layout from "./layouts/Layout";
import { SidebarProvider } from "./ui/sidebar";

export default function AppLayout() {
  const [title, setTitle] = useState("");

  return (
    <SidebarProvider>
      <AppSidebar />

      <Layout title={title}>
        <Outlet context={{ setTitle }} />
      </Layout>
    </SidebarProvider>
  );
}
