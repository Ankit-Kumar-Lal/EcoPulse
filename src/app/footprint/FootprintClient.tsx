"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { AddActivityModal } from "@/components/activities/AddActivityModal";
import {
  Plus,
  Download,
  Filter,
  Search,
  Calendar,
  Footprints,
  Edit2,
  Trash2,
  BookOpen,
  Info,
  Loader2,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface FootprintClientProps {
  user: any;
}

export function FootprintClient({ user }: FootprintClientProps) {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "ALL";
  const autoOpen = searchParams.get("new") === "1";

  const [category, setCategory] = useState<string>(initialCategory);
  const [search, setSearch] = useState<string>(searchParams.get("search") || "");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [activities, setActivities] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(autoOpen);
  const [editingActivity, setEditingActivity] = useState<any>(null);

  const categories = [
    { id: "ALL", label: "All Activities" },
    { id: "HOME_ENERGY", label: "Home Energy" },
    { id: "TRANSPORT", label: "Transport" },
    { id: "FOOD", label: "Food & Diet" },
    { id: "WATER", label: "Water" },
    { id: "WASTE", label: "Waste" },
  ];

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        category,
        page: page.toString(),
        limit: "15",
      });
      if (startDate) params.set("startDate", startDate);
      if (endDate) params.set("endDate", endDate);

      const res = await fetch(`/api/activities?${params.toString()}`);
      const data = await res.json();
      if (res.ok && data.data) {
        setActivities(data.data.items);
        setTotalCount(data.data.totalCount);
        setTotalPages(data.data.totalPages);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [category, startDate, endDate, page]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this recorded activity?")) return;
    try {
      await fetch(`/api/activities/${id}`, { method: "DELETE" });
      fetchActivities();
    } catch (e) {
      console.error(e);
    }
  };

  const filteredItems = activities.filter((item) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      item.activityType.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      (item.note && item.note.toLowerCase().includes(q))
    );
  });

  return (
    <AppShell user={user}>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#0D2E22]">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-sans">
              My Footprint Ledger
            </h1>
            <p className="text-xs sm:text-sm text-[#8BA398] mt-1">
              Complete, verifiable audit log of your everyday recorded activities and regional factor multiplications.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <a
              href="/api/activities/export"
              download
              className="inline-flex items-center rounded-xl border border-[#143E30] bg-[#091F18] px-4 py-2 text-xs font-semibold text-white hover:bg-[#0B251D] shadow-sm transition"
            >
              <Download className="mr-1.5 h-3.5 w-3.5 text-[#34D399]" />
              Export CSV
            </a>

            <button
              type="button"
              onClick={() => {
                setEditingActivity(null);
                setIsModalOpen(true);
              }}
              className="inline-flex items-center rounded-xl bg-gradient-to-r from-[#10B981] to-[#059669] px-4 py-2 text-xs font-bold text-white shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:brightness-110 transition"
            >
              <Plus className="mr-1.5 h-4 w-4" />
              Add Activity
            </button>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setCategory(c.id);
                setPage(1);
              }}
              className={`rounded-xl px-4 py-2 text-xs font-bold whitespace-nowrap transition ${
                category === c.id
                  ? "bg-[#113B2C] text-[#34D399] border border-[#10B981]/50 shadow-sm"
                  : "bg-[#091F18] text-[#8BA398] border border-[#143E30] hover:bg-[#0B251D] hover:text-white"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Filters Bar: Search & Date Inputs */}
        <div className="rounded-3xl border border-[#143E30] bg-[#091F18] p-4 sm:p-5 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#5D7E70]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by keyword or note..."
              className="w-full rounded-xl border border-[#143E30] bg-[#06140F] py-2 pl-9 pr-3 text-xs text-white placeholder:text-[#5D7E70] focus:border-[#10B981] focus:outline-none transition"
            />
          </div>

          <div className="flex items-center space-x-3 w-full md:w-auto">
            <div className="flex items-center space-x-2 text-xs text-[#8BA398]">
              <span>From:</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="rounded-xl border border-[#143E30] bg-[#06140F] px-2.5 py-1.5 text-xs text-white focus:border-[#10B981] focus:outline-none"
              />
            </div>
            <div className="flex items-center space-x-2 text-xs text-[#8BA398]">
              <span>To:</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="rounded-xl border border-[#143E30] bg-[#06140F] px-2.5 py-1.5 text-xs text-white focus:border-[#10B981] focus:outline-none"
              />
            </div>
            {(startDate || endDate || search) && (
              <button
                type="button"
                onClick={() => {
                  setStartDate("");
                  setEndDate("");
                  setSearch("");
                }}
                className="text-xs text-[#34D399] hover:underline font-bold"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Main Activities Table */}
        <div className="rounded-3xl border border-[#143E30] bg-[#091F18] shadow-2xl overflow-hidden">
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-[#10B981]" />
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <Footprints className="h-10 w-10 text-[#5D7E70] mx-auto" />
              <h3 className="text-base font-bold text-white">
                No activity records found
              </h3>
              <p className="text-xs text-[#8BA398] max-w-sm mx-auto">
                No entries match your current category or date range filter. Click below to add a new record.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditingActivity(null);
                    setIsModalOpen(true);
                  }}
                  className="inline-flex items-center rounded-xl bg-gradient-to-r from-[#10B981] to-[#059669] px-4 py-2 text-xs font-bold text-white shadow-sm hover:brightness-110"
                >
                  <Plus className="mr-1.5 h-4 w-4" />
                  Record Activity
                </button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-[#0D2E22] bg-[#06140F] text-[#8BA398] font-bold">
                  <tr>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Activity Description</th>
                    <th className="py-3.5 px-4 text-right">Quantity</th>
                    <th className="py-3.5 px-4 text-right">Est. Footprint</th>
                    <th className="py-3.5 px-4">Emission Factor & Source</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#0D2E22]">
                  {filteredItems.map((act) => (
                    <tr key={act.id} className="hover:bg-[#0B251D] transition">
                      <td className="py-3.5 px-4 text-white font-medium whitespace-nowrap">
                        {new Date(act.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="rounded-md bg-[#06140F] px-2.5 py-0.5 text-[11px] font-bold text-[#34D399] border border-[#0D2E22] whitespace-nowrap">
                          {act.category.replace("_", " ")}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-[#E2F0EA]">
                        <p className="font-semibold text-white">{act.activityType}</p>
                        {act.note && (
                          <p className="text-[11px] text-[#8BA398] italic mt-0.5">
                            &ldquo;{act.note}&rdquo;
                          </p>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-semibold text-white whitespace-nowrap">
                        {act.amount} {act.unit}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-[#34D399] whitespace-nowrap">
                        {act.calculatedKgCO2e.toFixed(2)} kg CO₂e
                      </td>
                      <td className="py-3.5 px-4 text-[#8BA398] max-w-xs">
                        <p className="text-[11px] text-white truncate">
                          {act.factorSource}
                        </p>
                        <p className="text-[10px] text-[#718E80]">
                          Factor: {act.factorValue} • Version: {act.factorVersion}
                        </p>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingActivity(act);
                            setIsModalOpen(true);
                          }}
                          className="rounded-lg p-1.5 text-[#8BA398] hover:bg-[#0B251D] hover:text-white"
                          aria-label="Edit entry"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(act.id)}
                          className="rounded-lg p-1.5 text-red-400 hover:bg-red-950/40 hover:text-red-300"
                          aria-label="Delete entry"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Footer */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t border-[#0D2E22] bg-[#06140F] text-xs text-[#8BA398]">
              <span>
                Showing page {page} of {totalPages} ({totalCount} total entries)
              </span>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                  className="rounded-xl border border-[#143E30] p-2 hover:bg-[#0B251D] disabled:opacity-30"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => setPage(page + 1)}
                  className="rounded-xl border border-[#143E30] p-2 hover:bg-[#0B251D] disabled:opacity-30"
                  aria-label="Next page"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      <AddActivityModal
        isOpen={isModalOpen}
        initialData={editingActivity}
        onClose={() => {
          setIsModalOpen(false);
          setEditingActivity(null);
        }}
        onSuccess={() => {
          fetchActivities();
        }}
      />
    </AppShell>
  );
}
