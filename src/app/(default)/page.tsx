import ShareMap from "@/components/map/shareMap";
import { list } from "@vercel/blob";
import { cookies } from "next/headers";

export default async function Home() {
  const cookieStore = await cookies();

  const arena = cookieStore.get("map")?.value ?? "salen";
  const { blobs } = await list({ prefix: "maps" });
  const map = blobs.find((blob) => blob.pathname.startsWith(`maps/${arena}`));

  if (!map) return null;

  return <ShareMap arena={arena} map={map.downloadUrl} />;
}
