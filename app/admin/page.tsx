import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import StatusBadge from "@/components/StatusBadge";

const LABELS = {
  PENDING: "En attente",
  ACCEPTED: "Acceptée",
  REJECTED: "Refusée",
} as const;

type Status = keyof typeof LABELS;

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  await requireRole("ADMIN");
  const { status } = await searchParams;
  const filter = status && status in LABELS ? (status as Status) : undefined;

  const [bookings, counts] = await Promise.all([
    prisma.booking.findMany({
      where: filter ? { status: filter } : {},
      include: {
        vessel: { include: { owner: true } },
        slot: { include: { shipyard: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.booking.groupBy({ by: ["status"], _count: true }),
  ]);

  const countOf = (s: Status) => counts.find((c) => c.status === s)?._count ?? 0;

  return (
    <main className="mx-auto mt-10 max-w-3xl space-y-6 p-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Administration</h1>
      </div>

      <div className="grid grid-cols-3 gap-3 text-center">
        {(Object.keys(LABELS) as Status[]).map((s) => (
          <Link key={s} href={`/admin?status=${s}`} className="rounded-lg border border-slate-200 bg-white shadow-sm p-3">
            <p className="text-2xl font-bold">{countOf(s)}</p>
            <p className="text-sm text-gray-600">{LABELS[s]}</p>
          </Link>
        ))}
      </div>
      {filter && <Link href="/admin" className="text-sm underline">Voir toutes les demandes</Link>}

      <ul className="space-y-2">
        {bookings.map((b) => (
          <li key={b.id} className="rounded-lg border border-slate-200 bg-white shadow-sm p-3 text-sm">
            <p className="font-medium">
              {b.vessel.name} ({b.vessel.owner.name}) → {b.slot.shipyard.name}, {b.slot.shipyard.port}
            </p>
            <div className="mt-1 flex items-center gap-2 text-gray-600">
              <span>
                {b.slot.startDate.toLocaleDateString("fr-FR")} →{" "}
                {b.slot.endDate.toLocaleDateString("fr-FR")}
              </span>
              <StatusBadge status={b.status} />
            </div>
          </li>
        ))}
        {bookings.length === 0 && <p className="text-gray-500">Aucune demande.</p>}
      </ul>
    </main>
  );
}