"use client";

import { useEffect, useState } from "react";
import {
  formatWhen,
  templateLabel,
  typeLabel,
} from "@/components/admin/format";

type Site = {
  id: number;
  name: string;
  type_id: string;
  template_id: string;
  invite_code: string;
  updated_at: string;
  updated_by_name: string | null;
};

export default function AdminSitesPage() {
  const [sites, setSites] = useState<Site[]>([]);

  useEffect(() => {
    void fetch("/api/admin/sites", { credentials: "include" })
      .then((r) => r.json())
      .then((json) => setSites((json as { sites: Site[] }).sites ?? []));
  }, []);

  return (
    <>
      <header className="admin-page-head">
        <div>
          <h1>Website</h1>
          <p className="admin-lead">Loại, mẫu, mã mời và người cập nhật</p>
        </div>
        <span className="admin-count">{sites.length} site</span>
      </header>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Tên</th>
              <th>Loại / mẫu</th>
              <th>Mã mời</th>
              <th>Cập nhật</th>
            </tr>
          </thead>
          <tbody>
            {sites.map((s) => (
              <tr key={s.id}>
                <td>
                  <strong>{s.name}</strong>
                </td>
                <td>
                  <div className="admin-stack">
                    <span className="admin-badge">{typeLabel(s.type_id)}</span>
                    <span className="admin-sub">{templateLabel(s.template_id)}</span>
                  </div>
                </td>
                <td>
                  <code className="admin-code">{s.invite_code}</code>
                </td>
                <td>
                  <div className="admin-stack">
                    <span>{s.updated_by_name || "—"}</span>
                    <span className="admin-sub">{formatWhen(s.updated_at)}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
