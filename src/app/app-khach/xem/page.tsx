import { XemScreen } from "@/components/app-khach/XemScreen";

export default async function XemPage({
  searchParams,
}: {
  searchParams: Promise<{ loai?: string }>;
}) {
  const { loai } = await searchParams;
  return <XemScreen loai={loai} />;
}
