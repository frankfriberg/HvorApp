import Logo from "@/components/logo";
import Map from "@/components/map/map";

export default function GeneratePage() {
  return (
    <div className="px-10 touch-none select-none">
      <Logo className="mx-auto my-6" />
      <Map offsetY={0} />
    </div>
  );
}
