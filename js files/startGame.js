import Game from "./game.js";

class StartGame {
  constructor() {
    this.nameStorage = [];
    this.playButton = document.getElementById("play");
    this.startButton = document.getElementById("start");
    this.queryString = window.location.search;
    this.level =
      this.queryString && Number(this.queryString.split("&")[1].split("=")[1]);
    this.userName = document.querySelector(".name");

    // check username is string
    this.userName &&
      this.userName.addEventListener("change", () => {
        if (!isNaN(+this.userName.value)) {
          this.userName.value = "";
          Swal.fire("Enter a valid Username");
        }
      });

    this.playButton &&
      this.playButton.addEventListener("click", (e) =>
        this.handlePlayButtonClick(e)
      );
    this.startButton &&
      this.startButton.addEventListener("click", () =>
        this.handleStartButtonClick()
      );
  }

  handlePlayButtonClick() {
    this.nameStorage = JSON.parse(localStorage.getItem("players")) || [];
    localStorage.setItem("currentPlayer", this.userName.value);
    // Check if the username already exists in the array
    const userNameExist = this.nameStorage.some(
      (element) => element.playerName === this.userName.value
    );

    if (userNameExist) {
      console.log("user exists");
      return;
    }

    this.nameStorage.push({ playerName: this.userName.value, score: 0 });
    localStorage.setItem("players", JSON.stringify(this.nameStorage));
    const newURL = `Game.html?level=${this.level}&user=${encodeURIComponent(
      this.userName.value
    )}`;
    window.location.href = newURL;
  }

  handleStartButtonClick() {
    if (this.level == 1) {
      const game = new Game(0.05, 5, 10, 30, 5);
    } else if (this.level == 2) {
      const game = new Game(0.12, 10, 10, 30, 5);
    }
    this.startButton.disabled = true;
  }
}

const gameApp = new StartGame();
