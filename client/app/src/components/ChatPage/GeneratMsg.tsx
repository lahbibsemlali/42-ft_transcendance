// import React from 'react'
import LeftMsg from './LeftMsg';
import RightMsg from './RightMsg';

type Props = {
    isAdmin: boolean;
    idClient: number;
    idChat: number;
    urlImg: string;
    msg: string;
    isMe: boolean;
    isGroup: boolean;
    isMuted: boolean;
};

const GeneratMsg = (props: Props) => {
    if (props.isMe) {
        return (
        <RightMsg isGroup={props.isGroup} isAdmin={props.isAdmin} idClient={props.idClient} idChat={props.idChat} urlImg={props.urlImg} msg={props.msg} />
        );
    }
  return (
    <>
        <LeftMsg isMuted={props.isMuted} isGroup={props.isGroup} isAdmin={props.isAdmin} idClient={props.idClient} idChat={props.idChat} urlImg={props.urlImg} msg={props.msg} />
    </>
  );
}

export default GeneratMsg
