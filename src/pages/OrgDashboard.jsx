import { useState, useEffect } from "react";
import { ref, push, onValue, query, orderByChild, equalTo } from "firebase/database";
import { db } from "../../firebase";
import { useAuth } from "../context/AuthContext";

const PROBLEM_TYPES = [
  { value: "mexanika", label: "Mexanika-mashinasozlik" },
  { value: "energetika", label: "Energetika muhandisligi" },
  { value: "kimyo", label: "Kimyo texnologiya" },
  { value: "arxitektura", label: "Arxitektura va qurilish" },
  { value: "boshqaruv", label: "Ishlab chiqarishda boshqaruv" },
  { value: "yengil_sanoat", label: "Yengil sanoat va to‘qimachilik" },
  { value: "axborot_texnologiyalari", label: "Axborot texnologiyalari va telekommunikatsiya" },
  { value: "Boshqa", label: "Boshqa" },
];

// SVG Ikonkalar (Komponent ichida ortiqcha joy egallamasligi uchun tashqarida)
const Icons = {
  Plus: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  ),
  Building: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h18M9 6h6m-6 3h6m-6 3h6" />
    </svg>
  ),
  Clock: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Check: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  )
};

export default function OrgDashboard() {
  const { user } = useAuth();
  const [problems, setProblems] = useState([]);
  const [newProblem, setNewProblem] = useState("");
  const [problemType, setProblemType] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);
    const problemsRef = query(ref(db, "problems"), orderByChild("orgId"), equalTo(user.id));

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
  }, [user?.id]);

  const submitNewProblem = () => {
    if (!newProblem.trim() || !problemType) {
      alert("Iltimos, barcha maydonlarni to'ldiring");
      return;
    }
    push(ref(db, "problems"), {
      orgId: user.id,
      orgName: user.name,
      text: newProblem,
      type: problemType,
      status: "new",
      createdAt: Date.now(),
    });
    setNewProblem("");
    setProblemType("");
  };

  const getTypeLabel = (value) => PROBLEM_TYPES.find((t) => t.value === value)?.label || value;

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 lg:p-12 text-slate-900 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* ================= HEADER ================= */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Tashkilot Paneli</h1>
            <p className="text-slate-500 font-medium">Muammolar va yechimlar monitoringi</p>
          </div>
          
          <div className="flex items-center gap-4 bg-white p-2 pr-5 rounded-2xl shadow-sm border border-slate-200">
            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
              <Icons.Building />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Tashkilot</p>
              <p className="font-bold text-slate-700">{user?.name || "Noma'lum"}</p>
            </div>
          </div>
        </div>

        {/* ================= MAIN CONTENT ================= */}
        <div className="grid lg:grid-cols-12 gap-10">
          
          {/* LEFT: FORM */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 sticky top-8">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="w-2 h-8 bg-indigo-600 rounded-full inline-block"></span>
                Yangi murojaat
              </h2>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-2 ml-1">Kategoriya</label>
                  <select
                    className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl focus:border-indigo-500 focus:bg-white outline-none transition-all appearance-none cursor-pointer"
                    value={problemType}
                    onChange={(e) => setProblemType(e.target.value)}
                  >
                    <option value="">Muammo turini tanlang...</option>
                    {PROBLEM_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-2 ml-1">Batafsil tavsif</label>
                  <textarea
                    className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl h-44 focus:border-indigo-500 focus:bg-white outline-none transition-all resize-none"
                    placeholder="Muammoni qisqacha va aniq yozing..."
                    value={newProblem}
                    onChange={(e) => setNewProblem(e.target.value)}
                  />
                </div>

                <button
                  onClick={submitNewProblem}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-indigo-200 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <Icons.Plus /> Yuborish
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: LIST */}
          <div className="lg:col-span-7">
            <div className="flex items-center justify-between mb-6 px-2">
              <h2 className="text-xl font-bold text-slate-800">Mening muammolarim</h2>
              <div className="px-4 py-1 bg-slate-200 rounded-full text-xs font-black text-slate-600 italic">
                {problems.length} TA
              </div>
            </div>

            <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2 scrollbar-hide">
              {loading ? (
                <div className="text-center py-20 text-slate-400 font-medium animate-pulse">Ma'lumotlar yuklanmoqda...</div>
              ) : problems.length === 0 ? (
                <div className="bg-white rounded-3xl p-16 text-center border-2 border-dashed border-slate-200">
                  <p className="text-slate-400 font-medium">Hozircha muammolar mavjud emas.</p>
                </div>
              ) : (
                problems.map((p) => (
                  <div key={p.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 hover:shadow-xl hover:shadow-slate-200/60 transition-all group">
                    <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                      <span className="px-4 py-1.5 bg-indigo-50 text-indigo-700 text-[11px] font-black uppercase tracking-widest rounded-xl">
                        {getTypeLabel(p.type)}
                      </span>
                      <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                        <Icons.Clock />
                        {new Date(p.createdAt).toLocaleDateString("uz-UZ")}
                      </div>
                    </div>

                    <p className="text-slate-700 font-semibold leading-relaxed mb-6 group-hover:text-slate-900 transition-colors">
                      {p.text}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                      <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase
                        ${p.status === "new" ? "bg-orange-50 text-orange-600" : ""}
                        ${p.status === "progress" ? "bg-blue-50 text-blue-600" : ""}
                        ${p.status === "done" ? "bg-emerald-50 text-emerald-600" : ""}
                      `}>
                        {p.status === "done" && <Icons.Check />}
                        {p.status === "new" ? "Yangi" : p.status === "progress" ? "Jarayonda" : "Bajarildi"}
                      </div>
                      
                      <button className="text-slate-300 hover:text-indigo-600 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}