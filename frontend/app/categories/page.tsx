import Link from "next/link";
import BottomNav from "../components/BottomNav";
import ChatButton from "../components/ChatButton";

const womenCategories = [
  { name: "Sarees", count: 12, color: "#D4A8B4" },
  { name: "Anarkalis", count: 12, color: "#C8A0A0" },
  { name: "Co-ord sets", count: 12, color: "#A8C4D4" },
  { name: "Lehengas", count: 12, color: "#E8D4A0" },
  { name: "Kurta sets", count: 12, color: "#C4D4A8" },
  { name: "Bridal wear", count: 12, color: "#E8C4D4" },
  { name: "Shirts", count: 12, color: "#D0D0D0" },
  { name: "Chikankari sets", count: 12, color: "#D4C8E0" },
  { name: "Western dresses", count: 12, color: "#C8D8D0" },
  { name: "Ethnic fusion", count: 12, color: "#E0D4B8" },
];

const menCategories = [
  { name: "Kurtas", count: 12, color: "#C4D0E0" },
  { name: "Shirts", count: 12, color: "#D0C4C4" },
  { name: "Blazers", count: 12, color: "#C4C8D0" },
  { name: "Sherwanis", count: 12, color: "#D4C8A8" },
  { name: "Nehru jackets", count: 12, color: "#C0D4C0" },
  { name: "Co-ord sets", count: 12, color: "#D8C8B8" },
];

export default function CategoriesPage() {
  return (
    <div className="bg-[#FAF7F4] min-h-screen pb-20">
      {/* Header */}
      <header className="bg-white sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-3 px-4 pt-4 pb-3">
          <Link href="/" className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5m7-7l-7 7 7 7"/></svg>
          </Link>
          <h1 className="text-base font-bold text-gray-900 flex-1">Categories</h1>
          <button className="text-gray-500">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </button>
          <button className="text-gray-500">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
          </button>
          <button className="text-gray-500">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
          </button>
        </div>

        {/* Gender Tabs */}
        <div className="flex px-4 border-b border-gray-100">
          <GenderTab label="Women" avatar="👩" active />
          <GenderTab label="Men" avatar="👨" active={false} />
        </div>
      </header>

      {/* Browse by Category */}
      <section className="px-4 mt-5">
        <h2 className="text-sm font-bold text-gray-900 mb-3">Browse by Category</h2>
        <div className="flex flex-col gap-2">
          {womenCategories.map((cat) => (
            <button
              key={cat.name}
              className="flex items-center gap-3 bg-white rounded-2xl p-3 shadow-sm active:scale-[0.99] transition-transform"
            >
              <div
                className="w-14 h-14 rounded-xl flex-shrink-0"
                style={{ background: `linear-gradient(135deg, ${cat.color}, ${cat.color}88)` }}
              />
              <div className="flex-1 text-left">
                <p className="text-sm font-semibold text-gray-900">{cat.name}</p>
                <p className="text-xs text-gray-400">{cat.count} items in this category</p>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          ))}
        </div>
      </section>

      <BottomNav />
      <ChatButton />
    </div>
  );
}

function GenderTab({ label, avatar, active }: { label: string; avatar: string; active: boolean }) {
  return (
    <button
      className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold border-b-2 mr-2 transition-colors ${
        active
          ? "text-[#8B1538] border-[#8B1538]"
          : "text-gray-400 border-transparent"
      }`}
    >
      <span className="text-base">{avatar}</span>
      {label}
    </button>
  );
}
