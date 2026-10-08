import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-content">
          <Link className="logo" href="/">
            Web<span>Studio.</span>
          </Link>
          <p>© 2026 WebStudio. All rights reserved.</p>
          <div className="footer-links">
            <Link href="/ve-chung-toi">Về chúng tôi</Link>
            <Link href="/tai-ung-dung">Tải App khách</Link>
            <a href="/#portfolio">Dự án</a>
            <a href="/#contact">Liên hệ</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
