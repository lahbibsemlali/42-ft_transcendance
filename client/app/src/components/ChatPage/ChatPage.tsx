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
import Result from "./Result";
import CreateGroups from "./CreateGroups";
import AddUser from "./AddUser";
import JoinGroup from "./JoinGroup";
import RestPass from "./RestPass";

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
    isOwner: false,
    idUser: 0,
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
    isMuted: boolean,
    isOwner: boolean,
    idUser: number,
  ) => {
    setrestMsgs({
      id: id,
      isGroup: isGroup,
      isAdmin: isAdmin,
      isProtected: isProtected,
      isMuted: isMuted,
      isOwner: isOwner,
      idUser: idUser,
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
            isOwner={userslist.isOwner}
            isMuted={userslist.isMuted}
            isAdmin={userslist.isAdmin}
            isGroup={userslist.isGroup}
            id={userslist.id}
            url={userslist.image}
            name={userslist.name}
            last={userslist.lastMessage || ""}
            status={userslist.state}
            isProtected={userslist.isProtected}
            idUser={userslist.userId}
            onChildClick={displayChat}
          />
        ));
        setListChat(listsNew);
      } catch (error) {
      }
    };

    fetchData();
  }, [newGroup]);

  const NewGroupCreated = () => {
    setNewGroup(!newGroup);
    setSelectchat(false);
  };

  const [btnCraete, setBtnCreate] = useState(false);
  const [btnAdd, setBtnAdd] = useState(false);
  const [modalpass, setmodalpass] = useState(false);
  const [modalupdate, setmodalUpdate] = useState(false);
  const [idTarget, setIdTarget] = useState(0);

  const createGroupOn = () => {
    setBtnCreate(!btnCraete);
  };

  const ftsetIdTarget = (id: number) => {
    setIdTarget(id);
  };

  const openAddUser = () => {
    setBtnAdd(!btnAdd);
  };

  const [nameGroup, setNmaeGroup] = useState("");
  const [searchR, setSearchR] = useState<ReactElement | null>(null);

  const setEmptyValue = () => {
    setNmaeGroup("");
    setNewGroup(!newGroup);
  };

  const openEnterPass = () => {
    setmodalpass(!modalpass);
  };

  const openUpdatePass = () => {
    setmodalUpdate(!modalupdate);
  };

  useEffect(() => {
    const mytoken = Cookies.get("jwt") || "";
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://${import.meta.env.VITE_DOMAIN}:8000/api/chat/search?keyword=${nameGroup}`,
          {
            headers: {
              Authorization: `bearer ${mytoken}`,
            },
          }
        );
        const shearchResult = res.data.matches.map((userslist: any) => (
          <Result
            isProtected={userslist.isProtected}
            handleClick={openEnterPass}
            setID={ftsetIdTarget}
            onChildClick={setEmptyValue}
            idChat={userslist.id}
            nameGroup={userslist.name}
            groupType={userslist.state}
          />
        ));
        setSearchR(shearchResult);
      } catch (error) {
      }
    };
    if (nameGroup.length)
      fetchData();
  }, [nameGroup]);

  if (isLoggedIn == 2) return <LoginPage />;

  return (
    <div>
      <Header />

      {btnCraete && (
        <CreateGroups
          NewGroupCreated={NewGroupCreated}
          crateGroup={createGroupOn}
        />
      )}

      {btnAdd && <AddUser idTarget={idTarget} handleClick={openAddUser} />}

        {modalpass && <JoinGroup NewGroupCreated={NewGroupCreated} idTarget={idTarget} handleClick={openEnterPass}/>}

        {modalupdate && <RestPass openUpdatePass={openUpdatePass} idTarget={idTarget} />}

      <div className="ChatContainer">
        <div className="barChat">
          <div className="search-box2">
            <input
              onChange={(e) => setNmaeGroup(e.target.value)}
              style={{ padding: "10px" }}
              placeholder="SEARCH FOR GROUPS"
              type="text"
              className="search"
            />
            <div
              style={{
                backgroundColor: "red",
                width: "200px",
                position: "absolute",
                display: "flex",
                flexDirection: "column-reverse",
              }}
            >
              {nameGroup.length != 0 && searchR}
            </div>
          </div>
          <button onClick={createGroupOn} className="plus-button"></button>
        </div>
        <div className="ChatBox">
          <div id="side-bar">{listChat}</div>
          {!selectchat && <WelcomeChat />}
          {selectchat && (
            <ChatMsg
            idUser={info.idUser}
              openUpdatePass={openUpdatePass}
              isOwner={info.isOwner}
              setID={ftsetIdTarget}
              modalAddUser={openAddUser}
              NewGroupCreated={NewGroupCreated}
              isMuted={info.isMuted}
              id={info.id}
              isAdmin={info.isAdmin}
              isGroup={info.isGroup}
              isProtected={info.isProtected}
            />
          )}{" "}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
