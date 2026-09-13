import Link from "next/link";
import { AppShell } from "@/components/app-khach/AppShell";
import { TemplateGrid } from "@/components/app-khach/TemplateGrid";
import { SITE_TYPES, TEMPLATES, type SiteTypeId } from "@/data/app-khach";

export default async function MauPage({
  searchParams,
}: {
  searchParams: Promise<{ loai?: string }>;
}) {
  const { loai } = await searchParams;
  const active = SITE_TYPES.some((t) => t.id === loai)
    ? (loai as SiteTypeId)
    : undefined;
  const list = (active
    ? TEMPLATES.filter((t) => t.type === active)
    : TEMPLATES
  ).map((t) => t.id);

  return (
    <AppShell active="mau">
      <header className="app-home-top">
        <div>
          <h1>Mẫu website</h1>
          <p>Chọn mẫu theo loại — rồi chỉ sửa chữ và ảnh</p>
        </div>
      </header>

      <div className="app-chips">
        <Link
          href="/app-khach/mau"
          className={`app-chip${!active ? " is-on" : ""}`}
        >
          Tất cả
        </Link>
        {SITE_TYPES.map((type) => (
          <Link
            key={type.id}
            href={`/app-khach/mau?loai=${type.id}`}
            className={`app-chip${active === type.id ? " is-on" : ""}`}
          >
            {type.short}
          </Link>
        ))}
      </div>

      <TemplateGrid ids={list} />
    </AppShell>
  );
}
