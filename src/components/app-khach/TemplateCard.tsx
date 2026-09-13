"use client";

import Image from "next/image";
import Link from "next/link";
import { SITE_TYPES, type TEMPLATES } from "@/data/app-khach";

type Tpl = (typeof TEMPLATES)[number];

export function TemplateCard({ tpl }: { tpl: Tpl }) {
  const typeName = SITE_TYPES.find((t) => t.id === tpl.type)?.short;

  return (
    <Link href={`/app-khach/soan/noi-dung?mau=${tpl.id}`} className="app-tpl">
      <div className="app-tpl-img">
        <Image
          src={tpl.image}
          alt={tpl.name}
          fill
          sizes="160px"
          style={{ objectFit: "cover" }}
        />
      </div>
      <strong>{tpl.name}</strong>
      <span>
        {typeName} · {tpl.use}
      </span>
    </Link>
  );
}
