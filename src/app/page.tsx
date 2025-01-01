import { Menu } from "@/components/home/menu";
import Logo from "@/components/logo";
import ShareMap from "@/components/map/shareMap";

export default function Home() {
  return (
    <div>
      <div className="flex justify-between p-6 items-center">
        <Logo />
        <Menu />
      </div>

      <ShareMap />
    </div>
  );
}
