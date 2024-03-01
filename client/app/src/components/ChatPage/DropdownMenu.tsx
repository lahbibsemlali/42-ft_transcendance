import React from "react";
import MenuBtn from "./MenuBtn";

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
  return (
    <div className="dropdown-content">
      {/* {!isGroup && !isMuted && <MenuBtn str="Block" />}
      {!isGroup && isMuted && <MenuBtn str="Unblock" />} */}
      {isGroup && <MenuBtn str="Leave group" />}
      {isGroup && isAdmin && <MenuBtn str="Add friend" />}
      {isGroup && isAdmin && isProtected && <MenuBtn str="change password" />}
      {isGroup && isAdmin && isProtected && <MenuBtn str="remove password" />}
    </div>
  );
};

export default DropdownMenu;
