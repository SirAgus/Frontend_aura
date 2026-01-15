import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Síntesis de Voz",
  description: "Genera audio hiper-realista con voces personalizadas usando inteligencia artificial avanzada.",
  keywords: [
    "generar voz",
    "síntesis de voz",
    "voz personalizada",
    "audio IA",
    "voz sintética",
    "text to speech",
    "TTS",
    "voz neuronal"
  ],
  openGraph: {
    title: "Síntesis de Voz | AURA_VOICE",
    description: "Genera audio hiper-realista con voces personalizadas.",
    type: "website",
  },
};

export default function SynthesisLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}


