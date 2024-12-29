import { Menu } from "@/components/home/menu";
import Map from "@/components/map/map";

export default function Home() {
  return (
    <div>
      <div className="flex justify-between p-6 items-center">
        Logo
        <Menu />
      </div>
      <Map />
    </div>
  );
}
