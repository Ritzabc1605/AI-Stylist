"use client";

import BottomNav from "./components/BottomNav";
import ChatButton from "./components/ChatButton";
import SearchModal from "./components/SearchModal";
import OutfitResultsDrawer from "./components/OutfitResultsDrawer";
import { useStylistStore } from "../store/stylistStore";

const categories = ["Women", "Men", "Kids"];
const categoryChips = ["Sarees", "T-shirts", "Western", "Ethnic", "Bridal wear"];

const recentlyAdded = [
  { name: "Anaya Couture", sub: "Lehengas & Anarkalis", color: "#E8D5C4" },
  { name: "Ethniq Studio", sub: "Festive kurta sets", color: "#C8D8C0" },
  { name: "Zuri Threads", sub: "All Sarees", color: "#D4C8E0" },
];

const offerZone = [
  { name: "Anaya Couture", discount: "20% OFF", timeLeft: "01d : 04h : 23m", color: "#D4A8B4" },
  { name: "Ethniq Studio", discount: "20% OFF", timeLeft: "02d : 04h : 23m", color: "#A8C4D4" },
  { name: "Zuri Threads", discount: "20% OFF", timeLeft: "03d : 04h : 23m", color: "#C4D4A8" },
];

const boutiques = [
  {
    name: "Anaya Couture",
    initial: "A",
    color: "#8B1538",
    items: [
      { name: "Orange Anarkali Set", price: "₹5,499", originalPrice: "₹7,499", discount: "Flat 10% Off", color: "#E8C8A0" },
      { name: "Crimson Kanjeevaram S…", price: "₹15,499", originalPrice: "₹18,999", discount: "Flat 15% Off", color: "#C8A0A0" },
    ],
  },
  {
    name: "Zuri threads",
    initial: "Z",
    color: "#2C5F2E",
    items: [
      { name: "Block Print Anarkali", price: "₹5,499", originalPrice: "₹7,499", discount: "Flat 10% Off", color: "#A8C8A0" },
      { name: "Indigo Cotton Saree", price: "₹15,499", originalPrice: "₹18,999", discount: "Flat 15% Off", color: "#A0A8C8" },
    ],
  },
  {
    name: "TWL Wears",
    initial: "tw",
    color: "#1A3A5C",
    items: [
      { name: "Navy Blazer Set", price: "₹5,499", originalPrice: "₹7,499", discount: "Flat 10% Off", color: "#A0B8C8" },
      { name: "Silk Coord Set", price: "₹15,499", originalPrice: "₹18,999", discount: "Flat 15% Off", color: "#C8B8A0" },
    ],
  },
];

const bestsellers = [
  { name: "Yellow Block Print Anarkali", price: "₹5,499", boutique: "Zuri Threads", color: "#F0D080" },
  { name: "Ram Red Ruffle Lehenga", price: "₹5,499", boutique: "Anaya Couture", color: "#E08080" },
  { name: "Floral Organza Saree", price: "₹7,499", boutique: "Anaya Couture", color: "#D4C8E0" },
  { name: "Silver Deep neck Party gown", price: "₹6,499", boutique: "TWL Wears", color: "#C8D4E0" },
];

const shopCategories = [
  { name: "Sarees", color: "#D4A8B4" },
  { name: "Kurti sets", color: "#A8C4D4" },
  { name: "Dresses", color: "#C4D4A8" },
  { name: "Lehengas", color: "#E8D4A0" },
  { name: "Shirts", color: "#A0C4C8" },
  { name: "Summer edition", color: "#E0C8A0" },
];

