import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ref, onValue } from "firebase/database";
import { db } from "../../firebase";
import { useAuth } from "../context/AuthContext";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { setUser } = useAuth(); // shu yerda setUser olinadi
  const navigate = useNavigate();

  useEffect(() => {
    // auto-login
    const loggedIn = localStorage.getItem("loggedIn");
    if (loggedIn === "admin") {
      setUser({ email: "admin@system.com", role: "admin" });
      navigate("/admin");
    }
  }, [setUser, navigate]);

  const handleLogin = () => {
    const userRef = ref(db, "users/admin");

    onValue(
      userRef,
      (snapshot) => {
        const adminData = snapshot.val();

        if (!adminData) {
          setError("Admin topilmadi!");
          return;
        }

        if (email === adminData.email && password === adminData.password) {
          setUser({ email: adminData.email, role: "admin" });
          localStorage.setItem("loggedIn", "admin");
          navigate("/admin");
        } else {
          setError("Email yoki parol noto‘g‘ri");
        }
      },
      { onlyOnce: true }
    );
  };

  return (
    <div className="p-6 max-w-sm mx-auto mt-20 border rounded-xl shadow">
      <h1 className="text-xl font-bold mb-4">Admin Login</h1>

      <input
        type="text"
        placeholder="Email"
        className="w-full p-2 border rounded mb-3"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Parol"
        className="w-full p-2 border rounded mb-3"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

      <button
        onClick={handleLogin}
        className="w-full bg-blue-600 text-white py-2 rounded"
      >
        Kirish
      </button>
    </div>
  );
}
