"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/app-khach/AppShell";
import { useCollab } from "@/components/app-khach/CollabProvider";
import {
  BLOCKS,
  DEFAULT_VALUES,
  draftChecksForType,
  editableValue,
  type BlockDef,
} from "@/data/app-blocks";
import { SITE_TYPES, type SiteTypeId } from "@/data/app-khach";

export function TypeInfoForm({ typeId }: { typeId: SiteTypeId }) {
  const { data, ready, saveBlocks } = useCollab();
  const router = useRouter();
  const blocks: BlockDef[] = BLOCKS[typeId];
  const title =
    SITE_TYPES.find((item) => item.id === typeId)?.name ?? typeId;
  const [values, setValues] = useState<Record<string, Record<string, string>>>(
    {},
  );
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const loadedFor = useRef("");

  useEffect(() => {
    if (!ready || !data) return;
    const key = `${data.site.id}:${typeId}`;
    if (loadedFor.current === key) return;
    loadedFor.current = key;
    const seed = DEFAULT_VALUES[data.site.templateId] ?? {};
    const next: Record<string, Record<string, string>> = {};
    for (const block of blocks) {
      const fromDraft = data.site.blocks[block.id] ?? {};
      next[block.id] = {};
      for (const field of block.fields) {
        next[block.id][field.key] = editableValue(
          fromDraft[field.key],
          seed[block.id]?.[field.key],
        );
      }
    }
    setValues(next);
    setSaved(false);
    setError("");
  }, [ready, data, typeId, blocks]);

  function onChange(blockId: string, key: string, max: number, next: string) {
    setSaved(false);
    setError("");
    setValues((prev) => ({
      ...prev,
      [blockId]: { ...prev[blockId], [key]: next.slice(0, max) },
    }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!data) return;
    const phone = (values.cta_form?.phone ?? values.contact?.phone ?? "").replace(
      /\s/g,
      "",
    );
    const zalo = (values.cta_form?.zalo ?? values.contact?.zalo ?? "").replace(
      /\s/g,
      "",
    );
    if (phone && !/^0\d{9}$/.test(phone)) {
      setError("SĐT gồm 10 số, bắt đầu bằng 0");
      return;
    }
    if (zalo && !/^0\d{9}$/.test(zalo)) {
      setError("Zalo gồm 10 số, bắt đầu bằng 0");
      return;
    }
    const enabled: Record<string, boolean> = {
      ...data.site.enabled,
      site_type: true,
    };
    for (const block of blocks) enabled[block.id] = true;
    const nextBlocks = {
      ...data.site.blocks,
      site_type: { typeId },
      ...values,
    };
    const checks = draftChecksForType(typeId, nextBlocks, data.site.templateId);
    const complete = checks.length > 0 && checks.every((item) => item.done);
    const ok = await saveBlocks(
      nextBlocks,
      enabled,
      `Điền ${title}`,
      { typeId, locked: complete },
    );
    if (!ok) {
      setError("Không lưu được");
      return;
    }
    if (complete) {
      setSaved(true);
      return;
    }
    router.replace("/app-khach");
  }

  return (
    <AppShell active="soan">
      <Link href="/app-khach/soan" className="app-back">
        ← Soạn thông tin website
      </Link>
      <header className="app-home-top">
        <div>
          <h1>{title}</h1>
          <p>Điền thông tin để tạo trang</p>
        </div>
      </header>

      {!ready || !data ? (
        <p className="app-note">Đang tải…</p>
      ) : (
        <form className="app-form" onSubmit={(e) => void onSubmit(e)}>
          {blocks.map((block) => (
            <div key={block.id}>
              <div className="app-section-label">{block.title}</div>
              {block.fields.map((field) => (
                <label key={field.key} className="app-field">
                  <span>
                    {field.label}
                    {field.required ? " *" : ""}
                  </span>
                  {field.type === "textarea" ? (
                    <textarea
                      value={values[block.id]?.[field.key] ?? ""}
                      rows={3}
                      maxLength={field.max}
                      placeholder={
                        field.placeholder ||
                        (data
                          ? DEFAULT_VALUES[data.site.templateId]?.[block.id]?.[
                              field.key
                            ]
                          : "") ||
                        ""
                      }
                      onChange={(e) =>
                        onChange(block.id, field.key, field.max, e.target.value)
                      }
                    />
                  ) : (
                    <input
                      type={field.type === "tel" ? "tel" : "text"}
                      inputMode={field.type === "tel" ? "numeric" : "text"}
                      value={values[block.id]?.[field.key] ?? ""}
                      maxLength={field.max}
                      placeholder={
                        field.placeholder ||
                        (data
                          ? DEFAULT_VALUES[data.site.templateId]?.[block.id]?.[
                              field.key
                            ]
                          : "") ||
                        ""
                      }
                      onChange={(e) =>
                        onChange(block.id, field.key, field.max, e.target.value)
                      }
                    />
                  )}
                  <small>
                    {(values[block.id]?.[field.key] ?? "").length}/{field.max}
                  </small>
                </label>
              ))}
            </div>
          ))}

          {error ? <p className="app-form-error">{error}</p> : null}
          {saved ? (
            <p className="app-form-ok">Đã gửi thông tin {title} sang app admin.</p>
          ) : null}

          <div className="app-site-actions is-center">
            <button type="submit" className="app-btn app-btn-primary">
              Lưu thông tin
            </button>
          </div>
        </form>
      )}
    </AppShell>
  );
}
