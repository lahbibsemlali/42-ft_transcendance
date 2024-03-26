import { P5CanvasInstance, ReactP5Wrapper } from "react-p5-wrapper";
import socketIOClient from "socket.io-client";
import Cookies from "js-cookie";
import axios from "axios";
import { Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from "react";


const ENDPOINT = `http://${import.meta.env.VITE_DOMAIN}:8000`;
let mytoken = Cookies.get("jwt") || "";
const socket = socketIOClient(ENDPOINT, {
  transports: ["websocket"],
  query: {
    token: mytoken,
  },
  transportOptions: {
    extraHeaders: {
      Authorization: `Bearer ${mytoken}`,
    },
  },
});
let isCustomRoom: string;
let customName: string;
let idUser2: string;
let witchplayer: string;
let setGameOverPointer: React.Dispatch<React.SetStateAction<boolean>>;
let RoomName: string;


function sketch(p5: P5CanvasInstance) {
  let canvaWidth: number;
  let canvaHeight: number;
  let button: any;
  let Play: boolean = false;
  let inRoom: boolean = false;
  let isPlaying: boolean = false;
  let toDisplayText = "WAIT";
  let player = false;
  let ifGuest: boolean;
  let myball: Ball;
  let upPaddle: Paddle;
  let downPaddle: Paddle;
  let scoreUP = 0;
  let scoreDOWN = 0;
  let textBtn = "START GAME";
  let ifWin = false;
  let isGameOver = false;
  let textfont: any;

  const CheckAuth = async () => {
    try {
      const res = await axios.get(
        `http://${import.meta.env.VITE_DOMAIN}:8000/api/auth/checkToken`,
        {
          headers: {
            Authorization: `bearer ${mytoken}`,
          },
        }
      );
      if (res.status === 200) return true;
    } catch (error) {
      return false;
    }
  };

  socket.on("Game Over", () => {
    isGameOver = true;
  });

  socket.on("room created", (nameRoom: string) => {
    RoomName = nameRoom;
    inRoom = true;

  });

  socket.on("start game", () => {
    Play = true;
  });

  socket.on("in game", () => {
    isPlaying = true;
  });

  socket.on("witchplayer", () => {
    player = true;
  });

  socket.on("done", () => {
    setGameOverPointer(true);
  });

  socket.on("winer", () => {
    socket.emit("updateResulte", {nameRoom: RoomName, bool: false});
    ifWin = true;
    toDisplayText = "WINNER";
  });

  socket.on('restPlay', () => {
    inRoom = false;
    if (isCustomRoom !== '1')
      createBtn();
  });

  p5.preload = () => {
    textfont = p5.loadFont("./test.ttf");
  };

  p5.setup = async () => {
    ifGuest = (await CheckAuth()) || false;
    if (!ifGuest) textBtn = "PLEASE LOGIN TO PLAY";
    p5.textFont(textfont);
    const canvasContainer = p5.select("#canvas-container")!;
    canvaWidth = p5.min(p5.windowWidth, p5.windowHeight) * 0.5;
    canvaHeight = p5.min(p5.windowWidth, p5.windowHeight) * 0.7;
    p5.createCanvas(canvaWidth, canvaHeight).parent(canvasContainer);
    myball = new Ball();
    upPaddle = new Paddle(true);
    downPaddle = new Paddle(false);
    if (isCustomRoom !== '1')
      createBtn();
    else if (witchplayer === '1') {
      socket.emit('runCustomRoom', customName, idUser2, witchplayer);
    }
    else
      socket.emit('joinMe', customName);
  };

  p5.draw = () => {
    p5.background(p5.color(34, 71, 113));
      if (Play && inRoom && !isPlaying && ifGuest && !ifWin && !isGameOver) {

      if (scoreUP != 5 && scoreDOWN != 5) {
        drawText();
        p5.stroke(33, 144, 226);
        p5.strokeWeight(3);
        p5.line(0, p5.height / 2, p5.width, p5.height / 2);

        myball.update();
        myball.display();

        upPaddle.update();
        upPaddle.display();

        downPaddle.update();
        downPaddle.display();
      } else {
        if (player) {
          // up p2
          if (scoreUP == 5) toDisplayText = "wikknner";
          else toDisplayText = "los";
          socket.emit("updateResulte", {nameRoom: RoomName, bool: true});
          socket.emit("updateBallPosition", {
            x: myball.x,
            y: myball.y,
            speedX: myball.xSpeed,
            speedY: myball.ySpeed,
            w: p5.width,
            h: p5.height,
            sp1: scoreDOWN,
            sp2: scoreUP,
            nameRoom: RoomName,
          });
        } else {
          // down p1
          if (scoreDOWN == 5) toDisplayText = "winner";
          else toDisplayText = "los";
          socket.emit("updateResulte", {nameRoom: RoomName, bool: true});
          socket.emit("updateBallPosition", {
            x: myball.x,
            y: myball.y,
            speedX: myball.xSpeed,
            speedY: myball.ySpeed,
            w: p5.width,
            h: p5.height,
            sp1: scoreDOWN,
            sp2: scoreUP,
            nameRoom: RoomName,
          });
        }
        setToDefault();
      }
    } else if (inRoom && !isPlaying && ifGuest && !ifWin && !isGameOver) {
      button.remove("playing");
      drawText2();
    } else if (isPlaying && ifGuest && !ifWin && !isGameOver) {
      toDisplayText = "in game";
      button.remove();
      drawText2();
    } else if (ifGuest && ifWin && !isGameOver) {
      toDisplayText = "win";
      setToDefault();
    } else if (ifGuest && isGameOver) {
      toDisplayText = "game over";
      setToDefault();
    }
  };

  function setToDefault() {
    player = false;
    isGameOver = false;
    Play = false;
    inRoom = true;
    isPlaying = false;
    ifWin = false;
    scoreUP = 0;
    scoreDOWN = 0;
    upPaddle.x = p5.width / 2;
    downPaddle.x = p5.width / 2;
  }

  function drawText2() {
    p5.textSize((p5.width * 50) / 466);
    p5.fill(p5.color(28, 108, 167));
    p5.textAlign(p5.CENTER);
    p5.text(toDisplayText, p5.width / 2, p5.height / 2);
  }


  p5.keyPressed = () => {
    if (p5.keyCode === p5.LEFT_ARROW) {
      if (player) downPaddle.move(0);
      else upPaddle.move(0);
    } else if (p5.keyCode === p5.RIGHT_ARROW) {
      if (player) downPaddle.move(1);
      else upPaddle.move(1);
    }
  };

  p5.keyReleased = () => {
    if (p5.keyCode === p5.LEFT_ARROW || p5.keyCode === p5.RIGHT_ARROW) {
      if (player) downPaddle.move(2);
      else upPaddle.move(2);
    }
  };

  function drawText() {
    p5.textSize((p5.width * 300) / 466);
    p5.fill(p5.color(28, 108, 167));
    p5.text(scoreDOWN, p5.width / 2 - (p5.width * 75) / 466, p5.height / 2);
    p5.text(
      scoreUP,
      p5.width / 2 - (p5.width * 75) / 466,
      p5.height / 2 + (p5.width * 190) / 466
    );
  }

  function createBtn() {
    button = p5.createButton(textBtn);
    button.style("font-size", (p5.width * 16) / 466 + "px");
    button.size((p5.width * 160) / 466, (p5.height * 50) / 652.4);
    button.position(p5.windowWidth / 2 - button.width / 2, p5.windowHeight / 2);
    button.mousePressed(() => {
      if (!ifGuest) {
        window.location.href = `http://${import.meta.env.VITE_DOMAIN}:8000/api/auth/42`;
      } else {
        button.remove();
        socket.emit("waiting");
      }
    });
  }

    p5.windowResized = () => {
    const canvasContainer = p5.select("#canvas-container");

    if (canvasContainer) {
      p5.canvasSize = p5.min(p5.windowWidth, p5.windowHeight) * 0.5;
      p5.canvasSize2 = p5.min(p5.windowWidth, p5.windowHeight) * 0.7;
      p5.resizeCanvas(p5.canvasSize, p5.canvasSize2);
      button.remove();
      if (!Play && isCustomRoom !== '1') createBtn();

      if (ifWin != true) drawText();

      p5.ball.update();
      p5.ball.display();

      upPaddle.update();
      upPaddle.display();

      downPaddle.update();
      downPaddle.display();
    }
  };

  document.addEventListener("visibilitychange", function () {
    if (!document.hidden && ifGuest) {
      socket.emit("back", Play);
    }
    if (document.hidden && ifGuest) socket.emit("exit", RoomName);
  });

  socket.on("updateBallPosition", (updatedBall) => {
    if (
      updatedBall &&
      updatedBall.x !== undefined &&
      updatedBall.y !== undefined &&
      updatedBall.w !== undefined &&
      updatedBall.h !== undefined
    ) {
      myball.x = (p5.width * updatedBall.x) / updatedBall.w;
      myball.y = (p5.height * updatedBall.y) / updatedBall.h;
      myball.xSpeed = updatedBall.speedX;
      myball.ySpeed = updatedBall.speedY;
      scoreDOWN = updatedBall.sp1;
      scoreUP = updatedBall.sp2;
    }
  });

  socket.on("updatePaddlePosition", (updatedPaddle) => {
    if (updatedPaddle && updatedPaddle.x !== undefined) {
      if (updatedPaddle.bool)
        upPaddle.x = (p5.width * updatedPaddle.x) / updatedPaddle.w;
      else downPaddle.x = (p5.width * updatedPaddle.x) / updatedPaddle.w;
    }
  });

  class Paddle {
    public ds: number;
    public isUp: boolean;
    public mywidth: number;
    public myheight: number;
    public x: number;
    public y: number;
    public oldX: number;
    public speed: number;
    constructor(itsUp: boolean) {
      this.ds = p5.width;
      this.isUp = itsUp;
      this.mywidth = (p5.width * 22) / 100;
      this.myheight = (p5.height * 3) / 100;
      this.x = p5.width / 2;
      if (this.isUp)
        //up
        this.y = this.myheight;
      // down
      else this.y = p5.height - (p5.height * 20) / 652.4;
      this.speed = 0;
      this.oldX = this.x;
    }

    update() {
      if (this.isUp) this.y = this.myheight;
      else this.y = p5.height - (p5.height * 20) / 652.4;
      this.x = (p5.width * this.x) / this.ds;
      this.mywidth = (p5.width * 22) / 100;
      this.myheight = (p5.height * 3) / 100;
      if (
        this.x - this.mywidth / 2 >= 0 &&
        this.x + this.mywidth / 2 <= p5.width + 0.1
      ) {
        this.x += this.speed;
        if (this.x - this.mywidth / 2 < 0) this.x = this.mywidth / 2;
        if (this.x + this.mywidth / 2 > p5.width)
          this.x = p5.width - this.mywidth / 2;
      }
      if (this.x != this.oldX) {
        this.oldX = this.x;
        if (ifGuest) {
          socket.emit("updatePaddlePosition", {
            x: this.x,
            bool: this.isUp,
            w: p5.width,
            nameRoom: RoomName,
          });
        }
      }
      this.ds = p5.width;
    }

    display() {
      p5.fill(p5.color(7, 38, 79));
      p5.rectMode(p5.CENTER);
      p5.noStroke();
      p5.rect(this.x, this.y, this.mywidth, this.myheight);
    }

    move(itsRight: number) {
      if (itsRight === 1) this.speed = (p5.width * 10) / 466;
      else if (itsRight === 0) this.speed = -((p5.width * 10) / 466);
      else this.speed = 0;
    }
  }

  class Ball {
    private oldHeight: number;
    private oldWidth: number;
    public x: number;
    public y: number;
    public mywidth: number;
    public xSpeed: number;
    public ySpeed: number;

    constructor() {
      this.oldHeight = p5.height;
      this.oldWidth = p5.width;
      this.x = p5.width / 2;
      this.y = p5.height / 2;
      this.mywidth = (p5.width * 20) / 466;
      this.xSpeed = 5;
      this.ySpeed = 3;
    }

    update() {
      if (this.xSpeed > 0) this.xSpeed = (p5.width * 5) / 466;
      else this.xSpeed = ((p5.width * 5) / 466) * -1;
      if (this.ySpeed > 0) this.ySpeed = (p5.height * 3) / 652.4;
      else this.ySpeed = ((p5.height * 3) / 652.4) * -1;
      this.mywidth = (p5.width * 20) / 466;
      this.x = (p5.width * this.x) / this.oldWidth;
      this.y = (p5.height * this.y) / this.oldHeight;
      this.x += this.xSpeed;
      this.y += this.ySpeed;

      if (this.x - this.mywidth / 2 < 0 || this.x + this.mywidth / 2 > p5.width)
        this.xSpeed *= -1;

      if (this.y - this.mywidth / 2 < upPaddle.y) {
        if (player) {
          scoreUP++;
          if (ifGuest) socket.emit("updateScoor", RoomName);
          this.x = p5.width / 2;
          this.y = p5.height / 2;
        }
      }
      if (this.y + this.mywidth / 2 > downPaddle.y + 3) {
        if (!player) {
          scoreDOWN++;
          if (ifGuest) socket.emit("updateScoor", RoomName);
          this.x = p5.width / 2;
          this.y = p5.height / 2;
        }
      }

      if (
        (this.y + this.mywidth / 2 > downPaddle.y - downPaddle.myheight / 2 &&
          this.x > downPaddle.x - downPaddle.mywidth / 2 &&
          this.x < downPaddle.x + downPaddle.mywidth / 2) ||
        (this.y - this.mywidth / 2 < upPaddle.y + upPaddle.myheight / 2 &&
          this.x > upPaddle.x - upPaddle.mywidth / 2 &&
          this.x < upPaddle.x + upPaddle.mywidth / 2)
      ) {
        this.ySpeed *= -1;
      }

      if (!player && this.y > p5.height / 2 && ifGuest) {
        socket.emit("updateBallPosition", {
          x: myball.x,
          y: myball.y,
          speedX: myball.xSpeed,
          speedY: myball.ySpeed,
          w: p5.width,
          h: p5.height,
          sp1: scoreDOWN,
          sp2: scoreUP,
          nameRoom: RoomName,
        });
      } else if (player && this.y < p5.height / 2 && ifGuest) {
        socket.emit("updateBallPosition", {
          x: myball.x,
          y: myball.y,
          speedX: myball.xSpeed,
          speedY: myball.ySpeed,
          w: p5.width,
          h: p5.height,
          sp1: scoreDOWN,
          sp2: scoreUP,
          nameRoom: RoomName,
        });
      }

      this.oldHeight = p5.height;
      this.oldWidth = p5.width;
    }

    display() {
      p5.noStroke();
      p5.fill(p5.color(7, 38, 79));
      p5.ellipse(this.x, this.y, this.mywidth);
    }
  }
}

const GamePage = () => {
  // const location = useLocation();

  // useEffect(() => {
  //   console.log('location changed', location.pathname)
  // }, [location]);


  const handleRouteChange = () => {
    socket.emit("exit", RoomName);
    // console.log('route changed', window.location.pathname)
  };

  window.addEventListener('popstate', handleRouteChange);
  //   window.addEventListener('hashchange', handleRouteChange);
  
const [gameOver, setGameOver] = useState(false);
setGameOverPointer = setGameOver;

  const queryParams = new URLSearchParams(location.search);
  isCustomRoom = queryParams.get('CustomRoom') || '0';
  customName = queryParams.get('roomName') || '';
  idUser2 = queryParams.get('idUser2') || '';
  witchplayer = queryParams.get('witchplayer') || '';
  return (
    <div>
      {gameOver && <Navigate to="/"/>}
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
