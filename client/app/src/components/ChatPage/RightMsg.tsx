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
  return (
    <div className="rightmsg">
      <div className="div-wrapper2">
        <img src={props.urlImg} />
      </div>
      <div className="contentright">{props.msg}</div>
    </div>
  );
};

export default RightMsg;
