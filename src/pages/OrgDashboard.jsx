import { useState, useEffect } from "react";
import { ref, push, onValue, query, orderByChild, equalTo } from "firebase/database";
import { db } from "../../firebase";
import { useAuth } from "../context/AuthContext";

/**
 * Muammo turlari
 */
const PROBLEM_TYPES = [
  { value: "mexanika", label: "Mexanika-mashinasozlik" },
  { value: "energetika", label: "Energetika muhandisligi" },
  { value: "kimyo", label: "Kimyo texnologiya" },
  { value: "arxitektura", label: "Arxitektura va qurilish" },
  { value: "boshqaruv", label: "Ishlab chiqarishda boshqaruv" },
  { value: "yengil_sanoat", label: "Yengil sanoat va to‘qimachilik" },
  {
    value: "axborot_texnologiyalari",
    label: "Axborot texnologiyalari va telekommunikatsiya",
  },
];

export default function OrgDashboard() {
  const { user } = useAuth();

  const [problems, setProblems] = useState([]);
  const [newProblem, setNewProblem] = useState("");
  const [problemType, setProblemType] = useState("");
  const [loading, setLoading] = useState(true);

  // =========================
  // LOAD ORGANIZATION PROBLEMS
  // =========================
  useEffect(() => {
    if (!user?.id) return;

    setLoading(true);

    const problemsRef = query(
      ref(db, "problems"),
      orderByChild("orgId"),
      equalTo(user.id)
    );

    return onValue(problemsRef, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        const list = Object.keys(data)
          .map((key) => ({
            id: key,
            ...data[key],
          }))
          .sort((a, b) => b.createdAt - a.createdAt);

        setProblems(list);
      } else {
        setProblems([]);
      }

      setLoading(false);
    });
  }, [user?.id]);

  // =========================
  // SUBMIT NEW PROBLEM
  // =========================
  const submitNewProblem = () => {
    if (!newProblem.trim() || !problemType) {
      alert("Muammo matni va muammo turini tanlang");
      return;
    }

    push(ref(db, "problems"), {
      orgId: user.id,
      orgName: user.name,
      text: newProblem,
      type: problemType,
      status: "new", // new | progress | done
      createdAt: Date.now(),
    });

    setNewProblem("");
    setProblemType("");
  };

  // TYPE label helper
  const getTypeLabel = (value) =>
    PROBLEM_TYPES.find((t) => t.value === value)?.label || value;

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      {/* ================= HEADER ================= */}
      <div className="bg-white p-4 md:p-6 rounded-xl shadow mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <h1 className="text-2xl md:text-3xl font-bold">
          Tashkilot paneli
        </h1>
        <span className="font-semibold text-gray-600">
          {user?.name}
        </span>
      </div>

      {/* ================= MAIN ================= */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* ================= ADD PROBLEM ================= */}
        <div className="bg-white p-5 md:p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">
            Yangi muammo yuborish
          </h2>

          {/* TYPE */}
          <select
            className="w-full border p-3 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={problemType}
            onChange={(e) => setProblemType(e.target.value)}
          >
            <option value="">Muammo turini tanlang</option>
            {PROBLEM_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>

          {/* TEXT */}
          <textarea
            className="w-full border p-3 rounded h-32 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Muammo matnini batafsil yozing..."
            value={newProblem}
            onChange={(e) => setNewProblem(e.target.value)}
          />

          <button
            onClick={submitNewProblem}
            className="mt-4 w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Muammoni yuborish
          </button>
        </div>

        {/* ================= PROBLEMS LIST ================= */}
        <div className="bg-white p-5 md:p-6 rounded-xl shadow max-h-[650px] overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4">
            Mening muammolarim
          </h2>

          {loading && (
            <p className="text-gray-500">Yuklanmoqda...</p>
          )}

          {!loading && problems.length === 0 && (
            <p className="text-gray-400">
              Hozircha muammolar yo‘q
            </p>
          )}

          {problems.map((p) => (
            <div
              key={p.id}
              className="border rounded-xl p-4 mb-4 hover:shadow transition"
            >
              {/* TEXT */}
              <p className="font-medium mb-2">{p.text}</p>

              {/* META */}
              <div className="flex flex-wrap justify-between items-center gap-2 text-xs">
                <span className="text-gray-500">
                  {new Date(p.createdAt).toLocaleString()}
                </span>

                <div className="flex flex-wrap gap-2">
                  {/* TYPE */}
                  <span className="px-2 py-1 rounded bg-blue-100 text-blue-700">
                    {getTypeLabel(p.type)}
                  </span>

                  {/* STATUS */}
                  <span
                    className={`px-2 py-1 rounded-full
                      ${p.status === "new" && "bg-gray-200 text-gray-700"}
                      ${p.status === "progress" && "bg-yellow-200 text-yellow-800"}
                      ${p.status === "done" && "bg-green-200 text-green-800"}
                    `}
                  >
                    {p.status === "new" && "Yangi"}
                    {p.status === "progress" && "Ko‘rib chiqilmoqda"}
                    {p.status === "done" && "Yechim tayyor"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
