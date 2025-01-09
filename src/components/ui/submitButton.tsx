"use client";

import { useFormStatus } from "react-dom";
import { Button } from "./button";
import { ComponentProps, PropsWithChildren } from "react";

export function SubmitButton(
  props: PropsWithChildren<ComponentProps<typeof Button>>,
) {
  const { pending } = useFormStatus();

  return <Button disabled={pending} type="submit" {...props} />;
}
