import { P5CanvasInstance, ReactP5Wrapper } from "react-p5-wrapper";
import socketIOClient from "socket.io-client";
const ENDPOINT = `http://${import.meta.env.VITE_DOMAIN}:8000`;
import Cookies from "js-cookie";
import axios from "axios";

let canvaWidth: number;
let canvaHeight: number;
let startGmae = false;
let waiting = false;
let ifWin = false;
let player = false; // down paddle
let scoreP1 = 0;
let scoreP2 = 0;
// let ifHidden = false;
let ifHidden2 = false;
let inGame = false;
let isGameOver = false;
const socket = socketIOClient(ENDPOINT, { transports: ["websocket"] });
const mytoken = Cookies.get("jwt") || "";

const CheckAuth = async () => {
  try {
    const res = await axios.get(`http://${import.meta.env.VITE_DOMAIN}:8000/api/auth/checkToken`, {
      headers: {
        Authorization: `bearer ${mytoken}`,
      },
    });
    if (res.status === 200) return true;
  } catch (error) {
    return false;
  }
};
// false
const GetUSerId = async () => {
  try {
    const res = await axios.get(`http://${import.meta.env.VITE_DOMAIN}:8000/api/user/getUserId`, {
      headers: {
        Authorization: `bearer ${mytoken}`,
      },
    });
    return res.data;
  } catch (error) {}
};

