import Link from "next/link"
import { requireRole } from "@/lib/session";
import { logout } from "../login/actions";

export default async function DashboardPage() {
  const session = await requireRole();

  return (
    <main className="mx-auto mt-16 max-w-2xl p-6">
      <h1 className="text-2xl font-bold">Bonjour {session.name}</h1>
      <p className="mt-2">Rôle : {session.role}</p>
      {session.role === "OWNER" && (
        <nav className="mt-4 flex flex-col gap-2">
          <Link href="/vessels" className="underline">Mes navires</Link>
          <Link href="/search" className="underline">Rechercher un chantier</Link>
          <Link href="/bookings" className="underline">Mes demandes</Link>
        </nav>
      )}
      {session.role === "SHIPYARD" && (
        <nav className="mt-4 flex flex-col gap-2">
          <Link href="/requests" className="underline">Demandes reçues</Link>
        </nav>
      )}
      {session.role === "ADMIN" && (
        <nav className="mt-4 flex flex-col gap-2">
          <Link href="/admin" className="underline">Administration</Link>
        </nav>
      )}
      <form action={logout} className="mt-6">
        <button className="rounded border px-3 py-1">Se déconnecter</button>
      </form>
    </main>
  );
}