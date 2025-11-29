import { Geist, Geist_Mono, Inter, Kanit } from "next/font/google";

import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Suspense } from "react";
import Loading from "../components/loading";
import BackToTop from "@/components/ui/BackToTop";
import prisma from "@/lib/prisma";
import Providers from "@/components/providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const kanit = Kanit({
  subsets: ["latin", "latin-ext", "thai"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-kanit",
});

export async function generateMetadata() {
  try {
    const settings = await prisma.siteSettings.findFirst();
    if (!settings) return {
      title: "Quangitech",
      description: "Quangitech Website",
      icons: {
        icon: "/logo.svg",
      },
    };

    const iconUrl = settings.logoUrl || "/logo.svg";

    return {
      title: settings.siteName || "Quangitech",
      description: settings.description || "Quangitech Website",
      keywords: settings.seoKeywords ? settings.seoKeywords.split(",").map(k => k.trim()) : [],
      icons: {
        icon: iconUrl,
        shortcut: iconUrl,
        apple: iconUrl,
      },
    };
  } catch (error) {
    console.error("Failed to load settings for metadata:", error);
    return {
      title: "Quangitech",
      description: "Quangitech Website",
      icons: {
        icon: "/logo.svg",
        shortcut: "/logo.svg",
        apple: "/logo.svg",
      },
    };
  }
}

export default async function RootLayout({ children }) {
  let themeStyle = {};
  try {
    const settings = await prisma.siteSettings.findFirst();
    if (settings?.themeColor) {
      themeStyle = {
        "--primary": settings.themeColor,
        "--sidebar-primary": settings.themeColor,
        "--sidebar": settings.themeColor,
      };
    }
  } catch (error) {
    console.error("Failed to load theme settings:", error);
  }

  return (
    <html lang="en">
      <body className={`${kanit.variable} antialiased`} style={themeStyle}>
        <Providers>
          <Toaster position="top-right" richColors />
          {children}
          <BackToTop />
        </Providers>
      </body>
    </html>
  );
}
