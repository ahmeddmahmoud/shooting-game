export default class Bullet {
  constructor(canvas, x, y, velocity, bulletColor) {
    this.canvas = canvas;
    this.x = x; //X-coordinate of the bullet
    this.y = y; //Y-coordinate of the bullet
    this.velocity = velocity; 
    this.bulletColor = bulletColor; 
    this.width = 10; 
    this.height = 15; 
  }

  //Method to draw a single bullet
  draw(theContext) {
    this.y -= this.velocity;
    theContext.fillStyle = this.bulletColor;
    theContext.fillRect(this.x, this.y, this.width, this.height);
  }
}
