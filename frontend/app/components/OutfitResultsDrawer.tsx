"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useStylistStore } from "../../store/stylistStore";
import type { OutfitCombination, OutfitItem, BudgetSegment } from "../../lib/types";

const SEGMENT_COLORS = ["#C2185B", "#8B1538", "#E91E63", "#AD1457", "#880E4F"];
const CARD_BG_COLORS = ["#E8D5C4", "#C8D8C0", "#D4C8E0", "#F0D080", "#D4A8B4"];

function imgSrc(item: OutfitItem): string | null {
  if (!item.image_url) return null;
  if (item.image_url.startsWith("http")) return item.image_url;
  return `http://localhost:8000/${item.image_url}`;
}

function OutfitCard({
  outfit,
  index,
  onSave,
}: {
  outfit: OutfitCombination;
  index: number;
  onSave: () => void;
}) {
  const dresses = outfit.items.filter((i) => i.category === "dress");
  const tops = outfit.items.filter((i) => i.category === "top");
  const bottoms = outfit.items.filter((i) => i.category === "bottom");
  const outerwear = outfit.items.filter((i) => i.category === "outerwear");

  const mainItems = dresses.length > 0 ? dresses : [...tops, ...bottoms];
  const accentItems = outerwear;
  const bgColor = CARD_BG_COLORS[index % CARD_BG_COLORS.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      className="bg-white rounded-2xl overflow-hidden shadow-sm"
    >
      {/* Image area */}
      <div className="relative">
        {/* Main product images (side by side) */}
        <div className="flex gap-0.5">
          {mainItems.slice(0, 2).map((item) => {
            const src = imgSrc(item);
            return (
              <div
                key={item.id}
                className="flex-1 h-28 overflow-hidden"
                style={{
                  background: `linear-gradient(145deg, ${bgColor}, ${bgColor}88)`,
                }}
              >
                {src && (
                  <img
                    src={src}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                )}
              </div>
            );
          })}
          {/* Placeholder second panel when only 1 main item */}
          {mainItems.length === 1 && (
            <div
              className="flex-1 h-28"
              style={{ background: `${bgColor}55` }}
            />
          )}
        </div>

        {/* Accessories / outerwear row */}
        {accentItems.length > 0 && (
          <div className="flex gap-0.5 mt-0.5">
            {accentItems.slice(0, 2).map((item) => {
              const src = imgSrc(item);
              const altBg = CARD_BG_COLORS[(index + 2) % CARD_BG_COLORS.length];
              return (
                <div
                  key={item.id}
                  className="flex-1 h-14 overflow-hidden"
                  style={{
                    background: `linear-gradient(145deg, ${altBg}, ${altBg}88)`,
                  }}
                >
                  {src && (
                    <img
                      src={src}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Action icons overlay */}
        <div className="absolute top-2 right-2 flex gap-1.5">
          <button
            onClick={onSave}
            className="w-7 h-7 rounded-full bg-white/90 shadow-sm flex items-center justify-center"
            title="Save outfit"
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#C2185B"
              strokeWidth="2"
            >
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
            </svg>
          </button>
          <button
            className="w-7 h-7 rounded-full bg-white/90 shadow-sm flex items-center justify-center"
            title="Share outfit"
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#374151"
              strokeWidth="2"
            >
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
          </button>
        </div>
      </div>

      {/* Card content */}
      <div className="p-2.5">
        <p className="text-xs font-bold text-gray-900 leading-tight">
          {outfit.name || `Outfit ${index + 1}`}
        </p>

        {/* Per-item prices */}
        {outfit.items.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {outfit.items.slice(0, 2).map((item, idx) => (
              <span
                key={idx}
                className="text-[9px] text-gray-500 bg-gray-50 px-1.5 py-0.5 rounded"
              >
                ₹{item.price.toLocaleString("en-IN")}
              </span>
            ))}
          </div>
        )}

        {/* Total price */}
        <p className="text-xs font-bold text-[#C2185B] mt-1">
          ₹{outfit.total_price.toLocaleString("en-IN")}
        </p>

        {/* Occasion tags */}
        {outfit.occasion_tags && outfit.occasion_tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1.5">
            {outfit.occasion_tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-[9px] bg-[#C2185B]/10 text-[#C2185B] px-1.5 py-0.5 rounded-full capitalize"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Styling tip */}
        {outfit.styling_tip && (
          <p className="text-[9px] text-gray-500 mt-1.5 leading-tight">
            💡 {outfit.styling_tip}
          </p>
        )}
      </div>
    </motion.div>
  );
}

export default function OutfitResultsDrawer() {
  const {
    isResultsDrawerOpen,
    closeDrawer,
    currentQuery,
    outfits,
    progressSteps,
    isLoading,
    error,
    clarifyingQuestion,
    totalBudget,
    saveOutfit: storeSave,
    submitSearch,
    openSearch,
  } = useStylistStore();

  const totalSpent = outfits.reduce((s, o) => s + o.total_price, 0);
  const remaining =
    totalBudget != null ? Math.max(totalBudget - totalSpent, 0) : null;

  const budgetSegments: BudgetSegment[] = outfits.map((outfit, i) => ({
    label: `Outfit ${i + 1}`,
    amount: outfit.total_price,
    color: SEGMENT_COLORS[i % SEGMENT_COLORS.length],
  }));

  return (
    <AnimatePresence>
      {isResultsDrawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={closeDrawer}
          />

          {/* Drawer */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 320 }}
            className="fixed inset-x-0 bottom-0 z-50 bg-[#FAF7F4] rounded-t-3xl flex flex-col"
            style={{ height: "93vh" }}
          >
            {/* Handle bar */}
            <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
              <div className="w-10 h-1 rounded-full bg-gray-300" />
            </div>

            {/* Header */}
            <div className="px-4 pb-3 border-b border-gray-100 flex-shrink-0">
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1 mr-3">
                  <span className="text-base font-bold text-[#C2185B]">
                    AI Miranda
                  </span>
                  {currentQuery && (
                    <p className="text-xs text-gray-500 mt-0.5 truncate">
                      &ldquo;{currentQuery}&rdquo;
                    </p>
                  )}
                </div>
                <button
                  onClick={closeDrawer}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 flex-shrink-0"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#374151"
                    strokeWidth="2.5"
                  >
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto">
              {/* ── Loading: progress steps ── */}
              {isLoading && (
                <div className="px-4 py-6">
                  <div className="flex flex-col gap-4">
                    {progressSteps.map((step, i) => (
                      <motion.div
                        key={step.label}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{
                          opacity: step.status !== "pending" ? 1 : 0.35,
                          x: 0,
                        }}
                        transition={{ delay: i * 0.08 }}
                        className="flex items-center gap-3"
                      >
                        {/* Step indicator */}
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                            step.status === "done"
                              ? "bg-[#C2185B]"
                              : step.status === "active"
                              ? "border-2 border-[#C2185B] bg-[#C2185B]/10"
                              : "bg-gray-200"
                          }`}
                        >
                          {step.status === "done" && (
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="white"
                              strokeWidth="3"
                            >
                              <path d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                          {step.status === "active" && (
                            <motion.div
                              animate={{ scale: [1, 1.3, 1] }}
                              transition={{ repeat: Infinity, duration: 0.9 }}
                              className="w-2 h-2 rounded-full bg-[#C2185B]"
                            />
                          )}
                        </div>

                        <span
                          className={`text-sm transition-colors ${
                            step.status === "active"
                              ? "text-[#C2185B] font-semibold"
                              : step.status === "done"
                              ? "text-gray-600"
                              : "text-gray-400"
                          }`}
                        >
                          {step.label}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Clarifying state ── */}
              {!isLoading && clarifyingQuestion && !error && (
                <div className="px-4 py-10 flex flex-col items-center text-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-[#C2185B]/10 flex items-center justify-center text-2xl">
                    ✨
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-1">
                      Just a little more info
                    </p>
                    <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
                      {clarifyingQuestion}
                    </p>
                  </div>
                  <button
                    onClick={() => { closeDrawer(); openSearch(); }}
                    className="bg-[#C2185B] text-white text-sm font-semibold px-6 py-2.5 rounded-full"
                  >
                    Refine Search
                  </button>
                </div>
              )}

              {/* ── Error state ── */}
              {!isLoading && error && (
                <div className="px-4 py-10 flex flex-col items-center text-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#C2185B"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 8v4m0 4h.01" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-1">
                      Something went wrong
                    </p>
                    <p className="text-xs text-gray-500 leading-relaxed max-w-xs">
                      {error}
                    </p>
                  </div>
                  <button
                    onClick={() => submitSearch(currentQuery)}
                    className="bg-[#C2185B] text-white text-sm font-semibold px-6 py-2.5 rounded-full"
                  >
                    Try Again
                  </button>
                </div>
              )}

              {/* ── Empty state ── */}
              {!isLoading && !error && outfits.length === 0 && (
                <div className="px-4 py-14 flex flex-col items-center text-center gap-3">
                  <span className="text-5xl">✨</span>
                  <p className="text-sm font-semibold text-gray-900">
                    Describe your dream trip above to get started
                  </p>
                  <p className="text-xs text-gray-400">
                    AI Miranda will curate perfect outfits for your journey
                  </p>
                </div>
              )}

              {/* ── Results ── */}
              {!isLoading && !error && outfits.length > 0 && (
                <div className="px-4 pt-4 pb-28">
                  {/* Budget bar */}
                  {totalBudget != null && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-5 bg-white rounded-2xl p-4 shadow-sm"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-gray-900">
                          Budget Breakdown
                        </span>
                        <span className="text-xs text-gray-500">
                          Total ₹{totalBudget.toLocaleString("en-IN")}
                        </span>
                      </div>

                      {/* Segmented bar */}
                      <div className="flex rounded-full overflow-hidden h-3 gap-px">
                        {budgetSegments.map((seg, i) => (
                          <div
                            key={i}
                            className="h-full first:rounded-l-full last:rounded-r-full"
                            style={{
                              background: seg.color,
                              flex: seg.amount,
                            }}
                          />
                        ))}
                        {remaining != null && remaining > 0 && (
                          <div
                            className="h-full last:rounded-r-full bg-gray-200"
                            style={{ flex: remaining }}
                          />
                        )}
                      </div>

                      {/* Legend */}
                      <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2.5">
                        {budgetSegments.map((seg, i) => (
                          <div key={i} className="flex items-center gap-1">
                            <div
                              className="w-2 h-2 rounded-full"
                              style={{ background: seg.color }}
                            />
                            <span className="text-[10px] text-gray-500">
                              {seg.label} ₹{seg.amount.toLocaleString("en-IN")}
                            </span>
                          </div>
                        ))}
                        {remaining != null && remaining > 0 && (
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-gray-200" />
                            <span className="text-[10px] text-gray-500">
                              Remaining ₹{remaining.toLocaleString("en-IN")}
                            </span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* Outfit grid (2 columns) */}
                  <div className="grid grid-cols-2 gap-3">
                    {outfits.map((outfit, i) => (
                      <OutfitCard
                        key={i}
                        outfit={outfit}
                        index={i}
                        onSave={() => storeSave(outfit)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
