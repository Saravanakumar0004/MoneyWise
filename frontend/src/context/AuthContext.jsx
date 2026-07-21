import React, { createContext, useContext, useState } from "react";
import axiosInstance from "../api/axiosInstance";
const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => { const s = localStorage.getItem("user"); return s ? JSON.parse(s) : null; });
  const [loading, setLoading] = useState(false);
  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.post("/auth/login", { email, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify({ _id: data._id, name: data.name, email: data.email }));
      setUser({ _id: data._id, name: data.name, email: data.email });
      return { success: true };
    } catch (err) { return { success: false, message: err.response?.data?.message || "Login failed" }; }
    finally { setLoading(false); }
  };
  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.post("/auth/register", { name, email, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify({ _id: data._id, name: data.name, email: data.email }));
      setUser({ _id: data._id, name: data.name, email: data.email });
      return { success: true };
    } catch (err) { return { success: false, message: err.response?.data?.message || "Registration failed" }; }
    finally { setLoading(false); }
  };
  const logout = () => { localStorage.removeItem("token"); localStorage.removeItem("user"); setUser(null); };
  return <AuthContext.Provider value={{ user, login, register, logout, loading }}>{children}</AuthContext.Provider>;
};
export const useAuth = () => useContext(AuthContext);