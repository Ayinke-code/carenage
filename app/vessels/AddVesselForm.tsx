"use client";

import { useActionState, useEffect, useRef } from "react";
import { addVessel } from "./actions";

export default function AddVesselForm() {
  const [state, action, pending] = useActionState(addVessel, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  // Vide le formulaire après un ajout réussi
  useEffect(() => {
    if (state?.success) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={action} className="grid gap-3 rounded border p-4">
      <h2 className="font-semibold">Ajouter un navire</h2>
      <input name="name" placeholder="Nom du navire" required className="rounded border p-2" />
      <select name="type" required className="rounded border p-2">
        <option value="Ferry">Ferry</option>
        <option value="Porte-conteneurs">Porte-conteneurs</option>
        <option value="Pétrolier">Pétrolier</option>
        <option value="Autre">Autre</option>
      </select>
      <input name="imoNumber" placeholder="Numéro IMO (optionnel)" className="rounded border p-2" />
      <div className="grid grid-cols-2 gap-3">
        <input name="lengthM" type="number" step="0.1" min="0" placeholder="Longueur (m)" required
          className="rounded border p-2" />
        <input name="draftM" type="number" step="0.1" min="0" placeholder="Tirant d'eau (m)" required
          className="rounded border p-2" />
      </div>
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state?.success && <p className="text-sm text-green-700">Navire ajouté.</p>}
      <button disabled={pending} className="rounded bg-blue-700 p-2 text-white disabled:opacity-50">
        {pending ? "Ajout..." : "Ajouter"}
      </button>
    </form>
  );
}