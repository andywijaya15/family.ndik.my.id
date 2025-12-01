import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AuthProvider } from "@/context/AuthContext";
import Login from "@/pages/Auth/Login";
import Home from "@/pages/Home";
import { MasterCategory } from "@/pages/Master/MasterCategory";
import { MasterTransaction } from "@/pages/Master/MasterTransaction";
import { Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import RouteGuard from "./RouteGuard";

export const AppRouter = () => {
  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <SidebarProvider>
            <AppSidebar />
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>
                <Route path="/" element={<Navigate to="/home" replace />} />

                <Route
                  path="/home"
                  element={
                    <RouteGuard>
                      <Home />
                    </RouteGuard>
                  }
                />
                <Route
                  path="/category"
                  element={
                    <RouteGuard>
                      <MasterCategory />
                    </RouteGuard>
                  }
                />
                <Route
                  path="/transaction"
                  element={
                    <RouteGuard>
                      <MasterTransaction />
                    </RouteGuard>
                  }
                />
                <Route
                  path="/login"
                  element={
                    <RouteGuard publicOnly>
                      <Login />
                    </RouteGuard>
                  }
                />
              </Routes>
            </Suspense>
          </SidebarProvider>
        </BrowserRouter>
      </AuthProvider>
    </>
  );
};
