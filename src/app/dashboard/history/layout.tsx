import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Historial de Generaciones",
  description: "Revisa y descarga todas tus generaciones de audio anteriores.",
  keywords: [
    "historial de audio",
    "generaciones anteriores",
    "descargar audio",
    "historial de voz",
    "archivos generados"
  ],
  openGraph: {
    title: "Historial de Generaciones | AURA_VOICE",
    description: "Revisa y descarga tu historial completo de audio generado.",
    type: "website",
  },
};

export default function HistoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}


