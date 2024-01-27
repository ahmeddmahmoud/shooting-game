import Box from "./Box.js";
import BulletController from "./BulletController.js";
import Player from "./Player.js";

export default class Game {
  constructor(fallingSpeed, velocity, rows, cols, gap, notStart = false) {
    this.notStart = notStart;
    const params = new URLSearchParams(window.location.search);
    const username = params.get("user");
    this.leftEdge = [0];
    this.rightEdge = [cols - 1];
    if (username && this.notStart) {
      this.popUpMessage();
      return;
    }
    if (!username) {
      return;
    }

    this.rows = rows;
    this.cols = cols;
    this.gap = gap;
    this.canvas = document.getElementById("game");
    this.theContext = this.canvas.getContext("2d");
    this.canvas.width = 1200;
    this.canvas.height = 550;
    this.backGround = new Image();
    this.backGround.src = "img/ground.png";
    this.remainingTime = 120;
    this.fallingSpeed = fallingSpeed;
    this.velocity = velocity;

    this.timerInterval = setInterval(() => {
      this.remainingTime--;
      if (this.remainingTime < 0) {
        this.loseGame();
      }
    }, 1000);

    this.playerBulletController = new BulletController(
      this.canvas,
      5000,
      "white",
      0
    );

    this.player = new Player(
      this.canvas,
      velocity,
      this.playerBulletController
    );

    this.boxes = Box.createBoxes(this.canvas, this.rows, this.cols, this.gap);

    this.setupEventListeners();
    this.startGame();
  }

  setupEventListeners() {
    document.addEventListener("keydown", this.handleKeyDown.bind(this));
    document.addEventListener("keyup", this.handleKeyUp.bind(this));
  }

  handleKeyDown(event) {
    this.player.handleKeyDown(event);
  }

  handleKeyUp(event) {
    this.player.handleKeyUp(event);
  }

  startGame() {
    let colsLeftEdge = 0;
    let colsRightEdge = this.cols - 1;
    for (let i = 1; i < this.rows; i++) {
      colsLeftEdge += this.cols;
      colsRightEdge += this.cols;
      this.leftEdge.push(colsLeftEdge);
      this.rightEdge.push(colsRightEdge);
    }
    this.gameLoop = setInterval(() => {
      this.update();
      this.draw();
    }, 1000 / 60);
  }

  update() {
    this.player.update();
    this.playerBulletController.shoot();
    Box.moveDown(this.boxes, this.theContext, this.fallingSpeed);
    this.playerBulletController.checkBulletCollisions(
      this.boxes,
      this.cols,
      this.leftEdge,
      this.rightEdge
    );
    this.checkFallingBoxes();
    this.checkHittingAllBoxes();
  }

  draw() {
    this.theContext.drawImage(
      this.backGround,
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );
    this.player.draw(this.theContext);
    this.playerBulletController.draw(this.theContext);
    Box.drawBoxes(this.boxes, this.theContext);
    this.theContext.font = "20px Arial";
    this.theContext.fillStyle = "white";
    this.theContext.fillText(
      "Score: " + this.playerBulletController.score,
      10,
      30
    );
    this.theContext.fillText("Timer: " + this.remainingTime, 10, 50);
  }

  checkFallingBoxes() {
    for (let i = 0; i < this.boxes.length; i++) {
      if (
        this.boxes[i].isDestroyed == false &&
        this.boxes[i].y >= this.canvas.height - 75
      ) {
        this.loseGame();
        return;
      }
    }
  }

  checkHittingAllBoxes() {
    for (let i = 0; i < this.boxes.length; i++) {
      if (this.boxes[i].isDestroyed == false) {
        return;
      }
    }
    this.winGame();
  }

  winGame() {
    this.updateLocalStorage();
    clearInterval(this.gameLoop);
    clearInterval(this.timerInterval);
    //alert("you win");
    Swal.fire({
      title: `Congratulation ${localStorage.getItem(
        "currentPlayer"
      )}\n Your score is ${this.playerBulletController.score}`,
      text: "You Want To Play Again",
      icon: "success",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        location.href = "";
      } else {
        location.href = "Home.html";
      }
    });
  }

  loseGame() {
    this.updateLocalStorage();
    clearInterval(this.gameLoop);
    clearInterval(this.timerInterval);
    // alert("you loose");
    Swal.fire({
      title: "Game Over",
      text: "You Want To Play Again",
      icon: "error",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        location.href = "";
      } else {
        location.href = "Home.html";
      }
    });
  }
  updateLocalStorage() {
    let players = JSON.parse(localStorage.getItem("players"));
    // Find the player with the matching name and update the score
    let currentPlayerName = localStorage.getItem("currentPlayer");
    let currentPlayer = players.find(
      (element) => element.playerName === currentPlayerName
    );

    if (currentPlayer) {
      currentPlayer.score = +this.playerBulletController.score;
    }
    localStorage.setItem("players", JSON.stringify(players));
  }

  popUpMessage() {
    let players = JSON.parse(localStorage.getItem("players"));
    let currentPlayer = {};
    players.map((element) => {
      if (element.playerName == localStorage.getItem("currentPlayer")) {
        currentPlayer = element;
      }
    });
    Swal.fire({
      title: `Welocome ${currentPlayer.playerName}`,
      text: `Score : ${currentPlayer.score}`,
    });
  }
}
const game = new Game(0.1, 5, 5, 10, 30, true);
