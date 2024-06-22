import { Brick } from "./brick.js";

export class Map {
    constructor(game, sx = 0, sy = 50, rows = 5, columns = 10, brickHeight = 25) {
        this.game = game;
        this.sx = sx;
        this.sy = sy;
        this.rows = rows;
        this.columns = columns;
        this.bricks = [];
        // 3 represents a margin around each brick in pixels
        this.brickW = ((this.game.width - (this.columns * 2)) / this.columns);
        this.brickH = brickHeight;
        this.initMap();
    }

    drawSingleBlock(context, x, y, width, height, fillColor, fillStroke) {
        context.fillStyle = fillColor;
        context.strokeStyle = fillStroke;
        context.fillRect(x, y, width, height);
        context.strokeRect(x, y, width, height);
    }

    initMap() {
        if (this.bricks.length == 0) {
            let nextPosX = this.sx;
            let nextPosY = this.sy;
            let lastPosX = nextPosX;
            let lastPosY = nextPosY;
            let fillcolor = "";
            let strokecolor = "black";

            for (let i = 0; i < this.rows; i++) {
                i % 2 == 0 ? fillcolor = "rgb(100, 100, 100)" : fillcolor = "rgb(150,150,150)";

                for (let j = 0; j < this.columns; j++) {
                    let brick = new Brick(nextPosX, nextPosY, this.brickW, this.brickH, fillcolor, strokecolor);
                    this.bricks.push(brick);
                    lastPosX = nextPosX + this.brickW + 2;
                    nextPosX = lastPosX;
                }
                lastPosY += this.brickH + 2;
                nextPosY = lastPosY;
                nextPosX = 0;
            }
        }
    }

    draw(context) {
        this.bricks.forEach(brick => brick.draw(context))
    }

    removeBrickFromMap(brickToRemove) {
        this.bricks = this.bricks.filter(brick => brick !== brickToRemove);
    }

    cleared() {
        return this.bricks.length === 0 
    }

}
