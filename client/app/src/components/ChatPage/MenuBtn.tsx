import React, { useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";

type Props = {
  str: string;
  idClient: number;
  idChat: number;
  ifMute: boolean;
  // fgf: boolean;
  onChildClick?: (param1: boolean) => void;
};

const MenuBtn = (props: Props) => {
  // const mytoken = Cookies.get("jwt");

  // useEffect(() => {
  //   const mute = async () => {
  //     const res = await axios.post(
  //       `http://${import.meta.env.VITE_DOMAIN}:8000/api/chat/muteOrUnmute`,
  //       {
  //         targetId: props.idClient,
  //         chatId: props.idChat,
  //         mute: props.ifMute,
  //       },
  //       {
  //         headers: {
  //           Authorization: `bearer ${mytoken}`,
  //         },
  //       }
  //     );
  //     console.log("block", res);
  //   };
  //   mute();
  // }, []);

  const handleClick = () => {
    if (props.onChildClick) {
      props.onChildClick(props.ifMute);
    }
  };

  return (
    <button onClick={handleClick} className="btnMenu" style={{ border: "none" }}>
      {props.str}
    </button>
  );
};

export default MenuBtn;
