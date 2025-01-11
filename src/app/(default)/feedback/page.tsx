"use client";
import { sendFeedback } from "@/actions/feedback";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/ui/submitButton";
import { Textarea } from "@/components/ui/textarea";
import { useActionState } from "react";

export default function FeedbackPage() {
  const [state, formAction] = useActionState(sendFeedback, {});

  return (
    <div className="flex flex-col gap-3 px-6 py-3">
      <h1 className="text-2xl font-bold mb-3">Gi din tilbakemelding</h1>
      <p>
        Hvis du har funnet en feil, eller om det er noe du vil skal være
        annerledes, eller har du en god ide til appen.
      </p>
      <form className="flex flex-col my-3 space-y-4" action={formAction}>
        <Label htmlFor="name">
          Navn
          <Input
            name="name"
            className="mt-2"
            required
            defaultValue={state.input?.name}
          />
        </Label>
        <Label htmlFor="email">
          Email
          <Input
            name="email"
            type="email"
            className="mt-2"
            required
            defaultValue={state.input?.email}
          />
        </Label>
        <Label htmlFor="content">
          Tilbakemelding
          <Textarea
            name="content"
            className="mt-2"
            required
            defaultValue={state.input?.content}
          />
        </Label>
        {state.message && <p>{state.message}</p>}
        {state.error && <p>{state.message}</p>}
        <SubmitButton disabled={!!state.message}>Send</SubmitButton>
      </form>
    </div>
  );
}
