import React from 'react'
import { useState } from 'react';

type Props = {}

const Listchat = (props: Props) => {
  const [selectchat, setSelectChat] = useState(false);

  return (
    <div className='listchat'>
        <div className='imgchat'>
          <img src={props.url} style={{maxWidth: "100%", maxHeight: "100%", display: "block", height: "auto"}} />
        </div>
        <div className='text-container'>
            <div className='chat-name'>{props.name}</div>
            <div className='last-msg'>{props.last}</div>
        </div>
    </div>
  )
}

export default Listchat
