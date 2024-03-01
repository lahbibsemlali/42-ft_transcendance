import { useEffect, useState } from "react";
import MenuBtn from "./MenuBtn";
import Cookies from "js-cookie";
import axios from "axios";

type Props = {
  isAdmin: boolean;
  idClient: number;
  idChat: number;
  isGroup: boolean;
  isMuted: boolean;
};

const MenuImg = (props: Props) => {
  // console.log('props.isGroup', props.isGroup);
  // const [isMuted2, setisMuted] = useState(false);
  const [muted, muteChanged] = useState(false);
  // let ifMuted = isMuted2;

  useEffect(() => {
    // const displayChat = async (bool: boolean) => {
    const mytoken = Cookies.get("jwt");
    const mute = async () => {
      const res = await axios.get(
        `http://${
          import.meta.env.VITE_DOMAIN
        }:8000/api/chat/isBlocked?targetId=${props.idClient}`,
        {
          headers: {
            Authorization: `bearer ${mytoken}`,
          },
        }
      );
      console.log("yesssssssssssssssss1");

      // console.log("vc", res.data.isBlocked);
      muteChanged(() => res.data.isBlocked);
    };
    mute();
    // };
  });

  const displayChat = (bool: boolean) => {
    const mytoken = Cookies.get("jwt");
    const mute = async () => {
      console.log("yesssssssssssssssss1", bool);
      const res = await axios.post(
        `http://${import.meta.env.VITE_DOMAIN}:8000/api/chat/blockOrUnblock`,
        {
          targetId: props.idClient,
          block: bool,
        },
        {
          headers: {
            Authorization: `bearer ${mytoken}`,
          },
        }
      );
    };
    mute();
    muteChanged(bool);
  };

  return (
    <div style={{ margin: "5px" }}>
      {!props.isGroup && !muted && (
        <MenuBtn
          onChildClick={displayChat}
          idClient={props.idClient}
          idChat={props.idChat}
          ifMute={true}
          str="Block"
        />
      )}
      {!props.isGroup && muted && (
        <MenuBtn
          onChildClick={displayChat}
          idClient={props.idClient}
          idChat={props.idChat}
          ifMute={false}
          str="Unblock"
        />
      )}
      {props.isGroup && props.isAdmin && (
        <MenuBtn
          idClient={props.idClient}
          idChat={props.idChat}
          ifMute={true}
          str="add admin"
        />
      )}
      {props.isGroup && props.isAdmin && (
        <MenuBtn
          idClient={props.idClient}
          idChat={props.idChat}
          ifMute={true}
          str="kick out"
        />
      )}
      {props.isGroup && props.isAdmin && (
        <MenuBtn
          idClient={props.idClient}
          idChat={props.idChat}
          ifMute={true}
          str="Ban"
        />
      )}
    </div>
  );
};

export default MenuImg;
