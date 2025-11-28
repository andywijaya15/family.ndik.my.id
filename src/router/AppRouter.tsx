import { AuthProvider } from "@/context/AuthContext";
import Login from "@/pages/Auth/Login";
import Home from "@/pages/Home";
import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import RouteGuard from "./RouteGuard";
const MasterCategory = lazy(() =>
  import("@/pages/Master/MasterCategory").then((mod) => ({ default: mod.MasterCategory }))
);
const MasterTransaction = lazy(() =>
  import("@/pages/Master/MasterTransaction").then((mod) => ({ default: mod.MasterTransaction }))
);

export const AppRouter = () => {
  return (
    <>
      <AuthProvider>
        <BrowserRouter>
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
        </BrowserRouter>
      </AuthProvider>
    </>
  );
};
