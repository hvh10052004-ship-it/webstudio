"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/app-khach/AppShell";
import { useCollab } from "@/components/app-khach/CollabProvider";
import { DEFAULT_VALUES, blocksForType } from "@/data/app-blocks";
import { SITE_TYPES, TEMPLATES, type SiteTypeId } from "@/data/app-khach";

export function SitePreview({ templateId }: { templateId: string }) {
  const { data, ready, setContentLocked } = useCollab();
  const router = useRouter();
  const tpl =
    TEMPLATES.find((t) => t.id === (data?.site.templateId ?? templateId)) ??
    TEMPLATES[0];
  const draftBlocks = data?.site.blocks ?? {};
  const draftEnabled = data?.site.enabled ?? {};
  const typeId =
    draftBlocks.site_type?.typeId || data?.site.typeId || tpl.type;
  const type = SITE_TYPES.find((t) => t.id === typeId) ?? SITE_TYPES[0];
  const blocks = blocksForType(typeId as SiteTypeId).filter(
    (b) => b.id !== "site_type",
  );

  const merge = (id: string) => ({
    ...(DEFAULT_VALUES[tpl.id]?.[id] ?? {}),
    ...(draftBlocks[id] ?? {}),
  });

  const hero = merge("hero");
  const home = merge("home");
  const services = merge("services");
  const about = merge("about");
  const contact = merge("contact");
  const benefits = merge("benefits");
  const review = merge("reviews");
  const cta = merge("cta_form");
  const isCompany = typeId === "company";
  const isSaas = typeId === "saas";
  const isShop = typeId === "ecommerce";
  const saasHero = merge("saas_hero");
  const features = merge("features");
  const pricing = merge("pricing");
  const signup = merge("signup");
  const shopHome = merge("shop_home");
  const cart = merge("cart");
  const payment = merge("payment");
  const products = (() => {
    try {
      const raw = merge("products").items;
      if (!raw) return [];
      return JSON.parse(raw) as { name: string; desc: string; price: string; cta: string }[];
    } catch {
      return [];
    }
  })();
  const stars = Math.min(5, Math.max(1, Number(review.rating) || 5));

  return (
    <AppShell active="xem">
      <header className="app-home-top">
        <div>
          <h1>Xem trước</h1>
          <p>
            {type.name} · {data?.site.name ?? tpl.name}
          </p>
        </div>
      </header>
      <Link href="/app-khach/xem" className="app-back">
        ← Tất cả loại website
      </Link>

      <div className="app-preview">
        <div className="app-preview-bar">
          <span />
          <span />
          <span />
        </div>
        {isCompany ? (
          <>
            {draftEnabled.home !== false ? (
              <div className="app-preview-hero">
                <small>{type.name}</small>
                <h2>{ready ? home.name || tpl.name : "…"}</h2>
                <p>{ready ? home.tagline : ""}</p>
                <span className="app-preview-cta">{home.cta || "Liên hệ"}</span>
              </div>
            ) : null}
            {draftEnabled.services !== false ? (
              <ul className="app-preview-benefits">
                {[services.s1, services.s2, services.s3]
                  .filter(Boolean)
                  .map((item) => (
                    <li key={item}>{item}</li>
                  ))}
              </ul>
            ) : null}
            {draftEnabled.about !== false && about.story ? (
              <blockquote className="app-preview-review">
                <p>{about.story}</p>
                <cite>{about.year ? `Thành lập ${about.year}` : ""}</cite>
              </blockquote>
            ) : null}
            {draftEnabled.contact !== false ? (
              <div className="app-preview-cta-row">
                <span>SĐT {contact.phone || "—"}</span>
                <span>Zalo {contact.zalo || "—"}</span>
              </div>
            ) : null}
          </>
        ) : isSaas ? (
          <>
            {draftEnabled.saas_hero !== false ? (
              <div className="app-preview-hero">
                <small>{saasHero.product || type.name}</small>
                <h2>{ready ? saasHero.headline || tpl.name : "…"}</h2>
                <span className="app-preview-cta">{saasHero.cta || "Dùng thử"}</span>
              </div>
            ) : null}
            {draftEnabled.features !== false ? (
              <ul className="app-preview-benefits">
                {[features.f1, features.f2, features.f3]
                  .filter(Boolean)
                  .map((item) => (
                    <li key={item}>{item}</li>
                  ))}
              </ul>
            ) : null}
            {draftEnabled.pricing !== false ? (
              <p className="app-preview-price" style={{ margin: "0 16px 12px" }}>
                {pricing.plan} · {pricing.price}
              </p>
            ) : null}
            {draftEnabled.signup !== false ? (
              <div className="app-preview-cta-row">
                <span>SĐT {signup.phone || "—"}</span>
                <span>Zalo {signup.zalo || "—"}</span>
              </div>
            ) : null}
          </>
        ) : isShop ? (
          <>
            {draftEnabled.shop_home !== false ? (
              <div className="app-preview-hero">
                <small>{type.name}</small>
                <h2>{ready ? shopHome.name || tpl.name : "…"}</h2>
                <p>{ready ? shopHome.promo : ""}</p>
                <span className="app-preview-cta">{cart.checkout || "Đặt hàng"}</span>
              </div>
            ) : null}
            {draftEnabled.products !== false && products.length ? (
              <ul className="app-preview-products">
                {products
                  .filter((p) => p.name)
                  .map((p) => (
                    <li key={p.name}>
                      <strong>{p.name}</strong>
                      <span>
                        {p.price} · {p.cta || "Mua ngay"}
                      </span>
                    </li>
                  ))}
              </ul>
            ) : null}
            {draftEnabled.payment !== false ? (
              <div className="app-preview-cta-row">
                <span>SĐT {payment.phone || "—"}</span>
                <span>Zalo {payment.zalo || "—"}</span>
              </div>
            ) : null}
          </>
        ) : (
          <>
        {draftEnabled.hero !== false ? (
          <div className="app-preview-hero">
            <small>{type.name}</small>
            <h2>{ready ? hero.headline || tpl.name : "…"}</h2>
            <p>{ready ? hero.lead : ""}</p>
            {hero.price ? (
              <strong className="app-preview-price">{hero.price}</strong>
            ) : null}
            <span className="app-preview-cta">{hero.cta || "Mua ngay"}</span>
          </div>
        ) : null}

        {draftEnabled.products !== false && products.length ? (
          <ul className="app-preview-products">
            {products
              .filter((p) => p.name)
              .map((p) => (
                <li key={p.name}>
                  <strong>{p.name}</strong>
                  <span>
                    {p.price} · {p.cta || "Mua ngay"}
                  </span>
                </li>
              ))}
          </ul>
        ) : null}

        {draftEnabled.benefits !== false ? (
          <ul className="app-preview-benefits">
            {[benefits.b1, benefits.b2, benefits.b3]
              .filter(Boolean)
              .map((item) => (
                <li key={item}>{item}</li>
              ))}
          </ul>
        ) : null}

        {draftEnabled.reviews !== false && review.quote ? (
          <blockquote className="app-preview-review">
            <p>
              {"★".repeat(stars)}
              {review.quote}
            </p>
            <cite>{review.author}</cite>
          </blockquote>
        ) : null}

        {draftEnabled.cta_form !== false ? (
          <div className="app-preview-cta-row">
            <span>SĐT {cta.phone || "—"}</span>
            <span>Zalo {cta.zalo || "—"}</span>
          </div>
        ) : null}
          </>
        )}

        <ul className="app-preview-blocks">
          {blocks.map((block) => {
            const on = draftEnabled[block.id] !== false;
            const row = merge(block.id);
            const summary =
              Object.values(row).filter(Boolean)[0] ?? "Chưa điền";
            return (
              <li key={block.id} className={!on ? "is-off" : undefined}>
                <strong>{block.title}</strong>
                <span>{on ? summary : "Đang ẩn"}</span>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="app-site-actions is-center" style={{ marginTop: 16 }}>
        <button
          type="button"
          className="app-btn app-btn-dark"
          onClick={() => {
            void (async () => {
              if (data?.site.locked) await setContentLocked(false);
              router.push(`/app-khach/soan/noi-dung?loai=${typeId}`);
            })();
          }}
        >
          Sửa thông tin
        </button>
      </div>
    </AppShell>
  );
}
