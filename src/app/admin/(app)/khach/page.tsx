"use client";

import { useEffect, useState } from "react";

type User = {
  id: number;
  name: string;
  phone: string | null;
  email: string | null;
  nickname: string | null;
  site_name: string | null;
};

export default function AdminCustomersPage() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    void fetch("/api/admin/users", { credentials: "include" })
      .then((r) => r.json())
      .then((json) => setUsers((json as { users: User[] }).users ?? []));
  }, []);

  return (
    <>
      <header className="admin-page-head">
        <div>
          <h1>Khách hàng</h1>
          <p className="admin-lead">Tài khoản và website đang soạn</p>
        </div>
        <span className="admin-count">{users.length} người</span>
      </header>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Khách</th>
              <th>Liên hệ</th>
              <th>Website</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>
                  <div className="admin-person">
                    <span className="admin-avatar">
                      {(u.nickname || u.name).slice(0, 1).toUpperCase()}
                    </span>
                    <div>
                      <strong>{u.nickname || u.name}</strong>
                      <span className="admin-sub">@{u.name}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="admin-stack">
                    <span>{u.phone || "Chưa có SĐT"}</span>
                    <span className="admin-sub">{u.email || "Chưa có email"}</span>
                  </div>
                </td>
                <td>{u.site_name || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
