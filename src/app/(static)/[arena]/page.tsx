import Logo from "@/components/logo";
import Map from "@/components/map/map";
import { list } from "@vercel/blob";

export default async function GeneratePage({
  params,
}: {
  params: { arena: string };
}) {
  const { blobs } = await list({ prefix: "maps" });
  const map = blobs.find((blob) =>
    blob.pathname.startsWith(`maps/${params.arena}`),
  );

  if (!map) throw new Error(`No map found for "${params.arena}"`);

  return (
    <div className="px-10 touch-none select-none">
      <Logo className="mx-auto my-6" />
      <Map map={map.downloadUrl} generate />
    </div>
  );
}
