import { P5CanvasInstance, ReactP5Wrapper } from "react-p5-wrapper";
import socketIOClient from "socket.io-client";
import Cookies from "js-cookie";

const ENDPOINT = `http://${import.meta.env.VITE_DOMAIN}:8000`;
let mytoken = Cookies.get("jwt") || "";
const socket = socketIOClient(ENDPOINT, {
  transports: ["websocket"],
  query: {
    token: mytoken,
  },
  transportOptions: {
      extraHeaders: {
        Authorization: `Bearer ${mytoken}`
      },
  }
});

function sketch(p5: P5CanvasInstance) {
  let canvaWidth: number;
  let canvaHeight: number;
  let button: any;
  let Play: boolean = false;
  let inRoom: boolean = false;

  p5.preload = () => {
    
  };

  p5.setup = () => {
    const canvasContainer = p5.select("#canvas-container")!;
    canvaWidth = p5.min(p5.windowWidth, p5.windowHeight) * 0.5;
    canvaHeight = p5.min(p5.windowWidth, p5.windowHeight) * 0.7;
    p5.createCanvas(canvaWidth, canvaHeight).parent(canvasContainer);
    createBtn();
  };

  p5.draw = () => {
    p5.background(p5.color(34, 71, 113));
    if (Play && inRoom) {
      // start game
    } else if (Play) {
      drawText();
      button.remove();
    }
  };

  function drawText() {
    p5.textSize((p5.width * 50) / 466);
    p5.fill(p5.color(28, 108, 167));
    p5.textAlign(p5.CENTER);
    p5.text("WAIT", p5.width / 2, p5.height / 2);
  }

  function createBtn() {
    button = p5.createButton("PLAY");
    button.style("font-size", (p5.width * 16) / 466 + "px");
    button.size((p5.width * 160) / 466, (p5.height * 50) / 652.4);
    button.position(p5.windowWidth / 2 - button.width / 2, p5.windowHeight / 2);
    button.mousePressed(() => {
      Play = true;
      button.remove();
      socket.emit("waiting");
    });
  }

  socket.on('room created', () => {
    inRoom = true;
  });
}

const GamePage = () => {
  return (
    <div>
      <div
        style={{
          display: "flex",
          marginTop: "100px",
        }}
        id="canvas-container"
      ></div>
      <ReactP5Wrapper sketch={sketch} />
    </div>
  );
};

export default GamePage;
