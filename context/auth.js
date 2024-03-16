import { createContext, useContext, useState } from "react";

const AuthContext = createContext();
const SetAuthContext = createContext(null);

export function AuthContextProvider({ value, children }) {
  const [user, setUser] = useState(value);
  return (
    <AuthContext.Provider value={user}>
      <SetAuthContext.Provider value={setUser}>{children}</SetAuthContext.Provider>
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}

export function useSetAuthContext() {
  return useContext(SetAuthContext);
}
