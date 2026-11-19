import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Carénage – réservation de créneaux",
  description: "Plateforme de réservation de créneaux de carénage pour navires",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <header className="bg-slate-900 text-white">
          <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3 px-6 py-3">
            <Link href="/dashboard" className="text-lg font-bold">
              ⚓ Carénage
            </Link>
            <Suspense fallback={null}>
              <Navbar />
            </Suspense>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}