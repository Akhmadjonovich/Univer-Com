import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ref, onValue } from "firebase/database";
import { db } from "../../firebase";
import { useAuth } from "../context/AuthContext";

// SVG Ikonkalar
const Icons = {
  Lock: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
  ),
  User: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  ),
  Shield: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751A11.956 11.956 0 0112 2.714z" />
    </svg>
  )
};

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { setUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loggedIn = localStorage.getItem("loggedIn");
    if (loggedIn === "admin") {
      setUser({ email: "admin@system.com", role: "admin" });
      navigate("/admin");
    }
  }, [setUser, navigate]);

  const handleLogin = () => {
    if (!email || !password) {
      setError("Iltimos, barcha maydonlarni to'ldiring");
      return;
    }

    setIsSubmitting(true);
    setError("");

    const userRef = ref(db, "users/admin");
    onValue(
      userRef,
      (snapshot) => {
        const adminData = snapshot.val();
        setIsSubmitting(false);

        if (!adminData) {
          setError("Tizimda admin topilmadi!");
          return;
        }

        if (email === adminData.email && password === adminData.password) {
          setUser({ email: adminData.email, role: "admin" });
          localStorage.setItem("loggedIn", "admin");
          navigate("/admin");
        } else {
          setError("Email yoki parol noto‘g‘ri");
        }
      },
      { onlyOnce: true }
    );
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 font-sans text-slate-900">
      <div className="w-full max-w-[440px]">
        
        {/* LOGO & TITLE */}
        <div className="text-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-[2rem] text-indigo-600 shadow-xl shadow-indigo-100/50 border border-indigo-50 mb-4">
            <Icons.Shield />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-800">Boshqaruv Paneli</h1>
          <p className="text-slate-400 font-medium mt-2">Tizimga kirish uchun ma'lumotlarni kiriting</p>
        </div>

        {/* LOGIN CARD */}
        <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-2xl shadow-slate-200/60 border border-slate-100 animate-in zoom-in-95 duration-500">
          <div className="space-y-6">
            
            {/* EMAIL FIELD */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Admin Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                  <Icons.User />
                </div>
                <input
                  type="email"
                  placeholder="admin@example.com"
                  className="w-full bg-slate-50 border-2 border-slate-100 py-4 pl-12 pr-4 rounded-2xl focus:border-indigo-500 focus:bg-white outline-none transition-all font-medium"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                />
              </div>
            </div>

            {/* PASSWORD FIELD */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Parol</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                  <Icons.Lock />
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border-2 border-slate-100 py-4 pl-12 pr-4 rounded-2xl focus:border-indigo-500 focus:bg-white outline-none transition-all font-medium"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                />
              </div>
            </div>

            {/* ERROR MESSAGE */}
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold flex items-center gap-2 animate-pulse">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            {/* SUBMIT BUTTON */}
            <button
              onClick={handleLogin}
              disabled={isSubmitting}
              className={`w-full bg-slate-900 hover:bg-indigo-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-slate-200 transition-all active:scale-[0.98] flex items-center justify-center gap-3 ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              {isSubmitting ? (
                <span className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                "Tizimga kirish"
              )}
            </button>

          </div>
        </div>

        {/* FOOTER */}
        <p className="text-center mt-8 text-slate-400 text-sm font-medium">
          &copy; 2026 Admin Dashboard System
        </p>
      </div>
    </div>
  );
}