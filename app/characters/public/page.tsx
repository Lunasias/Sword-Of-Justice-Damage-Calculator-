"use client";

import React, { useState, useEffect } from "react";
import { CharacterCard, CharacterCardData } from "@/components/character/CharacterCard";
import { LoadingState, EmptyState, ErrorState } from "@/components/ui/States";
import { Search, Globe, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

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
    <div className="max-w-content mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-8">
      {/* Header */}
      <div>
        <span className="text-xs font-mono text-periwinkle uppercase tracking-wider block mb-1">
          คลังข้อมูลชุมชน
        </span>
        <h1 className="font-display text-3xl sm:text-4xl text-pure font-light">
          ตัวละครสาธารณะ
        </h1>
        <p className="text-xs sm:text-sm font-ui text-ash mt-1">
          สำรวจบิลด์ตัวละครที่เผยแพร่โดยผู้เล่นอื่น นำไปใช้คำนวณ หรือคัดลอกมาปรับแต่งต่อ
        </p>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-card bg-graphite/20 border border-steel/40 flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ค้นหาชื่อตัวละคร คำอธิบาย หรือผู้สร้าง..."
            className="w-full h-10 pl-10 pr-4 rounded-input bg-abyss/80 text-pure text-xs font-ui border border-steel/60 focus:border-iris focus:outline-none"
          />
          <Search size={16} className="absolute left-3.5 top-3 text-fog" />
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-fog">
          <Globe size={14} className="text-periwinkle" />
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {characters.map((char) => (
            <CharacterCard key={char.id} character={char} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-6">
          <Button
            size="sm"
            variant="secondary"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            <ChevronLeft size={14} className="mr-1" /> ก่อนหน้า
          </Button>
          <span className="text-xs font-mono text-ash">
            หน้า {page} จาก {totalPages}
          </span>
          <Button
            size="sm"
            variant="secondary"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            ถัดไป <ChevronRight size={14} className="ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}
