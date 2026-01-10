import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

axios.defaults.withCredentials = true;

export const AppContent = createContext(null);

export const AppContextProvider = ({ children }) => {
  const backendurl = import.meta.env.VITE_BACKEND_URL;

  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState(null);

  const getuserdata = async () => {
    try {
      const { data } = await axios.get(
        `${backendurl}/api/user/data`
      );

      if (data.success) {
        setUserData(data.userData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch user data"
      );
    }
  };

  const getAuthState = async () => {
    try {
      if (!backendurl) return;

      const { data } = await axios.get(
        `${backendurl}/api/auth/is-auth`
      );

      if (data.success) {
        setIsLoggedin(true);
        getuserdata();
      } else {
        setIsLoggedin(false);
        setUserData(null);
      }
    } catch (error) {
      // silent fail (important)
      setIsLoggedin(false);
      setUserData(null);
    }
  };

  useEffect(() => {
    getAuthState();
  }, []);

  const value = {
    backendurl,
    isLoggedin,
    setIsLoggedin,
    userData,
    setUserData,
    getuserdata,
    getAuthState
  };

  return (
    <AppContent.Provider value={value}>
      {children}
    </AppContent.Provider>
  );
};
