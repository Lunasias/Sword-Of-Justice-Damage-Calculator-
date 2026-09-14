"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";
import { CharacterCard, CharacterCardData } from "@/components/character/CharacterCard";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { InputField, SelectField } from "@/components/ui/InputField";
import { LoadingState, EmptyState, ErrorState } from "@/components/ui/States";
import { PageHeader } from "@/components/ui/PageHeader";
import { useToast } from "@/components/ui/Toast";
import { PlusCircle, Search, Filter } from "lucide-react";

export default function MyCharactersPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { showToast } = useToast();

  const [characters, setCharacters] = useState<CharacterCardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [visibilityFilter, setVisibilityFilter] = useState<"ALL" | "PUBLIC" | "PRIVATE">("ALL");

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState<CharacterCardData | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    visibility: "PRIVATE" as "PUBLIC" | "PRIVATE",
    attack: 0,
    elementalAttack: 0,
    schoolCounter: 0,
    armorPenetration: 0,
    shieldBreak: 0,
    hit: 0,
    crit: 0,
    critDamage: 150,
  });

  const fetchCharacters = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/characters");
      if (!res.ok) {
        throw new Error("ไม่สามารถโหลดตัวละครได้");
      }
      const data = await res.json();
      setCharacters(data.characters || []);
    } catch (err: any) {
      setError(err.message || "เกิดข้อผิดพลาดในการโหลดข้อมูล");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCharacters();
    } else if (!authLoading) {
      setIsLoading(false);
    }
  }, [user, authLoading]);

  const handleOpenCreate = () => {
    setFormData({
      name: "",
      description: "",
      visibility: "PRIVATE",
      attack: 8000,
      elementalAttack: 2000,
      schoolCounter: 700,
      armorPenetration: 3000,
      shieldBreak: 1400,
      hit: 1200,
      crit: 1600,
      critDamage: 180,
    });
    setCreateModalOpen(true);
  };

  const handleOpenEdit = (char: CharacterCardData) => {
    setEditingCharacter(char);
    setFormData({
      name: char.name,
      description: char.description || "",
      visibility: char.visibility,
      attack: char.attack,
      elementalAttack: char.elementalAttack,
      schoolCounter: char.schoolCounter,
      armorPenetration: char.armorPenetration,
      shieldBreak: char.shieldBreak,
      hit: char.hit,
      crit: char.crit,
      critDamage: char.critDamage,
    });
  };

  const handleSaveCharacter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast("กรุณาระบุชื่อตัวละคร", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const isEditing = Boolean(editingCharacter);
      const url = isEditing
        ? `/api/characters/${editingCharacter!.id}`
        : "/api/characters";
      const method = isEditing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "เกิดข้อผิดพลาดในการบันทึก");
      }

      showToast(
        isEditing ? "บันทึกการแก้ไขตัวละครสำเร็จ" : "สร้างตัวละครใหม่สำเร็จ",
        "success"
      );
      setCreateModalOpen(false);
      setEditingCharacter(null);
      fetchCharacters();
    } catch (err: any) {
      showToast(err.message || "เกิดข้อผิดพลาด", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/characters/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "เกิดข้อผิดพลาดในการลบ");
      }
      showToast("ลบตัวละครเรียบร้อยแล้ว", "success");
      setDeleteConfirmId(null);
      fetchCharacters();
    } catch (err: any) {
      showToast(err.message || "ไม่สามารถลบตัวละครได้", "error");
    }
  };

  // Auth gate
  if (authLoading) {
    return <LoadingState message="กำลังตรวจสอบสิทธิ์การเข้าใช้งาน..." />;
  }

  if (!user) {
    return (
      <div className="max-w-content mx-auto px-4 sm:px-6 py-20 text-center">
        <EmptyState
          title="จำเป็นต้องเข้าสู่ระบบ"
          description="กรุณาเข้าสู่ระบบเพื่อจัดการและบันทึกตัวละครของคุณ"
          actionLabel="เข้าสู่ระบบทันที"
          onAction={() => (window.location.href = "/login")}
        />
      </div>
    );
  }

  // Filtered characters
  const filtered = characters.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.description && c.description.toLowerCase().includes(search.toLowerCase()));
    const matchesVisibility =
      visibilityFilter === "ALL" || c.visibility === visibilityFilter;
    return matchesSearch && matchesVisibility;
  });

  return (
    <div className="mx-auto max-w-content space-y-10 px-4 py-8 sm:px-6 md:py-12">
      <PageHeader
        eyebrow="การจัดการบิลด์"
        title="ตัวละครของฉัน"
        description="จัดการบิลด์ตัวละครที่คุณบันทึกไว้สำหรับใช้คำนวณและแชร์"
        actions={
          <Button onClick={handleOpenCreate} variant="primary" size="md">
            <PlusCircle size={16} />
            สร้างตัวละครใหม่
          </Button>
        }
      />

      {/* Filters Bar — a carved tray holding floating controls. */}
      <div className="flex flex-col items-center justify-between gap-5 rounded-card bg-neu-base p-5 shadow-neu-inset sm:flex-row">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ค้นหาชื่อตัวละคร..."
            aria-label="ค้นหาชื่อตัวละคร"
            className="h-11 w-full rounded-2xl bg-neu-base pl-11 pr-4 font-ui text-xs text-neu-fg shadow-neu-inset-deep transition-all duration-300 placeholder:text-neu-placeholder focus-neu-inset"
          />
          <Search
            size={15}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neu-muted"
          />
        </div>

        <div className="flex w-full items-center gap-2 sm:w-auto">
          <span className="mr-1 flex items-center gap-1 text-xs font-ui text-neu-muted">
            <Filter size={12} /> สถานะ:
          </span>
          {(["ALL", "PRIVATE", "PUBLIC"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setVisibilityFilter(mode)}
              aria-pressed={visibilityFilter === mode}
              className={`rounded-full px-4 py-2 text-xs font-ui transition-all duration-300 ease-out focus-neu ${
                visibilityFilter === mode
                  ? "bg-neu-base font-semibold text-neu-accent shadow-neu-inset-sm"
                  : "text-neu-muted shadow-neu-sm hover:text-neu-fg"
              }`}
            >
              {mode === "ALL" ? "ทั้งหมด" : mode === "PRIVATE" ? "ส่วนตัว" : "สาธารณะ"}
            </button>
          ))}
        </div>
      </div>

      {/* Characters Grid */}
      {isLoading ? (
        <LoadingState message="กำลังโหลดตัวละครของคุณ..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchCharacters} />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="ไม่พบตัวละคร"
          description={
            characters.length === 0
              ? "คุณยังไม่มีบิลด์ตัวละครที่บันทึกไว้ เริ่มต้นด้วยการสร้างตัวละครแรกของคุณ"
              : "ไม่พบบิลด์ที่ตรงกับคำค้นหาหรือตัวกรองที่เลือก"
          }
          actionLabel={characters.length === 0 ? "สร้างตัวละครใหม่" : undefined}
          onAction={characters.length === 0 ? handleOpenCreate : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((char) => (
            <CharacterCard
              key={char.id}
              character={char}
              onEdit={handleOpenEdit}
              onDelete={(id) => setDeleteConfirmId(id)}
            />
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal
        isOpen={createModalOpen || Boolean(editingCharacter)}
        onClose={() => {
          setCreateModalOpen(false);
          setEditingCharacter(null);
        }}
        title={editingCharacter ? "แก้ไขตัวละคร" : "สร้างตัวละครใหม่"}
        maxWidth="lg"
      >
        <form onSubmit={handleSaveCharacter} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <InputField
                label="ชื่อตัวละคร"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="เช่น ซู่เหวินสายคริติคอล"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <InputField
                label="คำอธิบาย (ไม่บังคับ)"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="รายละเอียดบิลด์ ข้อควรระวัง หรือชุดอุปกรณ์"
              />
            </div>

            <div className="sm:col-span-2">
              <SelectField
                label="สถานะการเผยแพร่"
                value={formData.visibility}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    visibility: e.target.value as "PUBLIC" | "PRIVATE",
                  })
                }
                options={[
                  { label: "ส่วนตัว (เห็นเฉพาะคุณ)", value: "PRIVATE" },
                  { label: "สาธารณะ (เปิดให้ผู้อื่นดูและใช้งานได้)", value: "PUBLIC" },
                ]}
              />
            </div>

            <InputField
              label="ดาเมจรวม"
              type="number"
              min={0}
              value={formData.attack}
              onChange={(e) =>
                setFormData({ ...formData, attack: parseFloat(e.target.value) || 0 })
              }
            />

            <InputField
              label="โจมตีธาตุทั้งหมด"
              type="number"
              min={0}
              value={formData.elementalAttack}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  elementalAttack: parseFloat(e.target.value) || 0,
                })
              }
            />

            <InputField
              label="ข่มสำนัก"
              type="number"
              min={0}
              value={formData.schoolCounter}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  schoolCounter: parseFloat(e.target.value) || 0,
                })
              }
            />

            <InputField
              label="เจาะเกราะ"
              type="number"
              min={0}
              value={formData.armorPenetration}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  armorPenetration: parseFloat(e.target.value) || 0,
                })
              }
            />

            <InputField
              label="ทำลายโล่"
              type="number"
              min={0}
              value={formData.shieldBreak}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  shieldBreak: parseFloat(e.target.value) || 0,
                })
              }
            />

            <InputField
              label="ความแม่นยำ"
              type="number"
              min={0}
              value={formData.hit}
              onChange={(e) =>
                setFormData({ ...formData, hit: parseFloat(e.target.value) || 0 })
              }
            />

            <InputField
              label="คริติคอล"
              type="number"
              min={0}
              value={formData.crit}
              onChange={(e) =>
                setFormData({ ...formData, crit: parseFloat(e.target.value) || 0 })
              }
            />

            <InputField
              label="ดาเมจคริติคอล"
              type="number"
              step="0.1"
              min={100}
              unit="%"
              value={formData.critDamage}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  critDamage: parseFloat(e.target.value) || 100,
                })
              }
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-5">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setCreateModalOpen(false);
                setEditingCharacter(null);
              }}
            >
              ยกเลิก
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
              {editingCharacter ? "บันทึกการแก้ไข" : "สร้างตัวละคร"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(deleteConfirmId)}
        onClose={() => setDeleteConfirmId(null)}
        title="ยืนยันการลบตัวละคร"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <p className="text-xs font-ui leading-relaxed text-neu-muted">
            คุณแน่ใจหรือไม่ว่าต้องการลบตัวละครนี้? การกระทำนี้ไม่สามารถย้อนกลับได้
          </p>
          <div className="flex items-center justify-end gap-3 pt-3">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setDeleteConfirmId(null)}
            >
              ยกเลิก
            </Button>
            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
            >
              ลบตัวละคร
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
