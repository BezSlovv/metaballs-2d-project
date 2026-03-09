class Metaball {
    constructor(x, y, vx, vy, strength, radius) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.baseStrength = strength;
        this.radius = radius;
    }

    update(isAnimating, speedMultiplier) {
        if (!isAnimating) {
            return;
        }

        this.x += this.vx * speedMultiplier;
        this.y += this.vy * speedMultiplier;
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

    getStrength() {
        return this.baseStrength * strengthMultiplier;
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
let speedMultiplier = 1.0;
let strengthMultiplier = 1.0;

let isAnimating = true;
let showGrid = true;
let showFieldPoints = true;
let showScalarBackground = true;
let showMetaballs = true;
let debugMode = false;

let thresholdSlider;
let gridSlider;
let ballSlider;
let speedSlider;
let strengthSlider;

let thresholdValueLabel;
let gridValueLabel;
let ballValueLabel;
let speedValueLabel;
let strengthValueLabel;

let showGridCheckbox;
let showFieldPointsCheckbox;
let showScalarBackgroundCheckbox;
let showMetaballsCheckbox;
let debugModeCheckbox;

let startButton;
let stopButton;
let resetButton;
let randomizeButton;
let removeButton;

let statusAnimation;
let statusCells;
let statusThreshold;
let statusMetaballs;
let statusSpeed;
let statusStrength;

function setup() {
    const canvas = createCanvas(900, 600);
    canvas.parent("canvas-container");

    setupControls();
    initializeField();
    createInitialMetaballs(Number(ballSlider.value));
    updateStatusPanel();
}

function draw() {
    background(15, 23, 42);

    for (const metaball of metaballs) {
        metaball.update(isAnimating, speedMultiplier);
        metaball.bounce(width, height);
    }

    computeField();

    if (showScalarBackground) {
        drawScalarBackground();
    }

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
    updateStatusPanel();
}

function setupControls() {
    thresholdSlider = document.getElementById("threshold-slider");
    gridSlider = document.getElementById("grid-slider");
    ballSlider = document.getElementById("ball-slider");
    speedSlider = document.getElementById("speed-slider");
    strengthSlider = document.getElementById("strength-slider");

    thresholdValueLabel = document.getElementById("threshold-value");
    gridValueLabel = document.getElementById("grid-value");
    ballValueLabel = document.getElementById("ball-value");
    speedValueLabel = document.getElementById("speed-value");
    strengthValueLabel = document.getElementById("strength-value");

    showGridCheckbox = document.getElementById("show-grid");
    showFieldPointsCheckbox = document.getElementById("show-field-points");
    showScalarBackgroundCheckbox = document.getElementById("show-scalar-background");
    showMetaballsCheckbox = document.getElementById("show-metaballs");
    debugModeCheckbox = document.getElementById("debug-mode");

    startButton = document.getElementById("start-button");
    stopButton = document.getElementById("stop-button");
    resetButton = document.getElementById("reset-button");
    randomizeButton = document.getElementById("randomize-button");
    removeButton = document.getElementById("remove-button");

    statusAnimation = document.getElementById("status-animation");
    statusCells = document.getElementById("status-cells");
    statusThreshold = document.getElementById("status-threshold");
    statusMetaballs = document.getElementById("status-metaballs");
    statusSpeed = document.getElementById("status-speed");
    statusStrength = document.getElementById("status-strength");

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

    speedSlider.addEventListener("input", () => {
        speedMultiplier = Number(speedSlider.value);
        speedValueLabel.textContent = speedMultiplier.toFixed(1);
    });

    strengthSlider.addEventListener("input", () => {
        strengthMultiplier = Number(strengthSlider.value);
        strengthValueLabel.textContent = strengthMultiplier.toFixed(1);
    });

    showGridCheckbox.addEventListener("change", () => {
        showGrid = showGridCheckbox.checked;
    });

    showFieldPointsCheckbox.addEventListener("change", () => {
        showFieldPoints = showFieldPointsCheckbox.checked;
    });

    showScalarBackgroundCheckbox.addEventListener("change", () => {
        showScalarBackground = showScalarBackgroundCheckbox.checked;
    });

    showMetaballsCheckbox.addEventListener("change", () => {
        showMetaballs = showMetaballsCheckbox.checked;
    });

    debugModeCheckbox.addEventListener("change", () => {
        debugMode = debugModeCheckbox.checked;

        if (debugMode) {
            showGrid = true;
            showFieldPoints = true;
            showScalarBackground = true;
            showGridCheckbox.checked = true;
            showFieldPointsCheckbox.checked = true;
            showScalarBackgroundCheckbox.checked = true;
        }
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
        speedMultiplier = 1.0;
        strengthMultiplier = 1.0;
        isAnimating = true;
        debugMode = false;

        thresholdSlider.value = threshold;
        gridSlider.value = gridSize;
        speedSlider.value = speedMultiplier;
        strengthSlider.value = strengthMultiplier;

        thresholdValueLabel.textContent = threshold.toFixed(1);
        gridValueLabel.textContent = gridSize;
        speedValueLabel.textContent = speedMultiplier.toFixed(1);
        strengthValueLabel.textContent = strengthMultiplier.toFixed(1);

        showGrid = true;
        showFieldPoints = true;
        showScalarBackground = true;
        showMetaballs = true;

        showGridCheckbox.checked = true;
        showFieldPointsCheckbox.checked = true;
        showScalarBackgroundCheckbox.checked = true;
        showMetaballsCheckbox.checked = true;
        debugModeCheckbox.checked = false;

        createInitialMetaballs(Number(ballSlider.value));
        initializeField();
    });

    randomizeButton.addEventListener("click", () => {
        createInitialMetaballs(Number(ballSlider.value));
    });

    removeButton.addEventListener("click", () => {
        if (metaballs.length > 1) {
            metaballs.pop();
            ballSlider.value = metaballs.length;
            ballValueLabel.textContent = metaballs.length;
        }
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
        metaballs.push(createRandomMetaball());
    }
}

function createRandomMetaball(x = null, y = null) {
    const radius = random(25, 45);
    const safeX = x ?? random(radius, width - radius);
    const safeY = y ?? random(radius, height - radius);
    const vx = random(-2.2, 2.2);
    const vy = random(-2.2, 2.2);
    const strength = random(9000, 17000);

    return new Metaball(safeX, safeY, vx, vy, strength, radius);
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
        sum += metaball.getStrength() / (distanceSquared + epsilon);
    }

    return sum;
}

function drawScalarBackground() {
    noStroke();

    for (let i = 0; i < cols - 1; i++) {
        for (let j = 0; j < rows - 1; j++) {
            const x = i * gridSize;
            const y = j * gridSize;
            const value = field[i][j];

            const intensity = constrain(map(value, 0, threshold * 2.2, 0, 1), 0, 1);

            const r = lerp(15, 40, intensity);
            const g = lerp(23, 180, intensity);
            const b = lerp(42, 160, intensity);
            const alpha = lerp(20, 170, intensity);

            fill(r, g, b, alpha);
            rect(x, y, gridSize, gridSize);
        }
    }
}

function drawGrid() {
    stroke(51, 65, 85, 120);
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

            const intensity = constrain(map(value, 0, threshold * 1.8, 0, 255), 0, 255);
            fill(intensity, intensity, intensity, 110);
            circle(x, y, 4);
        }
    }
}

function drawIsoLines() {
    stroke(74, 222, 128);
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

function updateStatusPanel() {
    statusAnimation.textContent = isAnimating ? "running" : "stopped";
    statusCells.textContent = `${cols - 1} x ${rows - 1}`;
    statusThreshold.textContent = threshold.toFixed(1);
    statusMetaballs.textContent = metaballs.length;
    statusSpeed.textContent = speedMultiplier.toFixed(1);
    statusStrength.textContent = strengthMultiplier.toFixed(1);
}

function drawSceneLabel() {
    noStroke();
    fill(226, 232, 240);
    textAlign(LEFT, TOP);
    textSize(18);
    text("Etap 7: rozszerzona interakcja i kontrola dynamiki", 20, 20);
}

function mousePressed() {
    if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
        metaballs.push(createRandomMetaball(mouseX, mouseY));
        ballSlider.value = metaballs.length;
        ballValueLabel.textContent = metaballs.length;
    }
}