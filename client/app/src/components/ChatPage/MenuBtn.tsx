import React from 'react'

type MenuBtnProps = {
    str: string;
};

const MenuBtn: React.FC<MenuBtnProps> = ({
    str
}) => {
  return (
    <button className="btnMenu" style={{ border: "none" }}>
      {str}
    </button>
  );
}

export default MenuBtn
