export class Othello {
    constructor(bord, turn) {
        this.turn = Othello.BLACK;
        this.bord = [
            [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
            [9, 0, 0, 0, 0, 0, 0, 0, 0, 9],
            [9, 0, 0, 0, 0, 0, 0, 0, 0, 9],
            [9, 0, 0, 0, 0, 0, 0, 0, 0, 9],
            [9, 0, 0, 0, 1, 2, 0, 0, 0, 9],
            [9, 0, 0, 0, 2, 1, 0, 0, 0, 9],
            [9, 0, 0, 0, 0, 0, 0, 0, 0, 9],
            [9, 0, 0, 0, 0, 0, 0, 0, 0, 9],
            [9, 0, 0, 0, 0, 0, 0, 0, 0, 9],
            [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
        ];
        this.putableCoords = [];
        if (bord && turn) {
            for (let i = 0; i < bord.length; i++) {
                for (let j = 0; j < bord[i].length; j++) {
                    this.bord[i][j] = bord[i][j];
                }
            }
            this.turn = turn;
            this.updatePutableCoords();
        }
        else {
            this.updatePutableCoords();
        }
    }
    switchTurn() {
        this.turn = ((this.turn - 3) * -1);
    }
    getLine(x, y, dx, dy) {
        const line = [];
        for (let i = 0; i < this.bord.length; i++) {
            const col = this.bord[y + i * dy][x + i * dx];
            if (col === Othello.WALL) {
                break;
            }
            line.push(col);
        }
        return line;
    }
    cntReversable(line) {
        for (let i = 1; i < line.length; i++) {
            if (line[i] === Othello.BLANK) {
                return 0;
            }
            if (line[i] === this.turn) {
                return i - 1;
            }
        }
        return 0;
    }
    reverse(x, y) {
        let isReverse = false;
        for (let dx = -1; dx < 2; dx++) {
            for (let dy = -1; dy < 2; dy++) {
                if (dx == 0 && dy == 0) {
                    continue;
                }
                const line = this.getLine(x, y, dx, dy);
                const nReversable = this.cntReversable(line);
                if (nReversable !== 0) {
                    isReverse = true;
                }
                for (let i = 0; i <= nReversable; i++) {
                    this.bord[y + i * dy][x + i * dx] = this.turn;
                }
            }
        }
        return isReverse;
    }
    canReverse(x, y) {
        let isReverse = false;
        for (let dx = -1; dx < 2; dx++) {
            for (let dy = -1; dy < 2; dy++) {
                if (dx == 0 && dy == 0) {
                    continue;
                }
                const line = this.getLine(x, y, dx, dy);
                const nReversable = this.cntReversable(line);
                if (nReversable != 0) {
                    isReverse = true;
                }
            }
        }
        return isReverse;
    }
    canPut(x, y) {
        if (this.bord[y][x] != Othello.BLANK) {
            return false;
        }
        this.bord[y][x] = this.turn;
        const can = this.canReverse(x, y);
        this.bord[y][x] = Othello.BLANK;
        return can;
    }
    updatePutableCoords() {
        this.putableCoords = [];
        for (let x = 1; x < this.bord.length - 1; x++) {
            for (let y = 1; y < this.bord.length - 1; y++) {
                if (this.canPut(x, y)) {
                    this.putableCoords.push({
                        x,
                        y,
                    });
                }
            }
        }
    }
    put(coord) {
        const { x, y } = coord;
        if (this.bord[y][x] != Othello.BLANK) {
            return false;
        }
        this.bord[y][x] = this.turn;
        if (!this.reverse(x, y)) {
            this.bord[y][x] = Othello.BLANK;
            return false;
        }
        this.switchTurn();
        this.updatePutableCoords();
        return true;
    }
    get getBord() {
        return this.bord;
    }
    get getPutableCoords() {
        return this.putableCoords;
    }
    get getTurn() {
        return this.turn;
    }
}
Othello.BLACK = 2;
Othello.WHITE = 1;
Othello.BLANK = 0;
Othello.WALL = 9;
