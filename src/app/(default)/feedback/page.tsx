import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/ui/submitButton";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "../../../../utils/supabase";

export default function FeedbackPage() {
  async function sendFeedback(formData: FormData) {
    "use server";

    const supabase = await createClient();

    const rawFormData = {
      name: formData.get("name"),
      email: formData.get("email"),
      content: formData.get("content"),
    };

    const { error } = await supabase.from("feedback").insert([rawFormData]);

    if (error) throw new Error(error.message);
  }

  return (
    <div className="flex flex-col gap-3 px-6 py-3">
      <h1 className="text-2xl font-bold mb-3">Gi din tilbakemelding</h1>
      <p>
        Hvis du har funnet en feil, eller om det er noe du vil skal være
        annerledes, eller har du en god ide til appen.
      </p>
      <form className="flex flex-col my-3 space-y-4" action={sendFeedback}>
        <Label htmlFor="name">
          Navn
          <Input name="name" className="mt-2" required />
        </Label>
        <Label htmlFor="email">
          Email
          <Input name="email" type="email" className="mt-2" required />
        </Label>
        <Label htmlFor="content">
          Tilbakemelding
          <Textarea name="content" className="mt-2" required />
        </Label>
        <SubmitButton>Send</SubmitButton>
      </form>
    </div>
  );
}
