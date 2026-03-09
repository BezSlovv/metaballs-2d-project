class Metaball {
    constructor(x, y, vx, vy, strength, radius) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.strength = strength;
        this.radius = radius;
    }

    update(isAnimating) {
        if (!isAnimating) {
            return;
        }

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
        fill(96, 165, 250, 70);
        circle(this.x, this.y, this.radius * 2);
    }
}

let metaballs = [];
let gridSize = 20;
let cols = 0;
let rows = 0;
let field = [];
let threshold = 2.0;

let isAnimating = true;
let showGrid = true;
let showFieldPoints = true;
let showMetaballs = true;

let thresholdSlider;
let gridSlider;
let ballSlider;

let thresholdValueLabel;
let gridValueLabel;
let ballValueLabel;

let showGridCheckbox;
let showFieldPointsCheckbox;
let showMetaballsCheckbox;

let startButton;
let stopButton;
let resetButton;

function setup() {
    const canvas = createCanvas(900, 600);
    canvas.parent("canvas-container");

    setupControls();
    initializeField();
    createInitialMetaballs(Number(ballSlider.value));
}

function draw() {
    background(15, 23, 42);

    for (const metaball of metaballs) {
        metaball.update(isAnimating);
        metaball.bounce(width, height);
    }

    computeField();

    if (showGrid) {
        drawGrid();
    }

    if (showFieldPoints) {
        drawFieldPoints();
    }

    drawIsoLines();

    if (showMetaballs) {
        for (const metaball of metaballs) {
            metaball.draw();
        }
    }

    drawSceneLabel();
}

function setupControls() {
    thresholdSlider = document.getElementById("threshold-slider");
    gridSlider = document.getElementById("grid-slider");
    ballSlider = document.getElementById("ball-slider");

    thresholdValueLabel = document.getElementById("threshold-value");
    gridValueLabel = document.getElementById("grid-value");
    ballValueLabel = document.getElementById("ball-value");

    showGridCheckbox = document.getElementById("show-grid");
    showFieldPointsCheckbox = document.getElementById("show-field-points");
    showMetaballsCheckbox = document.getElementById("show-metaballs");

    startButton = document.getElementById("start-button");
    stopButton = document.getElementById("stop-button");
    resetButton = document.getElementById("reset-button");

    thresholdSlider.addEventListener("input", () => {
        threshold = Number(thresholdSlider.value);
        thresholdValueLabel.textContent = threshold.toFixed(1);
    });

    gridSlider.addEventListener("input", () => {
        gridSize = Number(gridSlider.value);
        gridValueLabel.textContent = gridSize;
        initializeField();
    });

    ballSlider.addEventListener("input", () => {
        const ballCount = Number(ballSlider.value);
        ballValueLabel.textContent = ballCount;
        createInitialMetaballs(ballCount);
    });

    showGridCheckbox.addEventListener("change", () => {
        showGrid = showGridCheckbox.checked;
    });

    showFieldPointsCheckbox.addEventListener("change", () => {
        showFieldPoints = showFieldPointsCheckbox.checked;
    });

    showMetaballsCheckbox.addEventListener("change", () => {
        showMetaballs = showMetaballsCheckbox.checked;
    });

    startButton.addEventListener("click", () => {
        isAnimating = true;
    });

    stopButton.addEventListener("click", () => {
        isAnimating = false;
    });

    resetButton.addEventListener("click", () => {
        threshold = 2.0;
        gridSize = 20;

        thresholdSlider.value = threshold;
        gridSlider.value = gridSize;
        thresholdValueLabel.textContent = threshold.toFixed(1);
        gridValueLabel.textContent = gridSize;

        createInitialMetaballs(Number(ballSlider.value));
        initializeField();
        isAnimating = true;
    });
}

function initializeField() {
    cols = floor(width / gridSize) + 1;
    rows = floor(height / gridSize) + 1;
    field = new Array(cols);

    for (let i = 0; i < cols; i++) {
        field[i] = new Array(rows).fill(0);
    }
}

function createInitialMetaballs(count) {
    metaballs = [];

    for (let i = 0; i < count; i++) {
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

            const intensity = constrain(map(value, 0, 2.5, 0, 255), 0, 255);
            fill(intensity, intensity, intensity, 120);
            circle(x, y, 5);
        }
    }
}

function drawIsoLines() {
    stroke(34, 197, 94);
    strokeWeight(3);
    noFill();

    for (let i = 0; i < cols - 1; i++) {
        for (let j = 0; j < rows - 1; j++) {
            const x = i * gridSize;
            const y = j * gridSize;

            const aValue = field[i][j];
            const bValue = field[i + 1][j];
            const cValue = field[i + 1][j + 1];
            const dValue = field[i][j + 1];

            let state = 0;
            if (aValue >= threshold) state |= 8;
            if (bValue >= threshold) state |= 4;
            if (cValue >= threshold) state |= 2;
            if (dValue >= threshold) state |= 1;

            const a = createVector(x, y);
            const b = createVector(x + gridSize, y);
            const c = createVector(x + gridSize, y + gridSize);
            const d = createVector(x, y + gridSize);

            const top = interpolatePoint(a, b, aValue, bValue);
            const right = interpolatePoint(b, c, bValue, cValue);
            const bottom = interpolatePoint(d, c, dValue, cValue);
            const left = interpolatePoint(a, d, aValue, dValue);

            drawMarchingSquaresCase(state, top, right, bottom, left);
        }
    }
}

function interpolatePoint(p1, p2, value1, value2) {
    const denominator = value2 - value1;

    if (abs(denominator) < 0.000001) {
        return createVector((p1.x + p2.x) * 0.5, (p1.y + p2.y) * 0.5);
    }

    const t = (threshold - value1) / denominator;
    const clampedT = constrain(t, 0, 1);

    return createVector(
        lerp(p1.x, p2.x, clampedT),
        lerp(p1.y, p2.y, clampedT)
    );
}

function drawMarchingSquaresCase(state, top, right, bottom, left) {
    switch (state) {
        case 0:
        case 15:
            break;
        case 1:
            drawSegment(left, bottom);
            break;
        case 2:
            drawSegment(bottom, right);
            break;
        case 3:
            drawSegment(left, right);
            break;
        case 4:
            drawSegment(top, right);
            break;
        case 5:
            drawSegment(top, left);
            drawSegment(bottom, right);
            break;
        case 6:
            drawSegment(top, bottom);
            break;
        case 7:
            drawSegment(top, left);
            break;
        case 8:
            drawSegment(top, left);
            break;
        case 9:
            drawSegment(top, bottom);
            break;
        case 10:
            drawSegment(top, right);
            drawSegment(left, bottom);
            break;
        case 11:
            drawSegment(top, right);
            break;
        case 12:
            drawSegment(left, right);
            break;
        case 13:
            drawSegment(bottom, right);
            break;
        case 14:
            drawSegment(left, bottom);
            break;
    }
}

function drawSegment(p1, p2) {
    line(p1.x, p1.y, p2.x, p2.y);
}

function drawSceneLabel() {
    noStroke();
    fill(226, 232, 240);
    textAlign(LEFT, TOP);
    textSize(18);
    text("Etap 5: interaktywny panel sterowania", 20, 20);
}