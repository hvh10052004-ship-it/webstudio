"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/app-khach/AppShell";
import { useCollab } from "@/components/app-khach/CollabProvider";
import { DEFAULT_VALUES, editableProductsJson, editableValue, parseProducts, type BlockDef } from "@/data/app-blocks";
import { ProductListEditor } from "./ProductListEditor";

export function BlockForm({
  templateId,
  templateName,
  typeName,
  block,
}: {
  templateId: string;
  templateName: string;
  typeName: string;
  block: BlockDef;
}) {
  const { data, ready, saveBlocks } = useCollab();
  const router = useRouter();
  const [values, setValues] = useState<Record<string, string>>({});
  const [enabled, setEnabled] = useState(true);
  const [error, setError] = useState("");
  const loadedKey = useRef("");

  const siteBlocks = data?.site.blocks ?? {};
  const siteEnabled = data?.site.enabled ?? {};

  useEffect(() => {
    if (!ready || !data) return;
    const key = `${data.site.id}:${block.id}`;
    if (loadedKey.current === key) return;
    loadedKey.current = key;
    const seed = DEFAULT_VALUES[templateId]?.[block.id] ?? {};
    const fromDraft = siteBlocks[block.id] ?? {};
    const next: Record<string, string> = {};
    for (const field of block.fields) {
      if (block.id === "products" && field.key === "items") {
        next[field.key] = editableProductsJson(fromDraft[field.key], seed[field.key]);
        continue;
      }
      next[field.key] = editableValue(fromDraft[field.key], seed[field.key]);
    }
    if (block.id === "site_type" && !next.typeId) {
      next.typeId = data.site.typeId;
    }
    setValues(next);
    setEnabled(siteEnabled[block.id] !== false);
    setError("");
  }, [ready, data, block, templateId, siteBlocks, siteEnabled]);

  function onChange(key: string, max: number, next: string) {
    setError("");
    setValues((prev) => ({ ...prev, [key]: next.slice(0, max) }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!data) return;
    if (data.site.locked) {
      setError("Thông tin đã lưu. Sửa ở tab Xem.");
      return;
    }
    const missing = block.fields.filter((f) => {
      if (block.id === "products" && f.key === "items") {
        const products = parseProducts(values.items);
        return products.some((p) => !p.name.trim() || !p.price.trim());
      }
      return f.required && !values[f.key]?.trim();
    });
    if (missing.length) {
      setError(
        block.id === "products"
          ? "Mỗi sản phẩm cần tên và giá"
          : `Điền: ${missing.map((f) => f.label).join(", ")}`,
      );
      return;
    }
    const phone = values.phone?.replace(/\s/g, "");
    if (values.phone !== undefined && phone && !/^0\d{9}$/.test(phone)) {
      setError("SĐT gồm 10 số, bắt đầu bằng 0");
      return;
    }
    const zalo = values.zalo?.replace(/\s/g, "");
    if (values.zalo !== undefined && zalo && !/^0\d{9}$/.test(zalo)) {
      setError("Zalo gồm 10 số, bắt đầu bằng 0");
      return;
    }
    const extra =
      block.id === "site_type" && values.typeId
        ? { typeId: values.typeId }
        : undefined;
    const ok = await saveBlocks(
      { ...data.site.blocks, [block.id]: values },
      { ...data.site.enabled, [block.id]: enabled },
      `Sửa khối ${block.title}`,
      extra,
    );
    if (!ok) {
      setError("Không lưu được lên CSDL");
      return;
    }
    router.replace(back);
  }

  const typeQ = data?.site.typeId ? `&loai=${data.site.typeId}` : "";
  const back = `/app-khach/soan/noi-dung?mau=${templateId}${typeQ}`;
  const seedRow = DEFAULT_VALUES[templateId]?.[block.id] ?? {};

  function hintFor(field: (typeof block.fields)[number]) {
    return field.placeholder || seedRow[field.key] || "";
  }

  return (
    <AppShell active="soan">
      <Link href={back} className="app-back">
        ← Tất cả khối · {templateName}
      </Link>
      <header className="app-home-top">
        <div>
          <h1>{block.title}</h1>
          <p>
            {typeName} · {block.hint}
          </p>
        </div>
      </header>

      {!ready || !data ? (
        <p className="app-note">Đang tải bản nháp chung…</p>
      ) : data.site.locked ? (
        <p className="app-note">
          Đã lưu. Vào tab Xem bấm Sửa thông tin để chỉnh lại.
        </p>
      ) : (
        <form className="app-form" onSubmit={onSubmit}>
          <label className="app-toggle">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => {
                setEnabled(e.target.checked);
              }}
            />
            Hiện khối này trên site
          </label>

          {block.id === "products" ? (
            <ProductListEditor
              value={values.items ?? ""}
              onChange={(next) => {
                setError("");
                setValues((prev) => ({ ...prev, items: next }));
              }}
            />
          ) : (
            block.fields.map((field) => (
            <label key={field.key} className="app-field">
              <span>
                {field.label}
                {field.required ? " *" : ""}
              </span>
              {field.type === "textarea" ? (
                <textarea
                  value={values[field.key] ?? ""}
                  rows={3}
                  maxLength={field.max}
                  placeholder={hintFor(field)}
                  onChange={(e) =>
                    onChange(field.key, field.max, e.target.value)
                  }
                />
              ) : field.type === "select" ? (
                <select
                  value={values[field.key] ?? ""}
                  onChange={(e) =>
                    onChange(field.key, field.max, e.target.value)
                  }
                >
                  <option value="">Chọn loại</option>
                  {(field.options ?? []).map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type === "tel" ? "tel" : "text"}
                  inputMode={field.type === "tel" ? "numeric" : "text"}
                  value={values[field.key] ?? ""}
                  maxLength={field.max}
                  placeholder={hintFor(field)}
                  onChange={(e) =>
                    onChange(field.key, field.max, e.target.value)
                  }
                />
              )}
              <small>
                {(values[field.key] ?? "").length}/{field.max}
              </small>
            </label>
          ))
          )}

          {error ? <p className="app-form-error">{error}</p> : null}

          <div className="app-site-actions">
            <Link href={back} className="app-btn app-btn-dark">
              Hủy
            </Link>
            <button type="submit" className="app-btn app-btn-primary">
              Lưu khối
            </button>
          </div>
        </form>
      )}
    </AppShell>
  );
}
