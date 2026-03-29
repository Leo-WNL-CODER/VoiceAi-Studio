import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "VoiceAI Studio",
    short_name: "VoiceAI",
    description: "AI Text-to-Speech Generator with Voice Cloning",
    start_url: "/",
    display: "standalone",
    background_color: "#2a2a2e",
    theme_color: "#6366f1",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
