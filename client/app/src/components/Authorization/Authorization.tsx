import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { createContext } from "react";
import React, { ReactNode } from "react";

interface AuthorizationProps {
  children: ReactNode;
}

type ReCheckContextType = {
  check: boolean;
  setCheck: React.Dispatch<React.SetStateAction<boolean>>;
};

export const isLogin = createContext({});
export const reCheck = createContext<ReCheckContextType | undefined>(undefined);

const Authorization: React.FC<AuthorizationProps> = ({ children }) => {
  const [check, setCheck] = useState(false);
  const [statuscode, setStatusCode] = useState(0);
  const [token, setToken] = useState("");
  useEffect(() => {
    const extractTokenFromCookies = () => {
      const mytoken = Cookies.get("jwt") || "";
      setToken(mytoken);
    };
    extractTokenFromCookies();
  }, [check]);
  useEffect(() => {
    const CheckAuth = async () => {
      if (token.length) {
        try {
          const res = await axios.get(`http://${import.meta.env.VITE_DOMAIN}:8000/api/auth/checkToken`, {
            headers: {
              Authorization: `bearer ${token}`,
            },
          });
          if (res.status === 200) setStatusCode(1);
        } catch (error) {
          if (token.length) {
            Cookies.remove("jwt");
            setStatusCode(2);
          }
        }
      } else setStatusCode(2);
    };
    CheckAuth();
  }, [token]);
  return (
    <>
      <reCheck.Provider value={{ check, setCheck }}>
        <isLogin.Provider value={statuscode}>{children}</isLogin.Provider>
      </reCheck.Provider>
    </>
  );
};

export default Authorization;
