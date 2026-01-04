import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Configuración API",
  description: "Configura tu API key y ajustes de integración para AURA_VOICE.",
  keywords: [
    "configuración API",
    "API key",
    "integración",
    "ajustes",
    "configuración"
  ],
  openGraph: {
    title: "Configuración API | AURA_VOICE",
    description: "Configura tu API key y ajustes de integración.",
    type: "website",
  },
};

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
