import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import AddVesselForm from "./AddVesselForm";
import StatusBadge from "@/components/StatusBadge";

export default async function VesselsPage() {
  const session = await requireRole("OWNER");

  const vessels = await prisma.vessel.findMany({
    where: { ownerId: session.userId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="mx-auto mt-10 max-w-2xl space-y-6 p-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Mes navires</h1>
      </div>

      <ul className="space-y-2">
        {vessels.map((v) => (
          <li key={v.id} className="rounded-lg border border-slate-200 bg-white shadow-sm p-3">
            <p className="font-medium">{v.name}</p>
            <p className="text-sm text-gray-600">
              {v.type} · {v.lengthM} m · tirant d'eau {v.draftM} m
            </p>
          </li>
        ))}
        {vessels.length === 0 && <p className="text-gray-500">Aucun navire pour l'instant.</p>}
      </ul>

      <AddVesselForm />
    </main>
  );

}