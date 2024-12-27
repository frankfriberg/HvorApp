import { Menu } from "@/components/home/menu";

export default function Home() {
  return (
    <div>
      <div className="flex justify-between p-6 items-center">
        Logo
        <Menu />
      </div>
    </div>
  );
}
