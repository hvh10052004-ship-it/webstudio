"use client";

import { useEffect } from "react";
import { SitePreview } from "@/components/app-khach/SitePreview";
import { XemHub } from "@/components/app-khach/XemHub";
import { useCollab } from "@/components/app-khach/CollabProvider";
import { TYPE_TEMPLATE, type SiteTypeId } from "@/data/app-khach";

export function XemScreen({ loai }: { loai?: string }) {
  const { data, switchType } = useCollab();
  const typeId = loai as SiteTypeId | undefined;
  const valid = Boolean(
    typeId && ["landing", "company", "saas", "ecommerce"].includes(typeId),
  );

  useEffect(() => {
    if (valid && typeId) void switchType(typeId);
  }, [valid, typeId, switchType]);

  if (!valid) return <XemHub />;

  const readyType = Boolean(
    data && data.site.typeId === typeId && data.site.locked,
  );
  if (!readyType) {
    return <XemHub />;
  }

  return <SitePreview templateId={TYPE_TEMPLATE[typeId!]} />;
}
