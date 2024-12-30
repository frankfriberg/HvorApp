import Map from "@/components/map/map";

export default function GeneratePage() {
  return (
    <div className="px-10 touch-none select-none overflow-hidden">
      <div className="flex justify-center py-8">Logo</div>
      <Map offsetY={0} />
    </div>
  );
}
