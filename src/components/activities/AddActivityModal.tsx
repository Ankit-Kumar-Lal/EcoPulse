"use client";

import { useState, useEffect } from "react";
import { X, Sparkles, AlertCircle, Info, Check } from "lucide-react";
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
      setDate(
        new Date(initialData.date).toISOString().split("T")[0]
      );
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-brand-border animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-brand-border">
          <div>
            <h2 id="modal-title" className="text-lg font-bold text-brand-forest">
              {initialData ? "Edit Activity Record" : "Record Everyday Activity"}
            </h2>
            <p className="text-xs text-brand-sage">
              All records calculate carbon impact using verified regional factors.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-brand-sage hover:bg-brand-natural hover:text-brand-forest"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {errorMessage && (
          <div className="mt-4 rounded-xl bg-red-50 p-3 text-xs text-red-800 flex items-start border border-red-200">
            <AlertCircle className="mr-2 h-4 w-4 flex-shrink-0 mt-0.5 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Category Selector */}
          <div>
            <label className="block text-xs font-semibold text-brand-forest mb-1.5">
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
                  className={`rounded-lg py-2 text-xs font-medium border transition-all ${
                    category === c.id
                      ? "bg-brand-forest text-white border-brand-forest shadow-sm"
                      : "bg-white text-brand-forest border-brand-border hover:bg-brand-natural"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Activity Type Dropdown */}
          <div>
            <label className="block text-xs font-semibold text-brand-forest mb-1">
              Activity Type
            </label>
            <select
              value={activityType}
              onChange={(e) => handleTypeChange(e.target.value)}
              className="w-full rounded-lg border border-brand-border bg-white px-3 py-2 text-sm text-brand-forest focus:border-brand-emerald focus:outline-none focus:ring-1 focus:ring-brand-emerald"
            >
              {categoryFactors.map((f) => (
                <option key={f.activityType} value={f.activityType}>
                  {f.label} ({f.region})
                </option>
              ))}
            </select>
          </div>

          {/* Amount & Unit */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-brand-forest mb-1">
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
                className="w-full rounded-lg border border-brand-border bg-white px-3 py-2 text-sm text-brand-forest focus:border-brand-emerald focus:outline-none focus:ring-1 focus:ring-brand-emerald"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-brand-forest mb-1">
                Unit
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full rounded-lg border border-brand-border bg-white px-3 py-2 text-sm text-brand-forest focus:border-brand-emerald focus:outline-none focus:ring-1 focus:ring-brand-emerald"
              >
                {currentFactorDef?.supportedUnits.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date Picker */}
          <div>
            <label className="block text-xs font-semibold text-brand-forest mb-1">
              Date
            </label>
            <input
              type="date"
              required
              value={date}
              max={new Date().toISOString().split("T")[0]}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-lg border border-brand-border bg-white px-3 py-2 text-sm text-brand-forest focus:border-brand-emerald focus:outline-none focus:ring-1 focus:ring-brand-emerald"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-brand-forest mb-1">
              Notes (optional)
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Commute to office, October electricity bill"
              className="w-full rounded-lg border border-brand-border bg-white px-3 py-2 text-sm text-brand-forest focus:border-brand-emerald focus:outline-none focus:ring-1 focus:ring-brand-emerald"
            />
          </div>

          {/* Live Calculation Preview Card */}
          {previewKg !== null && (
            <div className="rounded-xl bg-brand-natural p-3.5 border border-brand-border">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-brand-sage">
                  Estimated Footprint:
                </span>
                <span className="text-base font-bold text-brand-emerald-dark">
                  {previewKg.toFixed(2)} kg CO₂e
                </span>
              </div>
              <div className="mt-1 text-[11px] text-brand-sage flex items-start">
                <Info className="mr-1 h-3.5 w-3.5 flex-shrink-0 mt-0.5 text-brand-emerald" />
                <span>{previewMethod}</span>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-brand-border">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-brand-border px-4 py-2 text-xs font-medium text-brand-sage hover:bg-brand-natural hover:text-brand-forest"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || previewKg === null}
              className="inline-flex items-center rounded-lg bg-brand-emerald px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-brand-emerald-dark disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : initialData ? "Save Changes" : "Record Activity"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
