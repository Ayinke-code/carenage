import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import RequestForm from "./RequestForm";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ vesselId?: string; port?: string }>;
}) {
  const session = await requireRole("OWNER");
  const { vesselId, port } = await searchParams;

  const vessels = await prisma.vessel.findMany({
    where: { ownerId: session.userId },
    orderBy: { name: "asc" },
  });
  const vessel = vessels.find((v) => v.id === vesselId);

  // Seuls les chantiers compatibles avec le navire sont renvoyés
  const shipyards = vessel
    ? await prisma.shipyard.findMany({
        where: {
          ...(port ? { port: { contains: port, mode: "insensitive" } } : {}),
          maxLengthM: { gte: vessel.lengthM },
          maxDraftM: { gte: vessel.draftM },
        },
        include: {
          slots: {
            where: { isAvailable: true, startDate: { gte: new Date() } },
            orderBy: { startDate: "asc" },
          },
        },
        orderBy: { name: "asc" },
      })
    : [];

  return (
    <main className="mx-auto mt-10 max-w-2xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Rechercher un chantier</h1>
        <Link href="/dashboard" className="text-sm underline">← Tableau de bord</Link>
      </div>

      <form method="get" className="grid gap-3 rounded border p-4">
        <select name="vesselId" defaultValue={vesselId ?? ""} required className="rounded border p-2">
          <option value="" disabled>Choisir un navire</option>
          {vessels.map((v) => (
            <option key={v.id} value={v.id}>
              {v.name} ({v.lengthM} m, {v.draftM} m)
            </option>
          ))}
        </select>
        <input
          name="port"
          defaultValue={port ?? ""}
          placeholder="Port (ex : Marseille)"
          className="rounded border p-2"
        />
        <button className="rounded bg-blue-700 p-2 text-white">Rechercher</button>
      </form>

      {vessel && shipyards.length === 0 && (
        <p className="text-gray-500">Aucun chantier compatible trouvé.</p>
      )}

      {vessel &&
        shipyards.map((y) => (
          <section key={y.id} className="rounded border p-4">
            <h2 className="font-semibold">{y.name}</h2>
            <p className="text-sm text-gray-600">
              {y.port} · dock jusqu'à {y.maxLengthM} m / {y.maxDraftM} m
            </p>
            <p className="text-sm text-gray-600">Services : {y.services.join(", ")}</p>

            <div className="mt-3 space-y-3">
              {y.slots.length === 0 && (
                <p className="text-sm text-gray-500">Aucun créneau libre.</p>
              )}
              {y.slots.map((s) => (
                <div key={s.id} className="rounded border p-3">
                  <p className="text-sm font-medium">
                    {s.startDate.toLocaleDateString("fr-FR")} →{" "}
                    {s.endDate.toLocaleDateString("fr-FR")}
                    {s.dockName ? ` · ${s.dockName}` : ""}
                  </p>
                  <RequestForm vesselId={vessel.id} slotId={s.id} />
                </div>
              ))}
            </div>
          </section>
        ))}
    </main>
  );
}