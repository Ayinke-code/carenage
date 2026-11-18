"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";

export type RequestState = { error?: string } | undefined;

export async function requestBooking(
  _prev: RequestState,
  formData: FormData
): Promise<RequestState> {
  const session = await requireRole("OWNER");

  const vesselId = String(formData.get("vesselId") ?? "");
  const slotId = String(formData.get("slotId") ?? "");
  const message = String(formData.get("message") ?? "").trim();

  // Le navire doit appartenir à l'utilisateur connecté
  const vessel = await prisma.vessel.findFirst({
    where: { id: vesselId, ownerId: session.userId },
  });
  if (!vessel) return { error: "Navire introuvable." };

  const slot = await prisma.slot.findUnique({
    where: { id: slotId },
    include: { shipyard: true },
  });
  if (!slot || !slot.isAvailable) {
    return { error: "Ce créneau n'est plus disponible." };
  }

  // Contrôle de compatibilité refait côté serveur (ne jamais faire confiance au client)
  if (
    vessel.lengthM > slot.shipyard.maxLengthM ||
    vessel.draftM > slot.shipyard.maxDraftM
  ) {
    return { error: "Ce navire est incompatible avec les dimensions du dock." };
  }

  const existing = await prisma.booking.findFirst({
    where: { vesselId, slotId, status: { in: ["PENDING", "ACCEPTED"] } },
  });
  if (existing) {
    return { error: "Une demande existe déjà pour ce navire et ce créneau." };
  }

  await prisma.booking.create({
    data: { vesselId, slotId, message: message || null },
  });

  redirect("/bookings");
}