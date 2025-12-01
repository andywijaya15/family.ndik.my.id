import AppLayout from "@/components/AppLayout";
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
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            {/* Redirect */}
            <Route path="/" element={<Navigate to="/home" replace />} />

            {/* LOGIN – tanpa sidebar */}
            <Route
              path="/login"
              element={
                <RouteGuard publicOnly>
                  <Login />
                </RouteGuard>
              }
            />

            {/* ROUTES DENGAN SIDEBAR + LAYOUT */}
            <Route
              element={
                <RouteGuard>
                  <AppLayout />
                </RouteGuard>
              }
            >
              <Route path="/home" element={<Home />} />
              <Route path="/category" element={<MasterCategory />} />
              <Route path="/transaction" element={<MasterTransaction />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
};
