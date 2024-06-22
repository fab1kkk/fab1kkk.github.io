const PADDLE = 'paddle';
const BRICK = 'brick';

export class Ball {
    constructor(game) {
        this.game = game;
        this.radius = 10;
        this.x = (this.game.width + this.radius) / 2;
        this.y = this.game.height - 350;
        this.speedX = 1.5;
        this.speedY = 3.5;
        this.lastTouched;
    }


    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (!this.game.map.bricks.length !== 0) {
            this.handleWallCollision();
            this.handleBrickCollision();
            this.handlePadleCollision();
        }
    }

    draw(context) {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        context.fillStyle = "rgb(0, 250, 250)";
        context.fill();
    }

    handlePadleCollision() {
        const paddleCords = this.game.paddle.getCurrentCoordinates();
        const ballCenter = this.x;
        const ballBottom = this.y + this.radius;

        // Check for collision with the paddle
        if (ballBottom >= paddleCords.y && ballCenter > paddleCords.topleft && ballCenter < paddleCords.topright) {

            this.game.paddle.playSound();

            // Reverse the vertical direction of the ball
            this.speedY *= -1;

            // Calculate the position of the hit on the paddle
            const paddleWidth = paddleCords.topright - paddleCords.topleft;
            const hitPos = (ballCenter - paddleCords.middle) / (paddleWidth / 2);
            // Limit hitPos to be between -1 and 1
            const limitedHitPos = Math.max(-1, Math.min(hitPos, 1));

            // Maximum bounce angle (75 degrees in radians)
            const maxBounceAngle = 75 * Math.PI / 180;

            // Calculate the bounce angle
            const bounceAngle = limitedHitPos * maxBounceAngle;
            // Calculate the speed of the ball
            const ballSpeed = Math.sqrt(this.speedX * this.speedX + this.speedY * this.speedY);

            // Update the ball's speed based on the bounce angle
            this.speedX = ballSpeed * Math.sin(bounceAngle);
            this.speedY = -ballSpeed * Math.cos(bounceAngle);
            this.game.scoreMultiplier = 1;
            this.lastTouched = PADDLE;
        }
    }
    handleBrickCollision() {
        const collidedBrick = this.checkBrickCollision()
        if (collidedBrick) {
            this.applyPositionOnBrickCollision(collidedBrick);
            this.game.map.removeBrickFromMap(collidedBrick);

            // multiply the combo x2 if ball touched another brick before it hit the paddle
            if (this.lastTouched === BRICK) this.game.scoreMultiplier *= 2;

            this.lastTouched = BRICK;
            this.game.addPoint();
        }
    }
    checkBrickCollision() {
        const collidingBrick = this.game.map.bricks.find((brick) =>
            this.x + this.radius > brick.x &&
            this.x - this.radius < brick.x + brick.w &&
            this.y + this.radius > brick.y &&
            this.y - this.radius < brick.y + brick.h
        )
        return collidingBrick ? collidingBrick : null;
    }

    applyPositionOnBrickCollision(brick) {
        let ballLeft = this.x - this.radius;
        let ballRight = this.x + this.radius;
        let ballTop = this.y - this.radius;
        let ballBottom = this.y + this.radius;

        // Get the edges of the brick
        let brickLeft = brick.x;
        let brickRight = brick.x + brick.w;
        let brickTop = brick.y;
        let brickBottom = brick.y + brick.h;

        if (ballRight > brickLeft && ballLeft < brickRight && ballBottom > brickTop && ballTop < brickBottom) {
            // Collision detected, determine which side the collision occurred on
            let overlapLeft = ballRight - brickLeft;
            let overlapRight = brickRight - ballLeft;
            let overlapTop = ballBottom - brickTop;
            let overlapBottom = brickBottom - ballTop;

            let minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);

            // Resolve the collision by reversing the ball's direction
            if (minOverlap === overlapLeft || minOverlap === overlapRight) {
                this.speedX = -this.speedX; // Reverse horizontal direction
            } else if (minOverlap === overlapTop || minOverlap === overlapBottom) {
                this.speedY = -this.speedY; // Reverse vertical direction
            }
        }
    }
    handleWallCollision() {
        // right-left collision
        if (
            this.x + this.radius > this.game.width ||
            this.x - this.radius < 0
        ) {
            this.speedX *= -1;
        }
        // top collision
        if (
            this.y - this.radius < 0
        ) {
            this.speedY *= -1;
        }
    }
    // hitBottom is special as it ends the game
    hitBottom() {
        return this.y + this.radius > this.game.height;
    }
}