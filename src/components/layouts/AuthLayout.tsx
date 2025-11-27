export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden lg:block bg-muted"></div>

      <div className="flex items-center justify-center p-6">
        <div className="mx-auto w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
