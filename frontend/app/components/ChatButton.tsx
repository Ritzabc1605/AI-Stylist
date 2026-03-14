"use client";

import { useState, useRef, useEffect } from "react";

const suggestions = [
  "Pink sarees under ₹3k",
  "Office wear for women",
  "5-day Goa vacation outfits",
  "Bridal lehengas",
  "Casual kurta sets",
  "Festive wear under ₹5k",
];

export default function ChatButton() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  const handleSuggestion = (text: string) => {
    setInput(text);
    inputRef.current?.focus();
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-20 right-4 z-40 flex items-center gap-2 bg-[#8B1538] text-white rounded-full shadow-lg px-4 py-3 text-sm font-semibold hover:bg-[#6e102c] active:scale-95 transition-all"
        aria-label="Open AI Stylist"
      >
        <SparkleIcon />
        <span>AI Stylist</span>
      </button>

      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-50 bg-black/40 transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Bottom Sheet */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl transition-transform duration-300 ease-out ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ maxHeight: "80vh" }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-3 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#8B1538] flex items-center justify-center">
              <SparkleIcon small />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">AI Stylist</h2>
              <p className="text-xs text-gray-400">Ask me anything about fashion</p>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="px-5 pb-2">
          <div className="h-px bg-gray-100" />
        </div>

        {/* Suggestions */}
        <div className="px-5 py-3">
          <p className="text-xs text-gray-400 font-medium mb-2 uppercase tracking-wide">Try asking</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => handleSuggestion(s)}
                className="text-xs px-3 py-1.5 rounded-full border border-[#8B1538]/30 text-[#8B1538] bg-[#8B1538]/5 hover:bg-[#8B1538]/10 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="px-5 pb-6 pt-2">
          <div className="flex items-end gap-2 bg-gray-50 rounded-2xl border border-gray-200 p-3 focus-within:border-[#8B1538] transition-colors">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='e.g. "suggest outfits for a 5 day Goa trip each under ₹5k"'
              rows={2}
              className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 resize-none outline-none leading-relaxed"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  // handle send – wire to backend later
                }
              }}
            />
            <button
              disabled={!input.trim()}
              className="mb-0.5 w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-xl bg-[#8B1538] disabled:bg-gray-200 text-white disabled:text-gray-400 transition-colors"
            >
              <SendIcon />
            </button>
          </div>
          <p className="text-[11px] text-gray-400 mt-2 text-center">
            Powered by AI · Suggestions are personalised
          </p>
        </div>
      </div>
    </>
  );
}

function SparkleIcon({ small }: { small?: boolean }) {
  const size = small ? 16 : 18;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l2.4 7.2H22l-6.2 4.5 2.4 7.2L12 17l-6.2 3.9 2.4-7.2L2 9.2h7.6z" fill="currentColor" stroke="none" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}
