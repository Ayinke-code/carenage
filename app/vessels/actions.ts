"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";

export type VesselFormState = { error?: string; success?: boolean } | undefined;

export async function addVessel(
  _prev: VesselFormState,
  formData: FormData
): Promise<VesselFormState> {
  const session = await requireRole("OWNER");

  const name = String(formData.get("name") ?? "").trim();
  const type = String(formData.get("type") ?? "").trim();
  const imoNumber = String(formData.get("imoNumber") ?? "").trim();
  const lengthM = Number(formData.get("lengthM"));
  const draftM = Number(formData.get("draftM"));

  if (!name || !type || !(lengthM > 0) || !(draftM > 0)) {
    return { error: "Nom, type, longueur et tirant d'eau sont obligatoires (dimensions > 0)." };
  }

  await prisma.vessel.create({
    data: { ownerId: session.userId, name, type, imoNumber: imoNumber || null, lengthM, draftM },
  });

  revalidatePath("/vessels");
  return { success: true };
}