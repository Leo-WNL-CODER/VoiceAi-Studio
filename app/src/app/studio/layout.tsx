import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Studio - Generate Speech",
  description:
    "Generate professional voiceovers with AI. Choose from 21 voices, clone your own, speak in 14 languages. Download as MP3.",
};

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
