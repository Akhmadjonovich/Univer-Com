import { useState } from "react";
import { db } from "../../firebase";
import { ref, onValue } from "firebase/database";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

// SVG Ikonkalar (Shaffof dizaynga mos ingichka chiziqlarda)
const Icons = {
  User: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  ),
  Lock: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
  ),
  Chevron: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
  )
};

export default function Login() {
  const [role, setRole] = useState("tashkilot");
  const [loginInput, setLoginInput] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!loginInput || !password) return alert("Ma'lumotlarni to'ldiring!");
    
    setLoading(true);
    const usersRef = ref(db, "users");

    onValue(usersRef, (snapshot) => {
        let found = null;
        snapshot.forEach((child) => {
          const u = child.val();
          if (u.login === loginInput && u.password === password && u.role === role) {
            found = { id: child.key, ...u };
          }
        });

        setLoading(false);
        if (!found) return alert("Login yoki parol noto‘g‘ri!");

        loginUser(found);
        navigate(found.role === "tashkilot" ? "/dashboard-org" : "/dashboard-masul");
      },
      { onlyOnce: true }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] relative overflow-hidden font-sans">
      
      {/* Orqa fondagi harakatlanuvchi rangli doiralar (Glow effect) */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]"></div>

      {/* Glassmorphism Card */}
      <div className="backdrop-blur-2xl bg-white/10 p-10 rounded-[2.5rem] shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] w-full max-w-[400px] border border-white/20 relative z-10 animate-in fade-in zoom-in-95 duration-500">
        
        {/* Avatar Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-tr from-indigo-500 to-blue-400 rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-500/30 rotate-3 hover:rotate-0 transition-transform duration-300">
            <Icons.User className="text-3xl" />
          </div>
          <h2 className="text-2xl font-black text-white mt-6 tracking-tight text-center">
            Tizimga Kirish
          </h2>
          {/* <p className="text-slate-400 text-sm font-medium mt-1">Davom etish uchun ma'lumotlarni kiriting</p> */}
        </div>

        <div className="space-y-5">
          
          {/* Role Selection */}
          <div className="relative group">
            <label className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] ml-2 mb-2 block">Sizning rolingiz</label>
            <select
              className="w-full bg-white/5 text-white border border-white/10 p-4 rounded-2xl focus:outline-none focus:border-indigo-500/50 transition-all appearance-none cursor-pointer font-semibold"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="tashkilot" className="bg-[#1e293b]">Tashkilot (Korxona)</option>
              <option value="masul" className="bg-[#1e293b]">Universitet Mas’uli</option>
            </select>
            <div className="absolute right-4 bottom-4 text-white/40 pointer-events-none">
              <Icons.Chevron />
            </div>
          </div>

          {/* Login Input */}
          <div className="group">
            <label className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] ml-2 mb-2 block">Login</label>
            <div className="flex items-center bg-white/5 border border-white/10 rounded-2xl p-4 group-focus-within:border-indigo-500/50 transition-all">
              <span className="text-white/40 group-focus-within:text-indigo-400 transition-colors mr-3">
                <Icons.User />
              </span>
              <input
                type="text"
                placeholder="Loginni kiriting"
                className="bg-transparent w-full outline-none text-white placeholder-white/20 font-medium"
                value={loginInput}
                onChange={(e) => setLoginInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="group">
            <label className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] ml-2 mb-2 block">Parol</label>
            <div className="flex items-center bg-white/5 border border-white/10 rounded-2xl p-4 group-focus-within:border-indigo-500/50 transition-all">
              <span className="text-white/40 group-focus-within:text-indigo-400 transition-colors mr-3">
                <Icons.Lock />
              </span>
              <input
                type="password"
                placeholder="••••••••"
                className="bg-transparent w-full outline-none text-white placeholder-white/20 font-medium tracking-widest"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>
          </div>

          {/* Options */}
          <div className="flex justify-between items-center px-1">
            <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer hover:text-white transition-colors">
              <input type="checkbox" className="w-4 h-4 rounded border-white/10 bg-white/5 text-indigo-600 focus:ring-0" />
              Eslab qolish
            </label>
            <button className="text-xs text-indigo-400 hover:text-indigo-300 font-bold transition-colors">Parolni unutdingizmi?</button>
          </div>

          {/* Submit button */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-2xl shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-95 transition-all font-black text-sm tracking-widest uppercase mt-4 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              "Tizimga kirish"
            )}
          </button>
        </div>

        {/* Footer info */}
        <p className="text-center mt-8 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
          Secure Access Portal &bull; 2026
        </p>
      </div>
    </div>
  );
}