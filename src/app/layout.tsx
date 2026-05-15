import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "VeriHire AI | Real-Time Recruitment Threat Intelligence",
    template: "%s | VeriHire AI",
  },
  description: "Enterprise-grade AI SaaS platform that detects fake jobs, scam recruiters, phishing hiring campaigns, and fraudulent offer letters in real time.",
  keywords: ["AI Scam Detection", "Fake Job Detector", "Recruitment Fraud", "Cybersecurity", "Threat Intelligence", "Phishing"],
  authors: [{ name: "VeriHire Intelligence Systems" }],
  creator: "VeriHire AI",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://verihire.ai",
    title: "VeriHire AI - Detect Fake Jobs Before They Scam You",
    description: "AI-powered recruitment threat intelligence platform. Neural NLP analysis of job descriptions, scam DNA mapping, and recruiter reputation scoring.",
    siteName: "VeriHire AI",
    images: [
      {
        url: "https://verihire.ai/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "VeriHire AI Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VeriHire AI | Real-Time Recruitment Threat Intelligence",
    description: "Detect fake jobs, phishing campaigns, and scam recruiters with our neural engine.",
    images: ["https://verihire.ai/og-image.jpg"],
    creator: "@verihireai",
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
};

import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className="antialiased bg-black text-white selection:bg-indigo-500/30 selection:text-indigo-200"
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
