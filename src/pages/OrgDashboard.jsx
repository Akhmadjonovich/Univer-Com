import { useState, useEffect } from "react";
// 1. 'update' funksiyasini import qilamiz
import { ref, push, onValue, query, orderByChild, equalTo, update } from "firebase/database"; 
import { db } from "../../firebase";
import { useAuth } from "../context/AuthContext";
// Lucide-react ikonkalari (npm install lucide-react)
import { 
  Plus, Building2, Clock, CheckCircle2, 
  RotateCcw, PlayCircle, CheckCircle, ChevronRight, Trash2 
} from "lucide-react";

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

  // Statusni yangilash funksiyasi
  const updateStatus = (problemId, newStatus) => {
    const problemRef = ref(db, `problems/${problemId}`);
    update(problemRef, { status: newStatus })
      .then(() => {
        console.log("Status muvaffaqiyatli yangilandi");
      })
      .catch((error) => {
        alert("Xatolik yuz berdi: " + error.message);
      });
  };

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
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 lg:p-12 text-slate-900 font-sans selection:bg-indigo-100">
      <div className="max-w-6xl mx-auto">
        
        {/* ================= HEADER ================= */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Tashkilot <span className="text-indigo-600">Paneli</span></h1>
            <p className="text-slate-500 font-medium mt-1 text-lg">Muammolar monitoringi va boshqaruvi</p>
          </div>
          
          <div className="flex items-center gap-4 bg-white p-3 pr-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-100 transition-transform hover:scale-105">
              <Building2 size={28} />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-0.5">Avtorizatsiya</p>
              <p className="font-extrabold text-slate-800 text-lg">{user?.name || "Noma'lum"}</p>
            </div>
          </div>
        </div>

        {/* ================= MAIN CONTENT ================= */}
        <div className="grid lg:grid-cols-12 gap-12">
          
          {/* LEFT: FORM */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-[2.5rem] p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-slate-100 sticky top-10">
              <h2 className="text-2xl font-black mb-8 flex items-center gap-3 text-slate-800">
                <span className="w-2.5 h-10 bg-indigo-600 rounded-full"></span>
                Yangi muammo
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Kategoriya</label>
                  <select
                    className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all appearance-none cursor-pointer font-semibold text-slate-700"
                    value={problemType}
                    onChange={(e) => setProblemType(e.target.value)}
                  >
                    <option value="">Yo'nalishni tanlang...</option>
                    {PROBLEM_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Muammo tavsifi</label>
                  <textarea
                    className="w-full bg-slate-50 border-2 border-slate-100 p-5 rounded-2xl h-48 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all resize-none font-medium text-slate-700 leading-relaxed"
                    placeholder="Muammo haqida batafsil ma'lumot qoldiring..."
                    value={newProblem}
                    onChange={(e) => setNewProblem(e.target.value)}
                  />
                </div>

                <button
                  onClick={submitNewProblem}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-indigo-200 transition-all active:scale-[0.97] flex items-center justify-center gap-3 group"
                >
                  <Plus className="group-hover:rotate-90 transition-transform" /> 
                  Platformaga joylash
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: LIST */}
          <div className="lg:col-span-7">
            <div className="flex items-center justify-between mb-8 px-2">
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">Mening muammolarim</h2>
              <div className="px-5 py-1.5 bg-slate-100 border border-slate-200 rounded-full text-[11px] font-black text-slate-500 tracking-widest">
                {problems.length} TA AKTIV
              </div>
            </div>

            <div className="space-y-6 max-h-[800px] overflow-y-auto pr-3 scrollbar-thin scrollbar-thumb-slate-200">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-4">
                  <RotateCcw className="animate-spin text-indigo-500" size={32} />
                  <p className="font-bold tracking-widest text-xs uppercase">Ma'lumotlar yuklanmoqda...</p>
                </div>
              ) : problems.length === 0 ? (
                <div className="bg-white rounded-[2.5rem] p-20 text-center border-2 border-dashed border-slate-200 shadow-inner">
                  <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Plus className="text-slate-300" size={40} />
                  </div>
                  <p className="text-slate-400 font-bold text-lg">Hozircha hech qanday muammo joylamadingiz.</p>
                </div>
              ) : (
                problems.map((p) => (
                  <div key={p.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-300 group relative">
                    
                    <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                      <span className="px-4 py-1.5 bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase tracking-[0.15em] rounded-xl border border-indigo-100">
                        {getTypeLabel(p.type)}
                      </span>
                      <div className="flex items-center gap-2 text-slate-400 text-xs font-bold">
                        <Clock size={14} />
                        {new Date(p.createdAt).toLocaleDateString("uz-UZ")}
                      </div>
                    </div>

                    <p className="text-slate-700 font-bold text-lg leading-relaxed mb-8 group-hover:text-slate-900 transition-colors">
                      {p.text}
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-6 pt-6 border-t border-slate-50">
                      
                      {/* STATUS CONTROL AREA */}
                      <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                        <button 
                          onClick={() => updateStatus(p.id, "new")}
                          className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${p.status === "new" ? "bg-amber-500 text-white shadow-lg shadow-amber-200" : "text-slate-400 hover:text-slate-600"}`}
                        >
                          Yangi
                        </button>
                        <button 
                          onClick={() => updateStatus(p.id, "progress")}
                          className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${p.status === "progress" ? "bg-blue-500 text-white shadow-lg shadow-blue-200" : "text-slate-400 hover:text-slate-600"}`}
                        >
                          Jarayonda
                        </button>
                        <button 
                          onClick={() => updateStatus(p.id, "done")}
                          className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${p.status === "done" ? "bg-emerald-500 text-white shadow-lg shadow-emerald-200" : "text-slate-400 hover:text-slate-600"}`}
                        >
                          Bajarildi
                        </button>
                      </div>

                      {/* CURRENT STATUS INDICATOR */}
                      <div className="flex items-center gap-3">
                         {p.status === 'done' && (
                           <div className="flex items-center gap-2 text-emerald-600 font-black text-xs uppercase italic animate-bounce">
                             <CheckCircle size={18} /> Muvaffaqiyatli!
                           </div>
                         )}
                         <button className="w-10 h-10 bg-slate-50 text-slate-300 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl flex items-center justify-center transition-all">
                            <ChevronRight size={20} />
                         </button>
                      </div>

                    </div>
                    
                    {/* Hover Decoration */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/30 rounded-full -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity blur-2xl"></div>
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