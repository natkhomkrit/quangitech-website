import { Geist, Geist_Mono, Inter, Kanit } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Suspense } from "react";
import Loading from "../components/loading";
import BackToTop from "@/components/ui/BackToTop";
import prisma from "@/lib/prisma";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const kanit = Kanit({
  subsets: ["latin", "latin-ext", "thai"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-kanit",
});

export const metadata = {
  title: "Quangitech",
  description: "Quangitech Website",
  icons: {
    icon: "/logo.svg",
  },
};

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
        <Toaster position="top-right" richColors />
        {children}
        <BackToTop />
      </body>
    </html>
  );
}
