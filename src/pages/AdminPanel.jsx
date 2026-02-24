import { useState, useEffect } from "react";
import { ref, push, onValue, update, remove } from "firebase/database";
import { db } from "../../firebase";
import { 
  Plus, Building2, Key, Phone, Edit3, 
  Save, X, Trash2, Search, ShieldCheck 
} from "lucide-react";

export default function AdminPanel() {
  const [orgName, setOrgName] = useState("");
  const [orgPhone, setOrgPhone] = useState("");
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Tahrirlash uchun state
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", phone: "", login: "", password: "" });

  const generatePassword = () => Math.floor(100000 + Math.random() * 900000).toString();
  const toLogin = (str) => str.toLowerCase().replace(/[^a-z0-9]/g, "");

  // Tashkilot qo'shish
  const addOrganization = () => {
    if (!orgName || !orgPhone) return alert("Iltimos barcha maydonlarni to‘ldiring!");
    const login = toLogin(orgName);
    const password = generatePassword();
    
    push(ref(db, "users"), { 
      name: orgName, 
      phone: orgPhone, 
      login, 
      password, 
      role: "tashkilot",
      createdAt: Date.now()
    });
    
    setOrgName(""); setOrgPhone("");
    alert(`Tashkilot qo‘shildi!`);
  };

  // Tahrirlashni boshlash
  const startEdit = (user) => {
    setEditingId(user.id);
    setEditForm({ name: user.name, phone: user.phone, login: user.login, password: user.password });
  };

  // O'zgarishlarni saqlash
  const saveEdit = (id) => {
    const userRef = ref(db, `users/${id}`);
    update(userRef, editForm)
      .then(() => {
        setEditingId(null);
      })
      .catch((err) => alert("Xatolik: " + err.message));
  };

  // Tashkilotni o'chirish
  const deleteOrg = (id) => {
    if (window.confirm("Haqiqatan ham ushbu tashkilotni tizimdan o'chirmoqchimisiz?")) {
      remove(ref(db, `users/${id}`));
    }
  };

  useEffect(() => {
    const usersRef = ref(db, "users");
    return onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.keys(data)
          .map((key) => ({ id: key, ...data[key] }))
          .filter(u => u.role === "tashkilot")
          .sort((a, b) => b.createdAt - a.createdAt);
        setUsers(list);
      } else {
        setUsers([]);
      }
    });
  }, []);

  const filteredOrgs = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.login.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 lg:p-12 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto">
        
        {/* ================= HEADER ================= */}
        <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-indigo-600 p-2 rounded-lg text-white">
                <ShieldCheck size={24} />
              </div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase">Super Admin</h1>
            </div>
            <p className="text-slate-500 font-medium ml-1">Tashkilotlar va kirish huquqlarini boshqarish</p>
          </div>
          
          <div className="flex items-center gap-4 bg-white px-5 py-3 rounded-2xl shadow-sm border border-slate-200">
            <div className="text-right">
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Tizim holati</p>
              <p className="text-sm font-bold text-emerald-600">Boshqaruv faol</p>
            </div>
            <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500">
              <Building2 size={20} />
            </div>
          </div>
        </header>

        <div className="grid lg:grid-cols-12 gap-10">
          
          {/* ================= LEFT: ADD FORM ================= */}
          <div className="lg:col-span-4">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 sticky top-8">
              <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
                <Plus className="text-indigo-600" size={24} />
                Yangi Tashkilot
              </h2>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Korxona nomi</label>
                  <input type="text" placeholder="Masalan: UzAuto Motors" className="w-full bg-slate-50 border-2 border-slate-50 p-4 rounded-2xl focus:border-indigo-500 focus:bg-white outline-none transition-all font-semibold" value={orgName} onChange={(e) => setOrgName(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Aloqa uchun tel</label>
                  <input type="text" placeholder="+998 90 123 45 67" className="w-full bg-slate-50 border-2 border-slate-50 p-4 rounded-2xl focus:border-indigo-500 focus:bg-white outline-none transition-all font-semibold" value={orgPhone} onChange={(e) => setOrgPhone(e.target.value)} />
                </div>
                <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-black shadow-lg shadow-indigo-100 transition-all active:scale-95 mt-2 flex items-center justify-center gap-2" onClick={addOrganization}>
                  Ro'yxatga olish
                </button>
              </div>
            </div>
          </div>

          {/* ================= RIGHT: LIST & EDIT ================= */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h3 className="font-black text-slate-800 flex items-center gap-2 uppercase text-sm tracking-tight">
                  <span className="w-2 h-5 bg-indigo-600 rounded-full"></span> 
                  Tashkilotlar bazasi
                  <span className="ml-2 px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md text-[10px]">{users.length}</span>
                </h3>
                
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="text" 
                    placeholder="Izlash..." 
                    className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 w-full md:w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50">
                    <tr className="text-slate-400 text-[10px] uppercase font-black tracking-widest">
                      <th className="p-6">Tashkilot ma'lumotlari</th>
                      <th className="p-6">Kirish kalitlari</th>
                      <th className="p-6 text-right">Amallar</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredOrgs.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="p-6">
                          {editingId === u.id ? (
                            <div className="space-y-2">
                              <input 
                                className="w-full p-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                                value={editForm.name} 
                                onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                              />
                              <input 
                                className="w-full p-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none font-mono" 
                                value={editForm.phone} 
                                onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                              />
                            </div>
                          ) : (
                            <div>
                              <p className="font-bold text-slate-800">{u.name}</p>
                              <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1 font-medium">
                                <Phone size={12} /> {u.phone}
                              </div>
                            </div>
                          )}
                        </td>
                        <td className="p-6">
                          {editingId === u.id ? (
                            <div className="space-y-2">
                              <input 
                                className="w-full p-2 text-sm border rounded-lg bg-indigo-50 outline-none" 
                                value={editForm.login} 
                                onChange={(e) => setEditForm({...editForm, login: e.target.value})}
                              />
                              <input 
                                className="w-full p-2 text-sm border rounded-lg bg-amber-50 outline-none font-mono" 
                                value={editForm.password} 
                                onChange={(e) => setEditForm({...editForm, password: e.target.value})}
                              />
                            </div>
                          ) : (
                            <div className="space-y-1.5">
                              <div className="text-[10px] font-mono font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-md w-fit">
                                @{u.login}
                              </div>
                              <div className="flex items-center gap-2 text-slate-600 font-mono text-xs font-bold">
                                <Key size={12} className="text-slate-300" /> {u.password}
                              </div>
                            </div>
                          )}
                        </td>
                        <td className="p-6">
                          <div className="flex items-center justify-end gap-2">
                            {editingId === u.id ? (
                              <>
                                <button onClick={() => saveEdit(u.id)} className="p-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 shadow-lg shadow-emerald-100 transition-all">
                                  <Save size={18} />
                                </button>
                                <button onClick={() => setEditingId(null)} className="p-2 bg-slate-200 text-slate-600 rounded-xl hover:bg-slate-300 transition-all">
                                  <X size={18} />
                                </button>
                              </>
                            ) : (
                              <>
                                <button onClick={() => startEdit(u)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                                  <Edit3 size={18} />
                                </button>
                                <button onClick={() => deleteOrg(u.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                                  <Trash2 size={18} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredOrgs.length === 0 && (
                  <div className="p-20 text-center text-slate-400 font-medium">
                    Ma'lumot topilmadi...
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}