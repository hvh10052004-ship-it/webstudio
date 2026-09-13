"use client";

import { TEMPLATES } from "@/data/app-khach";
import { TemplateCard } from "@/components/app-khach/TemplateCard";

export function TemplateGrid({
  ids,
  emptyText = "Chưa có mẫu phù hợp.",
}: {
  ids?: readonly string[];
  emptyText?: string;
}) {
  const list = ids
    ? TEMPLATES.filter((t) => ids.includes(t.id))
    : TEMPLATES;

  if (!list.length) {
    return <p className="app-note">{emptyText}</p>;
  }

  return (
    <div className="app-tpl-grid">
      {list.map((tpl) => (
        <TemplateCard key={tpl.id} tpl={tpl} />
      ))}
    </div>
  );
}
