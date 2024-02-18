import React from "react";
import MenuBtn from "./MenuBtn";

type DropWownProps = {
  wichMenu: number;
  ifAdmin: boolean;
};

const DropdownMenu: React.FC<DropWownProps> = ({
  wichMenu,
  ifAdmin,
}) => {
  return (
    <div className="dropdown-content">
      {wichMenu == 1 && <MenuBtn str="Mute" />}
      {wichMenu == 2 || wichMenu == 3 && <MenuBtn str="Leave group" />}
      {wichMenu == 2 || wichMenu == 3 && <MenuBtn str="Add friend" />}
      {wichMenu == 3 && ifAdmin && <MenuBtn str="change password" />}
      {wichMenu == 3 && ifAdmin && <MenuBtn str="remove password" />}
    </div>
  );
};

export default DropdownMenu;
