import React from 'react'
import DropdownMenu from './DropdownMenu'
import { useState } from 'react'
import LeftMsg from './LeftMsg'
import RightMsg from './RightMsg'

type Props = {}

const ChatMsg = (props: Props) => {
    const [openmenu, setOpenMenu] = useState(false);

    function openMenu() {
        if (openmenu) setOpenMenu(false);
        else setOpenMenu(true);
      }
    
    //   function handleClick() {
    //     if (openmenu) setOpenMenu(false);
    //   }

  return (
    <div className="chat-window">
        <div className="chat-msg">
            <div>
                <button className="option-btn" onClick={openMenu}>
                    {!openmenu && <i className="fa-solid fa-square-caret-down threedot"></i>}
                    {openmenu && <i className="fa-solid fa-rectangle-xmark threedot"></i>}
                </button>
                {openmenu && <DropdownMenu />}
            </div>
            <div className="scrollmsg">
                <LeftMsg />
                <RightMsg />
                <LeftMsg />
                <LeftMsg />
                <RightMsg />
                <LeftMsg />
                <LeftMsg />
                <RightMsg />
                <LeftMsg />
                <LeftMsg />
                <RightMsg />
                <LeftMsg />
                <LeftMsg />
                <RightMsg />
                <LeftMsg />
                <LeftMsg />
                <RightMsg />
                <LeftMsg />
            </div>
        </div>
        <div className="chat-send">
            <div className="inputmsg"></div>
            <div className="btnsend">
                <button className="btnsend2">
                    <i className="fa-solid fa-paper-plane sendicon"></i>
                </button>
            </div>
        </div>
    </div>
  )
}

export default ChatMsg