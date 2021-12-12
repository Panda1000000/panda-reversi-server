import { Othello } from "../Othello/Othello.js";
export class UI {
    constructor(w, h, parent) {
        this.canvas = document.createElement("canvas");
        this.canvas.width = w;
        this.canvas.height = h;
        this.ctx = this.canvas.getContext("2d");
        if (parent !== undefined) {
            parent.appendChild(this.canvas);
        }
        else {
            document.body.appendChild(this.canvas);
        }
        this.drawBord();
    }
    drawBord() {
        this.ctx.fillStyle = "green";
        this.ctx.strokeStyle = "black";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        for (let i = 0; i < this.canvas.width; i += this.canvas.width / 8) {
            for (let j = 0; j < this.canvas.height; j += this.canvas.height / 8) {
                this.ctx.strokeRect(i, j, this.canvas.width / 8, this.canvas.height / 8);
            }
        }
    }
    showOthello(othello) {
        this.drawBord();
        const bord = othello.getBord;
        const putable = othello.getPutableCoords;
        for (let i = 1; i < bord.length - 1; i++) {
            for (let j = 1; j < bord[i].length - 1; j++) {
                const x = j - 1;
                const y = i - 1;
                if (bord[i][j] == Othello.BLACK) {
                    this.ctx.fillStyle = "black";
                    this.ctx.fillRect((x * this.canvas.width) / 8 + 5, (y * this.canvas.height) / 8 + 5, this.canvas.width / 8 - 10, this.canvas.height / 8 - 10);
                }
                else if (bord[i][j] == Othello.WHITE) {
                    this.ctx.fillStyle = "white";
                    this.ctx.fillRect((x * this.canvas.width) / 8 + 5, (y * this.canvas.height) / 8 + 5, this.canvas.width / 8 - 10, this.canvas.height / 8 - 10);
                }
                for (let k = 0; k < putable.length; k++) {
                    if (putable[k].x == j && putable[k].y == i) {
                        this.ctx.fillStyle = "rgba(255,255,255, 0.5)";
                        this.ctx.fillRect((x * this.canvas.width) / 8 + 5, (y * this.canvas.height) / 8 + 5, this.canvas.width / 8 - 10, this.canvas.height / 8 - 10);
                    }
                }
            }
        }
    }
    get getWidth() {
        return this.canvas.width;
    }
    get getHeight() {
        return this.canvas.height;
    }
    addClickEvent(callback) {
        this.canvas.addEventListener("click", (me) => {
            const clickEvent = {
                x: me.clientX - this.canvas.getBoundingClientRect().left,
                y: me.clientY - this.canvas.getBoundingClientRect().top,
            };
            callback(clickEvent);
        }, false);
    }
}
