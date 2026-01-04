import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Panel de control de AURA_VOICE. Gestiona tus voces, genera audio y revisa tu historial.",
  keywords: [
    "dashboard",
    "panel de control",
    "gestionar voces",
    "historial de audio",
    "AURA VOICE dashboard"
  ],
  openGraph: {
    title: "Dashboard | AURA_VOICE",
    description: "Panel de control completo para gestión de voces y síntesis de audio.",
    type: "website",
  },
  robots: {
    index: false, // No indexar dashboard
    follow: false,
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
