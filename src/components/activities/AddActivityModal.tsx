"use client";

import { useState, useEffect } from "react";
import { X, Sparkles, AlertCircle, Info, Check, Plus, Flame } from "lucide-react";
import { OFFICIAL_FACTORS } from "@/lib/calculations/factors";
import { calculateFootprint } from "@/lib/calculations/calculator";

interface AddActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: any;
}

export function AddActivityModal({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}: AddActivityModalProps) {
  const [category, setCategory] = useState<string>("HOME_ENERGY");
  const [activityType, setActivityType] = useState<string>("electricity_grid");
  const [amount, setAmount] = useState<string>("100");
  const [unit, setUnit] = useState<string>("kWh");
  const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [note, setNote] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Available factors for the chosen category
  const categoryFactors = OFFICIAL_FACTORS.filter((f) => f.category === category);

  // Synchronize initial data if editing
  useEffect(() => {
    if (initialData) {
      setCategory(initialData.category);
      setActivityType(initialData.activityType);
      setAmount(String(initialData.amount));
      setUnit(initialData.unit);
      setDate(new Date(initialData.date).toISOString().split("T")[0]);
      setNote(initialData.note || "");
    } else {
      setCategory("HOME_ENERGY");
      setActivityType("electricity_grid");
      setAmount("100");
      setUnit("kWh");
      setDate(new Date().toISOString().split("T")[0]);
      setNote("");
    }
  }, [initialData, isOpen]);

  // When category changes, reset activity type and unit
  const handleCategoryChange = (newCat: string) => {
    setCategory(newCat);
    const available = OFFICIAL_FACTORS.filter((f) => f.category === newCat);
    if (available.length > 0) {
      setActivityType(available[0].activityType);
      setUnit(available[0].supportedUnits[0]);
    }
  };

  // When activity type changes, reset unit
  const handleTypeChange = (newType: string) => {
    setActivityType(newType);
    const factor = OFFICIAL_FACTORS.find((f) => f.activityType === newType);
    if (factor && !factor.supportedUnits.includes(unit)) {
      setUnit(factor.supportedUnits[0]);
    }
  };

  // Live calculation preview
  let previewKg: number | null = null;
  let previewFactorSource = "";
  let previewMethod = "";
  const numericAmount = parseFloat(amount);

  if (!isNaN(numericAmount) && numericAmount > 0) {
    try {
      const res = calculateFootprint({
        category: category as any,
        activityType,
        amount: numericAmount,
        unit,
      });
      previewKg = res.calculatedKgCO2e;
      previewFactorSource = `${res.factorSource} (${res.factorVersion})`;
      previewMethod = res.methodologyNote;
    } catch {
      previewKg = null;
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const payload = {
        category,
        activityType,
        amount: parseFloat(amount),
        unit,
        date: new Date(date).toISOString(),
        note: note.trim() || undefined,
      };

      const endpoint = initialData
        ? `/api/activities/${initialData.id}`
        : "/api/activities";
      const method = initialData ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || "Failed to save activity record.");
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const currentFactorDef = OFFICIAL_FACTORS.find(
    (f) => f.activityType === activityType
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="relative w-full max-w-lg rounded-3xl bg-[#091F18] p-6 sm:p-7 shadow-2xl border border-[#143E30] text-[#E2F0EA] animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-[#0D2E22]">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#10B981]/20 border border-[#10B981]/40 text-[#34D399] shadow-[0_0_15px_rgba(16,185,129,0.25)]">
              <Plus className="h-5 w-5" />
            </div>
            <div>
              <h2 id="modal-title" className="text-base sm:text-lg font-bold text-white">
                {initialData ? "Edit Activity Record" : "Record Everyday Activity"}
              </h2>
              <p className="text-[11px] text-[#8BA398]">
                Calculates verifiable CO₂e footprint + awards engagement XP & streak progress.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-1.5 text-[#8BA398] hover:bg-[#0B251D] hover:text-white transition"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {errorMessage && (
          <div className="mt-4 rounded-xl bg-red-950/40 p-3 text-xs text-red-300 flex items-start border border-red-800/40">
            <AlertCircle className="mr-2 h-4 w-4 flex-shrink-0 mt-0.5 text-red-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Category Selector */}
          <div>
            <label className="block text-xs font-semibold text-[#8BA398] mb-1.5">
              Activity Category
            </label>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
              {[
                { id: "HOME_ENERGY", label: "Energy" },
                { id: "TRANSPORT", label: "Transit" },
                { id: "FOOD", label: "Food" },
                { id: "WATER", label: "Water" },
                { id: "WASTE", label: "Waste" },
              ].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => handleCategoryChange(c.id)}
                  className={`rounded-xl py-2 text-xs font-semibold border transition-all ${
                    category === c.id
                      ? "bg-[#113B2C] text-[#34D399] border-[#10B981]/50 shadow-[0_0_10px_rgba(16,185,129,0.2)]"
                      : "bg-[#06140F] text-[#8BA398] border-[#0D2E22] hover:bg-[#0B251D] hover:text-[#E2F0EA]"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Activity Type Dropdown */}
          <div>
            <label className="block text-xs font-semibold text-[#8BA398] mb-1">
              Activity Type
            </label>
            <select
              value={activityType}
              onChange={(e) => handleTypeChange(e.target.value)}
              className="w-full rounded-xl border border-[#143E30] bg-[#06140F] px-3.5 py-2.5 text-xs text-white focus:border-[#10B981] focus:outline-none focus:ring-1 focus:ring-[#10B981] transition"
            >
              {categoryFactors.map((f) => (
                <option key={f.activityType} value={f.activityType} className="bg-[#091F18] text-white">
                  {f.label} ({f.region})
                </option>
              ))}
            </select>
          </div>

          {/* Amount & Unit */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#8BA398] mb-1">
                Amount / Quantity
              </label>
              <input
                type="number"
                step="any"
                min="0.01"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g. 150"
                className="w-full rounded-xl border border-[#143E30] bg-[#06140F] px-3.5 py-2.5 text-xs text-white focus:border-[#10B981] focus:outline-none focus:ring-1 focus:ring-[#10B981] transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#8BA398] mb-1">
                Unit
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full rounded-xl border border-[#143E30] bg-[#06140F] px-3.5 py-2.5 text-xs text-white focus:border-[#10B981] focus:outline-none focus:ring-1 focus:ring-[#10B981] transition"
              >
                {currentFactorDef?.supportedUnits.map((u) => (
                  <option key={u} value={u} className="bg-[#091F18] text-white">
                    {u}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date Picker */}
          <div>
            <label className="block text-xs font-semibold text-[#8BA398] mb-1">
              Date
            </label>
            <input
              type="date"
              required
              value={date}
              max={new Date().toISOString().split("T")[0]}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-xl border border-[#143E30] bg-[#06140F] px-3.5 py-2.5 text-xs text-white focus:border-[#10B981] focus:outline-none focus:ring-1 focus:ring-[#10B981] transition"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-[#8BA398] mb-1">
              Notes (optional)
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Commute to office, October electricity bill"
              className="w-full rounded-xl border border-[#143E30] bg-[#06140F] px-3.5 py-2.5 text-xs text-white focus:border-[#10B981] focus:outline-none focus:ring-1 focus:ring-[#10B981] transition"
            />
          </div>

          {/* Live Calculation Preview Card */}
          {previewKg !== null && (
            <div className="rounded-2xl bg-[#06140F] p-4 border border-[#10B981]/30 shadow-inner">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-[#8BA398] uppercase tracking-wider">
                    Calculated Footprint:
                  </span>
                  <div className="text-xl font-extrabold text-[#34D399]">
                    {previewKg.toFixed(2)} kg CO₂e
                  </div>
                </div>
                <div className="flex items-center space-x-1.5 rounded-full bg-[#10B981]/15 px-3 py-1 border border-[#10B981]/30 text-amber-400 text-xs font-bold">
                  <Flame className="h-3.5 w-3.5" />
                  <span>+20-35 XP</span>
                </div>
              </div>
              <div className="mt-2 text-[11px] text-[#718E80] flex items-start leading-relaxed border-t border-[#0D2E22] pt-2">
                <Info className="mr-1.5 h-3.5 w-3.5 flex-shrink-0 mt-0.5 text-[#34D399]" />
                <span>{previewMethod}</span>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#0D2E22]">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-[#143E30] px-4 py-2.5 text-xs font-medium text-[#8BA398] hover:bg-[#0B251D] hover:text-white transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || previewKg === null}
              className="inline-flex items-center rounded-xl bg-gradient-to-r from-[#10B981] to-[#059669] px-5 py-2.5 text-xs font-bold text-white shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:brightness-110 disabled:opacity-50 transition"
            >
              {isSubmitting ? "Saving..." : initialData ? "Save Changes" : "Record Activity"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
