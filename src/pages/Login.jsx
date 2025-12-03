import { useState } from "react";
import { db } from "../../firebase";
import { ref, onValue } from "firebase/database";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [role, setRole] = useState("tashkilot");
  const [loginInput, setLoginInput] = useState("");
  const [password, setPassword] = useState("");

  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    const usersRef = ref(db, "users");

    onValue(
      usersRef,
      (snapshot) => {
        let found = null;

        snapshot.forEach((child) => {
          const u = child.val();

          if (
            u.login === loginInput &&
            u.password === password &&
            u.role === role
          ) {
            found = { id: child.key, ...u };
          }
        });

        if (!found) {
          alert("Login yoki parol noto‘g‘ri!");
          return;
        }

        loginUser(found);

        if (found.role === "tashkilot") navigate("/dashboard-org");
        if (found.role === "masul") navigate("/dashboard-masul");
      },
      { onlyOnce: true }
    );
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br to-gray-600">
      
      {/* Glassmorphism Card */}
      <div className="backdrop-blur-xl bg-white/20 p-8 rounded-3xl shadow-xl w-[340px] border border-white/30 relative">
        
        {/* Avatar circle */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-blue-900 rounded-full flex items-center justify-center shadow-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-12 h-12 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </div>

        <h2 className="text-center text-white font-semibold text-xl mt-12 mb-6">
          Login
        </h2>

        {/* Role select */}
        <select
          className="w-full rounded-2xl mb-4 bg-white/20 text-white placeholder-white border-2 border-white/40 p-2  focus:outline-none"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="tashkilot" className="text-black">
            Tashkilot
          </option>
          <option value="masul" className="text-black">
            Univer mas’uli
          </option>
        </select>

        {/* Login Input */}
        <div className="mb-4">
          <div className="flex items-center bg-white/20 border border-white/40 rounded-2xl p-2">
            <span className="text-white mr-2">
              <i className="fa fa-user"></i>
            </span>
            <input
              type="text"
              placeholder="Email ID"
              className="bg-transparent w-full outline-none text-white placeholder-white"
              value={loginInput}
              onChange={(e) => setLoginInput(e.target.value)}
            />
          </div>
        </div>

        {/* Password */}
        <div className="mb-4">
          <div className="flex items-center bg-white/20 border border-white/40 rounded-2xl p-2">
            <span className="text-white mr-2">
              <i className="fa fa-lock"></i>
            </span>
            <input
              type="password"
              placeholder="Password"
              className="bg-transparent w-full outline-none text-white placeholder-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        {/* Remember / Forgot */}
        <div className="flex justify-between text-white text-sm mb-6">
          <label className="flex items-center gap-1">
            <input type="checkbox" />
            Remember me
          </label>

          <button className="hover:underline">Forgot Password?</button>
        </div>

        {/* Submit button */}
        <button
          onClick={handleLogin}
          className="w-full py-2 bg-[#1C398E] text-white rounded-full shadow hover:bg-white/40 hover:text-[#1C398E] border border-transparent hover:border-[#1C398E] transition font-semibold"
        >
          LOGIN
        </button>
      </div>
    </div>
  );
}
