import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function OrgDashboard() {
  const { user } = useAuth();
  const [problems, setProblems] = useState([]);
  const [newProblem, setNewProblem] = useState("");
  const [loading, setLoading] = useState(true);

  // LOAD FROM API
  useEffect(() => {
    setLoading(true);
    fetch(`/api/problems?orgId=${user.id}`)
      .then((res) => res.json())
      .then((data) => setProblems(data))
      .finally(() => setLoading(false));
  }, [user.id]);

  // SEND TO API
  const submitNewProblem = () => {
    if (!newProblem) return;

    fetch("/api/problems", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orgId: user.id,
        text: newProblem,
      }),
    })
      .then((res) => res.json())
      .then((p) => setProblems([p, ...problems]));

    setNewProblem("");
  };

  return (
    <div className="min-h-screen p-5 md:p-10 bg-gray-100">

      {/* Header */}
      <div className="bg-white p-4 rounded-xl shadow mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tashkilot paneli</h1>
        <p className="font-semibold">{user.name}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">

        {/* NEW PROBLEM */}
        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-3">Yangi muammo yuborish</h2>

          <textarea
            className="w-full border p-3 rounded h-28"
            placeholder="Muammo matnini kiriting..."
            value={newProblem}
            onChange={(e) => setNewProblem(e.target.value)}
          />

          <button
            onClick={submitNewProblem}
            className="mt-3 bg-blue-600 text-white px-5 py-2 rounded w-full hover:bg-blue-700"
          >
            Yuborish
          </button>
        </div>

        {/* PROBLEMS LIST */}
        <div className="bg-white p-5 rounded-xl shadow max-h-[600px] overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4">Mening muammolarim</h2>

          {loading && <p>Yuklanmoqda...</p>}

          {problems.map((p) => (
            <div key={p.id} className="p-3 mb-3 border rounded-lg">
              <p className="font-medium">{p.text}</p>

              <div className="flex justify-between mt-2">
                <span className="text-xs text-gray-500">
                  {new Date(p.createdAt).toLocaleString()}
                </span>

                {/* STATUS BADGE */}
                <span className={`
                  px-2 py-1 text-xs rounded-full 
                  ${p.status === "new" && "bg-gray-200"}
                  ${p.status === "progress" && "bg-yellow-200"}
                  ${p.status === "done" && "bg-green-200"}
                `}>
                  {p.status === "new" && "Yangi"}
                  {p.status === "progress" && "Ko‘rib chiqilmoqda"}
                  {p.status === "done" && "Yechim tayyor"}
                </span>
              </div>

              {/* FILE DOWNLOAD */}
              {p.file && (
                <a
                  href={p.file}
                  download
                  className="mt-3 inline-block bg-green-600 text-white px-3 py-1 rounded text-sm"
                >
                  Yechimni yuklab olish
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
