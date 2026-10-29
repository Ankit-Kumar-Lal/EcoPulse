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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-brand-border">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-forest">
              My Footprint Ledger
            </h1>
            <p className="text-xs sm:text-sm text-brand-sage mt-1">
              Complete, verifiable audit log of your everyday recorded activities and regional factor multiplications.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <a
              href="/api/activities/export"
              download
              className="inline-flex items-center rounded-xl border border-brand-border bg-white px-3.5 py-2 text-xs font-semibold text-brand-forest hover:bg-brand-natural shadow-xs transition"
            >
              <Download className="mr-1.5 h-3.5 w-3.5 text-brand-sage" />
              Export CSV
            </a>

            <button
              type="button"
              onClick={() => {
                setEditingActivity(null);
                setIsModalOpen(true);
              }}
              className="inline-flex items-center rounded-xl bg-brand-emerald px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-brand-emerald-dark transition"
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
              className={`rounded-xl px-4 py-2 text-xs font-semibold whitespace-nowrap transition ${
                category === c.id
                  ? "bg-brand-forest text-white shadow-xs"
                  : "bg-white text-brand-forest border border-brand-border hover:bg-brand-natural"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Filters Bar: Search & Date Inputs */}
        <div className="rounded-2xl border border-brand-border bg-white p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-brand-sage" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by keyword or note..."
              className="w-full rounded-xl border border-brand-border bg-brand-natural/40 py-1.5 pl-8 pr-3 text-xs text-brand-forest placeholder:text-brand-sage focus:border-brand-emerald focus:bg-white focus:outline-none"
            />
          </div>

          <div className="flex items-center space-x-3 w-full md:w-auto">
            <div className="flex items-center space-x-2 text-xs text-brand-sage">
              <span>From:</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="rounded-lg border border-brand-border bg-brand-natural/40 px-2.5 py-1 text-xs text-brand-forest"
              />
            </div>
            <div className="flex items-center space-x-2 text-xs text-brand-sage">
              <span>To:</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="rounded-lg border border-brand-border bg-brand-natural/40 px-2.5 py-1 text-xs text-brand-forest"
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
                className="text-xs text-brand-emerald hover:underline font-semibold"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Main Activities Table */}
        <div className="rounded-3xl border border-brand-border bg-white shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-brand-emerald" />
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <Footprints className="h-10 w-10 text-brand-sage/40 mx-auto" />
              <h3 className="text-base font-bold text-brand-forest">
                No activity records found
              </h3>
              <p className="text-xs text-brand-sage max-w-sm mx-auto">
                No entries match your current category or date range filter. Click below to add a new record.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditingActivity(null);
                    setIsModalOpen(true);
                  }}
                  className="inline-flex items-center rounded-xl bg-brand-emerald px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-brand-emerald-dark"
                >
                  <Plus className="mr-1.5 h-4 w-4" />
                  Record Activity
                </button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-brand-border bg-brand-natural/70 text-brand-forest font-bold">
                  <tr>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Activity Description</th>
                    <th className="py-3 px-4 text-right">Quantity</th>
                    <th className="py-3 px-4 text-right">Est. Footprint</th>
                    <th className="py-3 px-4">Emission Factor & Source</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border">
                  {filteredItems.map((act) => (
                    <tr key={act.id} className="hover:bg-brand-natural/30 transition">
                      <td className="py-3 px-4 text-brand-forest font-medium whitespace-nowrap">
                        {new Date(act.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="py-3 px-4">
                        <span className="rounded-md bg-brand-natural px-2 py-0.5 text-[11px] font-semibold text-brand-forest border border-brand-border whitespace-nowrap">
                          {act.category.replace("_", " ")}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-brand-forest">
                        <p className="font-semibold">{act.activityType}</p>
                        {act.note && (
                          <p className="text-[11px] text-brand-sage italic mt-0.5">
                            &ldquo;{act.note}&rdquo;
                          </p>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-semibold text-brand-forest whitespace-nowrap">
                        {act.amount} {act.unit}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-brand-emerald-dark whitespace-nowrap">
                        {act.calculatedKgCO2e.toFixed(2)} kg CO₂e
                      </td>
                      <td className="py-3 px-4 text-brand-sage max-w-xs">
                        <p className="text-[11px] text-brand-forest truncate">
                          {act.factorSource}
                        </p>
                        <p className="text-[10px] text-brand-sage">
                          Factor: {act.factorValue} • Version: {act.factorVersion}
                        </p>
                      </td>
                      <td className="py-3 px-4 text-right space-x-2 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingActivity(act);
                            setIsModalOpen(true);
                          }}
                          className="rounded-lg p-1.5 text-brand-sage hover:bg-brand-natural hover:text-brand-forest"
                          aria-label="Edit entry"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(act.id)}
                          className="rounded-lg p-1.5 text-red-500 hover:bg-red-50 hover:text-red-700"
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
            <div className="flex items-center justify-between p-4 border-t border-brand-border bg-white text-xs text-brand-sage">
              <span>
                Showing page {page} of {totalPages} ({totalCount} total entries)
              </span>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                  className="rounded-lg border border-brand-border p-1.5 hover:bg-brand-natural disabled:opacity-40"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => setPage(page + 1)}
                  className="rounded-lg border border-brand-border p-1.5 hover:bg-brand-natural disabled:opacity-40"
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
