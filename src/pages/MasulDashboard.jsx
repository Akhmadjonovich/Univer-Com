import { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../../firebase";

const PROBLEM_TYPES = [
  { value: "all", label: "Barcha yo'nalishlar" },
  { value: "mexanika", label: "Mexanika-mashinasozlik" },
  { value: "energetika", label: "Energetika muhandisligi" },
  { value: "kimyo", label: "Kimyo texnologiya" },
  { value: "arxitektura", label: "Arxitektura va qurilish" },
  { value: "boshqaruv", label: "Ishlab chiqarishda boshqaruv" },
  { value: "yengil_sanoat", label: "Yengil sanoat va to‘qimachilik" },
  { value: "axborot_texnologiyalari", label: "Axborot texnologiyalari" },
  { value: "Boshqa", label: "Boshqa" },

];

const Icons = {
  Building: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
    </svg>
  ),
  Copy: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
    </svg>
  ),
  Search: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
  ),
  Phone: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
    </svg>
  )
};

export default function MasulDashboard() {
  const [orgs, setOrgs] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [problems, setProblems] = useState([]);
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    const orgRef = ref(db, "users");
    return onValue(orgRef, (snap) => {
      const data = snap.val();
      if (!data) return setOrgs([]);
      const list = Object.keys(data)
        .map((id) => ({ id, ...data[id] }))
        .filter((u) => u.role === "tashkilot");
      setOrgs(list);
    });
  }, []);

  useEffect(() => {
    if (!selectedOrg) return;
    const problemsRef = ref(db, "problems");
    return onValue(problemsRef, (snap) => {
      const data = snap.val();
      if (!data) return setProblems([]);
      let list = Object.keys(data)
        .map((id) => ({ id, ...data[id] }))
        .filter((p) => p.orgId === selectedOrg.id);
      if (typeFilter !== "all") {
        list = list.filter((p) => p.type === typeFilter);
      }
      list.sort((a, b) => b.createdAt - a.createdAt);
      setProblems(list);
    });
  }, [selectedOrg, typeFilter]);

  const copyText = (text) => {
    navigator.clipboard.writeText(text);
    // Alert o'rniga yumshoqroq bildirishnoma ham qilish mumkin
    alert("Nusxalandi ✅");
  };

  const getTypeLabel = (value) =>
    PROBLEM_TYPES.find((t) => t.value === value)?.label || value;

  return (
    <div className="flex flex-col md:flex-row bg-[#f8fafc] h-screen overflow-hidden text-slate-900 font-sans">
      
      {/* ================= LEFT SIDEBAR (Organizations) ================= */}
      <aside className="md:w-80 w-full bg-white border-r border-slate-200 flex flex-col h-full shadow-sm">
        <div className="p-6 border-b border-slate-100 bg-white sticky top-0 z-10">
          <h2 className="text-xl font-black tracking-tight text-indigo-600 mb-1">Tashkilotlar</h2>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Ro'yxat ({orgs.length})</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
          {orgs.map((o) => (
            <div
              key={o.id}
              onClick={() => setSelectedOrg(o)}
              className={`p-4 rounded-2xl cursor-pointer transition-all duration-200 group border
                ${selectedOrg?.id === o.id 
                  ? "bg-indigo-600 border-indigo-600 shadow-lg shadow-indigo-100 scale-[1.02]" 
                  : "bg-white border-slate-100 hover:border-indigo-200 hover:bg-slate-50"
                }
              `}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl transition-colors ${selectedOrg?.id === o.id ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500 group-hover:bg-indigo-50"}`}>
                  <Icons.Building />
                </div>
                <div className="overflow-hidden">
                  <p className={`font-bold truncate ${selectedOrg?.id === o.id ? "text-white" : "text-slate-700"}`}>
                    {o.name}
                  </p>
                  <p className={`text-xs flex items-center gap-1 ${selectedOrg?.id === o.id ? "text-indigo-100" : "text-slate-400"}`}>
                    <Icons.Phone /> {o.phone}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* ================= RIGHT MAIN AREA ================= */}
      <main className="flex-1 overflow-y-auto bg-[#f8fafc] p-4 md:p-10 lg:p-12 custom-scrollbar">
        {!selectedOrg ? (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
            <div className="w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center mb-4">
              <Icons.Search />
            </div>
            <h3 className="text-xl font-bold text-slate-500">Tashkilot tanlanmagan</h3>
            <p className="max-w-xs mx-auto">Murojaatlarni ko'rish uchun chap tomondagi ro'yxatdan tashkilotni tanlang</p>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
            
            {/* SELECTED ORG INFO */}
            <header className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-indigo-100 rounded-[1.5rem] flex items-center justify-center text-indigo-600 shadow-inner">
                  <Icons.Building />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-800 tracking-tight">{selectedOrg.name}</h2>
                  <p className="flex items-center gap-2 text-slate-500 font-medium">
                    <Icons.Phone /> {selectedOrg.phone}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col items-end border-l-0 md:border-l border-slate-100 pl-0 md:pl-8">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-1">Murojaatlar soni</span>
                <span className="text-4xl font-black text-indigo-600 leading-none">{problems.length}</span>
              </div>
            </header>

            {/* FILTERS SECTION */}
            <div className="flex items-center gap-3">
               <span className="text-sm font-bold text-slate-400 mr-2">Saralash:</span>
               <select
                className="bg-white border-2 border-slate-200 px-4 py-2 rounded-xl focus:border-indigo-500 outline-none font-bold text-sm text-slate-700 cursor-pointer transition-all"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                {PROBLEM_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            {/* PROBLEMS GRID/LIST */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-800 px-2 flex items-center gap-2">
                <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                Muammolar ro'yxati
              </h3>

              {problems.length === 0 ? (
                <div className="bg-white p-12 rounded-[2rem] border-2 border-dashed border-slate-200 text-center italic text-slate-400">
                  Ushbu tashkilotda muammolar topilmadi
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {problems.map((p) => (
                    <div key={p.id} className="bg-white p-6 rounded-[2rem] border border-slate-200 hover:shadow-lg hover:shadow-slate-200 transition-all group">
                      <div className="flex justify-between items-start gap-4 mb-4">
                        <span className="px-4 py-1.5 bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-xl">
                          {getTypeLabel(p.type)}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">
                          {new Date(p.createdAt).toLocaleDateString("uz-UZ")}
                        </span>
                      </div>

                      <p className="text-slate-800 font-semibold leading-relaxed mb-6 group-hover:text-black">
                        {p.text}
                      </p>

                      <div className="flex items-center justify-between pt-5 border-t border-slate-50">
                        <div className="flex items-center gap-2">
                           {/* Status badge - bu yerda sizdagi mavjud statuslarni ishlatsa bo'ladi */}
                           <div className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter
                             ${p.status === 'new' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'}`}>
                             {p.status === 'new' ? 'Ko\'rilmagan' : 'Jarayonda'}
                           </div>
                        </div>

                        <button
                          onClick={() => copyText(p.text)}
                          className="flex items-center gap-2 bg-slate-900 hover:bg-indigo-600 text-white px-5 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-md shadow-slate-200"
                        >
                          <Icons.Copy /> Nusxa ko'chirish
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}