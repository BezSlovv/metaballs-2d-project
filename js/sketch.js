let metaballs = [];
let gridSize = APP_CONFIG.defaultGridSize;
let cols = 0;
let rows = 0;
let field = [];
let threshold = APP_CONFIG.defaultThreshold;
let speedMultiplier = APP_CONFIG.defaultSpeedMultiplier;
let strengthMultiplier = APP_CONFIG.defaultStrengthMultiplier;

let isAnimating = true;
let showGrid = false;
let showFieldPoints = false;
let showScalarBackground = true;
let showMetaballs = true;

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

let startButton;
let stopButton;
let resetButton;
let randomizeButton;
let addButton;
let removeButton;

let statusAnimation;
let statusCells;
let statusThreshold;
let statusMetaballs;
let statusSpeed;
let statusStrength;

function setup() {
    const canvas = createCanvas(APP_CONFIG.canvasWidth, APP_CONFIG.canvasHeight);
    canvas.parent("canvas-container");

    setupControls();
    initializeField();
    createInitialMetaballs(APP_CONFIG.defaultBallCount);
    applyDefaultView();
    updateStatusPanel();
}

function draw() {
    background(8, 15, 28);

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

    updateStatusPanel();
}

function createInitialMetaballs(count) {
    metaballs = [];

    for (let i = 0; i < count; i++) {
        metaballs.push(createRandomMetaball());
    }

    syncBallControls();
}

function createRandomMetaball(x = null, y = null) {
    const radius = random(18, 42);
    const safeX = x ?? random(radius, width - radius);
    const safeY = y ?? random(radius, height - radius);
    const vx = random(-2.2, 2.2);
    const vy = random(-2.2, 2.2);
    const baseStrength = random(0.9, 1.5);

    return new Metaball(safeX, safeY, vx, vy, baseStrength, radius);
}

function addMetaball(x = null, y = null) {
    if (metaballs.length >= APP_CONFIG.maxMetaballs) {
        return;
    }

    metaballs.push(createRandomMetaball(x, y));
    syncBallControls();
}

function mousePressed() {
    if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
        addMetaball(mouseX, mouseY);
    }
}