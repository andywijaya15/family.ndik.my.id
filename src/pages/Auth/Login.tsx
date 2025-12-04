import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabaseClient";
import { AlertCircle, Loader2, Lock, Mail, Wallet } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;

      setSuccess("Login successful! Redirecting...");
      setTimeout(() => navigate("/home"), 1000);
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden p-6 md:p-10">
      {/* Animated gradient background */}
      <div className="absolute inset-0 -z-10 bg-linear-to-br from-primary/20 via-background to-secondary/20" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
      
      {/* Floating shapes */}
      <div className="absolute left-[10%] top-[20%] size-72 animate-pulse rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute bottom-[20%] right-[10%] size-96 animate-pulse rounded-full bg-secondary/10 blur-3xl delay-1000" />

      <div className="relative z-10 flex w-full max-w-md flex-col gap-6">
        {/* Logo and brand */}
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="bg-primary text-primary-foreground flex size-16 items-center justify-center rounded-2xl shadow-lg shadow-primary/20 transition-transform hover:scale-105">
            <Wallet className="size-8" />
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Family Plan</h1>
            <p className="text-muted-foreground text-sm">Manage your family finances with ease</p>
          </div>
        </div>

        {/* Alert messages */}
        {error && (
          <Alert variant="destructive" className="animate-in slide-in-from-top-2">
            <AlertCircle className="size-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="animate-in slide-in-from-top-2 border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-400">
            <AlertCircle className="size-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {/* Login card */}
        <Card className="border-border/50 shadow-xl backdrop-blur-sm">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>Sign in to your account to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <div className="relative">
                    <Mail className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                </Field>

                <Field>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <div className="relative">
                    <Lock className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                </Field>

                <Button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <FieldDescription className="text-center text-xs">
          Andy Wijaya © {new Date().getFullYear()}
        </FieldDescription>
      </div>
    </div>
  );
}
