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
  isOwner: boolean;
  NewGroupCreated: () => void;
  openMenu: () => void;
  modalAddUser: () => void;
  setID: (param: number) => void;
  openUpdatePass: () => void;
};

const DropdownMenu: React.FC<DropWownProps> = ({
  isGroup,
  isAdmin,
  isProtected,
  id,
  isMuted,
  NewGroupCreated,
  openMenu,
  modalAddUser,
  setID,
  openUpdatePass,
  isOwner,
}) => {

  const RemoveGroup = async  () => {
    const mytoken = Cookies.get("jwt") || "";
    await axios.delete(`http://${import.meta.env.VITE_DOMAIN}:8000/api/chat/remove_group?groupId=${id}`,
    {
      headers: {
        Authorization: `bearer ${mytoken}`,
      }});
      NewGroupCreated();
  };

  const AddUser = async  () => {
    setID(id);
    modalAddUser();
    openMenu();
  };

  const leaveGroup = async () => {
    const mytoken = Cookies.get("jwt") || "";
    try {
      await axios(`http://${import.meta.env.VITE_DOMAIN}:8000/api/chat/leave_group?groupId=${id}`,
      {
        headers: {
          Authorization: `bearer ${mytoken}`,
        }});
      } catch (error) {
      }
    openMenu();
    NewGroupCreated();
  };

  const changePass = async () => {
    setID(id);
    openUpdatePass();
    NewGroupCreated();
  };

  const removePass = async () => {
    const mytoken = Cookies.get("jwt") || "";
    try {
      await axios.delete(`http://${import.meta.env.VITE_DOMAIN}:8000/api/chat/remove_password?groupId=${id}`,
      {
        headers: {
          Authorization: `bearer ${mytoken}`,
        }});
      } catch (error) {
      }
    openMenu();
    NewGroupCreated();
  };


  return (
    <>
    <div className="dropdown-content">
      {isGroup && <MenuBtn onChildClick5={leaveGroup} action={5} str="Leave group" />}
      {isGroup && isAdmin && <MenuBtn onChildClick6={AddUser} action={6} str="Add User" />}
      {isGroup && isOwner && <MenuBtn onChildClick7={RemoveGroup} action={7} str="Remove Group" />}
      {isGroup && isOwner && isProtected && <MenuBtn onChildClick8={changePass} action={8} str="change password" />}
      {isGroup && isOwner && isProtected && <MenuBtn onChildClick9={removePass} action={9} str="remove password" />}
    </div>
    </>
  );
};

export default DropdownMenu;
