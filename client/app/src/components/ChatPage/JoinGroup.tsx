import React, { useRef } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import toast from "react-hot-toast";


type Props = {
  idTarget: number;
  handleClick: () => void;
  NewGroupCreated: () => void;
};

const JoinGroup = (props: Props) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const closemodale = () => {
    props.handleClick();
  };
  const Join = async () => {
    const inputValue = inputRef.current?.value;
    if (!inputValue?.length) {
      toast.error("empty pass");
      return;
    }
        const mytoken = Cookies.get("jwt");
    try {
      const res = await axios.get(
        `http://${import.meta.env.VITE_DOMAIN}:8000/api/chat/join_group?id=${
          props.idTarget
        }&password=${inputValue}`,
        {
          headers: {
            Authorization: `bearer ${mytoken}`,
          },
        }
      );
    toast.success("joined");
    props.NewGroupCreated();
    closemodale();
  } catch (error) {
    toast.error('wrong password')
  }
  };
  return (
    <div id="myModal" className="modal">
      <div className="modal-content">
        <span onClick={closemodale} className="close">&times;</span>
        <h4 style={{color: "black"}}>enter password</h4>
        <input
        ref={inputRef}
          style={{ padding: "5px", marginBottom: "5px" }}
          placeholder="enter pass"
          type="text"
          maxLength={7}
        />
        <button onClick={Join} style={{ width: "20%" }}>Join</button>
      </div>
    </div>
  );
};

export default JoinGroup;
