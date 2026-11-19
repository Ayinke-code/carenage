# Carénage – plateforme de réservation de créneaux de carénage

Prototype : des armateurs réservent un créneau de carénage auprès de chantiers navals.

## Stack
Next.js (App Router) · TypeScript · Prisma · PostgreSQL · Tailwind CSS

## Prérequis
Node.js 20+, Docker (pour PostgreSQL, exposé sur le port 5433)

## Lancer le projet
```bash
cp .env.example .env
docker compose up -d
npm install
npx prisma migrate deploy
npx prisma db seed
npm run dev
```
Ouvrir http://localhost:3000

## Comptes de test (mot de passe : carenage123)
| Rôle | Email |
|---|---|
| Armateur | armateur@carenage.test |
| Chantier | chantier@carenage.test |
| Administrateur | admin@carenage.test |

## Parcours implémenté
1. L'armateur enregistre ses navires (longueur, tirant d'eau).
2. Il recherche un chantier par port : seuls les docks compatibles sont proposés.
3. Il demande un créneau.
4. Le chantier accepte ou refuse (transaction : un seul accepté par créneau).
5. L'admin suit toutes les demandes par statut.