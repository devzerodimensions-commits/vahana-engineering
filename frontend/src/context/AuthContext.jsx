import { createContext, useContext, useState, useCallback } from "react";
import * as adminApi from "../services/admin.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => adminApi.getStoredUser());

  const login = useCallback(async (email, password) => {
    const u = await adminApi.login(email, password);
    setUser(u);
    return u;
  }, []);

  const logout = useCallback(() => {
    adminApi.logout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthed: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
