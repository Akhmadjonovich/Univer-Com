import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ref, get } from "firebase/database";
import { db } from "../../firebase";
import { ArrowLeft, Building2, Calendar, Tag, Info, CheckCircle2, Clock, AlertCircle } from "lucide-react";

export default function ProblemDetail() {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProblem = async () => {
      const snapshot = await get(ref(db, `problems/${id}`));
      if (snapshot.exists()) {
        setProblem(snapshot.val());
      }
      setLoading(false);
    };
    fetchProblem();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
    </div>
  );

  if (!problem) return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <AlertCircle size={48} className="text-red-400 mb-4" />
      <h2 className="text-2xl font-bold">Muammo topilmadi</h2>
      <Link to="/" className="mt-4 text-indigo-600 font-medium">Bosh sahifaga qaytish</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-medium mb-8 transition-colors group">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Orqaga qaytish
        </Link>

        <div className="bg-white rounded-[32px] shadow-sm border border-slate-200 overflow-hidden">
          {/* Header Section */}
          <div className="p-8 md:p-12 border-b border-slate-100 bg-slate-50/50">
            <div className="flex flex-wrap gap-3 mb-6">
              <span className="px-4 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-full uppercase tracking-widest">
                {problem.type}
              </span>
              <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border flex items-center gap-2
                ${problem.status === 'done' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 
                  problem.status === 'progress' ? 'bg-blue-100 text-blue-700 border-blue-200' : 
                  'bg-amber-100 text-amber-700 border-amber-200'}`}>
                {problem.status === 'done' ? <CheckCircle2 size={14}/> : <Clock size={14}/>}
                {problem.status}
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">
              {problem.text}
            </h1>
          </div>

          {/* Details Grid */}
          <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Building2 size={16} /> Tashkilot haqida
                </h3>
                <p className="text-xl font-bold text-slate-800">{problem.orgName}</p>
                <p className="text-slate-500 text-sm mt-1">Sanoat hamkori</p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Calendar size={16} /> E'lon qilingan sana
                </h3>
                <p className="text-lg font-semibold text-slate-700">
                  {new Date(problem.createdAt).toLocaleDateString("uz-UZ", {
                    day: "numeric",
                    month: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100">
  <h3 className="text-blue-900 font-bold mb-3 flex items-center gap-2">
    <Info size={18} /> Ma'lumot uchun
  </h3>
  <p className="text-blue-700/80 text-sm leading-relaxed">
    Ushbu platforma muammolar bilan tanishish va ularni o'rganish uchun mo'ljallangan. 
    Hamkorlik masalalari yuzasidan bevosita tegishli tashkilotga murojaat qilishingiz mumkin.
  </p>
</div>
          </div>

          
        </div>
      </div>
    </div>
  );
}