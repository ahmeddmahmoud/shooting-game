export default class Box {
  constructor(canvas, x, y, width, height, src, type) {
    this.canvas = canvas;
    this.x = x; //X-coordinate of the box
    this.y = y; //Y-coordinate of the box
    this.type = type; //Type  of box (green/red)
    this.width = width; 
    this.height = height; 
    this.image = new Image();
    this.image.src = src;
    this.isDestroyed = false; // Flag to track whether the box is destroyed
  }

  //Method to create the boxes of the game
  static createBoxes(canvas, numRows, numCols, gap) {
    const boxes = [];
    let type;
    let src;
    const boxWidth = (canvas.width - (numCols - 1) * gap) / numCols;
    const boxHeight = (0.5 * canvas.height - (numRows - 1) * gap) / numRows;

    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        // Calculate position with gap based on row and column
        const x = col * (boxWidth + gap);
        const y = row * (boxHeight + gap);
        const isRed = Math.random().toFixed(2);
        if (isRed > 0.95) {
          src = "./img/redBox.png";
          type = "red";
        } else {
          src = "./img/greenBox.png";
          type = "green";
        }

        // Create a new Box object and add it to the array
        const box = new Box(canvas, x, y, boxWidth, boxHeight, src, type);
        boxes.push(box);
      }
    }
    return boxes;
  }

  //Method to draw all the boxes of the game
  static drawBoxes(boxes, theContext) {
    boxes.forEach((box) => {
      box.draw(theContext);
    });
  }

  //Method to move the boxes down on the screen
  static moveDown(boxes, theContext, velocity) {
    boxes.forEach((box) => {
      if (!box.isDestroyed) {
        box.y += velocity;
        theContext.drawImage(box.image, box.x, box.y, box.width, box.height);
      }
    });
  }

  //Method to draw a single box on the screen
  draw(theContext) {
    if (!this.isDestroyed) {
      theContext.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
  }
}
