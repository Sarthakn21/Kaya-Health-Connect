import { createContext, useState, useEffect } from "react";

export const GlobalContext = createContext();
const GlobalProvider = ({ children }) => {
  const [tabValue, setTabValue] = useState("Dashboard");
  const [currentUser, setCurrentUser] = useState(() => {
    const storedUser = localStorage.getItem("currentUser");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // useEffect(() => {
  //   localStorage.setItem("user", JSON.stringify(currentUser));
  //   localStorage.setItem("expirationTime", expirationTime);
  // }, [currentUser]);

  return (
    <GlobalContext.Provider
      value={{
        tabValue,
        setTabValue,
        currentUser,
        setCurrentUser,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