function sketch(p5: P5CanvasInstance) {
  socket.on("startgame", () => {
    waiting = true;
  });

  socket.on("winer", () => {
    ifWin = true;
    toDisplayText = "WINNER";
    console.log("winner");
  });

  socket.on("in game", () => {
    // console.log("in gameeeeeeeeeee");
    inGame = true;
  });

  socket.on("witchplayer", () => {
    player = true;
  });

  socket.on("Game Over", () => {
    isGameOver = true;
  });

  document.addEventListener("visibilitychange", function () {
    if (!document.hidden && startGmae && ifGuest) {
      // is game over
      socket.emit("is Game Over");
      socket.emit("please change my ball position");
    }
    socket.emit("this is my visibility", document.hidden);
    // ifHidden = document.hidden;
  });

  socket.on("please give me your ball position", () => {
    // if (bool != player && ifGuest) {
      socket.emit("updateBallPosition", {
        x: myball.x,
        y: myball.y,
        speedX: myball.xSpeed,
        speedY: myball.ySpeed,
        w: p5.width,
        h: p5.height,
        sp1: scoreP1,
        sp2: scoreP2,
      });
    // }
  });

  // socket.on("give Me your Visibility", () => {
  //   // if (bool != player)
  //   socket.emit("this is my visibility", ifHidden);
  // });

  socket.on("this is the visibility", (visibState) => {
    ifHidden2 = visibState;
  });

  let toDisplayText = "PLEASE WAIT";
  let button: any;
  let myball: Ball;
  let upPaddle: Paddle;
  let downPaddle: Paddle;
  let textBtn = "START GAME";
  let ifGuest: boolean;
  let userId: number;

  let textfont: any;

  p5.preload = () => {
    textfont = p5.loadFont("./test.ttf");
  };

  p5.setup = async () => {
    userId = await GetUSerId();
    ifGuest = (await CheckAuth()) || false;
    if (!ifGuest) textBtn = "PLAY WITH BOT";
    p5.textFont(textfont);
    const canvasContainer = p5.select("#canvas-container")!;
    canvaWidth = p5.min(p5.windowWidth, p5.windowHeight) * 0.5;
    canvaHeight = p5.min(p5.windowWidth, p5.windowHeight) * 0.7;
    p5.createCanvas(canvaWidth, canvaHeight).parent(canvasContainer);
    myball = new Ball();
    upPaddle = new Paddle(true);
    downPaddle = new Paddle(false);
    createBtn();
  };

  function createBtn() {
    button = p5.createButton(textBtn);
    button.style("font-size", (p5.width * 16) / 466 + "px");
    button.size((p5.width * 160) / 466, (p5.height * 50) / 652.4);
    button.position(p5.windowWidth / 2 - button.width / 2, p5.windowHeight / 2);
    button.mousePressed(() => {
      startGmae = true;
      button.remove();
      if (ifGuest) socket.emit("waiting", userId);
    });
  }

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
      scoreP1 = updatedBall.sp1;
      scoreP2 = updatedBall.sp2;
    }
  });

  socket.on("updatePaddlePosition", (updatedPaddle) => {
    if (updatedPaddle && updatedPaddle.x !== undefined) {
      if (updatedPaddle.bool)
        upPaddle.x = (p5.width * updatedPaddle.x) / updatedPaddle.w;
      else downPaddle.x = (p5.width * updatedPaddle.x) / updatedPaddle.w;
    }
  });

  p5.draw = () => {
    p5.background(p5.color(34, 71, 113));
    if (inGame) {
      toDisplayText = "IN GAME";
      drawText2();
      return;
    }

    if (isGameOver) {
      toDisplayText = "Game oveeer";
      drawText2();
      return;
    }
    if (startGmae && ifGuest) {
      if (waiting && ifWin != true) {
        if (scoreP1 != 5 && scoreP2 != 5) {
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
            if (scoreP2 == 5) toDisplayText = "winner";
            else toDisplayText = "los";
            socket.emit("updateResulte", userId);
          } else {
            // down p1
            if (scoreP1 == 5) toDisplayText = "winner";
            else toDisplayText = "los";
            socket.emit("updateResulte", userId);
          }
          drawText2();
          setToDefault();
        }
      } else if (ifWin != true) drawText2(); // PLEASE WAIT
      else drawText2(); // WINNER // check this
    } else runBot();
  };

  function setToDefault() {
    startGmae = false;
    waiting = false;
    toDisplayText = "PLEASE WAIT";
    ifWin = false;
    player = false;
    scoreP1 = 0;
    scoreP2 = 0;
    inGame = false;
    upPaddle.x = p5.width / 2;
    downPaddle.x = p5.width / 2;
    createBtn();
  }

  function runBot() {
    if (startGmae) {
      myball.update();
      myball.display();

      upPaddle.update();
      upPaddle.display();

      downPaddle.x = myball.x;
      downPaddle.display();
    }
  }

  function drawText2() {
    p5.textSize((p5.width * 50) / 466);
    p5.fill(p5.color(28, 108, 167));
    p5.textAlign(p5.CENTER);
    p5.text(toDisplayText, p5.width / 2, p5.height / 2);
  }

  function drawText() {
    p5.textSize((p5.width * 300) / 466);
    p5.fill(p5.color(28, 108, 167));
    p5.text(scoreP1, p5.width / 2 - (p5.width * 75) / 466, p5.height / 2);
    p5.text(
      scoreP2,
      p5.width / 2 - (p5.width * 75) / 466,
      p5.height / 2 + (p5.width * 190) / 466
    );
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

  p5.windowResized = () => {
    const canvasContainer = p5.select("#canvas-container");

    if (canvasContainer) {
      p5.canvasSize = p5.min(p5.windowWidth, p5.windowHeight) * 0.5;
      p5.canvasSize2 = p5.min(p5.windowWidth, p5.windowHeight) * 0.7;
      p5.resizeCanvas(p5.canvasSize, p5.canvasSize2);
      button.remove();
      if (!startGmae) createBtn();

      if (waiting && ifWin != true) drawText();

      p5.ball.update();
      p5.ball.display();

      upPaddle.update();
      upPaddle.display();

      downPaddle.update();
      downPaddle.display();
    }
  };

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

    printTest() {
      console.log("done", this.isUp);
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
        if (ifGuest)
          socket.emit("updatePaddlePosition", {
            x: this.x,
            bool: this.isUp,
            w: p5.width,
          });
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
        const tmpScore = scoreP2;
        this.x = p5.width / 2;
        this.y = p5.height / 2;
        if (!player && ifGuest) {
          // socket.emit("isVisible");
          if (!ifHidden2) socket.emit("please change my ball position");
          else scoreP2++;
        }
        if (player) scoreP2++;
        if (tmpScore != scoreP2) socket.emit("updateScoor", userId, scoreP2);

        // socket.emit("updateResulte", userId);
      }
      if (this.y + this.mywidth / 2 > downPaddle.y + 3) {
        const tmpScore = scoreP1;
        this.x = p5.width / 2;
        this.y = p5.height / 2;
        if (player && ifGuest) {
          // socket.emit("isVisible");
          if (!ifHidden2) socket.emit("please change my ball position");
          else scoreP1++;
        }
        if (!player) scoreP1++;
        if (tmpScore != scoreP1) socket.emit("updateScoor", userId, scoreP1);
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
  return (
    <div>
      {/* <Header /> */}
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
