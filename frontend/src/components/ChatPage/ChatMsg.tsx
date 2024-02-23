import React, { ReactElement, useRef } from "react";
import DropdownMenu from "./DropdownMenu";
import { useState } from "react";
import LeftMsg from "./LeftMsg";
import RightMsg from "./RightMsg";
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://localhost:3000";
const socket = socketIOClient(ENDPOINT, { transports: ["websocket"] });
import { useEffect } from "react";
import GeneratMsg from "./GeneratMsg";
import axios from "axios";

type Props = {
  id: string;
};
// type

const ChatMsg = (props: Props) => {
  const [openmenu, setOpenMenu] = useState(false);
  // const [MsgGenerated, setMsgGenerated] = useState<ReactElement | null>(null);
  const [MsgGenerated, setMsgGenerated] = useState<React.ReactElement<any, string | React.JSXElementConstructor<any>>[] | null>(null);

  
  useEffect(() => {
    console.log("re fetch data");
    setMsgGenerated(null);
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://stapi.co/api/v2/rest/spacecraft/search"
        );
        // const LIstMsg =
        const spacecrafts = response.data.spacecrafts;
        const LIstMsg = spacecrafts.map((spacecraft: any) => (
          <GeneratMsg
            isAdmin={true}
            idClient={21212}
            idChat={212121}
            urlImg="https://cdn.intra.42.fr/users/bc6d13d354c50b832542b18db4a7d7ba/lsemlali.jpg"
            msg={spacecraft.name}
          />
        ));
        setMsgGenerated(LIstMsg);
      } catch (error) {}
    };

    fetchData();
  }, [props.id]);

  useEffect(() => {
    socket.emit("join to this chat room", props.id);
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
    console.log(inputValue);
    let MsgGeneratedTmp = MsgGenerated;
    const newMsg = (
      <GeneratMsg
            isAdmin={true}
            idClient={888888}
            idChat={212121}
            urlImg="https://cdn.intra.42.fr/users/bc6d13d354c50b832542b18db4a7d7ba/lsemlali.jpg"
            msg={inputValue || ""}
          />
    );

    const updatedMsgs = MsgGeneratedTmp ? [...MsgGeneratedTmp, newMsg] : [newMsg];
  setMsgGenerated(updatedMsgs);
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
