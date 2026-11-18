import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // On repart d'une base propre à chaque exécution
  await prisma.booking.deleteMany();
  await prisma.slot.deleteMany();
  await prisma.shipyard.deleteMany();
  await prisma.vessel.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("demo1234", 10);

  const owner = await prisma.user.create({
    data: { email: "owner@demo.com", name: "Armateur Demo", role: "OWNER", passwordHash },
  });
  const yardManager = await prisma.user.create({
    data: { email: "yard@demo.com", name: "Chantier Demo", role: "SHIPYARD", passwordHash },
  });
  await prisma.user.create({
    data: { email: "admin@demo.com", name: "Admin Demo", role: "ADMIN", passwordHash },
  });

  const ferry = await prisma.vessel.create({
    data: { ownerId: owner.id, name: "Ferry Atlantique", type: "Ferry", lengthM: 150, draftM: 6.5 },
  });
  await prisma.vessel.create({
    data: { ownerId: owner.id, name: "Container Aurora", type: "Porte-conteneurs", lengthM: 300, draftM: 13 },
  });

  const nantes = await prisma.shipyard.create({
    data: {
      managerId: yardManager.id,
      name: "Chantier Naval de Loire",
      port: "Saint-Nazaire",
      country: "France",
      maxLengthM: 200,
      maxDraftM: 8,
      services: ["Sablage", "Peinture antifouling", "Hélices"],
    },
  });
  const marseille = await prisma.shipyard.create({
    data: {
      managerId: yardManager.id,
      name: "Chantier Méditerranée",
      port: "Marseille",
      country: "France",
      maxLengthM: 350,
      maxDraftM: 14,
      services: ["Sablage", "Peinture antifouling", "Inspection de coque"],
    },
  });

  const slot1 = await prisma.slot.create({
    data: { shipyardId: nantes.id, dockName: "Cale 1", startDate: new Date("2027-02-01"), endDate: new Date("2027-02-10") },
  });
  await prisma.slot.create({
    data: { shipyardId: nantes.id, dockName: "Cale 1", startDate: new Date("2027-03-01"), endDate: new Date("2027-03-12") },
  });
  await prisma.slot.create({
    data: { shipyardId: marseille.id, dockName: "Bassin A", startDate: new Date("2027-02-15"), endDate: new Date("2027-02-28") },
  });

  await prisma.booking.create({
    data: { vesselId: ferry.id, slotId: slot1.id, message: "Carénage annuel avant la saison." },
  });

  console.log("Seed terminé.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());