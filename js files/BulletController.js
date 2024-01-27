import Bullet from "./Bullet.js";

export default class BulletController {
  bullets = []; 
  timeTillNextBulletAllowed = 0; 
  constructor(canvas, maxBulletsAtTime, bulletColor, score) {
    this.canvas = canvas;
    this.maxBulletsAtTime = maxBulletsAtTime;
    this.bulletColor = bulletColor;
    this.score = score;
  }

  //Method to loop over the array and draw the bullets
  draw(theContext) {
    this.bullets.forEach((bullet) => {
      bullet.draw(theContext);
    });
    if (this.timeTillNextBulletAllowed > 0) {
      this.timeTillNextBulletAllowed--;
    }
  }

  //Method to control the movement of the bullet
  shoot(x, y, velocity, timeTillNextBulletAllowed = 0) {
    if (
      this.timeTillNextBulletAllowed <= 0 && // time = 10 , max = 1000
      this.bullets.length < this.maxBulletsAtTime
    ) {
      const bullet = new Bullet(this.canvas, x, y, velocity, this.bulletColor);
      this.bullets.push(bullet);
      this.timeTillNextBulletAllowed = timeTillNextBulletAllowed;
    }
  }

  //Method to check the collisions between boxes and bullets
  checkBulletCollisions(boxes, cols, rows, leftEdge, rightEdge) {
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const bullet = this.bullets[i];

      for (let j = 0; j < boxes.length; j++) {
        const box = boxes[j];

        if (
          !box.isDestroyed && // Check if the box is not already destroyed
          bullet.x < box.x + box.width &&
          bullet.x + bullet.width > box.x &&
          bullet.y < box.y + box.height &&
          bullet.y + bullet.height > box.y
        ) {
          // Bullet has hit the box
          box.isDestroyed = true;
          this.bullets.splice(i, 1); // Remove the bullet from the array
          if (box.type == "green") {
            this.score += 2;
          } else if (box.type == "red") {
            this.score += 15;
            this.destroySurroundingBoxes(
              boxes,
              j,
              cols,
              rows,
              leftEdge,
              rightEdge
            );
          }
          return true;
        }
      }
    }
    return false;
  }

  //Method to destroy the surroundings boxes of the red boxes
  destroySurroundingBoxes(boxes, index, cols, leftEdge, rightEdge) {
    let surroundingIndices;
    if (leftEdge.includes(index)) {
      surroundingIndices = [
        index + 1,
        index - cols,
        index - cols + 1,
        index + cols,
        index + cols + 1,
      ];
    } else if (rightEdge.includes(index)) {
      surroundingIndices = [
        index - 1,
        index - cols,
        index - cols - 1,
        index + cols,
        index + cols - 1,
      ];
    } else {
      surroundingIndices = [
        index - 1,
        index + 1,
        index - cols,
        index - cols - 1,
        index - cols + 1,
        index + cols,
        index + cols + 1,
        index + cols - 1,
      ];
    }

    for (let i = 0; i < surroundingIndices.length; i++) {
      if (surroundingIndices[i] >= 0 && surroundingIndices[i] < boxes.length) {
        const surroundingBox = boxes[surroundingIndices[i]];
        if (!surroundingBox.isDestroyed) {
          surroundingBox.isDestroyed = true;
        }
      }
    }
  }
}
