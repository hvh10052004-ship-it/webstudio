"use client";

import { useEffect, useState } from "react";
import { clip, formatWhen } from "@/components/admin/format";

type Overview = {
  customers: number;
  sites: number;
  messages: {
    id: number;
    body: string;
    created_at: string;
    user_name: string;
    site_name: string;
  }[];
};

export default function AdminOverviewPage() {
  const [data, setData] = useState<Overview | null>(null);

  useEffect(() => {
    void fetch("/api/admin/overview", { credentials: "include" })
      .then((r) => r.json())
      .then((json) => setData(json as Overview));
  }, []);

  return (
    <>
      <header className="admin-page-head">
        <div>
          <h1>Tổng quan</h1>
          <p className="admin-lead">Tình trạng khách, site và chat gần đây</p>
        </div>
      </header>

      <div className="admin-stats">
        <div className="admin-stat">
          <span>Khách hàng</span>
          <strong>{data?.customers ?? "…"}</strong>
        </div>
        <div className="admin-stat">
          <span>Website</span>
          <strong>{data?.sites ?? "…"}</strong>
        </div>
        <div className="admin-stat">
          <span>Tin mới</span>
          <strong>{data?.messages.length ?? "…"}</strong>
        </div>
      </div>

      <section className="admin-panel">
        <div className="admin-panel-head">
          <h2>Tin nhắn gần đây</h2>
        </div>
        <ul className="admin-feed">
          {(data?.messages ?? []).map((m) => (
            <li key={m.id} className="admin-feed-item">
              <div className="admin-feed-meta">
                <strong>{m.user_name}</strong>
                <span>{m.site_name}</span>
                <time>{formatWhen(m.created_at)}</time>
              </div>
              <p>{clip(m.body, 140)}</p>
            </li>
          ))}
          {data && data.messages.length === 0 ? (
            <li className="admin-empty">Chưa có tin nhắn</li>
          ) : null}
        </ul>
      </section>
    </>
  );
}
