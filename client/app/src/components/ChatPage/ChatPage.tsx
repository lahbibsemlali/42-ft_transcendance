import Header from "../Header/Header";
import Listchat from "./Listchat";
import "./ChatPage.css";
import { ReactElement, useEffect, useRef, useState } from "react";
import axios from "axios";
import { isLogin, reCheck } from "../Authorization/Authorization";
import { useContext } from "react";
import LoginPage from "../LoginPage/LoginPage";
import WelcomeChat from "./WelcomeChat";
import ChatMsg from "./ChatMsg";
import Cookies from "js-cookie";
import Popup from "reactjs-popup";
import Result from "./Result";
import CreateGroups from "./CreateGroups";

const ChatPage = () => {
  const isLoggedIn = useContext(isLogin);
  const context = useContext(reCheck);
  if (!context || !context.setCheck) return null;
  const { check, setCheck } = context;
  const [selectchat, setSelectchat] = useState(false);
  const [listChat, setListChat] = useState<ReactElement | null>(null);
  const [newGroup, setNewGroup] = useState(false);
  const [info, setrestMsgs] = useState({
    id: 0,
    isGroup: false,
    isAdmin: false,
    isProtected: false,
    isMuted: false,
  });

  useEffect(() => {
    if (check) setCheck(false);
    else setCheck(true);
  }, []);

  const displayChat = (
    id: number,
    isGroup: boolean,
    isAdmin: boolean,
    isProtected: boolean,
    isMuted: boolean
  ) => {
    setrestMsgs({
      id: id,
      isGroup: isGroup,
      isAdmin: isAdmin,
      isProtected: isProtected,
      isMuted: isMuted,
    });
    setSelectchat(true);
  };

  useEffect(() => {
    const mytoken = Cookies.get("jwt") || "";
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://${import.meta.env.VITE_DOMAIN}:8000/api/chat/get_chat`,
          {
            headers: {
              Authorization: `bearer ${mytoken}`,
            },
          }
        );
        const listsNew = res.data.map((userslist: any) => (
          <Listchat
            isMuted={userslist.isMuted}
            isAdmin={userslist.isAdmin}
            isGroup={userslist.isGroup}
            id={userslist.id}
            url={userslist.image}
            name={userslist.name}
            last={userslist.lastMessage || ""}
            status={userslist.state}
            isProtected={userslist.isProtected}
            onChildClick={displayChat}
          />
        ));
        setListChat(listsNew);
      } catch (error) {}
    };

    fetchData();
  }, [newGroup]);

  const NewGroupCreated = () => {
    if (newGroup)
      setNewGroup(false);
    else
      setNewGroup(true);
  }; 

 
  const [btnCraete, setBtnCreate] = useState(false);

  const createGroupOn = () => {
    if (btnCraete)
      setBtnCreate(false);
    else
      setBtnCreate(true);
  };

  if (isLoggedIn == 2) return <LoginPage />;

  return (
    <div>
      <Header />

        {btnCraete && <CreateGroups NewGroupCreated={NewGroupCreated} crateGroup={createGroupOn} />}

      <div className="ChatContainer">
        <div className="barChat">
          <div className="search-box2">
            <input
              style={{ padding: "10px" }}
              placeholder="SEARCH FOR GROUPS"
              type="text"
              className="search"
            />
            <div
              style={{
                // height: "100px",
                backgroundColor: "red",
                width: "200px",
                position: "absolute",
                display: "flex",
                flexDirection: "column-reverse",
              }}
            >
              {/* <Result />
              <Result /> */}
            </div>
            {/* <Result />
            <Result /> */}
          </div>
          <button onClick={createGroupOn}>Creat Group</button>
        </div>
        <div className="ChatBox">
          <div id="side-bar">{listChat}</div>
          {!selectchat && <WelcomeChat />}
          {selectchat && (
            <ChatMsg
              isMuted={info.isMuted}
              id={info.id}
              isAdmin={info.isAdmin}
              isGroup={info.isGroup}
              isProtected={info.isProtected}
            />
          )}{" "}
          {/* send restMsgs in props ===> id */}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
