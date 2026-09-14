"use client";

import React, { useState, useEffect } from "react";
import { CharacterStats } from "@/lib/calculator/types";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { InputField, SelectField } from "@/components/ui/InputField";
import { useAuth } from "@/lib/auth/AuthContext";
import { useToast } from "@/components/ui/Toast";
import { User, Globe, Save, PlusCircle, Check } from "lucide-react";

export interface SavedCharacter {
  id: string;
  name: string;
  description?: string | null;
  visibility: "PUBLIC" | "PRIVATE";
  attack: number;
  elementalAttack: number;
  schoolCounter: number;
  armorPenetration: number;
  shieldBreak: number;
  hit: number;
  crit: number;
  critDamage: number;
  userId: string;
  user?: {
    username: string;
  };
}

interface CharacterSelectorProps {
  currentStats: CharacterStats;
  onSelectCharacter: (char: SavedCharacter) => void;
  activeCharacter: SavedCharacter | null;
  onClearActiveCharacter: () => void;
}

export function CharacterSelector({
  currentStats,
  onSelectCharacter,
  activeCharacter,
  onClearActiveCharacter,
}: CharacterSelectorProps) {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [myCharacters, setMyCharacters] = useState<SavedCharacter[]>([]);
  const [publicCharacters, setPublicCharacters] = useState<SavedCharacter[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Modals
  const [selectModalOpen, setSelectModalOpen] = useState(false);
  const [saveNewModalOpen, setSaveNewModalOpen] = useState(false);
  const [newCharName, setNewCharName] = useState("");
  const [newCharDesc, setNewCharDesc] = useState("");
  const [newCharVisibility, setNewCharVisibility] = useState<"PUBLIC" | "PRIVATE">("PRIVATE");
  const [isSaving, setIsSaving] = useState(false);

  const fetchCharacters = async () => {
    setIsLoading(true);
    try {
      if (user) {
        const res = await fetch("/api/characters");
        if (res.ok) {
          const data = await res.json();
          setMyCharacters(data.characters || []);
        }
      }

      const pubRes = await fetch("/api/characters/public?limit=8");
      if (pubRes.ok) {
        const pubData = await pubRes.json();
        setPublicCharacters(pubData.characters || []);
      }
    } catch (err) {
      console.error("Fetch characters error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCharacters();
  }, [user]);

  // Explicit Save Changes to loaded character (Section 26)
  const handleSaveChangesToCurrent = async () => {
    if (!activeCharacter || !user || activeCharacter.userId !== user.id) {
      showToast("ไม่สามารถแก้ไขตัวละครนี้ได้", "error");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch(`/api/characters/${activeCharacter.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: activeCharacter.name,
          description: activeCharacter.description || "",
          visibility: activeCharacter.visibility,
          attack: currentStats.attack,
          elementalAttack: currentStats.elementalAttack,
          schoolCounter: currentStats.schoolCounter,
          armorPenetration: currentStats.armorPenetration,
          shieldBreak: currentStats.shieldBreak,
          hit: currentStats.hit,
          crit: currentStats.crit,
          critDamage: currentStats.critDamage,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "เกิดข้อผิดพลาด");
      }

      const data = await res.json();
      showToast("บันทึกการเปลี่ยนแปลงสำเร็จ", "success");
      onSelectCharacter(data.character);
      fetchCharacters();
    } catch (err: any) {
      showToast(err.message || "เกิดข้อผิดพลาดในการบันทึก", "error");
    } finally {
      setIsSaving(false);
    }
  };

  // Save as New Character
  const handleSaveAsNew = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      showToast("กรุณาเข้าสู่ระบบก่อนบันทึกตัวละคร", "error");
      return;
    }
    if (!newCharName.trim()) {
      showToast("กรุณาระบุชื่อตัวละคร", "error");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch("/api/characters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newCharName.trim(),
          description: newCharDesc.trim(),
          visibility: newCharVisibility,
          attack: currentStats.attack,
          elementalAttack: currentStats.elementalAttack,
          schoolCounter: currentStats.schoolCounter,
          armorPenetration: currentStats.armorPenetration,
          shieldBreak: currentStats.shieldBreak,
          hit: currentStats.hit,
          crit: currentStats.crit,
          critDamage: currentStats.critDamage,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "เกิดข้อผิดพลาดในการสร้างตัวละคร");
      }

      const data = await res.json();
      showToast("สร้างตัวละครใหม่เรียบร้อยแล้ว", "success");
      onSelectCharacter(data.character);
      setSaveNewModalOpen(false);
      setNewCharName("");
      setNewCharDesc("");
      fetchCharacters();
    } catch (err: any) {
      showToast(err.message || "เกิดข้อผิดพลาด", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-4 rounded-card bg-graphite/40 border border-steel/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-nav bg-abyss text-iris border border-steel/50 flex items-center justify-center">
          <User size={18} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-ui text-ash">บิลด์ตัวละครที่ใช้งาน:</span>
            {activeCharacter ? (
              <span className="text-sm font-ui font-medium text-pure">
                {activeCharacter.name}
              </span>
            ) : (
              <span className="text-xs font-ui text-fog">กำหนดค่าด้วยตนเอง</span>
            )}
            {activeCharacter && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-steel/30 text-cloud">
                {activeCharacter.visibility === "PUBLIC" ? "สาธารณะ" : "ส่วนตัว"}
              </span>
            )}
          </div>
          <p className="text-[11px] font-ui text-fog">
            {activeCharacter
              ? activeCharacter.userId === user?.id
                ? "การแก้ไขค่าในเครื่องคำนวณจะไม่ถูกบันทึกอัตโนมัติ"
                : `อ้างอิงจากตัวละครสาธารณะของ ${activeCharacter.user?.username || "ผู้ใช้อื่น"}`
              : "คุณสามารถโหลดบิลด์ที่บันทึกไว้ หรือบันทึกค่าปัจจุบันเป็นตัวละครใหม่"}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={() => {
            fetchCharacters();
            setSelectModalOpen(true);
          }}
        >
          เลือกตัวละคร
        </Button>

        {activeCharacter && user && activeCharacter.userId === user.id && (
          <Button
            type="button"
            size="sm"
            variant="primary"
            isLoading={isSaving}
            onClick={handleSaveChangesToCurrent}
            title="บันทึกค่าที่แก้ไขลงในตัวละครนี้"
          >
            <Save size={14} className="mr-1.5" />
            บันทึกการเปลี่ยนแปลง
          </Button>
        )}

        {user && (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => setSaveNewModalOpen(true)}
            className="text-cloud hover:text-pure"
          >
            <PlusCircle size={14} className="mr-1" />
            บันทึกเป็นตัวละครใหม่
          </Button>
        )}

        {activeCharacter && (
          <button
            type="button"
            onClick={onClearActiveCharacter}
            className="text-xs font-ui text-ash hover:text-red-400 transition-colors px-2 py-1"
          >
            ยกเลิกการเลือก
          </button>
        )}
      </div>

      {/* Select Character Modal */}
      <Modal
        isOpen={selectModalOpen}
        onClose={() => setSelectModalOpen(false)}
        title="เลือกตัวละครเพื่อคำนวณ"
        maxWidth="lg"
      >
        <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-1">
          {/* User's Characters */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <User size={16} className="text-iris" />
              <h4 className="font-ui font-medium text-pure text-sm">
                ตัวละครของฉัน ({myCharacters.length})
              </h4>
            </div>

            {!user ? (
              <div className="p-4 rounded-card bg-abyss text-center text-xs font-ui text-ash border border-steel/30">
                เข้าสู่ระบบเพื่อดูและเลือกตัวละครของคุณ
              </div>
            ) : myCharacters.length === 0 ? (
              <div className="p-4 rounded-card bg-abyss text-center text-xs font-ui text-ash border border-steel/30">
                คุณยังไม่มีตัวละครที่บันทึกไว้
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {myCharacters.map((char) => (
                  <div
                    key={char.id}
                    onClick={() => {
                      onSelectCharacter(char);
                      setSelectModalOpen(false);
                      showToast(`โหลดตัวละคร "${char.name}" เรียบร้อยแล้ว`, "success");
                    }}
                    className={`p-3.5 rounded-card bg-abyss hover:bg-steel/30 border transition-all cursor-pointer ${
                      activeCharacter?.id === char.id
                        ? "border-iris"
                        : "border-steel/40"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-ui font-medium text-pure text-sm">
                        {char.name}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-steel/30 text-ash">
                        {char.visibility === "PUBLIC" ? "สาธารณะ" : "ส่วนตัว"}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-1 font-mono text-[11px] text-ash mt-2">
                      <div>ดาเมจรวม: <span className="text-cloud">{char.attack}</span></div>
                      <div>เจาะเกราะ: <span className="text-cloud">{char.armorPenetration}</span></div>
                      <div>คริติคอล: <span className="text-cloud">{char.crit}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Public Characters Directory Preview */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Globe size={16} className="text-cyan-signal" />
              <h4 className="font-ui font-medium text-pure text-sm">
                ตัวละครสาธารณะแนะนำ
              </h4>
            </div>

            {publicCharacters.length === 0 ? (
              <div className="p-4 rounded-card bg-abyss text-center text-xs font-ui text-ash border border-steel/30">
                ยังไม่มีตัวละครสาธารณะ
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {publicCharacters.map((char) => (
                  <div
                    key={char.id}
                    onClick={() => {
                      onSelectCharacter(char);
                      setSelectModalOpen(false);
                      showToast(`โหลดตัวละครสาธารณะ "${char.name}" เรียบร้อยแล้ว`, "success");
                    }}
                    className={`p-3.5 rounded-card bg-abyss hover:bg-steel/30 border transition-all cursor-pointer ${
                      activeCharacter?.id === char.id
                        ? "border-cyan-signal"
                        : "border-steel/40"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-ui font-medium text-pure text-sm">
                        {char.name}
                      </span>
                      <span className="text-[10px] font-ui text-ash">
                        โดย {char.user?.username || "ไม่ระบุ"}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-1 font-mono text-[11px] text-ash mt-2">
                      <div>ดาเมจรวม: <span className="text-cloud">{char.attack}</span></div>
                      <div>เจาะเกราะ: <span className="text-cloud">{char.armorPenetration}</span></div>
                      <div>คริติคอล: <span className="text-cloud">{char.crit}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Modal>

      {/* Save as New Character Modal */}
      <Modal
        isOpen={saveNewModalOpen}
        onClose={() => setSaveNewModalOpen(false)}
        title="บันทึกเป็นตัวละครใหม่"
        maxWidth="md"
      >
        <form onSubmit={handleSaveAsNew} className="space-y-4">
          <InputField
            label="ชื่อตัวละคร"
            value={newCharName}
            onChange={(e) => setNewCharName(e.target.value)}
            placeholder="เช่น เสินเวยสายเจาะเกราะ"
            required
          />

          <InputField
            label="คำอธิบาย (ไม่บังคับ)"
            value={newCharDesc}
            onChange={(e) => setNewCharDesc(e.target.value)}
            placeholder="รายละเอียดอุปกรณ์หรือจุดเด่นของบิลด์นี้"
          />

          <SelectField
            label="สถานะการเผยแพร่"
            value={newCharVisibility}
            onChange={(e) => setNewCharVisibility(e.target.value as "PUBLIC" | "PRIVATE")}
            options={[
              { label: "ส่วนตัว (เห็นเฉพาะคุณ)", value: "PRIVATE" },
              { label: "สาธารณะ (แชร์ให้ผู้อื่นดูและใช้งานได้)", value: "PUBLIC" },
            ]}
          />

          <div className="p-3 rounded-input bg-abyss/80 border border-steel/40 font-mono text-xs text-ash space-y-1">
            <div className="text-cloud font-ui font-medium mb-1">ค่าสเตตัสที่จะบันทึก:</div>
            <div className="grid grid-cols-2 gap-1 text-[11px]">
              <div>ดาเมจรวม: {currentStats.attack}</div>
              <div>โจมตีธาตุทั้งหมด: {currentStats.elementalAttack}</div>
              <div>ข่มสำนัก: {currentStats.schoolCounter}</div>
              <div>เจาะเกราะ: {currentStats.armorPenetration}</div>
              <div>ทำลายโล่: {currentStats.shieldBreak}</div>
              <div>คริติคอล: {currentStats.crit} ({currentStats.critDamage}%)</div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-steel/30">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setSaveNewModalOpen(false)}
            >
              ยกเลิก
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={isSaving}>
              บันทึกตัวละคร
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
