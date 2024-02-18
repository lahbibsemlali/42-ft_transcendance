import React, { useRef } from "react";
import DropdownMenu from "./DropdownMenu";
import { useState } from "react";
import LeftMsg from "./LeftMsg";
import RightMsg from "./RightMsg";
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://localhost:3000";
const socket = socketIOClient(ENDPOINT, { transports: ["websocket"] });
import { useEffect } from "react";

type Props = {};

const ChatMsg = (props: Props) => {
  const [openmenu, setOpenMenu] = useState(false);
  // const []

  function openMenu() {
    if (openmenu) setOpenMenu(false);
    else setOpenMenu(true);
  }

  const chatContainer = document.getElementById("chatContainer");
  if (chatContainer) {
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleButtonClick = () => {
    const inputValue = inputRef.current?.value;

    if (inputRef.current) {
      inputRef.current.value = "";
    }
    console.log(inputValue);
  };

  return (
    <div className="chat-window">
      <div className="chat-msg">
        <div>
          <button className="option-btn" onClick={openMenu}>
            {!openmenu && (
              <i className="fa-solid fa-square-caret-down threedot"></i>
            )}
            {openmenu && (
              <i className="fa-solid fa-rectangle-xmark threedot"></i>
            )}
          </button>
          {openmenu && <DropdownMenu ifAdmin={true} wichMenu={3} />}
        </div>
        <div id="chatContainer" className="scrollmsg">
          <LeftMsg isAdmin={true} />
          <RightMsg isAdmin={false} />
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
