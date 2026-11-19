import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import { decideBooking } from "./actions";
import StatusBadge from "@/components/StatusBadge";

export default async function RequestsPage() {
  const session = await requireRole("SHIPYARD");

  const bookings = await prisma.booking.findMany({
    where: { slot: { shipyard: { managerId: session.userId } } },
    include: {
      vessel: { include: { owner: true } },
      slot: { include: { shipyard: true } },
    },
    orderBy: [{ status: "asc" }, { createdAt: "desc" }], // en attente d'abord
  });

  return (
    <main className="mx-auto mt-10 max-w-2xl space-y-6 p-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Demandes reçues</h1>
      </div>

      <ul className="space-y-3">
        {bookings.map((b) => (
          <li key={b.id} className="rounded-lg border border-slate-200 bg-white shadow-sm p-4">
            <p className="font-medium">
              {b.vessel.name} ({b.vessel.type}, {b.vessel.lengthM} m, {b.vessel.draftM} m)
            </p>
            <p className="text-sm text-gray-600">Armateur : {b.vessel.owner.name}</p>
            <p className="text-sm text-gray-600">
              {b.slot.shipyard.name} · {b.slot.startDate.toLocaleDateString("fr-FR")} →{" "}
              {b.slot.endDate.toLocaleDateString("fr-FR")}
              {b.slot.dockName ? ` · ${b.slot.dockName}` : ""}
            </p>
            {b.message && <p className="mt-1 text-sm italic">« {b.message} »</p>}
            <div className="mt-2"><StatusBadge status={b.status} /></div>

            {b.status === "PENDING" && (
              <form action={decideBooking} className="mt-3 flex gap-2">
                <input type="hidden" name="bookingId" value={b.id} />
                <button name="decision" value="ACCEPTED"
                  className="rounded bg-green-700 px-3 py-1 text-sm text-white">
                  Accepter
                </button>
                <button name="decision" value="REJECTED"
                  className="rounded bg-red-700 px-3 py-1 text-sm text-white">
                  Refuser
                </button>
              </form>
            )}
          </li>
        ))}
        {bookings.length === 0 && <p className="text-gray-500">Aucune demande.</p>}
      </ul>
    </main>
  );
}