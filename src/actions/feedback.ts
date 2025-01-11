"use server";

import { createClient } from "@/lib/supabase";
import { SendFeedbackActionState } from "@/types/feedback";

export async function sendFeedback(
  _prevState: SendFeedbackActionState | null,
  formData: FormData,
): Promise<SendFeedbackActionState> {
  const supabase = await createClient();

  const rawFormData = {
    name: (formData.get("name") as string) ?? undefined,
    email: (formData.get("email") as string) ?? undefined,
    content: (formData.get("content") as string) ?? undefined,
  };

  const { error } = await supabase.from("feedback").insert([rawFormData]);

  if (error) return { error: "Noe gikk galt, prøv igjen.", input: rawFormData };

  return { message: "Takk for din tilbakemelding!", input: rawFormData };
}
