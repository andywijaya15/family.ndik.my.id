import { AuthProvider } from "@/context/AuthContext";
import Login from "@/pages/Auth/Login";
import Home from "@/pages/Home";
import { Category } from "@/pages/Master/Category";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import RouteGuard from "./RouteGuard";

export const AppRouter = () => {
  return (
    <>
      <AuthProvider>
        <BrowserRouter>
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
                  <Category />
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
        </BrowserRouter>
      </AuthProvider>
    </>
  );
};
