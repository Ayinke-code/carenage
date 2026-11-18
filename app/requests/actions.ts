"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";

export async function decideBooking(formData: FormData): Promise<void> {
  const session = await requireRole("SHIPYARD");

  const bookingId = String(formData.get("bookingId") ?? "");
  const decision = String(formData.get("decision") ?? "");
  if (decision !== "ACCEPTED" && decision !== "REJECTED") return;

  await prisma.$transaction(async (tx) => {
    // La demande doit être en attente ET concerner un chantier géré par cet utilisateur
    const booking = await tx.booking.findFirst({
      where: {
        id: bookingId,
        status: "PENDING",
        slot: { shipyard: { managerId: session.userId } },
      },
    });
    if (!booking) return;

    if (decision === "ACCEPTED") {
      // Mise à jour conditionnelle : garantit un seul acceptée par créneau
      const locked = await tx.slot.updateMany({
        where: { id: booking.slotId, isAvailable: true },
        data: { isAvailable: false },
      });
      if (locked.count === 0) return;

      // Les autres demandes en attente sur ce créneau sont refusées
      await tx.booking.updateMany({
        where: { slotId: booking.slotId, status: "PENDING", id: { not: booking.id } },
        data: { status: "REJECTED", decidedAt: new Date() },
      });
    }

    await tx.booking.update({
      where: { id: booking.id },
      data: { status: decision, decidedAt: new Date() },
    });
  });

  revalidatePath("/requests");
}