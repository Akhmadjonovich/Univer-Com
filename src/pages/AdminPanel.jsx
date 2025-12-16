import { useState, useEffect } from "react";
import { ref, push, onValue } from "firebase/database";
import { db } from "../../firebase";

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
    <div className="p-6 max-w-7xl mx-auto mt-10 space-y-10">
      <h1 className="text-3xl font-bold text-center mb-6">Admin Panel</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Tashkilot qo‘shish */}
        <div className="border p-6 rounded-xl shadow-lg bg-white">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">Tashkilot qo‘shish</h2>
          <input type="text" placeholder="Korxona nomi" className="w-full border p-3 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400" value={orgName} onChange={(e) => setOrgName(e.target.value)} />
          <input type="text" placeholder="Telefon" className="w-full border p-3 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400" value={orgPhone} onChange={(e) => setOrgPhone(e.target.value)} />
          <button className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition" onClick={addOrganization}>Qo‘shish</button>
        </div>

        {/* Mas’ul qo‘shish */}
        <div className="border p-6 rounded-xl shadow-lg bg-white">
          <h2 className="text-xl font-semibold mb-4 text-green-600">Universitet Mas’uli qo‘shish</h2>
          <input type="text" placeholder="F.I.Sh" className="w-full border p-3 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-green-400" value={masName} onChange={(e) => setMasName(e.target.value)} />
          <input type="text" placeholder="Telefon" className="w-full border p-3 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-green-400" value={masPhone} onChange={(e) => setMasPhone(e.target.value)} />
          <button className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 transition" onClick={addMasul}>Qo‘shish</button>
        </div>
      </div>

      {/* Users ro'yxati */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Tashkilotlar */}
        <div className="bg-white p-6 rounded-xl shadow-lg max-h-[400px] overflow-y-auto">
          <h2 className="text-2xl font-semibold mb-4 text-blue-600">Tashkilotlar</h2>
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3 border-b">Ism</th>
                <th className="p-3 border-b">Telefon</th>
                <th className="p-3 border-b">Login</th>
                <th className="p-3 border-b">Parol</th>
              </tr>
            </thead>
            <tbody>
              {organizations.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition">
                  <td className="p-3 border-b">{user.name}</td>
                  <td className="p-3 border-b">{user.phone}</td>
                  <td className="p-3 border-b">{user.login}</td>
                  <td className="p-3 border-b">{user.password}</td>
                </tr>
              ))}
              {organizations.length === 0 && <tr><td colSpan={4} className="p-3 text-center text-gray-400">Hech qanday tashkilot yo‘q</td></tr>}
            </tbody>
          </table>
        </div>

        {/* Mas’ullar */}
        <div className="bg-white p-6 rounded-xl shadow-lg max-h-[400px] overflow-y-auto">
          <h2 className="text-2xl font-semibold mb-4 text-green-600">Universitet Mas’ullari</h2>
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3 border-b">Ism</th>
                <th className="p-3 border-b">Telefon</th>
                <th className="p-3 border-b">Login</th>
                <th className="p-3 border-b">Parol</th>
              </tr>
            </thead>
            <tbody>
              {masuls.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition">
                  <td className="p-3 border-b">{user.name}</td>
                  <td className="p-3 border-b">{user.phone}</td>
                  <td className="p-3 border-b">{user.login}</td>
                  <td className="p-3 border-b">{user.password}</td>
                </tr>
              ))}
              {masuls.length === 0 && <tr><td colSpan={4} className="p-3 text-center text-gray-400">Hech qanday mas’ul yo‘q</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
