import React from "react";

type Props = {};

const WelcomeChat = (props: Props) => {
  return (
    <div className="chat-window">
        <div className="welcomechat">
          <img
            src="https://raw.githubusercontent.com/koolkishan/chat-app-react-nodejs/master/public/src/assets/robot.gif"
            style={{ width: "300px" }}
          />
          <h1 style={{ color: "#ffc305", margin: "5px"}}>Welcome</h1>
          <h3>Please select a chat to Start Messaging</h3>
        </div>
    </div>
  );
};

export default WelcomeChat;
