"use client";

import { useActionState } from "react";
import { login } from "./actions";

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <main className="mx-auto mt-24 max-w-sm p-6">
      <h1 className="mb-6 text-2xl font-bold">Connexion</h1>
      <form action={action} className="flex flex-col gap-3">
        <input name="email" type="email" placeholder="Email" required
          className="rounded border p-2" />
        <input name="password" type="password" placeholder="Mot de passe" required
          className="rounded border p-2" />
        {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
        <button disabled={pending}
          className="rounded bg-blue-700 p-2 text-white disabled:opacity-50">
          {pending ? "Connexion..." : "Se connecter"}
        </button>
      </form>
      <p className="mt-4 text-xs text-gray-500">
        Démo : owner@demo.com, yard@demo.com, admin@demo.com (mot de passe : demo1234)
      </p>
    </main>
  );
}