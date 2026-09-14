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
    <header className="sticky top-0 z-40 w-full bg-neu-base shadow-neu-sm">
      <div className="mx-auto flex h-16 max-w-content items-center justify-between px-4 sm:px-6">
        {/* Logo — the mark sits in a carved well, the wordmark stays flat text */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="flex items-center gap-2.5 rounded-2xl font-ui text-sm font-bold tracking-tight text-neu-fg transition-opacity duration-300 hover:opacity-80 focus-neu"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-neu-base text-neu-accent shadow-neu-inset-deep">
              <Calculator size={18} />
            </span>
            <span>
              Sword<span className="text-neu-accent"> of Justice</span>
            </span>
          </Link>

          {/* Desktop navigation — the active route is pressed *into* the bar */}
          <nav className="hidden items-center gap-2 md:flex" aria-label="เมนูหลัก">
            {navLinks.map((link) => {
              if (link.protected && !user) return null;
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-2xl px-3.5 py-2 text-xs font-ui transition-all duration-300 ease-out focus-neu ${
                    active
                      ? "bg-neu-base font-semibold text-neu-accent shadow-neu-inset-sm"
                      : "text-neu-muted hover:text-neu-fg hover:shadow-neu-sm"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right CTA & auth area */}
        <div className="hidden items-center gap-3 md:flex">
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
                aria-expanded={profileDropdownOpen}
                aria-haspopup="menu"
                className="flex items-center gap-2 rounded-2xl bg-neu-base px-3 py-2 text-xs font-ui text-neu-fg shadow-neu-extruded transition-all duration-300 ease-out hover:shadow-neu-lifted focus-neu"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-neu-base text-[10px] font-semibold text-neu-accent shadow-neu-inset-sm">
                  {user.username.substring(0, 1).toUpperCase()}
                </span>
                <span>{user.username}</span>
                {user.role === "ADMIN" && (
                  <span className="rounded-full bg-neu-accent px-2 py-0.5 text-[9px] font-medium text-white">
                    แอดมิน
                  </span>
                )}
              </button>

              {profileDropdownOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-3 w-52 animate-fade-in rounded-card bg-neu-base py-2 text-xs font-ui shadow-neu-lifted"
                  onMouseLeave={() => setProfileDropdownOpen(false)}
                >
                  <Link
                    href="/dashboard"
                    role="menuitem"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-neu-muted transition-colors duration-300 hover:text-neu-fg focus-neu"
                  >
                    <LayoutDashboard size={14} />
                    แดชบอร์ด
                  </Link>
                  <Link
                    href="/profile"
                    role="menuitem"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-neu-muted transition-colors duration-300 hover:text-neu-fg focus-neu"
                  >
                    <User size={14} />
                    โปรไฟล์
                  </Link>
                  {user.role === "ADMIN" && (
                    <Link
                      href="/admin"
                      role="menuitem"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-neu-accent transition-colors duration-300 focus-neu"
                    >
                      <Shield size={14} />
                      จัดการระบบแอดมิน
                    </Link>
                  )}

                  <div className="my-2 h-px bg-neu-shadow-dark/40 shadow-[0_1px_0_rgb(255_255_255/0.5)]" />

                  <button
                    role="menuitem"
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      logout();
                    }}
                    className="flex w-full items-center gap-2 rounded-xl px-4 py-2.5 text-left text-neu-danger transition-colors duration-300 focus-neu"
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

        {/* Mobile menu toggle — 44px touch target */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-neu-base text-neu-fg shadow-neu-extruded transition-all duration-300 ease-out active:translate-y-0.5 active:shadow-neu-inset-sm focus-neu"
            aria-label={mobileMenuOpen ? "ปิดเมนูหลัก" : "เปิดเมนูหลัก"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer — slides down from the bar with its own extrusion */}
      <div
        className={`overflow-hidden bg-neu-base transition-all duration-300 ease-out md:hidden ${
          mobileMenuOpen ? "max-h-[36rem] shadow-neu-lifted" : "max-h-0"
        }`}
      >
        <div className="flex flex-col gap-2 p-4">
          {navLinks.map((link) => {
            if (link.protected && !user) return null;
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                onClick={() => setMobileMenuOpen(false)}
                className={`rounded-2xl px-4 py-3 text-sm font-ui transition-all duration-300 ease-out focus-neu ${
                  active
                    ? "bg-neu-base font-semibold text-neu-accent shadow-neu-inset-sm"
                    : "text-neu-muted shadow-neu-sm"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          <div className="my-2 h-px bg-neu-shadow-dark/40 shadow-[0_1px_0_rgb(255_255_255/0.5)]" />

          {user ? (
            <div className="flex flex-col gap-2">
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-ui text-neu-muted shadow-neu-sm focus-neu"
              >
                <LayoutDashboard size={16} />
                แดชบอร์ด
              </Link>
              <Link
                href="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-ui text-neu-muted shadow-neu-sm focus-neu"
              >
                <User size={16} />
                โปรไฟล์ ({user.username})
              </Link>
              {user.role === "ADMIN" && (
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-ui text-neu-accent shadow-neu-sm focus-neu"
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
                className="flex items-center gap-2 rounded-2xl px-4 py-3 text-left text-sm font-ui text-neu-danger shadow-neu-sm focus-neu"
              >
                <LogOut size={16} />
                ออกจากระบบ
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3 pt-2">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full" variant="secondary" size="md">
                  เข้าสู่ระบบ
                </Button>
              </Link>
              <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full" variant="primary" size="md">
                  สมัครสมาชิก
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
