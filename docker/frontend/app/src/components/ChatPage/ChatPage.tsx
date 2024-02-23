import Header from "../Header/Header";
import Listchat from "./Listchat";
import "./ChatPage.css";
import { ReactElement, useEffect, useState } from "react";
import axios from "axios";
import { isLogin, reCheck } from "../Authorization/Authorization";
import { useContext } from "react";
import LoginPage from "../LoginPage/LoginPage";
import WelcomeChat from "./WelcomeChat";
import ChatMsg from "./ChatMsg";
import Cookies from "js-cookie";

const ChatPage = () => {
  const isLoggedIn = useContext(isLogin);
  const context = useContext(reCheck);
  if (!context || !context.setCheck) return null;
  const { check, setCheck } = context;
  const [selectchat, setSelectchat] = useState(false);
  const [listChat, setListChat] = useState<ReactElement | null>(null);
  const [restMsgs, setrestMsgs] = useState("");

  useEffect(() => {
    if (check) setCheck(false);
    else setCheck(true);
  }, []);

  const displayChat = (id: string) => {
    console.log(id);
    setrestMsgs(id);
    setSelectchat(true);
  };

  useEffect(() => {
    const mytoken = Cookies.get("jwt") || "";
    const fetchData = async () => {
      try {
        // const res = await axios.get("https://api.imgflip.com/get_memes");
        const res = await axios.get("http://localhost:3000/chat/get_chat", {
          headers: {
            Authorization: `bearer ${mytoken}`,
          },
        });
        console.log(res.data);
        const listsNew = res.data.map((userslist: any) => (
          <Listchat
            url={userslist.image}
            name={userslist.name}
            last={userslist.lastMessage || ""}
            status={true}
            onChildClick={displayChat}
          />
        ));
        setListChat(listsNew);
      } catch (error) {
        // console.log("error");
      }
    };

    fetchData();
  }, [restMsgs]);

  if (isLoggedIn == 2) return <LoginPage />;

  return (
    <div>
      <Header />
      <div className="ChatContainer">
        <div className="ChatBox">
          <div id="side-bar">{listChat}</div>
          {!selectchat && <WelcomeChat />}
          {selectchat && <ChatMsg id={restMsgs} />}{" "}
          {/* send restMsgs in props ===> id */}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
