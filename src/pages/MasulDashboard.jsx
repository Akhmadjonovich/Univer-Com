import { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../../firebase";

/**
 * Muammo turlari (filter uchun)
 */
const PROBLEM_TYPES = [
  { value: "all", label: "Barchasi" },
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

export default function MasulDashboard() {
  const [orgs, setOrgs] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [problems, setProblems] = useState([]);
  const [typeFilter, setTypeFilter] = useState("all");

  // =============================
  // LOAD ORGANIZATIONS
  // =============================
  useEffect(() => {
    const orgRef = ref(db, "users");

    return onValue(orgRef, (snap) => {
      const data = snap.val();
      if (!data) return setOrgs([]);

      const list = Object.keys(data)
        .map((id) => ({ id, ...data[id] }))
        .filter((u) => u.role === "tashkilot");

      setOrgs(list);
    });
  }, []);

  // =============================
  // LOAD PROBLEMS BY ORG
  // =============================
  useEffect(() => {
    if (!selectedOrg) return;

    const problemsRef = ref(db, "problems");

    return onValue(problemsRef, (snap) => {
      const data = snap.val();
      if (!data) return setProblems([]);

      let list = Object.keys(data)
        .map((id) => ({ id, ...data[id] }))
        .filter((p) => p.orgId === selectedOrg.id);

      if (typeFilter !== "all") {
        list = list.filter((p) => p.type === typeFilter);
      }

      list.sort((a, b) => b.createdAt - a.createdAt);
      setProblems(list);
    });
  }, [selectedOrg, typeFilter]);

  // =============================
  // COPY TEXT
  // =============================
  const copyText = (text) => {
    navigator.clipboard.writeText(text);
    alert("Muammo matni nusxalandi ✅");
  };

  // TYPE label helper
  const getTypeLabel = (value) =>
    PROBLEM_TYPES.find((t) => t.value === value)?.label || value;

  return (
    <div className="flex flex-col md:flex-row bg-gray-100 h-screen">
      {/* ================= LEFT SIDEBAR ================= */}
      <div className="md:w-72 w-full bg-white shadow-lg p-5 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Tashkilotlar</h2>

        {orgs.map((o) => (
          <div
            key={o.id}
            className={`p-3 mb-2 rounded-lg cursor-pointer border
              ${
                selectedOrg?.id === o.id
                  ? "bg-blue-100 border-blue-400"
                  : "hover:bg-gray-100"
              }
            `}
            onClick={() => setSelectedOrg(o)}
          >
            <p className="font-medium">{o.name}</p>
            <p className="text-sm text-gray-500">{o.phone}</p>
          </div>
        ))}
      </div>

      {/* ================= RIGHT SIDE ================= */}
      <div className="flex-1 p-4 md:p-8 overflow-y-auto">
        {!selectedOrg && (
          <p className="text-gray-500 text-center mt-20">
            Tashkilot tanlang 👈
          </p>
        )}

        {selectedOrg && (
          <>
            {/* ORG INFO */}
            <div className="bg-white p-5 rounded-xl shadow mb-6">
              <h2 className="text-2xl font-bold">{selectedOrg.name}</h2>
              <p className="text-gray-600">{selectedOrg.phone}</p>

              <hr className="my-3" />

              <p>
                <strong>Jami muammolar:</strong> {problems.length}
              </p>
            </div>

            {/* FILTER */}
            <div className="mb-4">
              <select
                className="border p-2 rounded"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                {PROBLEM_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            {/* PROBLEMS LIST */}
            <div className="bg-white p-5 rounded-xl shadow">
              <h2 className="text-xl font-semibold mb-4">
                Muammolar
              </h2>

              {problems.length === 0 && (
                <p className="text-gray-500">
                  Muammo topilmadi
                </p>
              )}

              {problems.map((p) => (
                <div
                  key={p.id}
                  className="p-4 border rounded-lg mb-4 hover:shadow transition"
                >
                  <p className="font-medium mb-2">{p.text}</p>

                  <div className="flex flex-wrap justify-between items-center gap-2 text-xs">
                    <div className="flex gap-2">
                      <span className="text-gray-500">
                        {new Date(p.createdAt).toLocaleString()}
                      </span>

                      <span className="bg-blue-100 text-blue-700 px-2 rounded">
                        {getTypeLabel(p.type)}
                      </span>
                    </div>

                    <button
                      onClick={() => copyText(p.text)}
                      className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded text-sm"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
