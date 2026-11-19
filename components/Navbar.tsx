import Link from "next/link";
import { getSession, type Session } from "@/lib/session";
import { logout } from "@/app/login/actions";

const LINKS: Record<Session["role"], { href: string; label: string }[]> = {
  OWNER: [
    { href: "/vessels", label: "Mes navires" },
    { href: "/search", label: "Rechercher un chantier" },
    { href: "/bookings", label: "Mes demandes" },
  ],
  SHIPYARD: [{ href: "/requests", label: "Demandes reçues" }],
  ADMIN: [{ href: "/admin", label: "Administration" }],
};

const ROLE_LABELS: Record<Session["role"], string> = {
  OWNER: "Armateur",
  SHIPYARD: "Chantier",
  ADMIN: "Administrateur",
};

export default async function Navbar() {
  const session = await getSession();
  if (!session) return null;

  return (
    <nav className="flex flex-wrap items-center gap-4 text-sm">
      {LINKS[session.role].map((l) => (
        <Link key={l.href} href={l.href} className="hover:underline">
          {l.label}
        </Link>
      ))}

      <details className="relative">
        <summary className="cursor-pointer list-none rounded bg-slate-700 px-3 py-1 text-xs hover:bg-slate-600">
          {session.name} ▾
        </summary>
        <div className="absolute right-0 z-10 mt-2 w-44 rounded-lg border border-slate-200 bg-white p-2 text-slate-900 shadow-lg">
          <p className="px-2 py-1 text-xs text-slate-500">{ROLE_LABELS[session.role]}</p>
          <form action={logout}>
            <button className="w-full rounded px-2 py-1 text-left text-sm hover:bg-slate-100">
              Déconnexion
            </button>
          </form>
        </div>
      </details>
    </nav>
  );
}