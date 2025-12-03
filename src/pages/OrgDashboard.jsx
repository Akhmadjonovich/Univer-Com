import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { ref, push, onValue } from "firebase/database";
import { db } from "../../firebase";

export default function OrgDashboard() {
  const { user } = useAuth();
  const [problems, setProblems] = useState([]);
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [newProblemOpen, setNewProblemOpen] = useState(false);

  const [newProblemText, setNewProblemText] = useState("");
  const chatEndRef = useRef(null);

  // Muammolarni olish
  useEffect(() => {
    const problemsRef = ref(db, "problems");
    onValue(problemsRef, (snap) => {
      const arr = [];
      snap.forEach((child) => {
        const p = child.val();
        if (p.orgId === user.id) arr.push({ id: child.key, ...p });
      });
      setProblems(arr.sort((a, b) => a.createdAt - b.createdAt));
    });
  }, [user.id]);

  // Chatni olish
  useEffect(() => {
    const chatRef = ref(db, `chats/${user.id}`);
    onValue(chatRef, (snap) => {
      const arr = [];
      snap.forEach((child) => arr.push({ id: child.key, ...child.val() }));
      setChat(arr.sort((a, b) => a.createdAt - b.createdAt));
    });
  }, [user.id]);

  // Scroll bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  // Yangi muammo
  const submitNewProblem = () => {
    if (!newProblemText) return;
    const data = {
      orgId: user.id,
      text: newProblemText,
      createdAt: Date.now(),
      sender: "tashkilot",
    };

    push(ref(db, "problems"), data);
    push(ref(db, `chats/${user.id}`), data);

    setNewProblemText("");
  };

  // Chat xabar yuborish
  const sendMessage = () => {
    if (!message) return;
    push(ref(db, `chats/${user.id}`), {
      sender: "tashkilot",
      text: message,
      createdAt: Date.now(),
    });
    setMessage("");
  };

  return (
    <div className="p-4 lg:p-6 w-full h-screen mx-auto bg-gradient-to-br to-gray-400">
      
      {/* Title */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Tashkilot </h1>
        <p className="text-xl font-semibold">
          {user.name} <span className="text-gray-500">({user.password})</span>
        </p>
      </div>


      {/* ======= DESKTOP MODE: 2 COLUMN ======= */}
      <div className="hidden lg:grid grid-cols-2 gap-6">

        {/* LEFT COLUMN — problems + new problem */}
        <div className="space-y-6">

          {/* Problems list */}
          <div className="bg-white p-4 rounded-xl shadow h-80 overflow-y-auto">
            <h2 className="text-xl font-semibold mb-2">Mening muammolarim</h2>
            {problems.length === 0 ? (
              <p className="text-gray-500">Hozircha muammo yo‘q</p>
            ) : (
              problems.map((p) => (
                <div key={p.id} className="border-b py-2">
                  <p>{p.text}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(p.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* New problem input */}
          <div className="bg-white p-4 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-2">Yangi muammo yozish</h2>
            <textarea
              className="w-full border p-2 rounded h-28"
              placeholder="Muammo matnini kiriting..."
              value={newProblemText}
              onChange={(e) => setNewProblemText(e.target.value)}
            />
            <button
              className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={submitNewProblem}
            >
              Yuborish
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN — Chat */}
        <div className="bg-white p-4 rounded-xl shadow flex flex-col h-[520px]">
          <h2 className="text-xl font-semibold mb-2">Chat</h2>

          <div className="flex-1 overflow-y-auto space-y-2 mb-3">
            {chat.map((c) => (
              <div
                key={c.id}
                className={`p-2 rounded max-w-xs ${
                  c.sender === "tashkilot"
                    ? "ml-auto bg-blue-200"
                    : "bg-green-200"
                }`}
              >
                <p>{c.text}</p>
                <p className="text-xs text-gray-500">
                  {new Date(c.createdAt).toLocaleTimeString()}
                </p>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Xabar yozing..."
              className="flex-1 border p-2 rounded"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={sendMessage}
            >
              Yuborish
            </button>
          </div>
        </div>
      </div>



      {/* ======= MOBILE MODE — oldingi tartib saqlanadi ======= */}
      <div className="lg:hidden space-y-4">
      <button
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
          onClick={() => setNewProblemOpen(true)}
        >
          Yangi muammo yozish
        </button>
        <button
          className="bg-gray-600 text-white px-4 py-2 rounded w-full"
          onClick={() => setModalOpen(true)}
        >
          Mening muammolarim
        </button>

       

        {/* Modal — Problems */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white rounded-xl p-4 w-80 max-h-[80vh] overflow-y-auto">
              <h2 className="text-xl font-semibold mb-3">Mening muammolarim</h2>

              {problems.map((p) => (
                <div key={p.id} className="border-b py-2">
                  <p>{p.text}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(p.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}

              <button
                className="mt-3 px-4 py-2 rounded border w-full"
                onClick={() => setModalOpen(false)}
              >
                Yopish
              </button>
            </div>
          </div>
        )}

        {/* Modal — New problem */}
        {newProblemOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white rounded-xl p-4 w-80">
              <h2 className="text-xl font-semibold mb-3">Yangi muammo</h2>

              <textarea
                className="w-full border p-2 rounded h-32"
                value={newProblemText}
                onChange={(e) => setNewProblemText(e.target.value)}
              />

              <div className="flex justify-end space-x-2 mt-3">
                <button
                  className="px-4 py-2 rounded border"
                  onClick={() => setNewProblemOpen(false)}
                >
                  Bekor qilish
                </button>

                <button
                  className="px-4 py-2 rounded bg-blue-600 text-white"
                  onClick={() => { submitNewProblem(); setNewProblemOpen(false); }}
                >
                  Yuborish
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="bg-white p-4 rounded-xl shadow flex flex-col h-[400px]">
          <h2 className="text-xl font-semibold mb-2">Chat</h2>

          <div className="flex-1 overflow-y-auto space-y-2 mb-3">
            {chat.map((c) => (
              <div
                key={c.id}
                className={`p-2 rounded max-w-xs ${
                  c.sender === "tashkilot"
                    ? "ml-auto bg-blue-200"
                    : "bg-green-200"
                }`}
              >
                <p>{c.text}</p>
                <p className="text-xs text-gray-500">
                  {new Date(c.createdAt).toLocaleTimeString()}
                </p>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Xabar yozing..."
              className="flex-1 border p-2 rounded"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={sendMessage}
            >
              Yuborish
            </button>
          </div>
        </div>
      

      </div>

    </div>
  );
}
