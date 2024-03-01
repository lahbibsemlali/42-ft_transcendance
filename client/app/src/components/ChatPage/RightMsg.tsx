import { useState } from "react";
import MenuImg from "./MenuImg";

type Props = {
  isAdmin: boolean;
  idClient: number;
  idChat: number;
  urlImg: string;
  msg: string;
  isGroup: boolean;
};

const RightMsg = (props: Props) => {
  // isAdmin = true; // to be remove

  const [menuClicked, setMenuClicked] = useState(false);

  const imgClicked = () => {
    if (menuClicked) setMenuClicked(false);
    else setMenuClicked(true);
  };

  return (
    <div className="rightmsg">
      <div className="div-wrapper2">
        <img onClick={imgClicked} src={props.urlImg} />
      </div>
      {menuClicked && props.isGroup && (
        <MenuImg
          isGroup={props.isGroup}
          isAdmin={props.isAdmin}
          idClient={props.idClient}
          idChat={props.idChat}
        />
      )}
      <div className="contentright">{props.msg}</div>
    </div>
  );
};

export default RightMsg;
