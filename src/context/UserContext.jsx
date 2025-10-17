import React, { createContext, useEffect, useState } from "react";

export const UserContext = createContext({
  user: null,          
  setUser: () => {},
  logout: () => {},
});

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const raw = localStorage.getItem("user");
    const tok = localStorage.getItem("token");
    if (raw && tok) {
      try {
        const u = JSON.parse(raw);
        setUser({ ...u, token: tok });
      } catch {}
    }
  }, []);

  useEffect(() => {
    if (user?.token) {
      localStorage.setItem("token", user.token);
      localStorage.setItem(
        "user",
        JSON.stringify({ id: user.id, username: user.username })
      );
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  }, [user]);

  const logout = () => setUser(null);

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
}
