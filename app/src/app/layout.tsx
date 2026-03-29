import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://voice-ai-studio-five.vercel.app";

export const metadata: Metadata = {
  title: {
    default: "VoiceAI Studio - AI Text to Speech Generator & Voice Cloning",
    template: "%s | VoiceAI Studio",
  },
  description:
    "Generate professional voiceovers with 21 AI voices, clone your own voice in 30 seconds, speak in 14 languages, and download as MP3. Free to try.",
  keywords: [
    "text to speech",
    "AI voice generator",
    "voice cloning",
    "text to speech online",
    "AI voiceover",
    "TTS",
    "voice clone AI",
    "hindi text to speech",
    "free text to speech",
    "AI narration",
    "youtube voiceover",
    "podcast voice generator",
    "audiobook generator",
    "multilingual TTS",
    "ElevenLabs alternative",
  ],
  authors: [{ name: "VoiceAI Studio" }],
  creator: "VoiceAI Studio",
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "VoiceAI Studio",
    title: "VoiceAI Studio - AI Text to Speech Generator & Voice Cloning",
    description:
      "Generate professional voiceovers with 21 AI voices, clone your own voice, speak in 14 languages. Download as MP3. Free to try.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "VoiceAI Studio - AI Text to Speech Generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VoiceAI Studio - AI Text to Speech & Voice Cloning",
    description:
      "21 AI voices, voice cloning, 14 languages, MP3 download. Generate voiceovers in seconds.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
      >
        <body className="min-h-full flex flex-col">
          {children}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebApplication",
                name: "VoiceAI Studio",
                url: SITE_URL,
                description:
                  "AI-powered text-to-speech generator with 21 voices, voice cloning, and 14 languages.",
                applicationCategory: "MultimediaApplication",
                operatingSystem: "Web",
                offers: [
                  {
                    "@type": "Offer",
                    name: "Free",
                    price: "0",
                    priceCurrency: "USD",
                    description: "5 lifetime generations, 6 voices, English only",
                  },
                  {
                    "@type": "Offer",
                    name: "Pro",
                    price: "8",
                    priceCurrency: "USD",
                    description: "50 gen/day, 21 voices, 14 languages, voice cloning, MP3 download",
                  },
                  {
                    "@type": "Offer",
                    name: "Business",
                    price: "20",
                    priceCurrency: "USD",
                    description: "200 gen/day, 5 voice clones, 10K char scripts",
                  },
                ],
                featureList: [
                  "21 Premium AI Voices",
                  "Voice Cloning",
                  "14 Languages",
                  "MP3 Download",
                  "AI Script Rewrite",
                ],
              }),
            }}
          />
        </body>
      </html>
    </ClerkProvider>
  );
}
