import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { getAdminUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminAppLayout({
  children,
}: {
  children: ReactNode;
}) {
  const admin = await getAdminUser();
  if (!admin) redirect("/admin/dang-nhap");
  return <AdminShell name={admin.name}>{children}</AdminShell>;
}
