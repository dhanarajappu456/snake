"use strict";

/** |-- VARIABLE DECLARATION --|

 * c -> Canvas
 * ctx -> Context
 * WIDTH -> Screen width
 * HEIGHT -> Screen height
 * MIN -> Minimum of WIDTH and HEIGHT
 * GRID_SIZE -> Size of one grid
 * SNAKE -> The actual snake object
 * age -> Running time of the program
 * INTERVAL (change if too slow/fast) -> Intervals of frames (bigger - slower)
 * SCORE -> Only for display.

 * APPLE -> Contains the coordinates of the apple
 * start, end -> Handles swiping

 * PI -> Value of PI (3.14)
 * abs -> Absolute value

 */

let c, ctx,
    WIDTH, HEIGHT, MIN,
    GRID_SIZE,
    SNAKE,
    age = 0,
    INTERVAL = 10,
    SCORE = 0;


const APPLE = [],
    [start, end] = [[], []];

const {PI, abs} = Math;

/** |-- UTILITY FUNCTIONS --|

 * random -> Generates a random number between two given values
 * randInt -> Generates a random integer between two given values
 * rect -> Draw a cell of the snake
 * circle -> Draws the apple
 * clear -> Clears the entire canvas

 */

const UTILITY = {
    // - RANDOM - \\
    random: (max = 1, min = 0) => max > min? Math.random() * (max - min) + min: Math.random() * (min - max) + max,
    // - RANDINT - \\
    randInt: (max = 1, min = 0) => max > min? Math.floor(UTILITY.random(min, max)): Math.floor(UTILITY.random(max, min)),
    // - CLEAR - \\
    rect(x, y) {
        ctx.fillRect(GRID_SIZE * x + 1, GRID_SIZE * y + 1, GRID_SIZE - 2, GRID_SIZE - 2);
    },
    circle(x, y) {
        ctx.beginPath();
            ctx.arc(GRID_SIZE * x + GRID_SIZE / 2, GRID_SIZE * y + GRID_SIZE / 2, GRID_SIZE /  3, 0, PI * 2, true);
        ctx.closePath();

        ctx.fillStyle = "#F00";
        ctx.fill();
    },
    clear() {
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
    }
};

/** |-- MAIN FUNCTIONS --|

 * assign -> Assigns a value to the canvas and the context
 * setCanvas -> Sets the properties of the canvas
 * setSnake -> Sets up the SNAKE variable
 * update -> Gets called every frame, updates the state of the code

 */

const MAIN = {
// - ASSIGN - \\
    assign() {
        c = document.querySelector("canvas");
        ctx = c.getContext("2d");
    },
    // - SETCANVAS - \\
    setCanvas() {
        // - Clear screen
        UTILITY.clear();

        // - Set WIDTH, HEIGHT and MIN
        [WIDTH, HEIGHT] = [window.innerWidth, window.innerHeight];
        MIN = Math.min(WIDTH, HEIGHT);
        GRID_SIZE = MIN / 20;

        // - Set the canvas' position
        c.style.position = "absolute";
        c.style.top = 0;
        c.style.left = 0;

        // - Set background to black
        document.body.style.background = "#000";

        // - Set sizes of the canvas to cover the entire screen
        c.width = MIN;
        c.style.width = MIN;
        c.height = MIN;
        c.style.height = MIN;

        // - Set color of scoreboard
        document.querySelector("div").style.color = "#FFF";

        // - Set the page up depending on size
        document.querySelector("div").style.position = "absolute";
        document.querySelector("div").style["font-size"] = "5vw";

        if (WIDTH > HEIGHT) {
            c.style["border-right"] = `solid ${GRID_SIZE / 4}px #FFF`;
            c.style["border-bottom"] = "";

            document.querySelector("div").style.top = "2vw";
            document.querySelector("div").style.left = `calc(${MIN + GRID_SIZE / 4}px + 2vw)`;
        } else {
            c.style["border-right"] = "";
            c.style["border-bottom"] = `solid ${GRID_SIZE / 4}px #FFF`;

            document.querySelector("div").style.top = `calc(${MIN + GRID_SIZE / 4}px + 2vw)`;
            document.querySelector("div").style.left = "2vw";
        }
    },
    // - SETSNAKE - \\
    setSnake() {
        SNAKE = new Snake();
    },
    // - SETAPPLE - \\
    setApple() {
        do {
            APPLE.length = 0;
            APPLE.push(UTILITY.randInt(20), UTILITY.randInt(20));
        } while (SNAKE.cells.some(i => i[0] == APPLE[0] && i[1] == APPLE[1]));
    },
    // - UPDATE - \\
    update() {
        if (!(++age % INTERVAL)) {
            UTILITY.clear();

            UTILITY.circle(...APPLE);

            if ((SNAKE.cells[0][0] + 10000000) % 20 == APPLE[0] && (SNAKE.cells[0][1] + 10000000) % 20 == APPLE[1]) {
                MAIN.setApple();
                SNAKE.add();

                SCORE += UTILITY.randInt(80, 120);
            }

            SNAKE.queue();

            SNAKE.draw();

            document.querySelector("div").innerText = `Score: ${SCORE}`;

            if (SNAKE.cells.slice(1).some(i => i[0] == SNAKE.cells[0][0] && i[1] == SNAKE.cells[0][1])) {
                alert("Game Over!");
                alert(`Your Score: ${SCORE}`);

                MAIN.setSnake();
                MAIN.setApple();

                SCORE = 0;
            }
        }

        requestAnimationFrame(MAIN.update);
    }
};

