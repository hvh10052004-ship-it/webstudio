"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  IconBag,
  IconBuilding,
  IconCta,
  IconImage,
  IconPage,
  IconPhone,
  IconRocket,
  IconTag,
} from "@/components/app-khach/AppIcons";
import { useCollab } from "@/components/app-khach/CollabProvider";
import { draftChecksForType } from "@/data/app-blocks";
import {
  SITE_TYPES,
  TEMPLATES,
  TYPE_TEMPLATE,
  type SiteTypeId,
} from "@/data/app-khach";

const TYPE_ICONS = {
  landing: IconPage,
  company: IconBuilding,
  saas: IconRocket,
  ecommerce: IconBag,
} as const;

const CHECK_ICONS: Record<string, typeof IconTag> = {
  hero: IconTag,
  products: IconBag,
  benefits: IconTag,
  reviews: IconImage,
  cta_form: IconPhone,
  home: IconBuilding,
  services: IconBuilding,
  about: IconPage,
  contact: IconPhone,
  saas_hero: IconRocket,
  features: IconTag,
  pricing: IconTag,
  signup: IconCta,
  shop_home: IconBag,
  cart: IconBag,
  payment: IconCta,
};

const TYPE_KEY = "ws_home_type";

export function HomeComposePanel() {
  const { data, loggedIn, switchType } = useCollab();
  const [picked, setPicked] = useState<SiteTypeId>("landing");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(TYPE_KEY) as SiteTypeId | null;
      if (saved && SITE_TYPES.some((t) => t.id === saved)) setPicked(saved);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    const fromSite = data?.site.typeId as SiteTypeId | undefined;
    if (fromSite && SITE_TYPES.some((t) => t.id === fromSite)) {
      setPicked(fromSite);
    }
  }, [data?.site.typeId]);

  async function pick(id: SiteTypeId) {
    setPicked(id);
    try {
      window.localStorage.setItem(TYPE_KEY, id);
    } catch {
      /* ignore */
    }
    if (!loggedIn) return;
    setBusy(true);
    await switchType(id);
    setBusy(false);
  }

  const type = SITE_TYPES.find((t) => t.id === picked) ?? SITE_TYPES[0];
  const sameType = data?.site.typeId === picked;
  const blocks = sameType ? (data?.site.blocks ?? {}) : {};
  const templateId = sameType
    ? data?.site.templateId
    : TYPE_TEMPLATE[picked];
  const tpl =
    TEMPLATES.find((t) => t.id === templateId) ??
    TEMPLATES.find((t) => t.type === picked) ??
    TEMPLATES[0];
  const name = sameType && data?.site.name ? data.site.name : type.name;
  const checks = draftChecksForType(picked, blocks, tpl.id);
  const doneCount = checks.filter((c) => c.done).length;
  const progress = checks.length
    ? Math.round((doneCount / checks.length) * 100)
    : 0;
  const missing = checks.some((c) => !c.done);

  return (
    <>
      <div className="app-section-label">Các loại website</div>
      <div className="app-type-grid">
        {SITE_TYPES.map((item, i) => {
          const Icon = TYPE_ICONS[item.id];
          const on = picked === item.id;
          return (
            <button
              key={item.id}
              type="button"
              className={`app-type-card${on ? " is-on" : ""}`}
              disabled={busy}
              onClick={() => void pick(item.id)}
            >
              <span className="app-type-icon">
                <Icon size={20} />
              </span>
              <span className="app-type-num">0{i + 1}</span>
              <strong>{item.name}</strong>
              <span>{item.blurb}</span>
            </button>
          );
        })}
      </div>

      {missing ? (
        <>
          <div className="app-section-label">Đang soạn</div>
          <article className="app-site-card">
            <div className="app-site-card-head">
              <div className="app-site-thumb">
                <Image
                  src={tpl.image}
                  alt={`Ảnh ${name}`}
                  fill
                  sizes="64px"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div>
                <h2>{name}</h2>
                <p className="app-meta">
                  {type.name}
                  {sameType && data?.site.inviteCode
                    ? ` · ${data.site.inviteCode}`
                    : ""}
                </p>
              </div>
            </div>
            <div className="app-progress-row">
              <span>Hoàn thiện nội dung</span>
              <span>{progress}%</span>
            </div>
            <div className="app-progress-track" aria-hidden>
              <div
                className="app-progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="app-site-actions">
              <Link
                href={`/app-khach/xem?loai=${picked}`}
                className="app-btn app-btn-ghost"
              >
                Xem trang
              </Link>
              <Link
                href={`/app-khach/soan/noi-dung?loai=${picked}`}
                className="app-btn app-btn-primary"
              >
                Tiếp tục soạn
              </Link>
            </div>
          </article>
          <div className="app-checks">
            {checks.map((item) => {
              const Icon = CHECK_ICONS[item.id] ?? IconTag;
              return (
                <div className="app-check" key={item.id}>
                  <span className={`app-check-icon${item.done ? " on" : ""}`}>
                    <Icon size={18} />
                  </span>
                  <span className="app-check-label">{item.label}</span>
                  <small>{item.done ? "Xong" : "Thiếu"}</small>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <>
          <div className="app-section-label">Đang soạn</div>
          <p className="app-note">
            Đã đủ thông tin {type.name}. Có thể xem trang hoặc soạn lại.
          </p>
          <div className="app-site-actions" style={{ marginTop: 8 }}>
            <Link
              href={`/app-khach/xem?loai=${picked}`}
              className="app-btn app-btn-ghost"
            >
              Xem trang
            </Link>
            <Link
              href={`/app-khach/soan/noi-dung?loai=${picked}`}
              className="app-btn app-btn-primary"
            >
              Soạn lại
            </Link>
          </div>
        </>
      )}
    </>
  );
}
