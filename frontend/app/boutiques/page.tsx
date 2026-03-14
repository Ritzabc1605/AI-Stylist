import Link from "next/link";
import BottomNav from "../components/BottomNav";
import ChatButton from "../components/ChatButton";

const featuredBoutiques = [
  {
    name: "Anaya Couture",
    initial: "A",
    tagline: "Specializing in handcrafted lehengas and sarees with a touch of contemporary flair.",
    bgColor: "#3D1A1A",
    accentColor: "#8B1538",
  },
  {
    name: "Zuri Threads",
    initial: "Z",
    tagline: "Known for airy cottons, block prints, and sustainable ethnicwear.",
    bgColor: "#1A3D1A",
    accentColor: "#2C5F2E",
  },
  {
    name: "Vivah Couture",
    initial: "V",
    tagline: "Exquisite bridal and groomswear from renowned designers across India.",
    bgColor: "#1A1A3D",
    accentColor: "#1A2C7A",
  },
];

const curatedBoutiques = [
  { name: "Anaya Couture", initial: "A", color: "#8B1538", desc: "Specializing in handcrafted lehengas and sarees with a touch of contemporary flair." },
  { name: "Zuri Threads", initial: "Z", color: "#2C5F2E", desc: "Known for airy cottons, block prints, and sustainable ethnicwear." },
  { name: "TWL Wears", initial: "tw", color: "#1A3A5C", desc: "Specializing in modern, stylish and glamorous partywear and western wear." },
  { name: "Ethniq Stories", initial: "E", color: "#6B4C2A", desc: "A boutique bringing together heritage crafts from across India—perfect for festive edits." },
  { name: "Vivah Couture", initial: "V", color: "#4A1A6B", desc: "Exquisite bridal and groomswear from renowned designers across India." },
  { name: "Anaya Couture", initial: "A", color: "#8B1538", desc: "Specializing in handcrafted lehengas and sarees with a touch of contemporary flair." },
];

const followedBoutiques = [
  {
    name: "Anaya Couture",
    initial: "A",
    color: "#8B1538",
    items: [
      { label: "Best seller", price: "₹5,499", origPrice: "₹7,499", discount: "Flat 10% Off", color: "#E8C8A0" },
      { label: "Best seller", price: "₹15,499", origPrice: "₹18,999", discount: "Flat 15% Off", color: "#C8A0A0" },
    ],
  },
  {
    name: "Zuri threads",
    initial: "Z",
    color: "#2C5F2E",
    items: [
      { label: "Best seller", price: "₹5,499", origPrice: "₹7,499", discount: "Flat 10% Off", color: "#A8C8A0" },
      { label: "Best seller", price: "₹15,499", origPrice: "₹18,999", discount: "Flat 15% Off", color: "#A0A8C8" },
    ],
  },
  {
    name: "TWL Wears",
    initial: "tw",
    color: "#1A3A5C",
    items: [
      { label: "Best seller", price: "₹5,499", origPrice: "₹7,499", discount: "Flat 10% Off", color: "#A0B8C8" },
      { label: "Best seller", price: "₹15,499", origPrice: "₹18,999", discount: "Flat 15% Off", color: "#C8B8A0" },
    ],
  },
];

export default function BoutiquesPage() {
  return (
    <div className="bg-[#FAF7F4] min-h-screen pb-20">
      {/* Header */}
      <header className="bg-white sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-3 px-4 pt-4 pb-3">
          <Link href="/" className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5m7-7l-7 7 7 7"/></svg>
          </Link>
          <h1 className="text-base font-bold text-gray-900 flex-1">Boutiques</h1>
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
      </header>

      {/* Hero Banner */}
      <div className="mx-4 mt-4 rounded-2xl overflow-hidden relative h-32 bg-gradient-to-br from-amber-700 to-amber-900 flex items-center p-4">
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: "radial-gradient(circle at 80% 50%, #FCD34D 0%, transparent 60%)" }}
        />
        <div className="relative z-10">
          <h2 className="text-base font-bold text-white leading-tight">Discover India's Finest<br />Boutiques</h2>
          <p className="text-[10px] text-amber-200 mt-1">From luxury bridal couture to everyday ethnic edits — explore boutique collections crafted for you.</p>
        </div>
      </div>

      {/* Featured Boutiques */}
      <section className="mt-5 px-4">
        <h3 className="text-sm font-bold text-gray-900 mb-1">Featured Boutiques</h3>
        <p className="text-xs text-gray-400 mb-3">Handpicked boutique partners bringing their signature styles to Silhouette.</p>
        <div className="flex flex-col gap-3">
          {featuredBoutiques.map((b) => (
            <div
              key={b.name}
              className="relative w-full h-48 rounded-2xl overflow-hidden flex flex-col items-center justify-end pb-5"
              style={{ background: `linear-gradient(160deg, ${b.bgColor}, #000)` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <button
                className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/20 flex items-center justify-center"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
              </button>
              <div className="relative z-10 flex flex-col items-center text-center px-6">
                <div
                  className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center text-white font-bold text-base mb-2"
                  style={{ background: b.accentColor }}
                >
                  {b.initial}
                </div>
                <p className="text-sm font-bold text-white">{b.name}</p>
                <p className="text-[10px] text-gray-300 mt-0.5 mb-3">{b.tagline}</p>
                <button className="bg-white text-gray-900 text-xs font-semibold px-5 py-1.5 rounded-full">Explore</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Curated for You */}
      <section className="mt-6 px-4">
        <h3 className="text-sm font-bold text-gray-900 mb-3">Curated boutiques for you</h3>
        <div className="grid grid-cols-2 gap-3">
          {curatedBoutiques.map((b, i) => (
            <div key={`${b.name}-${i}`} className="bg-white rounded-2xl p-3 shadow-sm flex items-start gap-2">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5"
                style={{ background: b.color }}
              >
                {b.initial}
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-900 leading-tight">{b.name}</p>
                <p className="text-[10px] text-gray-400 mt-0.5 leading-tight line-clamp-3">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Boutiques You Follow */}
      <section className="mt-6 px-4">
        <div className="mb-1">
          <span className="text-[10px] font-bold text-amber-600 tracking-widest uppercase">Boutiques You Follow</span>
        </div>
        <p className="text-xs text-gray-400 mb-4">Handpicked bestsellers and trending styles from the boutiques you love.</p>

        {followedBoutiques.map((b) => (
          <div key={b.name} className="mb-5">
            <div className="flex items-center gap-2 mb-2.5">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                style={{ background: b.color }}
              >
                {b.initial}
              </div>
              <span className="text-sm font-semibold text-gray-900">{b.name}</span>
            </div>
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
              {b.items.map((item, idx) => (
                <div key={idx} className="flex-shrink-0 w-36">
                  <div
                    className="w-36 h-40 rounded-xl mb-2 relative"
                    style={{ background: `linear-gradient(145deg, ${item.color}, ${item.color}88)` }}
                  >
                    <span className="absolute top-2 left-2 bg-[#8B1538] text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full">{item.discount}</span>
                    <span className="absolute top-2 right-2 bg-amber-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-gray-900">{item.price}</span>
                    <span className="text-[10px] text-gray-400 line-through">{item.origPrice}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <button className="w-full mt-2 bg-[#8B1538] text-white text-sm font-semibold rounded-2xl py-3">
          View All Boutiques
        </button>
      </section>

      <BottomNav />
      <ChatButton />
    </div>
  );
}
