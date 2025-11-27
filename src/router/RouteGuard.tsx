import { useAuth } from "@/context/AuthContext";
import type { JSX } from "react";
import { Navigate } from "react-router";

type RouteGuardProps = {
  children: JSX.Element;
  publicOnly?: boolean; // publicOnly=true → user login akan diarahkan
  redirectTo?: string; // custom redirect
};

export default function RouteGuard({ children, publicOnly = false, redirectTo }: RouteGuardProps) {
  const { session, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  // Untuk route yang harus login (protected)
  if (!publicOnly && !session) return <Navigate to="/login" replace />;

  // Untuk route yang khusus untuk tamu (public route)
  if (publicOnly && session) return <Navigate to={redirectTo ?? "/home"} replace />;

  return children;
}
