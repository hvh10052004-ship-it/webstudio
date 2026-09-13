export function settingsBack(from: string | null) {
  if (from === "privacy") {
    return {
      href: "/app-khach/toi/quyen-rieng-tu",
      label: "← Quyền riêng tư",
    };
  }
  return {
    href: "/app-khach/toi/tai-khoan",
    label: "← Tài khoản và bảo mật",
  };
}
