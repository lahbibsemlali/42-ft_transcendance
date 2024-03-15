import { useState } from "react";
import MenuImg from "./MenuImg";

type Props = {
  sendToPlay: () => void;
};

const SendToPlay = (props: Props) => {
  return (
    <div className="btnsend">
    <button onClick={props.sendToPlay} className="btnsend2">
      <i className="fa-solid fa-play sendicon"></i>
    </button>
  </div>
  );
};

export default SendToPlay;
