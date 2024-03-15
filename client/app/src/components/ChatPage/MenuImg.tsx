import { useEffect, useState } from "react";
import MenuBtn from "./MenuBtn";
import Cookies from "js-cookie";
import axios from "axios";
import { Navigate, redirect } from "react-router-dom";

type Props = {
  isAdmin: boolean;
  isOwner: boolean;
  idClient: number;
  idChat: number;
  isGroup: boolean;
  isMuted: boolean;
  imgClicked?: () => void;
};

const MenuImg = (props: Props) => {
  const [isAdminOrOwner, setisAdminOrOwner] = useState(0);
  const [isBlock, BlockStateChanged] = useState(false);
  const mytoken = Cookies.get("jwt");

  useEffect(() => {
    const isBlocked = async () => {
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
      BlockStateChanged(() => res.data.isBlocked);

      const res2 = await axios.get(
        `http://${
          import.meta.env.VITE_DOMAIN
        }:8000/api/chat/get_user_role?userId=${props.idClient}&groupId=${
          props.idChat
        }`,
        {
          headers: {
            Authorization: `bearer ${mytoken}`,
          },
        }
      );
      setisAdminOrOwner(res2.data.isAdmin);
    };
    isBlocked();
  }, []);

  const BlcokUser = async (bool: boolean) => {
    await axios.post(
      `http://${import.meta.env.VITE_DOMAIN}:8000/api/chat/blockOrUnblock?targetId=${props.idClient}`,
      {
        block: bool
      },
      {
        headers: {
          Authorization: `bearer ${mytoken}`,
        },
      }
    );
    if (bool) BlockStateChanged(true);
    else BlockStateChanged(false);
  };

  const addAdmin = async () => {
    await axios.post(
      `http://${import.meta.env.VITE_DOMAIN}:8000/api/chat/promote`,
      {
        targetId: props.idClient,
        chatId: props.idChat,
      },
      {
        headers: {
          Authorization: `bearer ${mytoken}`,
        },
      }
    );
    if (props.imgClicked) props.imgClicked();
  };

  const removeAdmin = async () => {
    await axios.post(
      `http://${import.meta.env.VITE_DOMAIN}:8000/api/chat/denote`,
      {
        targetId: props.idClient,
        chatId: props.idChat,
      },
      {
        headers: {
          Authorization: `bearer ${mytoken}`,
        },
      }
    );
    if (props.imgClicked) props.imgClicked();
  };

  const kickOut = async () => {
    await axios.post(
      `http://${import.meta.env.VITE_DOMAIN}:8000/api/chat/kick`,
      {
        targetId: props.idClient,
        chatId: props.idChat,
      },
      {
        headers: {
          Authorization: `bearer ${mytoken}`,
        },
      }
    );
    if (props.imgClicked) props.imgClicked();
  };

  const banUser = async () => {
    await axios.post(
      `http://${import.meta.env.VITE_DOMAIN}:8000/api/chat/ban`,
      {
        targetId: props.idClient,
        chatId: props.idChat,
      },
      {
        headers: {
          Authorization: `bearer ${mytoken}`,
        },
      }
    );
    if (props.imgClicked) props.imgClicked();
  };

  const mute = async () => {
    await axios.post(
      `http://${import.meta.env.VITE_DOMAIN}:8000/api/chat/mute`,
      {
        targetId: props.idClient,
        chatId: props.idChat,
      },
      {
        headers: {
          Authorization: `bearer ${mytoken}`,
        },
      }
    );
    if (props.imgClicked) props.imgClicked();
  };

  const [viewP, setviewP] = useState(false);

  const viewProfile = () => {
    setviewP(true);
  };

  if (!isAdminOrOwner || isAdminOrOwner == 4) return null;

  return (
    <>
    {viewP && <Navigate to={`/profile/${props.idClient.toString()}`} />}
    <div style={{ margin: "5px" }}>
        <MenuBtn
          onChildClick2={viewProfile}
          action={2}
          ifMute={true}
          str="Profile"
        />
      {!props.isGroup && !isBlock && (
        <MenuBtn
          action={1}
          onChildClick={() => BlcokUser(true)}
          ifMute={true}
          str="Block"
        />
      )}
      {!props.isGroup && isBlock && (
        <MenuBtn
          action={1}
          onChildClick={() => BlcokUser(false)}
          ifMute={false}
          str="Unblock"
        />
      )}
      {props.isGroup && props.isOwner && isAdminOrOwner == 2 && (
        <MenuBtn
          onChildClick2={addAdmin}
          action={2}
          ifMute={true}
          str="add admin"
        />
      )}
      {props.isGroup && props.isOwner && isAdminOrOwner == 1 && (
        <MenuBtn
          onChildClick22={removeAdmin}
          action={22}
          ifMute={true}
          str="remove admin"
        />
      )}
      {props.isGroup && props.isAdmin && (
        <MenuBtn onChildClick3={mute} action={3} ifMute={true} str="mute 24h" />
      )}
      {props.isGroup && props.isAdmin && (
        <MenuBtn
          onChildClick3={kickOut}
          action={3}
          ifMute={true}
          str="kick out"
        />
      )}
      {props.isGroup && props.isAdmin && (
        <MenuBtn onChildClick4={banUser} action={4} ifMute={true} str="Ban" />
      )}
    </div>
    </>
  );
};

export default MenuImg;
