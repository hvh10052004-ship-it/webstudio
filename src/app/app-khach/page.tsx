import Link from "next/link";
import { AppShell } from "@/components/app-khach/AppShell";
import { HomeComposePanel } from "@/components/app-khach/HomeComposePanel";

export default function AppKhachHomePage() {
  return (
    <AppShell active="home">
      <header className="app-home-top">
        <div>
          <h1>Tạo website của bạn</h1>
          <p>Chọn loại site — soạn trên điện thoại, xuất bản ngay</p>
        </div>
        <Link href="/app-khach/toi" className="app-avatar">
          H
        </Link>
      </header>
      <HomeComposePanel />
    </AppShell>
  );
}
