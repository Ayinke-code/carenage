"use client";

import { useActionState } from "react";
import { login } from "./actions";
import StatusBadge from "@/components/StatusBadge";

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <main className="mx-auto mt-24 max-w-sm rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="mb-6 text-2xl font-bold">Connexion</h1>
      <form action={action} className="flex flex-col gap-3">
        <input name="email" type="email" placeholder="Email" required
          className="rounded-lg border border-slate-200 bg-white shadow-sm p-2" />
        <input name="password" type="password" placeholder="Mot de passe" required
          className="rounded-lg border border-slate-200 bg-white shadow-sm p-2" />
        {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
        <button disabled={pending}
          className="rounded bg-blue-700 p-2 text-white disabled:opacity-50">
          {pending ? "Connexion..." : "Se connecter"}
        </button>
      </form>
      <p className="mt-4 text-xs text-gray-500">
        Comptes de test : armateur@carenage.test, chantier@carenage.test,
        admin@carenage.test (mot de passe : carenage123)
      </p>
    </main>
  );
}