import React, { useRef, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import toast from "react-hot-toast";
import "./ChatPage.css";
import "./ChatPage.css";

type CreateTYpe = {
  crateGroup?: () => void;
  NewGroupCreated: () => void;
};

const CreateGroups: React.FC<CreateTYpe> = ({ crateGroup, NewGroupCreated }) => {
  const inputRef2 = useRef<HTMLInputElement | null>(null);
  const inputRef3 = useRef<HTMLInputElement | null>(null);
  const [typeGrpup, setTypeGrpup] = useState(1);

  const notify = (msg: string) => toast.error(msg);

  const createGroup = async () => {
    const inputValue = inputRef2.current?.value;
    const inputValue3 = inputRef3.current?.value;
    if (!inputValue3?.length) {
      notify("empty name");
      return;
    }
    if (typeGrpup == 3 && !inputValue?.length) {
      notify("empty password");
      return;
    }
    const mytoken = Cookies.get("jwt");
    const mute = async () => {
      const res = await axios.post(
        `http://${import.meta.env.VITE_DOMAIN}:8000/api/chat/create_group`,
        {
          name: inputValue3,
          password: inputValue === undefined ? '' : inputValue,
          status: typeGrpup,
        },
        {
          headers: {
            Authorization: `bearer ${mytoken}`,
          },
        }
      );
    };
    await mute();
    toast.success("group created");
    handleClick();
    NewGroupCreated2();
  };

  const GroupType = (type: number) => {
    setTypeGrpup(type);
  };

  const handleClick = () => {
    if (crateGroup) {
      crateGroup();
    }
  };

  const NewGroupCreated2 = () => {
    if (NewGroupCreated)
      NewGroupCreated();
  };

  return (
    <div id="myModal" className="modal">
      <div className="modal-content" style={{backgroundColor:"#224771" , border:"#224771", borderRadius:"10px"}}>
        <span onClick={handleClick} className="close" style={{margin:"10px"}}>
          &times;
        </span>
        <input
          ref={inputRef3}
          style={{ width:"250px", padding: "10px", marginBottom: "10px" , backgroundColor:"#2190e2",border:"#2190e2", borderRadius:"10px", fontFamily:"simo"}}
          placeholder="NAME"
          type="text"
          maxLength={7}
          className="search"
        />
        <select style={{ width: "25%", textAlign:"center",margin: "10px" , backgroundColor:"#2190e2", borderRadius:"5px", border:"#2190e2", fontFamily:"simo", color:"white"}} id="cars">
          <option onClick={() => GroupType(1)} value="volvo">
            public
          </option>
          <option onClick={() => GroupType(2)} value="saab">
            private
          </option>
          <option onClick={() => GroupType(3)} value="opel">
            protected
          </option>
        </select>
        {typeGrpup == 3 && (
          <input
            ref={inputRef2}
            style={{ padding: "5px", marginBottom: "25px" }}
            placeholder="PASSWORD"
            type="text"
          />
        )}
        <button onClick={createGroup} style={{ width: "25%" , backgroundColor:"#2190e2", borderRadius:"5px", border:"#2190e2", fontFamily:"simo", color:"white"}}>
          Create
        </button>
      </div>
    </div>
  );
};

export default CreateGroups;
