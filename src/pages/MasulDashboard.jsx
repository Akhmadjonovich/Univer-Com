import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { ref, onValue, push, set } from "firebase/database";
import { db } from "../../firebase";

export default function MasulDashboard() {
  const { user } = useAuth(); // Mas’ul user
  const [orgs, setOrgs] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [problems, setProblems] = useState([]);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  // 1️⃣ Tashkilotlarni olish
  useEffect(() => {
    const usersRef = ref(db, "users");
    onValue(usersRef, (snap) => {
      const arr = [];
      snap.forEach((child) => {
        const u = child.val();
        if (u.role === "tashkilot") arr.push({ id: child.key, ...u });
      });
      setOrgs(arr);
    });
  }, []);

  // 2️⃣ Muammolarni olish
  useEffect(() => {
    if (!selectedOrg) return;
    const problemsRef = ref(db, "problems");
    onValue(problemsRef, (snap) => {
      const arr = [];
      snap.forEach((child) => {
        const p = child.val();
        if (p.orgId === selectedOrg.id) arr.push({ id: child.key, ...p });
      });
      setProblems(arr);
    });
  }, [selectedOrg]);

  // 3️⃣ Chatni olish
  useEffect(() => {
    if (!selectedOrg) return;
    const chatRef = ref(db, `chats/${selectedOrg.id}`);
    onValue(chatRef, (snap) => {
      const arr = [];
      snap.forEach((child) => arr.push({ id: child.key, ...child.val() }));
      setChat(arr);
    });
  }, [selectedOrg]);

  // 4️⃣ Muammo qo‘shish
  const addProblem = () => {
    if (!selectedOrg || !message) return;

    const newRef = push(ref(db, "problems"));
    set(newRef, {
      orgId: selectedOrg.id,
      text: message,
      createdAt: Date.now(),
      sender: "masul",
    });

    setMessage("");
  };

  // 5️⃣ Chatga xabar yuborish
  const sendMessage = () => {
    if (!selectedOrg || !message) return;

    const msgRef = push(ref(db, `chats/${selectedOrg.id}`));
    set(msgRef, {
      sender: "masul",
      text: message,
      createdAt: Date.now(),
    });

    setMessage("");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold mb-4">Mas’ul Dashboard</h1>

      {/* Tashkilotlarni tanlash */}
      <div className="border p-4 rounded-xl shadow">
        <h2 className="font-semibold mb-2">Tashkilotlar:</h2>
        {orgs.map((o) => (
          <div
            key={o.id}
            className={`p-2 cursor-pointer ${selectedOrg?.id === o.id ? "bg-blue-100" : ""}`}
            onClick={() => setSelectedOrg(o)}
          >
            {o.name} — {o.phone}
          </div>
        ))}
      </div>

      {/* Tanlangan tashkilot */}
      {selectedOrg && (
        <div className="space-y-4">
          <h2 className="font-semibold">Muammolar:</h2>
          {problems.map((p) => (
            <div key={p.id} className="border-b py-2">
              <p>{p.text}</p>
              <p className="text-xs text-gray-500">
                {new Date(p.createdAt).toLocaleString()} — {p.sender}
              </p>
            </div>
          ))}

          <div className="flex space-x-2 mt-2">
            <input
              type="text"
              placeholder="Yangi muammo yoki xabar..."
              className="flex-1 border p-2 rounded"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded"
              onClick={() => {
                addProblem();
                sendMessage();
              }}
            >
              Yuborish
            </button>
          </div>

          <h2 className="font-semibold mt-4">Chat:</h2>
          <div className="border p-3 rounded-xl h-64 overflow-y-auto space-y-2">
            {chat.map((c) => (
              <div
                key={c.id}
                className={`p-2 rounded ${
                  c.sender === "masul"
                    ? "bg-green-200 ml-auto w-fit"
                    : "bg-gray-200 w-fit"
                }`}
              >
                <p>{c.text}</p>
                <p className="text-xs text-gray-500">{new Date(c.createdAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
