import { isLogin, reCheck } from "../Authorization/Authorization";
import { useContext, useEffect } from "react";
import LoginPage from "../LoginPage/LoginPage";
import Header from "../Header/Header";
import styles from "./HomePage.module.css";
import BoxContainer from "./BoxContainer";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import socketIOClient from "socket.io-client";
const ENDPOINT = `http://${import.meta.env.VITE_DOMAIN}:8000`;
import Cookies from "js-cookie";
let mytoken = Cookies.get("jwt") || "";
const socket = socketIOClient(ENDPOINT, {
  transports: ["websocket"],
  query: {
    token: mytoken,
  },
  transportOptions: {
    extraHeaders: {
      Authorization: `Bearer ${mytoken}`,
    },
  },
});

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
  const handleClick = (idUser: string, roomName: string, idUser2: string) => {
    socket.emit('accepted', idUser);
    navigate(`/Game?CustomRoom=1&roomName=${roomName}&idUser2=${idUser2}`);
  };

    socket.on("customRoom", (idUser: string, roomName: string, idUser2: string) => {
      toast((t) => (
        <span>
          SOME ONE INVITE YOU TO PLAY
          <button onClick={() => {
            toast.dismiss(t.id)
            handleClick(idUser, roomName, idUser2)
            }}>PLAY</button>
        </span>
      ));
    });
  }, []);

  const isLoggedIn = useContext(isLogin);
  const context = useContext(reCheck);
  if (!context || !context.setCheck) {
    return;
  }
  const { check, setCheck } = context;

  useEffect(() => {
    if (check) setCheck(false);
    else setCheck(true);
  }, []);

  if (isLoggedIn == 2) return <LoginPage />;

  return (
    <div>
      <Header />
      <div className={styles.Home}>
        <div><BoxContainer/></div>
      </div>
    </div>
  );
};

export default HomePage;
