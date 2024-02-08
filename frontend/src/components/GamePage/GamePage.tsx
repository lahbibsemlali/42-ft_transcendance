import React, { useEffect } from "react";
import { P5CanvasInstance, ReactP5Wrapper } from "react-p5-wrapper";
import io from "socket.io-client";
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://localhost:3000";

let canvaWidth: number;
let canvaHeight: number;
let startGmae = false;
let waiting = false;
let ifWin = false;
let player = false; // down paddle
let scoreP1 = 0;
let scoreP2 = 0;
const socket = socketIOClient(ENDPOINT, { transports: ["websocket"] });

function sketch(p5: P5CanvasInstance) {
  socket.on("startgame", () => {
    waiting = true;
  });

  socket.on("winer", () => {
    ifWin = true;
    toDisplayText = "WINNER";
    console.log("winner");
  });

  socket.on("witchplayer", () => {
    player = true;
  });

  document.addEventListener("visibilitychange", function () {
    if (!document.hidden && startGmae) {
      socket.emit("please change my ball position", player);
    }
  });

  socket.on("please give me your ball position", (bool) => {
    if (bool != player) {
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
    }
  });

  let toDisplayText = "PLEASE WAIT";
  let button: any;
  let myball: Ball;
  let upPaddle: Paddle;
  let downPaddle: Paddle;

  let textfont: any;

  p5.preload = () => {
    textfont = p5.loadFont("./test.ttf");
  };

  p5.setup = () => {
    p5.textFont(textfont);
    const canvasContainer = p5.select("#canvas-container")!;
    canvaWidth = p5.min(p5.windowWidth, p5.windowHeight) * 0.5;
    canvaHeight = p5.min(p5.windowWidth, p5.windowHeight) * 0.7;
    p5.createCanvas(canvaWidth, canvaHeight).parent(canvasContainer);
    myball = new Ball();
    upPaddle = new Paddle(true); //P1
    downPaddle = new Paddle(false); //P2
    // BUTTON
    button = p5.createButton("START GAME");
    const centerX = p5.windowWidth / 2 - button.width / 2;
    const centerY = p5.windowHeight / 2;
    button.position(centerX, centerY);
    button.mousePressed(() => {
      startGmae = true;
      button.remove();
      socket.emit("waiting");
    });
  };

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
      if (updatedPaddle.bool) {
        // change up
        upPaddle.x = (p5.width * updatedPaddle.x) / updatedPaddle.w;
      } else {
        // change down
        downPaddle.x = (p5.width * updatedPaddle.x) / updatedPaddle.w;
      }
    }
  });

  p5.draw = () => {
    p5.background(p5.color(34, 71, 113));
    if (startGmae) {
      if (waiting && ifWin != true) {
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
      } else if (ifWin != true) {
        // PLEASE WAIT
        p5.textSize(50);
        p5.fill(p5.color(28, 108, 167));
        p5.textAlign(p5.CENTER);
        p5.text(toDisplayText, p5.width / 2, p5.height / 2);
      } else {
        // WINNER
        p5.textSize(50);
        p5.fill(p5.color(28, 108, 167));
        p5.textAlign(p5.CENTER);
        p5.text(toDisplayText, p5.width / 2, p5.height / 2);
      }
    }
  };

  function drawText() {
    p5.textSize(300);
    p5.fill(p5.color(28, 108, 167));
    p5.text(scoreP1, p5.width / 2 - 75, p5.height / 2);
    p5.text(scoreP2, p5.width / 2 - 75, p5.height / 2 + 190);
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
        this.x = p5.width / 2;
        this.y = p5.height / 2;
        if (!player) socket.emit("please change my ball position", player);
        if (player)
          scoreP2++;
      }
      if (this.y + this.mywidth / 2 > downPaddle.y + 3) {
        this.x = p5.width / 2;
        this.y = p5.height / 2;
        if (player) socket.emit("please change my ball position", player);
        if (!player)
          scoreP1++;
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

type Props = {};

const GamePage = (props: Props) => {
  return (
    <div>
      <div
        style={{
          position: "relative",
          border: "4px solid rgb(33, 144, 226)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "100px",
        }}
        id="canvas-container"
      ></div>
      <ReactP5Wrapper sketch={sketch} />
    </div>
  );
};

export default GamePage;
