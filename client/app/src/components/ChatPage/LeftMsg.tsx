import { useState } from "react";
import MenuImg from "./MenuImg";

type Props = {
  isAdmin: boolean;
  idClient: number;
  idChat: number;
  urlImg: string;
  msg: string;
};

const LeftMsg = (props: Props) => {

  // isAdmin = true; // to be remove

  const [menuClicked, setMenuClicked] = useState(false);

  const imgClicked = () => {
    if (menuClicked) setMenuClicked(false);
    else setMenuClicked(true);
  };

  return (
    <div className="leftmsg">
      <div className="div-wrapper">
        <img
          onClick={imgClicked}
          src={props.urlImg}
        />
      </div>
      {menuClicked && props.isAdmin && <MenuImg idClient={props.idClient} idChat={props.idChat} />}
      <div className="contentleft">{props.msg}</div>
    </div>
  );
};

export default LeftMsg;
