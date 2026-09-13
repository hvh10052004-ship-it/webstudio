"use client";

import Link from "next/link";
import { AppShell } from "@/components/app-khach/AppShell";
import { useCollab } from "@/components/app-khach/CollabProvider";
import { SITE_TYPES } from "@/data/app-khach";

export function XemHub() {
  const { data } = useCollab();
  const saved = data?.typeSites ?? [];

  return (
    <AppShell active="xem">
      <header className="app-home-top">
        <div>
          <h1>Xem trang</h1>
          <p>Mỗi loại website là một trang riêng — hiện sau khi lưu thông tin</p>
        </div>
      </header>

      <ol className="app-soan-list">
        {SITE_TYPES.map((type, i) => {
          const row = saved.find((s) => s.typeId === type.id && s.locked);
          return (
            <li key={type.id}>
              {row ? (
                <Link
                  href={`/app-khach/xem?loai=${type.id}`}
                  className="app-soan-item"
                >
                  <span className="app-soan-idx">{i + 1}</span>
                  <div>
                    <strong>{type.name}</strong>
                    <p>{row.name}</p>
                  </div>
                </Link>
              ) : (
                <div className="app-soan-item is-locked">
                  <span className="app-soan-idx">{i + 1}</span>
                  <div>
                    <strong>{type.name}</strong>
                    <p>Chưa lưu — soạn rồi bấm Lưu thông tin</p>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </AppShell>
  );
}
