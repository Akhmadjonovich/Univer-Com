import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <div className="flex justify-between items-center px-10 py-6">
      <h1 className="text-2xl font-black text-white">
        Muammolar Platformasi
      </h1>

      {user ? (
        <div className="flex items-center gap-4">
          <span className="text-indigo-400 font-bold">
            {user.organizationName}
          </span>
          <button onClick={logout} className="text-sm text-red-400">
            Chiqish
          </button>
        </div>
      ) : (
        <Link
          to="/login"
          className="bg-indigo-600 px-6 py-2 rounded-xl text-white font-bold"
        >
          Kirish
        </Link>
      )}
    </div>
  );
}