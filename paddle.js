export class Paddle {
    constructor(game) {
        this.game = game;
        this.width = 140;
        this.height = 20;
        this.x = (this.game.width / 2) - (this.width / 2);
        this.y = this.game.height - this.height - 20;
        this.paddleImg = document.getElementById('paddle');
        this.sound = new Audio('./assets/paddleSound.ogg');
        this.speed = 0;
        this.maxSpeed = 3;
    }

    update(input) {
        this.x += this.speed;
        if ((input.indexOf('ArrowLeft') == 0 && this.x > 0)) this.speed = -this.maxSpeed;
        else if ((input.indexOf('ArrowRight') == 0 && this.x < this.game.width - this.width)) this.speed = this.maxSpeed;
        else this.speed = 0;

    }

    draw(context) {
        context.drawImage(this.paddleImg, this.x, this.y, this.width, this.height)
    }

    playSound() {
        this.sound.volume = 0.1;
        this.sound.play();
    }

    currentLeftWallPositionX() {
        return this.x
    }
    currentRightWallPositionX() {
        return this.x + this.width;
    }
    getCurrentCoordinates() {
        return {
            topleft: this.x,
            topright: this.x + this.width,
            middle: (this.x + this.x + this.width) / 2,
            y: this.y
        }
    }
}