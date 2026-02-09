import { useState, useEffect } from "react";
import { ref, push, onValue } from "firebase/database";
import { db } from "../../firebase";

// SVG Ikonkalar
const Icons = {
  Plus: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  ),
  UserGroup: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.998 5.998 0 00-12 0m12 0c0-1.657-1.343-3-3-3m-1.357-3.063a6.75 6.75 0 00-1.357-3.063m0 0a6.75 6.75 0 011.357 3.063m0 0A6.75 6.75 0 0112 15.75a6.75 6.75 0 01-4.5-5.25m4.5 5.25a6.75 6.75 0 004.5-5.25m-4.5 5.25a6.75 6.75 0 01-4.5-5.25m4.5 5.25a6.75 6.75 0 00-4.5-5.25" />
    </svg>
  ),
  Key: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-slate-400">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6.75 6.75 0 01-13.5 0m13.5 0a6.75 6.75 0 00-13.5 0m13.5 0a6.75 6.75 0 01-13.5 0m0 0V15m0 0l2.25 2.25M6.75 15l-2.25 2.25m4.5-4.5V15m0 0l2.25 2.25M11.25 15l-2.25 2.25" />
    </svg>
  ),
  Phone: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
    </svg>
  )
};

export default function AdminPanel() {
  const [orgName, setOrgName] = useState("");
  const [orgPhone, setOrgPhone] = useState("");
  const [masName, setMasName] = useState("");
  const [masPhone, setMasPhone] = useState("");
  const [users, setUsers] = useState([]);

  const generatePassword = () => Math.floor(100000 + Math.random() * 900000).toString();
  const toLogin = (str) => str.toLowerCase().replace(/ /g, "");

  const addOrganization = () => {
    if (!orgName || !orgPhone) return alert("Iltimos barcha maydonlarni to‘ldiring!");
    const login = toLogin(orgName);
    const password = generatePassword();
    push(ref(db, "users"), { name: orgName, phone: orgPhone, login, password, role: "tashkilot" });
    setOrgName(""); setOrgPhone("");
    alert(`Tashkilot qo‘shildi.\nLogin: ${login}\nParol: ${password}`);
  };

  const addMasul = () => {
    if (!masName || !masPhone) return alert("Iltimos barcha maydonlarni to‘ldiring!");
    const login = toLogin(masName);
    const password = generatePassword();
    push(ref(db, "users"), { name: masName, phone: masPhone, login, password, role: "masul" });
    setMasName(""); setMasPhone("");
    alert(`Mas’ul qo‘shildi.\nLogin: ${login}\nParol: ${password}`);
  };

  useEffect(() => {
    const usersRef = ref(db, "users");
    return onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) setUsers(Object.keys(data).map((key) => ({ id: key, ...data[key] })));
      else setUsers([]);
    });
  }, []);

  const organizations = users.filter(u => u.role === "tashkilot");
  const masuls = users.filter(u => u.role === "masul");

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 lg:p-12 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto">
        
        {/* ================= HEADER ================= */}
        <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-slate-800">Admin Panel</h1>
            <p className="text-slate-500 font-medium">Tizim foydalanuvchilari va tashkilotlarni boshqarish</p>
          </div>
          <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-[1.5rem] shadow-sm border border-slate-200">
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="font-bold text-slate-700 uppercase tracking-widest text-xs">Tizim Faol</span>
          </div>
        </header>

        {/* ================= FORMS SECTION ================= */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          
          {/* Add Organization */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center">
                <Icons.Plus />
              </div>
              <h2 className="text-xl font-black text-slate-800">Tashkilot qo‘shish</h2>
            </div>
            <div className="space-y-4">
              <input type="text" placeholder="Korxona nomi" className="w-full bg-slate-50 border-2 border-slate-50 p-4 rounded-2xl focus:border-indigo-500 focus:bg-white outline-none transition-all font-medium" value={orgName} onChange={(e) => setOrgName(e.target.value)} />
              <input type="text" placeholder="Telefon (masalan: +998...)" className="w-full bg-slate-50 border-2 border-slate-50 p-4 rounded-2xl focus:border-indigo-500 focus:bg-white outline-none transition-all font-medium" value={orgPhone} onChange={(e) => setOrgPhone(e.target.value)} />
              <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-black shadow-lg shadow-indigo-100 transition-all active:scale-95" onClick={addOrganization}>Tashkilotni ro'yxatga olish</button>
            </div>
          </div>

          {/* Add Mas'ul */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">
                <Icons.Plus />
              </div>
              <h2 className="text-xl font-black text-slate-800">Mas’ul qo‘shish</h2>
            </div>
            <div className="space-y-4">
              <input type="text" placeholder="F.I.Sh" className="w-full bg-slate-50 border-2 border-slate-50 p-4 rounded-2xl focus:border-emerald-500 focus:bg-white outline-none transition-all font-medium" value={masName} onChange={(e) => setMasName(e.target.value)} />
              <input type="text" placeholder="Telefon" className="w-full bg-slate-50 border-2 border-slate-50 p-4 rounded-2xl focus:border-emerald-500 focus:bg-white outline-none transition-all font-medium" value={masPhone} onChange={(e) => setMasPhone(e.target.value)} />
              <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-black shadow-lg shadow-emerald-100 transition-all active:scale-95" onClick={addMasul}>Mas'ulni ro'yxatga olish</button>
            </div>
          </div>
        </div>

        {/* ================= TABLES SECTION ================= */}
        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Organizations Table */}
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-black text-slate-800 flex items-center gap-2 uppercase tracking-tighter text-sm">
                <span className="w-2 h-5 bg-indigo-600 rounded-full"></span> Tashkilotlar
              </h3>
              <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-[10px] font-black">{organizations.length} TA</span>
            </div>
            <div className="overflow-x-auto max-h-[500px] overflow-y-auto custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-slate-50 z-10">
                  <tr className="text-slate-400 text-[10px] uppercase font-black tracking-widest">
                    <th className="p-5">Ism / Login</th>
                    <th className="p-5">Parol</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {organizations.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="p-5">
                        <p className="font-bold text-slate-800">{u.name}</p>
                        <p className="text-xs text-indigo-500 font-medium">@{u.login}</p>
                        <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-tighter">
                            <Icons.Phone /> {u.phone}
                        </div>
                      </td>
                      <td className="p-5">
                        <div className="flex items-center gap-2 bg-slate-100 px-3 py-2 rounded-xl w-fit group-hover:bg-white group-hover:shadow-sm border border-transparent group-hover:border-slate-200 transition-all font-mono text-sm font-bold text-slate-600 tracking-wider">
                          <Icons.Key /> {u.password}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Masuls Table */}
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-black text-slate-800 flex items-center gap-2 uppercase tracking-tighter text-sm">
                <span className="w-2 h-5 bg-emerald-600 rounded-full"></span> Universitet Mas’ullari
              </h3>
              <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-[10px] font-black">{masuls.length} TA</span>
            </div>
            <div className="overflow-x-auto max-h-[500px] overflow-y-auto custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-slate-50 z-10">
                  <tr className="text-slate-400 text-[10px] uppercase font-black tracking-widest">
                    <th className="p-5">F.I.Sh / Login</th>
                    <th className="p-5">Parol</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {masuls.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="p-5">
                        <p className="font-bold text-slate-800">{u.name}</p>
                        <p className="text-xs text-emerald-600 font-medium">@{u.login}</p>
                        <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-tighter">
                            <Icons.Phone /> {u.phone}
                        </div>
                      </td>
                      <td className="p-5">
                        <div className="flex items-center gap-2 bg-slate-100 px-3 py-2 rounded-xl w-fit group-hover:bg-white group-hover:shadow-sm border border-transparent group-hover:border-slate-200 transition-all font-mono text-sm font-bold text-slate-600 tracking-wider">
                          <Icons.Key /> {u.password}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}