export function isAppKhachServer() {
  return (
    process.env.APP_KHACH_SERVER === "1" ||
    process.env.NEXT_PUBLIC_APP_KHACH_SERVER === "1"
  );
}
