import TouchMap from "@/components/map/touchMap";
import Salen from "@public/arena/salen.svg";

export default async function GeneratePage() {
  return (
    <div className="touch-none select-none px-10 pt-20">
      <TouchMap map={Salen} generate />
    </div>
  );
}
