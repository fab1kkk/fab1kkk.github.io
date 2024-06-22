// blocks from within map.js needs to be replaced with new brick object
// td

const brickImg = new Image();
brickImg.src = "./assets/paddle.png";

export class Brick {
    constructor(x, y, width, height, fillcolor, strokecolor, hp = 1) {
        this.x = x;
        this.y = y;
        this.w = width;
        this.h = height;
        this.fillcolor = fillcolor;
        this.strokecolor = strokecolor;
        this.hp = hp;
    }

    draw(context) {
        // context.drawImage(brickImg, this.x, this.y, this.w, this.h);
        context.fillStyle = this.fillcolor;
        context.strokeStyle = this.strokecolor;
        context.fillRect(this.x, this.y, this.w, this.h);
        context.strokeRect(this.x, this.y, this.w, this.h);
    }
}