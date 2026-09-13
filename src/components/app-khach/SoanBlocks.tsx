"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/app-khach/AppShell";
import { useCollab } from "@/components/app-khach/CollabProvider";
import { DEFAULT_VALUES, contentBlocksForType, draftChecksForType } from "@/data/app-blocks";
import { SITE_TYPES, TEMPLATES, type SiteTypeId } from "@/data/app-khach";

export function SoanBlocks({
  templateId,
  typeId,
}: {
  templateId?: string;
  typeId?: SiteTypeId;
}) {
  const { data, ready, applyTemplate, saveBlocks, switchType } = useCollab();
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  const defaultTpl =
    typeId === "landing"
      ? "aura"
      : typeId === "company"
        ? "nova"
        : typeId === "saas"
          ? "pulse"
          : typeId === "ecommerce"
            ? "green"
            : undefined;
  const resolvedTpl = templateId || defaultTpl || data?.site.templateId;
  const locked =
    Boolean(data?.site.locked) &&
    (!typeId || data?.site.typeId === typeId);

  useEffect(() => {
    if (typeId) void switchType(typeId);
  }, [typeId, switchType]);

  useEffect(() => {
    if (!data || !ready || !resolvedTpl || locked) return;
    if (typeId && data.site.typeId !== typeId) return;
    if (data.site.templateId === resolvedTpl) return;
    void applyTemplate(resolvedTpl);
  }, [applyTemplate, data, ready, resolvedTpl, locked, typeId]);

  const tpl =
    TEMPLATES.find(
      (t) => t.id === (resolvedTpl || data?.site.templateId),
    ) ?? TEMPLATES[0];
  const currentType =
    typeId ||
    data?.site.blocks.site_type?.typeId ||
    data?.site.typeId ||
    tpl.type;
  const type = SITE_TYPES.find((t) => t.id === currentType) ?? SITE_TYPES[0];
  const draftBlocks = data?.site.blocks ?? {};
  const draftEnabled = data?.site.enabled ?? {};
  const blocks = contentBlocksForType(currentType as SiteTypeId);

  async function saveInfo() {
    if (!data || locked) return;
    setBusy(true);
    const checks = draftChecksForType(
      currentType as SiteTypeId,
      data.site.blocks,
      tpl.id,
    );
    const complete = checks.length > 0 && checks.every((item) => item.done);
    const ok = await saveBlocks(
      data.site.blocks,
      data.site.enabled,
      `Lưu thông tin ${type.name}`,
      { typeId: currentType, locked: complete },
    );
    setBusy(false);
    if (!ok) return;
    if (complete) {
      setSaved(true);
      return;
    }
    router.replace("/app-khach");
  }

  return (
    <AppShell active="soan">
      <div className="app-soan-page">
      <Link href="/app-khach/soan" className="app-back">
        ← Soạn thông tin website
      </Link>
      <header className="app-home-top">
        <div>
          <h1>Điền thông tin {type.name}</h1>
          <p>
            {locked
              ? "Đã lưu. Muốn sửa thì vào tab Xem → Sửa thông tin."
              : currentType === "landing" || currentType === "ecommerce"
                ? "Điền từng khối — có thể thêm sản phẩm"
                : "Điền từng khối bên dưới"}
          </p>
        </div>
      </header>

      <ol className="app-soan-list">
        {blocks.map((block, i) => {
          const filled = Boolean(
            draftBlocks[block.id] || DEFAULT_VALUES[tpl.id]?.[block.id],
          );
          const on = draftEnabled[block.id] !== false;
          const inner = (
            <>
              <span className="app-soan-idx">{i + 1}</span>
              <div>
                <strong>{block.title}</strong>
                <p>{block.hint}</p>
              </div>
              <span className="app-soan-go">
                {locked
                  ? "Đã lưu"
                  : !ready
                    ? "…"
                    : !on
                      ? "Ẩn"
                      : filled
                        ? "Sửa"
                        : "Điền"}
              </span>
            </>
          );
          return (
            <li key={block.id}>
              {locked ? (
                <div className="app-soan-item is-locked">{inner}</div>
              ) : (
                <Link
                  href={`/app-khach/soan/${block.id}?mau=${tpl.id}`}
                  className="app-soan-item"
                >
                  {inner}
                </Link>
              )}
            </li>
          );
        })}
      </ol>

      {saved || locked ? (
        <p className="app-form-ok">
          Đã gửi thông tin sang app admin. Sửa ở tab Xem.
        </p>
      ) : null}
      {locked ? null : (
        <div className="app-site-actions is-center">
          <button
            type="button"
            className="app-btn app-btn-primary"
            disabled={busy || !ready}
            onClick={() => void saveInfo()}
          >
            Lưu thông tin
          </button>
        </div>
      )}
      </div>
    </AppShell>
  );
}
