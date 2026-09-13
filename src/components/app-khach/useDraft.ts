"use client";

import { useCallback, useEffect, useState } from "react";

export type DraftStore = {
  templateId: string;
  blocks: Record<string, Record<string, string>>;
  enabled: Record<string, boolean>;
};

const PREFIX = "ws-draft:";

function emptyDraft(templateId: string): DraftStore {
  return { templateId, blocks: {}, enabled: {} };
}

export function readDraft(templateId: string): DraftStore {
  if (typeof window === "undefined") return emptyDraft(templateId);
  try {
    const raw = localStorage.getItem(PREFIX + templateId);
    if (!raw) return emptyDraft(templateId);
    const parsed = JSON.parse(raw) as DraftStore;
    if (parsed.templateId !== templateId) return emptyDraft(templateId);
    return {
      templateId,
      blocks: parsed.blocks ?? {},
      enabled: parsed.enabled ?? {},
    };
  } catch {
    return emptyDraft(templateId);
  }
}

export function writeDraft(draft: DraftStore) {
  localStorage.setItem(PREFIX + draft.templateId, JSON.stringify(draft));
}

export function useDraft(templateId: string) {
  const [draft, setDraft] = useState<DraftStore>(() => emptyDraft(templateId));
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setDraft(readDraft(templateId));
    setReady(true);
  }, [templateId]);

  const save = useCallback(
    (next: DraftStore) => {
      setDraft(next);
      writeDraft(next);
    },
    [],
  );

  return { draft, ready, save };
}
