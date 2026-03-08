class Metaball {
    constructor(x, y, vx, vy, strength, radius) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.strength = strength;
        this.radius = radius;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
    }

    bounce(canvasWidth, canvasHeight) {
        if (this.x - this.radius <= 0 || this.x + this.radius >= canvasWidth) {
            this.vx *= -1;
        }

        if (this.y - this.radius <= 0 || this.y + this.radius >= canvasHeight) {
            this.vy *= -1;
        }

        this.x = constrain(this.x, this.radius, canvasWidth - this.radius);
        this.y = constrain(this.y, this.radius, canvasHeight - this.radius);
    }

    draw() {
        noStroke();
        fill(96, 165, 250, 150);
        circle(this.x, this.y, this.radius * 2);
    }
}

let metaballs = [];
let gridSize = 20;
let cols = 0;
let rows = 0;
let field = [];

function setup() {
    const canvas = createCanvas(900, 600);
    canvas.parent("canvas-container");

    initializeField();
    createInitialMetaballs();
}

function draw() {
    background(15, 23, 42);

    for (const metaball of metaballs) {
        metaball.update();
        metaball.bounce(width, height);
    }

    computeField();
    drawGrid();
    drawFieldPoints();

    for (const metaball of metaballs) {
        metaball.draw();
    }

    drawSceneLabel();
}

function initializeField() {
    cols = floor(width / gridSize) + 1;
    rows = floor(height / gridSize) + 1;
    field = new Array(cols);

    for (let i = 0; i < cols; i++) {
        field[i] = new Array(rows).fill(0);
    }
}

function createInitialMetaballs() {
    metaballs = [];

    for (let i = 0; i < 5; i++) {
        const radius = random(25, 45);
        const x = random(radius, width - radius);
        const y = random(radius, height - radius);
        const vx = random(-2.2, 2.2);
        const vy = random(-2.2, 2.2);
        const strength = random(9000, 17000);

        metaballs.push(new Metaball(x, y, vx, vy, strength, radius));
    }
}

function computeField() {
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            const x = i * gridSize;
            const y = j * gridSize;
            field[i][j] = fieldValueAt(x, y);
        }
    }
}

function fieldValueAt(x, y) {
    let sum = 0;
    const epsilon = 0.0001;

    for (const metaball of metaballs) {
        const dx = x - metaball.x;
        const dy = y - metaball.y;
        const distanceSquared = dx * dx + dy * dy;
        sum += metaball.strength / (distanceSquared + epsilon);
    }

    return sum;
}

function drawGrid() {
    stroke(51, 65, 85);
    strokeWeight(1);

    for (let x = 0; x <= width; x += gridSize) {
        line(x, 0, x, height);
    }

    for (let y = 0; y <= height; y += gridSize) {
        line(0, y, width, y);
    }
}

function drawFieldPoints() {
    noStroke();

    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            const x = i * gridSize;
            const y = j * gridSize;
            const value = field[i][j];

            const intensity = constrain(map(value, 0, 8, 0, 255), 0, 255);
            fill(intensity, intensity, intensity, 220);
            circle(x, y, 6);
        }
    }
}

function drawSceneLabel() {
    noStroke();
    fill(226, 232, 240);
    textAlign(LEFT, TOP);
    textSize(18);
    text("Etap 3: pole skalarne na siatce", 20, 20);
}