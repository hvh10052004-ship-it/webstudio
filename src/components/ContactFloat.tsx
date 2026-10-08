export function ContactFloat() {
  return (
    <div className="float-dock" aria-label="Liên hệ nhanh">
      <a
        className="float-btn float-btn--zalo"
        href="https://zalo.me/0938002776"
        target="_blank"
        rel="noopener noreferrer"
      >
        Zalo
      </a>
      <a className="float-btn float-btn--phone" href="tel:0938002776" aria-label="Gọi điện thoại">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 16.9v2a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h2a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L7.1 9.5a16 16 0 0 0 6 6l1.1-1.1a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6A2 2 0 0 1 22 16.9z" />
        </svg>
      </a>
    </div>
  );
}
