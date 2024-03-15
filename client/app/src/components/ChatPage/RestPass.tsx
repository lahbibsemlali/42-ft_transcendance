import React, { useRef } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import toast from "react-hot-toast";


type Props = {
    idTarget: number;
    openUpdatePass: () => void;
}

const RestPass = (props: Props) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const changePass = async () => {
        const inputValue = inputRef.current?.value;
        if (!inputValue?.length) {
            toast.error("empty pass");
            return;
        }
        const mytoken = Cookies.get("jwt") || "";
        try {
        
          const res = await axios.post(`http://${import.meta.env.VITE_DOMAIN}:8000/api/chat/change_password?groupId=${props.idTarget}`,
          {
            password: inputValue,
          },
          {
            headers: {
              Authorization: `bearer ${mytoken}`,
            }});
          } catch (error) {
          }
        props.openUpdatePass();
    };

    return (
        <div id="myModal" className="modal">
          <div className="modal-content">
            <span onClick={props.openUpdatePass} className="close">&times;</span>
            <h4 style={{color: "black"}}>enter password</h4>
            <input
                ref={inputRef}
                style={{ padding: "5px", marginBottom: "5px" }}
                placeholder="enter pass"
                type="text"
                maxLength={7}
            />
            <button onClick={changePass} style={{ width: "20%" }}>Update pass</button>
          </div>
        </div>
      );
}

export default RestPass
