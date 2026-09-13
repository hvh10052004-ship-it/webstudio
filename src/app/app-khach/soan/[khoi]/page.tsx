import Link from "next/link";
import { AppShell } from "@/components/app-khach/AppShell";
import { BlockForm } from "@/components/app-khach/BlockForm";
import { findBlock } from "@/data/app-blocks";
import { SITE_TYPES, TEMPLATES } from "@/data/app-khach";

export default async function KhoiPage({
  params,
  searchParams,
}: {
  params: Promise<{ khoi: string }>;
  searchParams: Promise<{ mau?: string }>;
}) {
  const { khoi } = await params;
  const { mau } = await searchParams;
  const tpl = TEMPLATES.find((t) => t.id === mau) ?? TEMPLATES[0];
  const type = SITE_TYPES.find((t) => t.id === tpl.type)!;
  const block = findBlock(tpl.type, khoi);

  if (!block) {
    return (
      <AppShell active="soan">
        <h1>Không có khối này</h1>
        <p className="app-note">Mẫu {tpl.name} không dùng khối “{khoi}”.</p>
        <Link href={`/app-khach/soan/noi-dung?mau=${tpl.id}`} className="app-back">
          ← Về danh sách khối
        </Link>
      </AppShell>
    );
  }

  return (
    <BlockForm
      templateId={tpl.id}
      templateName={tpl.name}
      typeName={type.name}
      block={block}
    />
  );
}
