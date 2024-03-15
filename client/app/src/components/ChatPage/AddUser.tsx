import React, { useRef } from "react";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import axios from "axios";

type Props = {
  handleClick: () => void;
  idTarget: number;
};

const AddUser = (props: Props) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const notify = (msg: string) => toast.error(msg);

  const handleClick2 = () => {
    if (props.handleClick) props.handleClick();
  };

  const AddUser = async () => {
    const inputValue = inputRef.current?.value;
    if (!inputValue?.length) {
      notify("empty name");
      return;
    }
    const mytoken = Cookies.get("jwt") || "";
    try {
      await axios.post(
        `http://${
          import.meta.env.VITE_DOMAIN
        }:8000/api/chat/add_to_group?groupId=${props.idTarget}`,
        {
          target: inputValue,
        },
        {
          headers: {
            Authorization: `bearer ${mytoken}`,
          },
        }
      );
    } catch (error: any) {
      notify(error.response.data.message);
      return;
    }
    handleClick2();
  };

  return (
    <div id="myModal" className="modal">
      <div className="modal-content">
        <span onClick={handleClick2} className="close">
          &times;
        </span>
        <input
          ref={inputRef}
          style={{ padding: "5px", marginBottom: "5px" }}
          placeholder="USERNAME"
          type="text"
        />
        <button onClick={AddUser}>Add user</button>
      </div>
    </div>
  );
};

export default AddUser;
