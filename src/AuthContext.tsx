import React, { useState, createContext, useMemo } from "react";

interface ContextValue {
  authorised: boolean;
  token: string | undefined;
  setAuthorised: (arg0: boolean) => void;
  setToken: (arg0: string | undefined) => void;
}

const AuthContext = createContext<ContextValue>({
  authorised: false,
  token: undefined,
  setAuthorised: () => false,
  setToken: () => undefined,
});

const AuthContextProvider: React.FC<React.ReactNode> = ({ children }) => {
  const [authorised, setAuthorised] = useState<boolean>(false);
  const [token, setToken] = useState<string | undefined>(undefined);

  const contextvalue = useMemo(() => {
    return { authorised, token, setAuthorised, setToken };
  }, [authorised, token]);

  return (
    <AuthContext.Provider value={contextvalue}>{children}</AuthContext.Provider>
  );
};

export { AuthContextProvider, AuthContext };
