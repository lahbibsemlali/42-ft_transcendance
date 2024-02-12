import { isLogin, reCheck } from "../Authorization/Authorization";
import { useContext, useEffect, useState } from "react";
import LoginPage from "../LoginPage/LoginPage";
import Header from "../Header/Header";
import Listchat from "./Listchat";
import RightMsg from "./RightMsg";
import LeftMsg from "./LeftMsg";
import DropdownMenu from "./DropdownMenu";
import WelcomeChat from "./WelcomeChat";
import ChatMsg from "./ChatMsg";
import "./ChatPage.css";

const ChatPage = () => {
  const [selectchat, setSelectChat] = useState(false);
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

  function showChat() {
    console.log("chowwwwwwwwwwwww", selectchat);
    setSelectChat(true);
  }

  return (
    <div>
      <Header />
      <div className="ChatContainer">
        <div className="ChatBox">
          <div id="side-bar">
            <Listchat
              url="https://cdn.intra.42.fr/users/bc6d13d354c50b832542b18db4a7d7ba/lsemlali.jpg"
              name="username"
              last="last msg"
            />
            <Listchat
              url="https://cdn.intra.42.fr/users/bc6d13d354c50b832542b18db4a7d7ba/lsemlali.jpg"
              name="username"
              last="last msg"
            />
            <Listchat
              url="https://cdn.intra.42.fr/users/bc6d13d354c50b832542b18db4a7d7ba/lsemlali.jpg"
              name="username"
              last="last msg"
            />
            <Listchat
              url="https://cdn.intra.42.fr/users/bc6d13d354c50b832542b18db4a7d7ba/lsemlali.jpg"
              name="username"
              last="last msg"
            />
            <Listchat
              url="https://cdn.intra.42.fr/users/bc6d13d354c50b832542b18db4a7d7ba/lsemlali.jpg"
              name="username"
              last="last msg"
            />
            <Listchat
              url="https://cdn.intra.42.fr/users/bc6d13d354c50b832542b18db4a7d7ba/lsemlali.jpg"
              name="username"
              last="last msg"
            />
            <Listchat
              url="https://cdn.intra.42.fr/users/bc6d13d354c50b832542b18db4a7d7ba/lsemlali.jpg"
              name="username"
              last="last msg"
            />
            <Listchat
              url="https://cdn.intra.42.fr/users/bc6d13d354c50b832542b18db4a7d7ba/lsemlali.jpg"
              name="username"
              last="last msg"
            />
            <Listchat
              url="https://cdn.intra.42.fr/users/bc6d13d354c50b832542b18db4a7d7ba/lsemlali.jpg"
              name="username"
              last="last msg"
            />
          </div>
          {/* <div> */}
          {selectchat && <WelcomeChat />}
          {!selectchat && <ChatMsg />}
          {/* </div> */}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
