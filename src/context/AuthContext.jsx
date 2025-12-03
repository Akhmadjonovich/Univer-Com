import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // loginUser funksiyasini qo'shamiz
  const loginUser = (userData) => {
    setUser(userData);
    // localStorage ga saqlash (optional)
    localStorage.setItem("loggedInUser", JSON.stringify(userData));
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loginUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
