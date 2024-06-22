import { Paddle } from "./paddle.js";
import { InputHandler } from "./input.js";
import { Ball } from "./ball.js";
import { Map } from "./map.js";

window.addEventListener('load', () => {
    const canvas = document.getElementById("canvas1");
    const ctx = canvas.getContext("2d");

    const bgImg = new Image();
    bgImg.src = './assets/space.png';

    const scoreElem = document.getElementById("score");
    const comboElem = document.getElementById("combo");
    const timeElem = document.getElementById("time");
    const highScoreElem = document.getElementById("highest-score");
    const highComboElem = document.getElementById("highest-combo");
    const fastestFinishElem = document.getElementById("fastest-finish");

    const gameOverElem = document.getElementById("game-over");
    const gameOverTextElem = document.getElementById("game-over-text");

    canvas.width = 600;
    canvas.height = 600;

    class Game {
        constructor(width, height) {
            this.width = width
            this.height = height
            this.paddle = new Paddle(this);
            this.ball = new Ball(this);
            this.input = new InputHandler();
            this.map = new Map(this)
            this.gameOver = false;
            this.scoreMultiplier = 1;
            this.score = 0;

            this.gameStartedAt = Date.now();
            this.gameCompletedIn;
        }

        update() {
            if (this.map.cleared()) {
                this.gameCompletedIn = Date.now() - this.gameStartedAt
                if (this.gameCompletedIn < Cookies.get('fastFinish') || Cookies.get('fastFinish') == null) {
                    Cookies.set('fastFinish', this.gameCompletedIn)
                }
            }

            if (this.ball.hitBottom() || this.map.cleared()) {
                this.gameOver = true;
                if(this.ball.hitBottom()) this.handleGameOver('l');
                if(this.map.cleared()) this.handleGameOver('w');
                return;
            }
            this.paddle.update(this.input.keys);
            this.ball.update();
            this.displayScores();
            this.observeRecords();
            this.displayRecords();
        }

        draw(context) {
            context.drawImage(bgImg, 0, 0, this.width, this.height);

            this.paddle.draw(context);
            this.map.draw(context);
            this.ball.draw(context);

        }

        addPoint() {
            const pointAudio = new Audio('./assets/zipclick.flac');
            pointAudio.addEventListener('canplaythrough', () => {
                pointAudio.play();
            })
            this.score += 1 * this.scoreMultiplier;
        }

        reset() {
            this.paddle = new Paddle(this);
            this.ball = new Ball(this);
            this.map = new Map(this);
            this.score = 0;
            this.gameOver = false;
            this.gameStartedAt = Date.now();
            gameOverElem.style.display = "none";
        }

        observeRecords() {
            if (this.score > Cookies.get('highScore') || Cookies.get('highScore') == null) {
                Cookies.set('highScore', this.score)
            }
            if (this.scoreMultiplier > Cookies.get('highCombo') || Cookies.get('highCombo') == null) {
                Cookies.set('highCombo', this.scoreMultiplier)
            }
        }

        displayScores() {
            scoreElem.innerHTML = "Score: " + this.score;
            this.scoreMultiplier > 1 ? comboElem.innerHTML = "combo x" + this.scoreMultiplier + "!" : comboElem.innerHTML = "";
            timeElem.innerHTML = "Time: " + ((Date.now() - this.gameStartedAt) / 1000).toFixed(2) + "s";
        }

        displayRecords() {
            highScoreElem.innerHTML = "Score: " + Cookies.get('highScore');
            highComboElem.innerHTML = "Combo: x" + Cookies.get('highCombo');
            if (Cookies.get('fastFinish') != null) {
                fastestFinishElem.innerHTML = "Fastest: " + (Cookies.get('fastFinish') / 1000).toFixed(2) + "s";
            } else {
                fastestFinishElem.innerHTML = "Fastest: " + "Not finished yet.";
            }
        }

        handleGameOver(endType) {
            let text;
            let color;

            switch (endType) {
                case 'w':
                    text = "Congratulations, you won!<br>Press space to restart.";
                    color = "green";
                    break;
                case 'l':
                    text = "Maybe next time...<br>Press space to restart."
                    color = "red";
                    break;
            }
            if (this.gameOver) {
                gameOverElem.style.display = "block";
                gameOverElem.style.borderColor = color;
                gameOverTextElem.style.color = color;
                gameOverTextElem.innerHTML = text;
                
                document.addEventListener('keydown', event => {
                    if (this.gameOver && event.code === 'Space') {
                        this.reset();
                    }
                })
            }
        }
    }

    const game = new Game(canvas.width, canvas.height);

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.update();
        game.draw(ctx);
        requestAnimationFrame(animate);
    }
    animate();
})



