import { useState, useEffect } from "react";

export default function MasulDashboard() {
  const [orgs, setOrgs] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [problems, setProblems] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);

  // FAKE ORGS
  useEffect(() => {
    const fakeOrgs = [
      { id: "org1", name: "Axror Academy", phone: "+998 99 111 22 33" },
      { id: "org2", name: "IT Park Jizzax", phone: "+998 93 555 44 11" },
      { id: "org3", name: "Digital City", phone: "+998 94 777 88 99" },
      { id: "org4", name: "Mega Soft LLC", phone: "+998 90 123 45 67" },
    ];
    setOrgs(fakeOrgs);
  }, []);

  // FAKE PROBLEMS
  useEffect(() => {
    if (!selectedOrg) return;

    const fakeProblems = {
      org1: [
        { id: "p1", text: "Admin panelga kira olmayapmiz.", status: "new", createdAt: Date.now() - 50000 },
        { id: "p2", text: "Xodimlar ro'yxati yuklanmayapti.", status: "progress", createdAt: Date.now() - 180000 },
      ],
      org2: [
        { id: "p3", text: "PDF yuklanmayapti.", status: "new", createdAt: Date.now() - 250000 },
      ],
      org3: [
        { id: "p4", text: "Login xatosi.", status: "done", createdAt: Date.now() - 600000 },
        { id: "p5", text: "Fayl yuklash ishlamayapti.", status: "new", createdAt: Date.now() - 120000 },
      ],
      org4: [
        { id: "p6", text: "Server sekin ishlayapti.", status: "progress", createdAt: Date.now() - 90000 },
      ],
    };

    setProblems(fakeProblems[selectedOrg.id] || []);
  }, [selectedOrg]);

  const sendSolution = () => {
    if (!uploadFile || !selectedProblem) return;

    alert(`Fake yechim yuborildi:
Muammo: ${selectedProblem.text}
Fayl: ${uploadFile.name}`);

    setUploadFile(null);
    setSelectedProblem(null);
  };

  return (
    <div className="flex bg-gray-100 h-screen">

      {/* LEFT SIDEBAR - ORGS */}
      <div className="w-72 bg-white shadow-lg p-5 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Tashkilotlar</h2>

        {orgs.map((o) => (
          <div
            key={o.id}
            className={`p-3 mb-2 rounded-lg cursor-pointer border 
              ${selectedOrg?.id === o.id ? "bg-blue-100 border-blue-400" : "hover:bg-gray-100"}
            `}
            onClick={() => setSelectedOrg(o)}
          >
            <p className="font-medium">{o.name}</p>
            <p className="text-sm text-gray-500">{o.phone}</p>
          </div>
        ))}
      </div>

      {/* RIGHT SIDE */}
      <div className="flex-1 p-8 overflow-y-auto">

        {!selectedOrg && (
          <p className="text-gray-500 text-center mt-20">
            Tashkilot tanlang 👈
          </p>
        )}

        {selectedOrg && (
          <>
            {/* ORGANIZATION INFO */}
            <div className="bg-white p-5 rounded-xl shadow mb-6">
              <h2 className="text-2xl font-bold">{selectedOrg.name}</h2>
              <p className="text-gray-600">{selectedOrg.phone}</p>
              <hr className="my-3" />

              <div className="flex gap-6">
                <p><strong>Jami muammolar:</strong> {problems.length}</p>
                <p><strong>Yechilgan:</strong> {problems.filter(p => p.status === "done").length}</p>
                <p><strong>Yechilmagan:</strong> {problems.filter(p => p.status !== "done").length}</p>
              </div>
            </div>

            {/* PROBLEMS LIST */}
            <div className="bg-white p-5 rounded-xl shadow">

              <h2 className="text-xl font-semibold mb-4">Muammolar tarixi</h2>

              {problems.length === 0 && (
                <p className="text-gray-500">Muammo yo‘q 🎉</p>
              )}

              {problems.map((p) => (
                <div
                  key={p.id}
                  className={`p-4 border rounded-lg mb-4 cursor-pointer 
                    ${selectedProblem?.id === p.id ? "bg-blue-50" : ""}
                    ${p.status === "done" ? "border-green-400" : "border-gray-300"}
                  `}
                  onClick={() => setSelectedProblem(p)}
                >
                  <div className="flex justify-between">
                    <p className="font-medium">{p.text}</p>

                    <span
                      className={`
                        px-2 py-1 text-xs rounded-full 
                        ${p.status === "new" && "bg-gray-200"}
                        ${p.status === "progress" && "bg-yellow-200"}
                        ${p.status === "done" && "bg-green-300"}
                      `}
                    >
                      {p.status === "new" && "Yangi"}
                      {p.status === "progress" && "Jarayonda"}
                      {p.status === "done" && "Yechilgan"}
                    </span>
                  </div>

                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(p.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            {/* FILE UPLOADER */}
            {selectedProblem && (
              <div className="bg-white p-5 rounded-xl shadow mt-6">
                <h2 className="text-xl font-semibold mb-3">
                  Yechim yuklash — {selectedProblem.text}
                </h2>

                <div
                  className="border-2 border-dashed rounded-xl p-8 text-center"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    setUploadFile(e.dataTransfer.files[0]);
                  }}
                >
                  {!uploadFile ? (
                    <p className="text-gray-600">Faylni bu yerga tashlang</p>
                  ) : (
                    <p className="text-green-600">Tanlangan fayl: {uploadFile.name}</p>
                  )}
                </div>

                <button
                  onClick={sendSolution}
                  className="w-full mt-4 bg-blue-600 text-white py-2 rounded"
                >
                  Yechimni yuborish
                </button>
              </div>
            )}
          </>
        )}
      </div>

    </div>
  );
}
