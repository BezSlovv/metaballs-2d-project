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
        fill(96, 165, 250, 180);
        circle(this.x, this.y, this.radius * 2);
    }
}

let metaballs = [];

function setup() {
    const canvas = createCanvas(900, 600);
    canvas.parent("canvas-container");

    createInitialMetaballs();
}

function draw() {
    background(15, 23, 42);

    drawGrid();

    for (const metaball of metaballs) {
        metaball.update();
        metaball.bounce(width, height);
        metaball.draw();
    }

    drawSceneLabel();
}

function createInitialMetaballs() {
    metaballs = [];

    for (let i = 0; i < 5; i++) {
        const radius = random(25, 45);
        const x = random(radius, width - radius);
        const y = random(radius, height - radius);
        const vx = random(-2.2, 2.2);
        const vy = random(-2.2, 2.2);
        const strength = random(8000, 16000);

        metaballs.push(new Metaball(x, y, vx, vy, strength, radius));
    }
}

function drawGrid() {
    stroke(51, 65, 85);
    strokeWeight(1);

    for (let x = 0; x <= width; x += 30) {
        line(x, 0, x, height);
    }

    for (let y = 0; y <= height; y += 30) {
        line(0, y, width, y);
    }
}

function drawSceneLabel() {
    noStroke();
    fill(226, 232, 240);
    textAlign(LEFT, TOP);
    textSize(18);
    text("Etap 2: animowane metaballe", 20, 20);
}