import { SoanBlocks } from "@/components/app-khach/SoanBlocks";
import { TEMPLATES, TYPE_TEMPLATE, type SiteTypeId } from "@/data/app-khach";

export default async function SoanNoiDungPage({
  searchParams,
}: {
  searchParams: Promise<{ mau?: string; loai?: string }>;
}) {
  const { mau, loai } = await searchParams;
  const tpl =
    TEMPLATES.find((t) => t.id === mau) ??
    TEMPLATES.find((t) => t.id === TYPE_TEMPLATE[(loai as SiteTypeId) ?? "landing"]);
  const typeId = (loai || tpl?.type) as SiteTypeId | undefined;
  return <SoanBlocks templateId={tpl?.id} typeId={typeId} />;
}
