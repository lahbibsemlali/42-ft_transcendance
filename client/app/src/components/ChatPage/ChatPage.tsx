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

const ChatPage = () => {
  const isLoggedIn = useContext(isLogin);
  const context = useContext(reCheck);
  if (!context || !context.setCheck) return null;
  const { check, setCheck } = context;
  const [selectchat, setSelectchat] = useState(false);
  const [listChat, setListChat] = useState<ReactElement | null>(null);
  // const [restMsgs, setrestMsgs] = useState<number>(0);
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
    console.log("room name", id);
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
        console.log("zzzzzzz", res.data);
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
    // }, [restMsgs]);
  }, []);

  const [typeGrpup, setTypeGrpup] = useState(1);
  const [nameGrpup, setNameGrpup] = useState("");
  const [passGrpup, setPassGrpup] = useState("");
  const [empty, setEmpty] = useState(false);
  const inputRef2 = useRef<HTMLInputElement | null>(null);


  if (isLoggedIn == 2) return <LoginPage />;

  const hideString = () => {
    if (empty)
      setEmpty(false);
  };

  const GroupType = (type: number) => {
    // console.log(type);
    setTypeGrpup(type);
    if (empty)
      setEmpty(false);

  };

  const createGroup = async () => {
    console.log('hi');
    const inputValue = inputRef2.current?.value;
    if (typeGrpup == 3) {
      if (inputValue?.length) {
        if (inputRef2.current)
          inputRef2.current.value = "";
      } else {
        setEmpty(true);
        // console.log('empty');
        return ;
      }
    }
    // console.log('tzz');
    const mytoken = Cookies.get("jwt");
    const mute = async () => {
          const res = await axios.post(
            `http://${import.meta.env.VITE_DOMAIN}:8000/api/chat/create_group`,
            {
              name: "test",
              password: passGrpup,
              status: typeGrpup,
            },
            {
              headers: {
                Authorization: `bearer ${mytoken}`,
              },
            }
          );
          console.log("block", res);
        };
        await mute();
  };

  return (
    <div>
      <Header />

      <div id="myModal" className="modal">
        <div className="modal-content">
          <span className="close">&times;</span>
          <select style={{ width: "20%", margin: "10px" }} id="cars">
            <option onClick={() => GroupType(1)} value="volvo">public</option>
            <option onClick={() => GroupType(2)} value="saab">private</option>
            <option onClick={() => GroupType(3)} value="opel">protected</option>
          </select>
          {empty && <p style={{color: "black"}}>empty</p>}
          {typeGrpup == 3 && <input
          onChange={hideString}
            ref={inputRef2}
            style={{ padding: "5px", marginBottom: "25px" }}
            placeholder="PASSWORD"
            type="text"
            required
          />}
          <button onClick={createGroup} style={{ width: "20%" }}>Create</button>
        </div>
      </div>

      <div className="ChatContainer">
        <div className="barChat">
          <div className="search-box2">
            <input
              style={{ padding: "10px" }}
              placeholder="SEARCH FOR GROUPS"
              type="text"
              className="search"
            />
            <Result />
          </div>
          <button>Creat Group</button>
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
