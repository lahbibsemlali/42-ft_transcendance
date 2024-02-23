// import React from 'react'
import LeftMsg from './LeftMsg';
import RightMsg from './RightMsg';

type Props = {
    isAdmin: boolean;
    idClient: number;
    idChat: number;
    urlImg: string;
    msg: string;
};

const GeneratMsg = (props: Props) => {
    if (props.idClient == 888888) {
        return (
        <RightMsg isAdmin={props.isAdmin} idClient={props.idClient} idChat={props.idChat} urlImg={props.urlImg} msg={props.msg} />
        );
    }
  return (
    <>
        <LeftMsg isAdmin={props.isAdmin} idClient={props.idClient} idChat={props.idChat} urlImg={props.urlImg} msg={props.msg} />
        <RightMsg isAdmin={props.isAdmin} idClient={props.idClient} idChat={props.idChat} urlImg={props.urlImg} msg={props.msg} />
    </>
  );
}

export default GeneratMsg
