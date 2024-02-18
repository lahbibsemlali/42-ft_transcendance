import React, { useState } from "react";
import MenuImg from "./MenuImg";

type LeftMsgProps = {
  isAdmin: boolean;
};

const RightMsg: React.FC<LeftMsgProps> = ({ isAdmin }) => {

  // isAdmin = true; // to be remove

  const [menuClicked, setMenuClicked] = useState(false);

  const imgClicked = () => {
    if (menuClicked) setMenuClicked(false);
    else setMenuClicked(true);
  };

  return (
    <div className="rightmsg">
      <div className="div-wrapper2">
        <img
          onClick={imgClicked}
          src="https://cdn.intra.42.fr/users/bc6d13d354c50b832542b18db4a7d7ba/lsemlali.jpg"
        />
      </div>
      {menuClicked && isAdmin && <MenuImg />}
      <div className="contentright">RIGHT MESSAGES</div>
    </div>
  );
};

export default RightMsg;
