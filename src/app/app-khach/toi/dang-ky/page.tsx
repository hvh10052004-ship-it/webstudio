"use client";

import { AppShell } from "@/components/app-khach/AppShell";
import { RegisterForm } from "@/components/app-khach/AuthGate";

export default function DangKyPage() {
  return (
    <AppShell active="toi">
      <RegisterForm />
    </AppShell>
  );
}