export default function Home() {
  const { openSearch } = useStylistStore();
  return (
    <div className="bg-[#FAF7F4] min-h-screen pb-20">
      {/* Header */}
      <header className="bg-white sticky top-0 z-20 shadow-sm">
        <div className="flex items-center justify-between px-4 pt-3 pb-2">
          <div>
            <h1 className="text-xl font-bold text-[#8B1538] tracking-widest">LA BELD</h1>
            <div className="flex items-center gap-1 mt-0.5">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#8B1538" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <span className="text-[10px] text-gray-500">Indiranagar ↓</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="text-gray-500">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
            </button>
            <button className="text-gray-500">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-4 pb-3">
          <div onClick={openSearch} className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2.5 cursor-pointer active:bg-gray-200 transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <span className="text-sm text-gray-400">Search "lehengas"</span>
          </div>
        </div>

        {/* Gender Tabs */}
        <div className="flex border-b border-gray-100 px-4">
          {categories.map((cat, i) => (
            <button
              key={cat}
              className={`text-sm font-medium pb-2 mr-6 border-b-2 transition-colors ${
                i === 0
                  ? "text-[#8B1538] border-[#8B1538]"
                  : "text-gray-400 border-transparent"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      {/* Category Chips */}
      <div className="px-4 py-3 flex gap-2 overflow-x-auto no-scrollbar">
        {categoryChips.map((chip, i) => (
          <button
            key={chip}
            className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${
              i === 0
                ? "bg-[#8B1538] text-white border-[#8B1538]"
                : "border-gray-300 text-gray-600 bg-white"
            }`}
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Hero Banner */}
      <div className="mx-4 rounded-2xl overflow-hidden relative h-44 bg-gradient-to-br from-[#2D1B1E] to-[#5C2D3A] flex items-end">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="relative z-10 p-4">
          <p className="text-xs text-amber-300 font-medium mb-1">India's Most</p>
          <h2 className="text-lg font-bold text-white leading-tight">Discover India's Most<br /><span className="italic text-amber-300">Loved</span> Boutiques</h2>
          <p className="text-[10px] text-gray-300 mt-1 mb-3">Shop curated edits, exclusive offers, and handcrafted collections straight from designers you'll love.</p>
          <button className="bg-white text-[#8B1538] text-xs font-semibold px-4 py-1.5 rounded-full">Explore All Boutiques</button>
        </div>
      </div>

      {/* Recently Added */}
      <section className="mt-5 px-4">
        <h3 className="text-sm font-bold text-gray-900 mb-1">Recently Added</h3>
        <p className="text-xs text-gray-400 mb-3">Fresh drops from top boutiques—curated for your style story.</p>
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {recentlyAdded.map((item) => (
            <div key={item.name} className="flex-shrink-0 w-32">
              <div
                className="w-32 h-36 rounded-xl mb-2"
                style={{ background: `linear-gradient(135deg, ${item.color}, ${item.color}99)` }}
              />
              <p className="text-xs font-semibold text-gray-900 leading-tight">{item.name}</p>
              <p className="text-[10px] text-gray-400">{item.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Offer Zone */}
      <section className="mt-5 mx-4 bg-[#FFF0E8] rounded-2xl p-4">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="text-[10px] font-bold text-amber-600 tracking-widest uppercase">Offer Zone</span>
        </div>
        <h3 className="text-sm font-bold text-gray-900 mb-3">Boutique Deals You Can't Miss</h3>
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {offerZone.map((item) => (
            <div key={item.name} className="flex-shrink-0 w-32">
              <div
                className="w-32 h-36 rounded-xl mb-2 flex flex-col items-center justify-end p-2"
                style={{ background: `linear-gradient(135deg, ${item.color}, ${item.color}88)` }}
              >
                <span className="bg-[#8B1538] text-white text-[9px] font-bold px-2 py-0.5 rounded-full mb-1">{item.discount}</span>
                <span className="text-[9px] text-white bg-black/30 rounded px-1.5 py-0.5">{item.timeLeft}</span>
              </div>
              <p className="text-xs font-semibold text-gray-900">{item.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Best From Your Boutiques */}
      <section className="mt-5 px-4">
        <h3 className="text-sm font-bold text-gray-900 mb-1">Best From Your Boutiques</h3>
        <p className="text-xs text-gray-400 mb-4">Handpicked bestsellers and trending styles from the boutiques you follow.</p>

        {boutiques.map((boutique) => (
          <div key={boutique.name} className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                style={{ background: boutique.color }}
              >
                {boutique.initial}
              </div>
              <span className="text-sm font-semibold text-gray-900">{boutique.name}</span>
            </div>
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
              {boutique.items.map((item) => (
                <div key={item.name} className="flex-shrink-0 w-36">
                  <div
                    className="w-36 h-40 rounded-xl mb-2 relative"
                    style={{ background: `linear-gradient(145deg, ${item.color}, ${item.color}88)` }}
                  >
                    <span className="absolute top-2 left-2 bg-[#8B1538] text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full">{item.discount}</span>
                  </div>
                  <p className="text-xs font-medium text-gray-800 leading-tight">{item.name}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="text-xs font-bold text-gray-900">{item.price}</span>
                    <span className="text-[10px] text-gray-400 line-through">{item.originalPrice}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Bestselling Products */}
      <section className="mt-2 px-4">
        <h3 className="text-sm font-bold text-gray-900 mb-1">Bestselling Products</h3>
        <p className="text-xs text-gray-400 mb-3">Shop boutique favourites loved by hundreds of customers.</p>
        <div className="grid grid-cols-2 gap-3">
          {bestsellers.map((item) => (
            <div key={item.name}>
              <div
                className="w-full h-44 rounded-xl mb-2"
                style={{ background: `linear-gradient(145deg, ${item.color}, ${item.color}88)` }}
              />
              <p className="text-[10px] text-gray-400">{item.boutique}</p>
              <p className="text-xs font-medium text-gray-800 leading-tight">{item.name}</p>
              <p className="text-xs font-bold text-gray-900 mt-0.5">{item.price}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Shop by Category */}
      <section className="mt-6 px-4 mb-4">
        <h3 className="text-sm font-bold text-gray-900 mb-3">Shop by Category</h3>
        <div className="grid grid-cols-3 gap-3">
          {shopCategories.map((cat) => (
            <div key={cat.name} className="flex flex-col items-center gap-1.5">
              <div
                className="w-20 h-20 rounded-full"
                style={{ background: `linear-gradient(145deg, ${cat.color}, ${cat.color}88)` }}
              />
              <span className="text-xs font-medium text-gray-700">{cat.name}</span>
            </div>
          ))}
        </div>
        <button className="w-full mt-4 text-sm text-[#8B1538] font-semibold border border-[#8B1538]/30 rounded-xl py-2.5">
          View all
        </button>
      </section>

      <BottomNav />
      <ChatButton />
      <SearchModal />
      <OutfitResultsDrawer />
    </div>
  );
}
