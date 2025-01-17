"use client";

import type { ComponentProps, PropsWithChildren } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "./button";

export function SubmitButton(
  props: PropsWithChildren<ComponentProps<typeof Button>>,
) {
  const { pending } = useFormStatus();

  return <Button disabled={pending} type="submit" {...props} />;
}
