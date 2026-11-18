"use client";

import { useActionState } from "react";
import { requestBooking } from "./actions";

export default function RequestForm({
  vesselId,
  slotId,
}: {
  vesselId: string;
  slotId: string;
}) {
  const [state, action, pending] = useActionState(requestBooking, undefined);

  return (
    <form action={action} className="mt-2 flex flex-col gap-2">
      <input type="hidden" name="vesselId" value={vesselId} />
      <input type="hidden" name="slotId" value={slotId} />
      <input
        name="message"
        placeholder="Message pour le chantier (optionnel)"
        className="rounded border p-2 text-sm"
      />
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <button
        disabled={pending}
        className="self-start rounded bg-blue-700 px-3 py-1 text-sm text-white disabled:opacity-50"
      >
        {pending ? "Envoi..." : "Demander ce créneau"}
      </button>
    </form>
  );
}