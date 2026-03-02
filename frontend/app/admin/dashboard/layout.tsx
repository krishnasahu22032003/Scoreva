
import { ReactNode } from "react";

export default function AdminDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-[var(--foreground)]">
      <div className="pt-28">
        <div className="mx-auto max-w-7xl px-6">
          {children}
        </div>

      </div>
    </div>
  );
}