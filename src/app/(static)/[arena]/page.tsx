import Logo from "@/components/logo";
import TouchMap from "@/components/map/touchMap";
import { list } from "@vercel/blob";

export default async function GeneratePage({
  params,
}: {
  params: Promise<{ arena: string }>;
}) {
  const { arena } = await params;
  const { blobs } = await list({ prefix: "maps" });
  const map = blobs.find((blob) => blob.pathname.startsWith(`maps/${arena}`));

  if (!map) throw new Error(`No map found for "${arena}"`);

  return (
    <div className="touch-none select-none px-10">
      <Logo className="mx-auto my-6" />
      <TouchMap map={map.downloadUrl} generate />
    </div>
  );
}
