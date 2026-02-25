import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../../firebase";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Search, Filter, LogOut, LayoutDashboard, Briefcase, Calendar, MapPin } from "lucide-react"; // Ikonkalar uchun: npm install lucide-react

const PROBLEM_TYPES = [
  { value: "all", label: "Barchasi" },
  { value: "mexanika", label: "Mexanika-mashinasozlik" },
  { value: "energetika", label: "Energetika muhandisligi" },
  { value: "kimyo", label: "Kimyo texnologiya" },
  { value: "arxitektura", label: "Arxitektura va qurilish" },
  { value: "boshqaruv", label: "Ishlab chiqarishda boshqaruv" },
  { value: "yengil_sanoat", label: "Yengil sanoat" },
  { value: "axborot_texnologiyalari", label: "Axborot texnologiyalari" },
  { value: "Boshqa", label: "Boshqa" },
];

export default function Home() {
  const { user, logout } = useAuth();
  const [problems, setProblems] = useState([]);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const problemsRef = ref(db, "problems");
    return onValue(problemsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.keys(data)
          .map((key) => ({ id: key, ...data[key] }))
          .sort((a, b) => b.createdAt - a.createdAt);
        setProblems(list);
      } else {
        setProblems([]);
      }
      setLoading(false);
    });
  }, []);

  const filteredProblems = problems.filter((p) => {
    const matchesSearch = p.text.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === "all" ? true : p.type === filterType;
    return matchesSearch && matchesType;
  });

  const getStatusStyle = (status) => {
    switch (status) {
      case "new": return "bg-amber-100 text-amber-700 border-amber-200";
      case "progress": return "bg-blue-100 text-blue-700 border-blue-200";
      case "done": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-indigo-100">
      
      {/* --- MODERN NAVBAR --- */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-18 items-center py-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                <img src="/logo.png" alt="" />
              </div>
              <h1 className="text-xl font-extrabold tracking-tight text-slate-800">
  Inno<span className="text-indigo-600">Bridge</span>
</h1>
            </div>

            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <div className="hidden md:block text-right mr-2">
                    <p className="text-sm font-bold text-slate-800 leading-none">{user.name}</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">Foydalanuvchi</p>
                  </div>
                  <Link to="/dashboard" className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-medium transition-all shadow-sm active:scale-95 text-sm">
                    <LayoutDashboard size={18} />
                    <span>Dashboard</span>
                  </Link>
                  <button onClick={logout} className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors rounded-xl">
                    <LogOut size={20} />
                  </button>
                </>
              ) : (
                <Link to="/login" className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-md shadow-indigo-100 active:scale-95 text-sm">
                  Kirish
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* --- HERO & FILTERS --- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-10 text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">Dolzarb muammolarga <br className="hidden md:block" /> innovatsion yechimlar</h2>
          <p className="text-slate-500 max-w-2xl">Mavjud muammolarni ko'ring va o'z yechimlaringizni taklif qiling.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-12 items-center bg-white p-2 rounded-2xl shadow-sm border border-slate-200">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Muammo nomini yozing..."
              className="w-full outline-none pl-12 pr-4 py-3.5 bg-transparent border-none focus:ring-0 text-slate-700 placeholder:text-slate-400 font-medium"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="h-8 w-[1px] bg-slate-200 hidden md:block"></div>

          <div className="relative w-full md:w-72 flex items-center pr-2">
            <Filter className="absolute left-4 text-slate-400" size={18} />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full pl-11 pr-8 py-3.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500/20 text-slate-600 font-semibold appearance-none cursor-pointer"
            >
              {PROBLEM_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* --- CONTENT GRID --- */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 animate-pulse">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-slate-500 font-medium">Ma'lumotlar yuklanmoqda...</p>
          </div>
        ) : filteredProblems.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl py-20 text-center">
            <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
               <Search className="text-slate-300" size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Muammolar topilmadi</h3>
            <p className="text-slate-400">Qidiruv so'zini o'zgartirib ko'ring yoki boshqa bo'limni tanlang.</p>
          </div>
        ) : (
          // ... (tepadagi kodlar)

<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
  {filteredProblems.map((p) => (
    <Link
      to={`/problem/${p.id}`} // Mana bu qator yo'naltirishni ta'minlaydi
      key={p.id}
      className="group bg-white rounded-[24px] border border-slate-200 p-7 transition-all duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] hover:-translate-y-1 relative overflow-hidden flex flex-col cursor-pointer"
    >
      {/* Karta ichidagi qolgan hamma narsa o'zgarishsiz qoladi */}
      <div className="flex justify-between items-start mb-6">
        <div className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[11px] font-bold uppercase tracking-wider rounded-lg border border-indigo-100">
          {p.type}
        </div>
        <div className={`px-3 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider border ${getStatusStyle(p.status)}`}>
          {p.status}
        </div>
      </div>

      <h4 className="text-slate-800 font-bold text-lg leading-snug mb-4 group-hover:text-indigo-600 transition-colors line-clamp-3 flex-grow">
        {p.text}
      </h4>

      <div className="mt-auto pt-6 border-t border-slate-50 space-y-3">
        <div className="flex items-center gap-2 text-slate-500">
          <MapPin size={14} className="text-slate-400" />
          <span className="text-xs font-semibold">{p.orgName}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <Calendar size={14} />
          <span className="text-[11px]">{new Date(p.createdAt).toLocaleDateString("uz-UZ")}</span>
        </div>
      </div>
      
      <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-full -mr-12 -mt-12 opacity-0 group-hover:opacity-100 transition-opacity"></div>
    </Link>
  ))}
</div>
        )}
      </main>

      {/* --- FOOTER --- */}
      <footer className="py-10 border-t border-slate-200 mt-20">
         <p className="text-center text-slate-400 text-sm font-medium">© 2026 Ochiq Muammolar Platformasi. Barcha huquqlar himoyalangan.</p>
      </footer>
    </div>
  );
}