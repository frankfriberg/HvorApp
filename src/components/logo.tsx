import { cn } from "@/lib/utils";
import logo from "@public/logo.svg";
import Image from "next/image";
import type { ComponentProps } from "react";

export default function Logo(
  props: Omit<ComponentProps<typeof Image>, "alt" | "src">,
) {
  return (
    <Image
      priority
      src={logo}
      alt="Hvor logo"
      {...props}
      className={cn("w-12", props.className)}
    />
  );
}
