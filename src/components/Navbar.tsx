"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation"; // Import usePathname
import {
  Briefcase,
  Home,
  Star,
  User,
  Zap,
  CheckSquare,
  Menu,
  X,
} from "lucide-react";

// Improved with active state detection
export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  // Remove useState and useEffect for activePath
  // const [activePath, setActivePath] = useState<string>("");
  const pathname = usePathname(); // Get the current pathname reactively

  // Update active path on client side - REMOVED
  // useEffect(() => {
  //   setActivePath(window.location.pathname);
  // }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (isMenuOpen) setIsMenuOpen(false);
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isMenuOpen]);

  const navItems = [
    { href: "/", icon: <Home size={18} />, text: "Home" },
    { href: "/jobs/top-matches", icon: <Star size={18} />, text: "Matches" },
    { href: "/jobs/new", icon: <Zap size={18} />, text: "New" },
    { href: "/jobs/applied", icon: <CheckSquare size={18} />, text: "Applied" },
    { href: "/profile", icon: <User size={18} />, text: "Profile" },
  ];

  return (
    <header className="bg-white border-b border-gray-100 flex-shrink-0">
      <div className="container mx-auto px-4">
        <nav className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            <Briefcase className="h-5 w-5" />
            <span className="text-lg">JobTrack</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <NavItem
                key={item.href}
                href={item.href}
                icon={item.icon}
                text={item.text}
                isActive={pathname === item.href} // Use pathname directly
              />
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen(!isMenuOpen);
            }}
            className="md:hidden focus:outline-none"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-5 w-5 text-gray-600" />
            ) : (
              <Menu className="h-5 w-5 text-gray-600" />
            )}
          </button>
        </nav>
      </div>

      {/* Mobile Navigation Dropdown - Improved animation */}
      <div
        className={`md:hidden fixed inset-x-0 top-16 bg-white border-b border-gray-100 shadow-lg transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="container mx-auto px-4 py-2">
          {navItems.map((item) => (
            <MobileNavItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              text={item.text}
              isActive={pathname === item.href} // Use pathname directly
              onClick={() => setIsMenuOpen(false)}
            />
          ))}
        </div>
      </div>
    </header>
  );
}

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  text: string;
  isActive?: boolean;
  onClick?: () => void;
}

// Desktop Navigation Item
function NavItem({ href, icon, text, isActive }: NavItemProps) {
  return (
    <Link
      href={href}
      className={`px-3 py-2 rounded-md flex items-center text-sm font-medium transition-colors relative ${
        isActive ? "text-indigo-600" : "text-gray-500 hover:text-gray-800"
      }`}
    >
      <span className="mr-1.5">{icon}</span>
      <span>{text}</span>
      {isActive && (
        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-full" />
      )}
    </Link>
  );
}

// Mobile Navigation Item
function MobileNavItem({ href, icon, text, isActive, onClick }: NavItemProps) {
  return (
    <Link
      href={href}
      className={`py-4 px-2 flex items-center border-b border-gray-50 ${
        isActive
          ? "text-indigo-600 font-medium"
          : "text-gray-600 hover:text-gray-800"
      }`}
      onClick={onClick}
    >
      <span className="mr-3">{icon}</span>
      <span>{text}</span>
    </Link>
  );
}
