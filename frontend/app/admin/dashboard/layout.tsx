"use client";

import { ReactNode } from "react";
import Header from "@/components/Header";
import AdminDashboardHeader from "@/components/DashboardHeader";

export default function AdminDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-[var(--foreground)]">

      {/* 🔥 Global Header */}
      <AdminDashboardHeader />

      {/* 🔥 Page Wrapper */}
      <div className="pt-28 px-6">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
}