/** |-- EVENTS --|

 * load -> Creates canvas and sets its properties, then calles the update function for the first time
 * resize -> Updates the screen width and height

 */

const EVENTS = {
    // - LOAD - \\
    load() {
        MAIN.assign();
        MAIN.setCanvas();
        MAIN.setSnake();
        MAIN.setApple();

        requestAnimationFrame(MAIN.update);
    },
    // - RESIZE - \\
    resize() {
        MAIN.setCanvas();
        MAIN.setSnake();
        MAIN.setApple();
    },
    keydown(e) {
        switch (e.keyCode) {
            // - Left
            case 37:
                if (SNAKE.v[0] != 1 || SNAKE.length == 1) {
                    SNAKE.v[0] = -1;
                    SNAKE.v[1] = 0;
                }
                break;
            // - Up
            case 38:
                if (SNAKE.v[1] != 1 || SNAKE.length == 1) {
                    SNAKE.v[0] = 0;
                    SNAKE.v[1] = -1;
                }
                break;
            // - Right
            case 39:
                if (SNAKE.v[0] != -1 || SNAKE.length == 1) {
                    SNAKE.v[0] = 1;
                    SNAKE.v[1] = 0;
                }
                break;
            // - Down
            case 40:
                if (SNAKE.v[1] != -1 || SNAKE.length == 1) {
                    SNAKE.v[0] = 0;
                    SNAKE.v[1] = 1;
                }
                break;
        }
    },
    touchstart(e) {
        start.length = 0;

        start.push(e.touches[0].clientX, e.touches[0].clientY);
    },
    touchmove(e) {
        end.length = 0;

        end.push(e.touches[0].clientX, e.touches[0].clientY);
    },
    touchend() {
        const diff = [abs(start[0] - end[0]), abs(start[1] - end[1])];

        // - Left
        if (start[0] > end[0] && diff[0] > diff[1])
            if (SNAKE.v[0] != 1 || SNAKE.length == 1) {
                SNAKE.v[0] = -1;
                SNAKE.v[1] = 0;
            }
        // - Right
        if (start[0] < end[0] && diff[0] > diff[1])
            if (SNAKE.v[0] != -1 || SNAKE.length == 1) {
                SNAKE.v[0] = 1;
                SNAKE.v[1] = 0;
            }
        // - Up
        if (start[1] > end[1] && diff[0] < diff[1])
            if (SNAKE.v[1] != 1 || SNAKE.length == 1) {
                SNAKE.v[0] = 0;
                SNAKE.v[1] = -1;
            }
        // - Down
        if (start[1] < end[1] && diff[0] < diff[1])
            if (SNAKE.v[1] != -1 || SNAKE.length == 1) {
                SNAKE.v[0] = 0;
                SNAKE.v[1] = 1;
            }
    }
};

// - Actually give the window the events
for (const i in EVENTS)
    window.addEventListener(i, EVENTS[i]);

/** |-- SNAKE CLASS --|

 * constructor -> Sets all the variables of the object
 * add -> Increases length of snake
 * queue -> Updates positions of the snake
 * draw -> Draws the snake

 */

class Snake {
    // - CONSTRUCTOR - \\
    constructor() {
        this.cells = [[UTILITY.randInt(20), UTILITY.randInt(20)]];

        this.v = [0, 0];

        this.length = 1;
    }
    // - ADD - \\
    add() {
        this.length++;
        this.cells.push([this.cells[0][0], this.cells[0][1]]);
    }
    // - QUEUE - \\
    queue() {
        const pop = this.cells.pop();

        if (this.length == 1)
            this.cells.unshift([(pop[0] + this.v[0] + 10000000) % 20, (pop[1] + this.v[1] + 10000000) % 20]);
        else
            this.cells.unshift([(this.cells[0][0] + this.v[0] + 10000000) % 20, (this.cells[0][1] + this.v[1] + 10000000) % 20]);
    }
    // - DRAW - \\    
    draw() {
        ctx.fillStyle = "#FFF";

        this.cells.forEach(i => {UTILITY.rect(i[0], i[1])});
    }
}