"use client";

import React, { useState, useEffect } from "react";
import { CharacterCard, CharacterCardData } from "@/components/character/CharacterCard";
import { LoadingState, EmptyState, ErrorState } from "@/components/ui/States";
import { Search, Globe, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";

export default function PublicCharactersPage() {
  const [characters, setCharacters] = useState<CharacterCardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  const fetchPublicCharacters = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "12",
        search: debouncedSearch,
      });
      const res = await fetch(`/api/characters/public?${params.toString()}`);
      if (!res.ok) {
        throw new Error("ไม่สามารถโหลดตัวละครสาธารณะได้");
      }
      const data = await res.json();
      setCharacters(data.characters || []);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (err: any) {
      setError(err.message || "เกิดข้อผิดพลาดในการโหลดข้อมูล");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPublicCharacters();
  }, [page, debouncedSearch]);

  return (
    <div className="mx-auto max-w-content space-y-10 px-4 py-8 sm:px-6 md:py-12">
      <PageHeader
        eyebrow="คลังข้อมูลชุมชน"
        title="ตัวละครสาธารณะ"
        description="สำรวจบิลด์ตัวละครที่เผยแพร่โดยผู้เล่นอื่น นำไปใช้คำนวณ หรือคัดลอกมาปรับแต่งต่อ"
      />

      {/* Search Bar — carved tray with a floating input. */}
      <div className="flex items-center justify-between gap-4 rounded-card bg-neu-base p-5 shadow-neu-inset">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ค้นหาชื่อตัวละคร คำอธิบาย หรือผู้สร้าง..."
            aria-label="ค้นหาตัวละครสาธารณะ"
            className="h-12 w-full rounded-2xl bg-neu-base pl-12 pr-4 font-ui text-xs text-neu-fg shadow-neu-inset-deep transition-all duration-300 placeholder:text-neu-placeholder focus-neu-inset"
          />
          <Search
            size={16}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neu-muted"
          />
        </div>
        <div className="hidden shrink-0 items-center gap-2 text-xs font-ui text-neu-muted sm:flex">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-neu-base text-neu-accent-light shadow-neu-inset-deep">
            <Globe size={15} />
          </span>
          <span>ข้อมูลเปิดเผยสาธารณะ</span>
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <LoadingState message="กำลังค้นหาตัวละครสาธารณะ..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchPublicCharacters} />
      ) : characters.length === 0 ? (
        <EmptyState
          title="ไม่พบตัวละครสาธารณะ"
          description={
            debouncedSearch
              ? `ไม่พบบิลด์ที่ตรงกับคำค้นหา "${debouncedSearch}"`
              : "ยังไม่มีผู้เล่นแชร์ตัวละครสู่สาธารณะ เป็นคนแรกที่แชร์บิลด์ของคุณ!"
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
          {characters.map((char) => (
            <CharacterCard key={char.id} character={char} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-6">
          <Button
            size="sm"
            variant="secondary"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            <ChevronLeft size={14} /> ก่อนหน้า
          </Button>
          <span className="rounded-full bg-neu-base px-4 py-2 font-numeric text-xs text-neu-muted shadow-neu-inset-sm">
            หน้า {page} จาก {totalPages}
          </span>
          <Button
            size="sm"
            variant="secondary"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            ถัดไป <ChevronRight size={14} />
          </Button>
        </div>
      )}
    </div>
  );
}
