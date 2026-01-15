import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gestión de Voces",
  description: "Sube, clona y administra tus voces personalizadas para síntesis de audio.",
  keywords: [
    "voces personalizadas",
    "clonación de voz",
    "gestionar voces",
    "voz clonada",
    "biblioteca de voces"
  ],
  openGraph: {
    title: "Gestión de Voces | AURA_VOICE",
    description: "Sube y administra tus voces clonadas personalizadas.",
    type: "website",
  },
};

export default function VoicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}


