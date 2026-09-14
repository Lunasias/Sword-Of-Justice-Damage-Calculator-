"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { Button } from "@/components/ui/Button";
import { Calculator, User, Menu, X, Shield, LayoutDashboard, LogOut } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const navLinks = [
    { label: "เครื่องคำนวณ", href: "/calculator" },
    { label: "ตัวละคร", href: "/characters", protected: true },
    { label: "ตัวละครสาธารณะ", href: "/characters/public" },
    { label: "คู่มือ", href: "/guide" },
  ];

  const isActive = (path: string) => {
    if (path === "/calculator" && pathname === "/calculator") return true;
    if (path !== "/calculator" && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-steel/40 bg-obsidian/85 backdrop-blur-md transition-all">
      <div className="max-w-content mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-pure font-display text-lg tracking-tight hover:opacity-90 transition-opacity"
          >
            <div className="w-8 h-8 rounded-nav bg-graphite border border-steel flex items-center justify-center text-iris">
              <Calculator size={18} />
            </div>
            <span className="font-light">
              逆水寒<span className="text-iris font-normal">ดาเมจ</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              if (link.protected && !user) return null;
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 text-xs font-ui rounded-nav transition-all duration-150 ${
                    active
                      ? "text-pure bg-graphite border border-steel/60 font-medium"
                      : "text-ash hover:text-cloud hover:bg-graphite/40"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right CTA & Auth Area */}
        <div className="hidden md:flex items-center gap-3">
          {pathname !== "/calculator" && (
            <Link href="/calculator">
              <Button size="sm" variant="primary">
                เริ่มคำนวณ →
              </Button>
            </Link>
          )}

          {user ? (
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-nav bg-graphite/50 border border-steel/50 text-xs font-ui text-cloud hover:border-steel transition-all"
              >
                <div className="w-5 h-5 rounded-full bg-iris/20 text-iris flex items-center justify-center text-[10px] font-mono">
                  {user.username.substring(0, 1).toUpperCase()}
                </div>
                <span>{user.username}</span>
                {user.role === "ADMIN" && (
                  <span className="px-1.5 py-0.2 text-[9px] font-mono bg-iris/20 text-iris rounded-full border border-iris/30">
                    แอดมิน
                  </span>
                )}
              </button>

              {profileDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 rounded-card bg-abyss border border-steel/80 shadow-2xl py-1.5 z-50 text-xs font-ui"
                  onMouseLeave={() => setProfileDropdownOpen(false)}
                >
                  <Link
                    href="/dashboard"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-cloud hover:bg-graphite/60 hover:text-pure transition-colors"
                  >
                    <LayoutDashboard size={14} />
                    แดชบอร์ด
                  </Link>
                  <Link
                    href="/profile"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-cloud hover:bg-graphite/60 hover:text-pure transition-colors"
                  >
                    <User size={14} />
                    โปรไฟล์
                  </Link>
                  {user.role === "ADMIN" && (
                    <Link
                      href="/admin"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-iris hover:bg-graphite/60 transition-colors"
                    >
                      <Shield size={14} />
                      จัดการระบบแอดมิน
                    </Link>
                  )}
                  <div className="my-1 border-t border-steel/30" />
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      logout();
                    }}
                    className="w-full text-left flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-graphite/60 hover:text-red-300 transition-colors"
                  >
                    <LogOut size={14} />
                    ออกจากระบบ
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button size="sm" variant="ghost">
                  เข้าสู่ระบบ
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" variant="secondary">
                  สมัครสมาชิก
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="p-2 text-ash hover:text-pure rounded-nav bg-graphite/40 border border-steel/40"
            aria-label="เมนูหลัก"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-steel/40 bg-abyss p-4 flex flex-col gap-2">
          {navLinks.map((link) => {
            if (link.protected && !user) return null;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 text-sm font-ui rounded-nav transition-colors ${
                  isActive(link.href)
                    ? "bg-graphite text-pure font-medium"
                    : "text-cloud hover:bg-graphite/50"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          <div className="my-2 border-t border-steel/30" />

          {user ? (
            <div className="flex flex-col gap-1.5">
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm font-ui rounded-nav text-cloud hover:bg-graphite/50 flex items-center gap-2"
              >
                <LayoutDashboard size={16} />
                แดชบอร์ด
              </Link>
              <Link
                href="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm font-ui rounded-nav text-cloud hover:bg-graphite/50 flex items-center gap-2"
              >
                <User size={16} />
                โปรไฟล์ ({user.username})
              </Link>
              {user.role === "ADMIN" && (
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-sm font-ui rounded-nav text-iris hover:bg-graphite/50 flex items-center gap-2"
                >
                  <Shield size={16} />
                  จัดการระบบแอดมิน
                </Link>
              )}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="text-left px-3 py-2 text-sm font-ui rounded-nav text-red-400 hover:bg-graphite/50 flex items-center gap-2"
              >
                <LogOut size={16} />
                ออกจากระบบ
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2 pt-2">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full" variant="secondary" size="sm">
                  เข้าสู่ระบบ
                </Button>
              </Link>
              <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full" variant="primary" size="sm">
                  สมัครสมาชิก
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
