import ShareMap from "@/components/map/shareMap";
import { list } from "@vercel/blob";

export default async function Home() {
  const map = `https://${process.env.BLOB_URL}/maps/salen.svg`;

  return <ShareMap arena="salen" map={map} />;
}
