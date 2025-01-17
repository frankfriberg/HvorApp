import Image from "next/image";
import logo from "@public/logo.svg";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export default function Logo(
  props: Omit<ComponentProps<typeof Image>, "alt" | "src">,
) {
  return (
    <Image
      src={logo}
      alt="Hvor logo"
      {...props}
      className={cn("w-12", props.className)}
    />
  );
}
