"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStylistStore } from "../../store/stylistStore";

const CHIPS = [
  "10 day Bali trip under ₹20,000",
  "5 day Europe trip under ₹15,000 per outfit",
  "Weekend Goa getaway under ₹10,000",
  "3 day hill station trip under ₹8,000",
];

const MIRANDA_CARDS = [
  {
    title: "Beach vacation looks",
    gradient: "from-teal-400 to-cyan-600",
  },
  {
    title: "Festive occasion outfits",
    gradient: "from-rose-400 to-pink-700",
  },
  {
    title: "City sightseeing style",
    gradient: "from-violet-400 to-purple-700",
  },
];

export default function SearchModal() {
  const { isSearchModalOpen, closeSearch, submitSearch } = useStylistStore();
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchModalOpen) {
      setInput("");
      // slight delay so the animation completes before focus
      const t = setTimeout(() => inputRef.current?.focus(), 150);
      return () => clearTimeout(t);
    }
  }, [isSearchModalOpen]);

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    submitSearch(trimmed);
    setInput("");
  };

  return (
    <AnimatePresence>
      {isSearchModalOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={closeSearch}
          />

          {/* Full-screen modal slides up from bottom */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 320 }}
            className="fixed inset-0 z-50 bg-[#FAF7F4] flex flex-col"
          >
            {/* Top bar */}
            <div className="flex items-center gap-3 px-4 pt-12 pb-3 bg-white shadow-sm flex-shrink-0">
              <button
                onClick={closeSearch}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 flex-shrink-0"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#374151"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <path d="M19 12H5m7-7l-7 7 7 7" />
                </svg>
              </button>

              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="e.g. 10 day Bali trip under ₹20,000"
                className="flex-1 bg-transparent text-sm text-gray-800 outline-none placeholder-gray-400 min-w-0"
              />

              <button
                onClick={handleSubmit}
                disabled={!input.trim()}
                className="bg-[#C2185B] text-white text-xs font-semibold px-4 py-2 rounded-full disabled:opacity-40 flex-shrink-0 transition-opacity"
              >
                Find Outfits
              </button>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto px-4 pt-6">
              {/* Suggestion chips */}
              <div className="flex flex-wrap gap-2 mb-7">
                {CHIPS.map((chip) => (
                  <button
                    key={chip}
                    onClick={() => setInput(chip)}
                    className="text-xs border border-gray-300 bg-white text-gray-600 px-3 py-1.5 rounded-full active:bg-gray-50 transition-colors"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* AI Miranda Suggests */}
              <div className="mb-8">
                <h3 className="text-sm font-bold text-gray-900 mb-3">
                  AI Miranda Suggests
                </h3>
                <div className="flex flex-col gap-3">
                  {MIRANDA_CARDS.map((card) => (
                    <button
                      key={card.title}
                      onClick={() => setInput(card.title)}
                      className={`w-full h-20 rounded-2xl bg-gradient-to-r ${card.gradient} flex items-center px-5 text-white font-semibold text-sm text-left active:opacity-90 transition-opacity`}
                    >
                      {card.title}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
