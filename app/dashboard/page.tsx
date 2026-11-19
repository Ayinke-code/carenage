import Link from "next/link";
import { requireRole } from "@/lib/session";

const SHORTCUTS = {
  OWNER: [
    { href: "/vessels", title: "Mes navires", text: "Ajoutez vos navires et leurs dimensions." },
    { href: "/search", title: "Rechercher un chantier", text: "Trouvez un créneau compatible, par port." },
    { href: "/bookings", title: "Mes demandes", text: "Suivez l'état de vos réservations." },
  ],
  SHIPYARD: [
    { href: "/requests", title: "Demandes reçues", text: "Acceptez ou refusez les demandes des armateurs." },
  ],
  ADMIN: [
    { href: "/admin", title: "Administration", text: "Vue d'ensemble des demandes et de leurs statuts." },
  ],
} as const;

export default async function DashboardPage() {
  const session = await requireRole();

  return (
    <main className="mx-auto mt-10 max-w-4xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Bonjour {session.name}</h1>
        <p className="text-slate-600">Que souhaitez-vous faire ?</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SHORTCUTS[session.role].map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-600 hover:shadow-md"
          >
            <p className="font-semibold">{s.title}</p>
            <p className="mt-1 text-sm text-slate-600">{s.text}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}