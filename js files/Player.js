export default class Player {
  rightPressed = false;
  leftPressed = false;
  shootPressed = false;

  constructor(canvas, velocity, bulletController) {
    this.canvas = canvas;
    this.velocity = velocity;
    this.bulletController = bulletController;
    this.x = this.canvas.width / 2;
    this.y = this.canvas.height - 50;
    this.width = 50;
    this.height = 50;
    this.image = new Image();
    this.image.src = "img/spaceship.png";
    document.addEventListener("keydown", this.handleKeyDown);
    document.addEventListener("keyup", this.handleKeyUp);
  }

  draw(theContext) {
    if (this.shootPressed) {
      this.bulletController.shoot(this.x + this.width / 2, this.y, 10, 10);
    }
    this.update();
    theContext.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

  //Method to update the state of the player
  update() {
    //Check left boundary
    if (this.x < 0) {
      this.x = 0;
    }
    //Check Right
    if (this.x > this.canvas.width - this.width) {
      this.x = this.canvas.width - this.width;
    }
    //Move the player
    if (this.rightPressed) {
      this.x += this.velocity;
    } else if (this.leftPressed) {
      this.x -= this.velocity;
    }
  }

  //Method to handle the buttons pressing
  handleKeyDown = (event) => {
    if (event.code == "ArrowRight") {
      this.rightPressed = true;
    }
    if (event.code == "ArrowLeft") {
      this.leftPressed = true;
    }
    if (event.code == "Space") {
      this.shootPressed = true;
    }
  };

  handleKeyUp = (event) => {
    if (event.code === "ArrowRight") {
      this.rightPressed = false;
    }
    if (event.code === "ArrowLeft") {
      this.leftPressed = false;
    }
    if (event.code == "Space") {
      this.shootPressed = false;
    }
  };
}
