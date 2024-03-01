import React, { useRef } from "react";
import DropdownMenu from "./DropdownMenu";
import { useState } from "react";
import socketIOClient from "socket.io-client";
const ENDPOINT = `http://${import.meta.env.VITE_DOMAIN}:8000`;
const socket = socketIOClient(ENDPOINT, { transports: ["websocket"] });
import { useEffect } from "react";
import GeneratMsg from "./GeneratMsg";
import axios from "axios";
import Cookies from "js-cookie";

type Props = {
  id: number;
  isAdmin: boolean;
  isGroup: boolean;
  isProtected: boolean;
  isMuted: boolean;
};

const ChatMsg = (props: Props) => {
  const [openmenu, setOpenMenu] = useState(false);
  const [newMsg, setnewMsg] = useState(false);
  const [MsgGenerated, setMsgGenerated] = useState<
    React.ReactElement<any, string | React.JSXElementConstructor<any>>[] | null
  >(null);

  socket.on("send msg", () => {
    if (newMsg)
      setnewMsg(false);
    else
      setnewMsg(true);
  });

  useEffect(() => {
    const mytoken = Cookies.get("jwt") || "";
    console.log("re fetch data", props.id);
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://${
            import.meta.env.VITE_DOMAIN
          }:8000/api/chat/get_messages?chatId=${props.id}`,
          {
            headers: {
              Authorization: `bearer ${mytoken}`,
            },
          }
        );
        const spacecrafts = response.data;
        console.log("msg", spacecrafts)
        const LIstMsg = spacecrafts.map((spacecraft: any) => (
          <GeneratMsg
            isMuted={spacecraft.isMutted}
            isGroup={props.isGroup}
            isMe={spacecraft.isMe}
            isAdmin={props.isAdmin}
            idClient={spacecraft.userId}
            idChat={props.id}
            urlImg={spacecraft.avatar}
            msg={spacecraft.content}
          />
        ));
        setMsgGenerated(LIstMsg);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [props.id, newMsg]);

  useEffect(() => {
    socket.emit("join to this chat room", props.id.toString());
  }, [props.id]);

  function openMenu() {
    if (openmenu) setOpenMenu(false);
    else setOpenMenu(true);
  }

  useEffect(() => {
    const chatContainer = document.getElementById("chatContainer");
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [MsgGenerated]);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleButtonClick = () => {
    const inputValue = inputRef.current?.value;
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    socket.emit("send msg", inputValue, props.id);
  };

  return (
    <div className="chat-window">
      <div className="chat-msg">
        <div>
          <button className="option-btn" onClick={openMenu}>
            {!openmenu && props.isGroup && (
              <i className="fa-solid fa-square-caret-down threedot"></i>
            )}
            {openmenu && props.isGroup && (
              <i className="fa-solid fa-rectangle-xmark threedot"></i>
            )}
          </button>
          {openmenu && (
            <DropdownMenu
              isMuted={props.isMuted}
              id={props.id}
              isAdmin={props.isAdmin}
              isGroup={props.isGroup}
              isProtected={props.isProtected}
            />
          )}
        </div>
        <div id="chatContainer" className="scrollmsg">
          {MsgGenerated}
        </div>
      </div>
      <div className="chat-send">
        <div className="inputmsg">
          <input
            ref={inputRef}
            placeholder="Message"
            type="text"
            className="sendmsgcss"
          />
        </div>
        <div className="btnsend">
          <button onClick={handleButtonClick} className="btnsend2">
            <i className="fa-solid fa-paper-plane sendicon"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatMsg;
