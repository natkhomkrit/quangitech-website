"use client";

import * as React from "react";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { Menu, X, ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

function MenuItem({ item, scrolled, isMobile, onMenuClick }) {
  const hasChildren = item.children && item.children.length > 0;

  return (
    <NavigationMenuItem>
      {hasChildren ? (
        <>
          <NavigationMenuTrigger
            className={`text-gray-200 hover:text-white font-medium transition-colors`}
          >
            {item.name}
          </NavigationMenuTrigger>
          <NavigationMenuContent className="bg-gray-900 shadow-lg rounded-md p-2 border min-w-[200px]">
            <ul className="grid gap-1">
              {item.children.map((child) => (
                <li key={child.id}>
                  <Link
                    href={child.url || child.href || "#"}
                    className="block px-4 py-2 rounded-md text-sm text-gray-900 hover:bg-gray-700 hover:text-white transition-colors"
                    onClick={isMobile ? onMenuClick : undefined}
                  >
                    {child.name}
                  </Link>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </>
      ) : (
        <NavigationMenuLink asChild>
          <Link
            href={item.url || item.href || "#"}
            className={`transition-colors duration-200 px-4 py-2 rounded-md text-white hover:text-gray-400 font-medium`}
            onClick={isMobile ? onMenuClick : undefined}
          >
            {item.name}
          </Link>
        </NavigationMenuLink>
      )}
    </NavigationMenuItem>
  );
}

export default function Navbar() {
  const [menuData, setMenuData] = React.useState([]);
  const [scrolled, setScrolled] = React.useState(false);
  const [showNavbar, setShowNavbar] = React.useState(true);
  const [lastScrollY, setLastScrollY] = React.useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [logoUrl, setLogoUrl] = React.useState("/logo1.png");
  const [themeColor, setThemeColor] = React.useState("");
  const [expandedItems, setExpandedItems] = React.useState([]);

  React.useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/settings");
        const data = await res.json();
        if (data) {
          if (data.logoUrl) setLogoUrl(data.logoUrl);
          if (data.themeColor) setThemeColor(data.themeColor);
        }
      } catch (err) {
        console.error("Failed to fetch settings", err);
      }
    };
    fetchSettings();
  }, []);

  React.useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch("/api/menus?name=Navigation Bar");
        const data = await res.json();
        setMenuData(data[0]?.items || []);
      } catch (err) {
        console.error("Failed to fetch menu", err);
        setMenuData([
          { id: 1, name: "หน้าแรก", url: "/" },
          {
            id: 2,
            name: "บริการ",
            children: [
              { id: 21, name: "บริการ A", url: "/service-a" },
              { id: 22, name: "บริการ B", url: "/service-b" },
            ],
          },
          { id: 3, name: "เกี่ยวกับเรา", url: "/about" },
          { id: 4, name: "ติดต่อ", url: "/contact" },
        ]);
      }
    };
    fetchMenu();
  }, []);

  React.useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }

      setScrolled(currentScrollY > 10);
      setLastScrollY(currentScrollY);
    };

    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", throttledScroll);
    return () => window.removeEventListener("scroll", throttledScroll);
  }, [lastScrollY]);

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const toggleExpanded = (id) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <>
      <header
        className={`fixed top-2 md:top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl transition-all duration-300 ease-in-out 
    bg-gray-900 backdrop-blur-md shadow-2xl border border-gray-700
    ${showNavbar ? "translate-y-0 opacity-100" : "-translate-y-[200%] opacity-0"} 
    z-50 rounded-full`}
        style={{ backgroundColor: themeColor || "#111827" }}
      >
        <div
          className={`max-w-6xl mx-auto flex justify-between items-center px-4 sm:px-6 transition-all duration-300 ${scrolled ? "h-14 md:h-16" : "h-14 md:h-16"
            }`}
        >
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src={logoUrl}
              alt="Logo"
              width={scrolled ? 80 : 100}
              height={scrolled ? 40 : 50}
              priority
              className="transition-all duration-300 w-auto h-auto max-h-8 md:max-h-14"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <NavigationMenu viewport={false}>
              <NavigationMenuList className="space-x-4">
                {menuData.map((item) => (
                  <MenuItem key={item.id} item={item} scrolled={scrolled} />
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className={`md:hidden p-2 rounded-md transition-colors text-white hover:bg-gray-100 hover:text-gray-900`}
            aria-label="Toggle mobile menu"
          >
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      <div
        className={`fixed inset-0 z-[60] bg-white transition-transform duration-300 ease-in-out md:hidden ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Header */}
          <div className="flex justify-between items-center px-6 py-4 border-b">
            <Link href="/" onClick={closeMobileMenu}>
              <Image
                src={logoUrl}
                alt="Logo"
                width={100}
                height={50}
                className="w-auto h-8"
              />
            </Link>
            <button
              onClick={closeMobileMenu}
              className="p-2 rounded-md text-gray-500 hover:bg-gray-100"
            >
              <X size={24} />
            </button>
          </div>

          {/* Mobile Menu Items */}
          <div className="flex-1 overflow-y-auto py-4 px-6 space-y-2">
            {menuData.map((item) => (
              <div key={item.id} className="border-b border-gray-100 last:border-0">
                {item.children && item.children.length > 0 ? (
                  <div>
                    <button
                      onClick={() => toggleExpanded(item.id)}
                      className="flex items-center justify-between w-full py-3 text-lg font-medium text-gray-900"
                    >
                      {item.name}
                      {expandedItems.includes(item.id) ? (
                        <ChevronUp size={20} className="text-gray-500" />
                      ) : (
                        <ChevronDown size={20} className="text-gray-500" />
                      )}
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-300 ${expandedItems.includes(item.id) ? "max-h-96 opacity-100 mb-2" : "max-h-0 opacity-0"
                        }`}
                    >
                      <div className="pl-4 space-y-2 bg-gray-50 rounded-md py-2">
                        {item.children.map((child) => (
                          <Link
                            key={child.id}
                            href={child.url || child.href || "#"}
                            className="block py-2 px-4 text-gray-600 hover:text-blue-600 rounded-md transition-colors"
                            onClick={closeMobileMenu}
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    href={item.url || item.href || "#"}
                    className="block py-3 text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors"
                    onClick={closeMobileMenu}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Backdrop (optional, if we want to dim the background when menu slides in partially, but here it is full screen) */}
      {/* We don't need a backdrop if it's full screen opaque */}
    </>
  );
}
