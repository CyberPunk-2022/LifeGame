const SIZE = 100;
const WIDTH = 10;
const GAME_CANVAS = document.getElementById("game");
const DEFAULT_UPDATE_TIME = 100;
let GAME_INTERVAL = null;
let gameContext = GAME_CANVAS.getContext("2d");
let num=0;
let updateTime;
let mouseListener = function (event) {
    stop();
    let x = Math.floor(event.pageX / WIDTH) - 1;
    let y = Math.floor(event.pageY / WIDTH) - 1;
    GAME.cells[x][y] = (GAME.cells[x][y] === 1) ? 0 : 1;
    drawCells();
};
let game = function () {
    GAME_CANVAS.width = WIDTH * SIZE;
    GAME_CANVAS.height = WIDTH * SIZE;
    this.cells = generateCells();
    GAME_CANVAS.addEventListener("mousedown", mouseListener, false);
    updateTime=DEFAULT_UPDATE_TIME;
};
let clearAll = function () {
    GAME.cells = generateCells();
    drawCells();
    stop();
};
let generateCells = function () {
    let retval = new Array(SIZE);
    for (let i = 0; i < retval.length; i++) {
        retval[i] = new Array(SIZE);
        for (let j = 0; j < retval[i].length; j++) {
            retval[i][j] = 0;
        }
    }
    return retval;
};

let drawCells = function () {
    console.log("draw")
    for (let i = 0; i < SIZE; i++) {
        for (let j = 0; j < SIZE; j++) {
            if (GAME.cells[i][j]) {
                gameContext.fillRect(i * WIDTH + 1, j * WIDTH + 1, WIDTH - 2, WIDTH - 2);
            } else {
                gameContext.clearRect(i * WIDTH + 1, j * WIDTH + 1, WIDTH - 2, WIDTH - 2);
            }
        }
    }

};

let countNeighbours = function (x, y) {
    let count = 0;
    for (let i = x - 1; i <= x + 1; i++) {
        for (let j = y - 1; j <= y + 1; j++) {
            if (i < 0 || i >= SIZE || j < 0 || j >= SIZE || (i === x && j === y)) {
                continue;
            }
            if (GAME.cells[i][j]) {
                count++;
            }
        }
    }
    return count;
};

let update = function () {
    console.log("update");
    gameContext.clearRect(0, 0, SIZE * WIDTH, SIZE * WIDTH);
    for (let i = 0; i <= SIZE; i++) {
        gameContext.beginPath();
        gameContext.moveTo(0, i * WIDTH);
        gameContext.lineTo(SIZE * WIDTH, i * WIDTH);
        gameContext.moveTo(i * WIDTH, 0);
        gameContext.lineTo(i * WIDTH, SIZE * WIDTH);
        gameContext.stroke();
    }
    if (typeof GAME == "undefined") {
        return;
    }



    let newCells = JSON.parse(JSON.stringify(GAME.cells));
    for (let i = 0; i < SIZE; i++) {
        for (let j = 0; j < SIZE; j++) {
            newCells[i][j] = 0;
            let cell = GAME.cells[i][j];
            let nearBy = countNeighbours(i, j);
            if (2 === nearBy || nearBy === 3) {
                newCells[i][j] = (cell || nearBy === 3) ? 1 : 0;
            }
        }
    }
    GAME.cells = newCells;
    drawCells();
};
let start = function () {
    stop();
    GAME_INTERVAL = setInterval(update, updateTime);
};
let stop = function () {
    clearInterval(GAME_INTERVAL);
};
let step = function () {
    stop();
    update();
};
GAME = new game();
update();
