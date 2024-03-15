import React from "react";
import Cookies from "js-cookie";
import axios from "axios";
import toast from "react-hot-toast";

type Props = {
  idChat: number;
  nameGroup: string;
  groupType: string;
  onChildClick: () => void;
  setID: (param: number) => void;
  handleClick: () => void;
  isProtected: boolean;
};

const Result = (props: Props) => {
  const joinGroup = async () => {
    props.onChildClick();
    if (props.isProtected) {
      props.setID(props.idChat);
      props.handleClick();
    } else {
      const mytoken = Cookies.get("jwt");
    try {
      const res = await axios.get(
        `http://${import.meta.env.VITE_DOMAIN}:8000/api/chat/join_group?id=${props.idChat}`,
        {
          headers: {
            Authorization: `bearer ${mytoken}`,
          },
        }
      );
    toast.success("joined");
  } catch (error) {
    toast.error('error')
  }
    }
  };

  return (
    <div
      style={{
        display: "flex",
        padding: "5px",
        justifyContent: "space-between",
      }}
    >
      <p style={{ marginLeft: "5px" }}>{props.nameGroup}</p>
      <button style={{ marginRight: "5px" }} onClick={joinGroup}>
        Joing
      </button>
    </div>
  );
};

export default Result;
