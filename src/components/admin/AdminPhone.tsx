import type { ReactNode } from "react";

export function AdminPhone({
  children,
  footer,
  chat = false,
}: {
  children: ReactNode;
  footer?: ReactNode;
  chat?: boolean;
}) {
  return (
    <div className="admin-stage">
      <p className="admin-stage-hint">App admin</p>
      <div className="admin-phone">
        <div className={`admin-phone-body${chat ? " is-chat" : ""}`}>
          {children}
        </div>
        {footer}
      </div>
    </div>
  );
}
