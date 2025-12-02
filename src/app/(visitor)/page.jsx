"use client";

import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Footer from "@/components/ui/footer";
import { Loader2 } from "lucide-react";

// Modern Components
import HeroSectionModern from "@/components/sections/HeroSectionModern";
import ServicesSectionInteractive from "@/components/sections/ServicesSectionInteractive";
import RecentWorksSectionModern from "@/components/sections/RecentWorksSectionModern";

// Legacy Components (kept for other sections)
import TechnologiesSection from "@/components/sections/TechnologiesSection";
import AboutSection from "@/components/sections/AboutSection";
import NewsEventsSection from "@/components/sections/NewsEventsSection";
import WhyChooseUsSection from "@/components/sections/WhyChooseUsSection";
import CallToActionSection from "@/components/sections/CallToActionSection";
import ClientsSection from "@/components/sections/ClientsSection";

export default function Page() {
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [themeColor, setThemeColor] = useState("");

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });

    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/settings");
        const data = await res.json();
        if (data && data.themeColor) setThemeColor(data.themeColor);
      } catch (err) {
        console.error("Failed to fetch settings", err);
      }
    };
    fetchSettings();

    const fetchPage = async () => {
      try {
        const res = await fetch("/api/pages/home");
        if (res.ok) {
          const data = await res.json();
          setPage(data);
        }
      } catch (error) {
        console.error("Error fetching page:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPage();
  }, []);

  const renderSection = (section) => {
    const { type, content, id } = section;
    switch (type) {
      case "hero":
        // Use Modern Hero
        return <HeroSectionModern key={id} content={content} themeColor={themeColor} />;
      // case "technologies":
      //   return <TechnologiesSection key={id} content={content} themeColor={themeColor} />;
      case "about":
        return <AboutSection key={id} content={content} />;
      case "services":
        // Use Interactive Services
        return <ServicesSectionInteractive key={id} content={content} />;
      case "recent-works":
        // Use Modern Recent Works
        return <RecentWorksSectionModern key={id} content={content} themeColor={themeColor} />;
      case "news-events":
        return <NewsEventsSection key={id} content={content} />;
      case "why-choose-us":
        return <WhyChooseUsSection key={id} content={content} />;
      case "call-to-action":
        return <CallToActionSection key={id} content={content} />;
      case "clients":
        return <ClientsSection key={id} content={content} />;
      default:
        return null;
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="animate-spin text-gray-500" size={48} />
    </div>
  );

  return (
    <div>
      {page ? (
        page.sections.map((section) => renderSection(section))
      ) : (
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold">Welcome to Quangitech</h1>
          <p>Please seed the home page content in the backoffice.</p>
        </div>
      )}
      <Footer />
    </div>
  );
}
