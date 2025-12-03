import { useState } from "react";
import { ref, push } from "firebase/database";
import { db } from "../../firebase";

export default function AdminPanel() {
  const [orgName, setOrgName] = useState("");
  const [orgPhone, setOrgPhone] = useState("");

  const [masName, setMasName] = useState("");
  const [masPhone, setMasPhone] = useState("");

  // Random password generator
  const generatePassword = () => Math.floor(100000 + Math.random() * 900000).toString();

  // Login name generator (remove spaces, lowercase)
  const toLogin = (str) => str.toLowerCase().replace(/ /g, "");

  const addOrganization = () => {
    const login = toLogin(orgName);
    const password = generatePassword();

    push(ref(db, "users"), {
      name: orgName,
      phone: orgPhone,
      login,
      password,
      role: "tashkilot",
    });

    alert(`Tashkilot qo‘shildi.\nLogin: ${login}\nParol: ${password}`);
  };

  const addMasul = () => {
    const login = toLogin(masName);
    const password = generatePassword();

    push(ref(db, "users"), {
      name: masName,
      phone: masPhone,
      login,
      password,
      role: "masul",
    });

    alert(`Mas’ul qo‘shildi.\nLogin: ${login}\nParol: ${password}`);
  };

  return (
    <div className="p-6 max-w-xl mx-auto mt-10 space-y-8">

      {/* Tashkilot */}
      <div className="border p-5 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-3">Tashkilot qo‘shish</h2>

        <input
          type="text"
          placeholder="Korxona nomi"
          className="w-full border p-2 rounded mb-2"
          onChange={(e) => setOrgName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Telefon"
          className="w-full border p-2 rounded mb-2"
          onChange={(e) => setOrgPhone(e.target.value)}
        />

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={addOrganization}
        >
          Qo‘shish
        </button>
      </div>

      {/* Mas’ul */}
      <div className="border p-5 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-3">Universitet Mas’uli qo‘shish</h2>

        <input
          type="text"
          placeholder="F.I.Sh"
          className="w-full border p-2 rounded mb-2"
          onChange={(e) => setMasName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Telefon"
          className="w-full border p-2 rounded mb-2"
          onChange={(e) => setMasPhone(e.target.value)}
        />

        <button
          className="bg-green-600 text-white px-4 py-2 rounded"
          onClick={addMasul}
        >
          Qo‘shish
        </button>
      </div>
    </div>
  );
}
