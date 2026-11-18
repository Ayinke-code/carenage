import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";

const LABELS = {
  PENDING: "En attente",
  ACCEPTED: "Acceptée",
  REJECTED: "Refusée",
} as const;

export default async function BookingsPage() {
  const session = await requireRole("OWNER");

  const bookings = await prisma.booking.findMany({
    where: { vessel: { ownerId: session.userId } },
    include: { vessel: true, slot: { include: { shipyard: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="mx-auto mt-10 max-w-2xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Mes demandes</h1>
        <Link href="/dashboard" className="text-sm underline">← Tableau de bord</Link>
      </div>

      <ul className="space-y-2">
        {bookings.map((b) => (
          <li key={b.id} className="rounded border p-3">
            <p className="font-medium">
              {b.vessel.name} → {b.slot.shipyard.name} ({b.slot.shipyard.port})
            </p>
            <p className="text-sm text-gray-600">
              {b.slot.startDate.toLocaleDateString("fr-FR")} →{" "}
              {b.slot.endDate.toLocaleDateString("fr-FR")}
            </p>
            <p className="text-sm">Statut : {LABELS[b.status]}</p>
          </li>
        ))}
        {bookings.length === 0 && <p className="text-gray-500">Aucune demande.</p>}
      </ul>
    </main>
  );
}