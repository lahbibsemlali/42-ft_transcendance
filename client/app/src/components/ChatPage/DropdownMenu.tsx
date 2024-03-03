import React from "react";
import MenuBtn from "./MenuBtn";
import axios from "axios";
import Cookies from "js-cookie";

type DropWownProps = {
  id: number;
  isGroup: boolean;
  isAdmin: boolean;
  isProtected: boolean;
  isMuted: boolean;
};

const DropdownMenu: React.FC<DropWownProps> = ({
  isGroup,
  isAdmin,
  isProtected,
  id,
  isMuted,
}) => {

  const RemoveGroup = () => {
    const mytoken = Cookies.get("jwt") || "";
    axios.delete(`http://${import.meta.env.VITE_DOMAIN}:8000/api/chat/remove_group?groupId=${id}`,
    {
      headers: {
        Authorization: `bearer ${mytoken}`,
      }});
  };


  return (
    <div className="dropdown-content">
      {isGroup && !isAdmin && <MenuBtn action={5} str="Leave group" />}
      {isGroup && isAdmin && <MenuBtn action={6} str="Add User" />}
      {isGroup && isAdmin && <MenuBtn onChildClick7={RemoveGroup} action={7} str="Remove Group" />}
      {isGroup && isAdmin && isProtected && <MenuBtn action={8} str="change password" />}
      {isGroup && isAdmin && isProtected && <MenuBtn action={9} str="remove password" />}
    </div>
  );
};

export default DropdownMenu;
