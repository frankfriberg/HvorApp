"use server";

import { createClient } from "@/lib/supabase";
import type { SendFeedbackActionState } from "@/types/feedback";
import { Resend } from "resend";

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

  const resend = new Resend(process.env.RESEND_API_KEY);

  const { error } = await supabase.from("feedback").insert([rawFormData]);

  await resend.emails.send({
    from: "feedback@hvor.app",
    to: [process.env.LINEAR_ISSUE_EMAIL || ""],
    subject: `${rawFormData.name} - ${rawFormData.email}`,
    text: rawFormData.content,
  });

  if (error) return { error: "Noe gikk galt, prøv igjen.", input: rawFormData };

  return { message: "Takk for din tilbakemelding!", input: rawFormData };
}
