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
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

function MenuItem({ item, scrolled, isMobile, onMenuClick }) {
  const hasChildren = item.children && item.children.length > 0;

  return (
    <NavigationMenuItem>
      {hasChildren ? (
        <>
          <NavigationMenuTrigger
            className={`${scrolled ? "text-gray-900" : "text-white"}`}
          >
            {item.name}
          </NavigationMenuTrigger>
          <NavigationMenuContent className="bg-white shadow-lg rounded-md p-2 border min-w-[200px]">
            <ul className="grid gap-1">
              {item.children.map((child) => (
                <li key={child.id}>
                  <Link
                    href={child.url || child.href || "#"}
                    className="block px-4 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100 transition-colors"
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
            className={`transition-colors duration-200 px-4 py-2 rounded-md ${scrolled ? "text-gray-900" : "text-white"
              }`}
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
      setScrolled(currentScrollY > 10);

      if (currentScrollY > 100) {
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
          setShowNavbar(false);
        } else if (currentScrollY < lastScrollY) {
          setShowNavbar(true);
        }
      } else {
        setShowNavbar(true);
      }
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

  return (
    <>
      <header
        className={`fixed w-full transition-all duration-300 ease-in-out ${scrolled
            ? "bg-white/95 backdrop-blur-sm shadow-lg"
            : "bg-transparent"
          } ${showNavbar ? "translate-y-0" : "-translate-y-full"} z-50`}
      >
        <div
          className={`max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 transition-all duration-300 ${scrolled ? "h-16" : "h-20"
            }`}
        >
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/logo1.png"
              alt="Logo"
              width={scrolled ? 80 : 100}
              height={scrolled ? 40 : 50}
              priority
              className="transition-all duration-300 w-auto h-auto max-h-14"
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
            className={`md:hidden p-2 rounded-md transition-colors ${scrolled
                ? "text-gray-700 hover:bg-gray-100"
                : "text-white hover:bg-white/20"
              }`}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${mobileMenuOpen
              ? "max-h-screen opacity-100"
              : "max-h-0 opacity-0 overflow-hidden"
            } bg-white shadow-lg border-t border-gray-200`}
        >
          <div className="px-4 py-4 space-y-2">
            {menuData.map((item) => (
              <div key={item.id}>
                {item.children && item.children.length > 0 ? (
                  <div>
                    <div className="font-medium text-gray-900 py-2 px-4 bg-gray-50 rounded-md">
                      {item.name}
                    </div>
                    <div className="ml-4 mt-2 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.id}
                          href={child.url || child.href || "#"}
                          className="block py-2 px-4 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                          onClick={closeMobileMenu}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    href={item.url || item.href || "#"}
                    className="block py-3 px-4 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                    onClick={closeMobileMenu}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={closeMobileMenu}
        />
      )}
    </>
  );
}
