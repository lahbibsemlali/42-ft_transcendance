import { useState } from "react";
import MenuImg from "./MenuImg";

type Props = {
  isOwner: boolean;
  isAdmin: boolean;
  idClient: number;
  idChat: number;
  urlImg: string;
  msg: string;
  isGroup: boolean;
  isMuted: boolean;
};

const LeftMsg = (props: Props) => {
  const [menuClicked, setMenuClicked] = useState(false);

  const imgClicked = () => {
    if (menuClicked) setMenuClicked(false);
    else setMenuClicked(true);
  };

  return (
    <div className="leftmsg">
      <div className="div-wrapper">
        <img onClick={imgClicked} src={props.urlImg} />
      </div>
      {menuClicked && (
        <MenuImg
        isOwner={props.isOwner}
          imgClicked={imgClicked}
          isMuted={props.isMuted}
          isGroup={props.isGroup}
          isAdmin={props.isAdmin}
          idClient={props.idClient}
          idChat={props.idChat}
        />
      )}
      <div className="contentleft">{props.msg}</div>
    </div>
  );
};

export default LeftMsg;
