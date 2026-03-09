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

let canvasInstance;

function setup() {
    pixelDensity(1);

    canvasInstance = createCanvas(APP_CONFIG.canvasWidth, APP_CONFIG.canvasHeight);
    canvasInstance.parent("canvas-container");

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

function mousePressed(event) {
    const pointerX = event?.clientX;
    const pointerY = event?.clientY;

    if (typeof pointerX !== "number" || typeof pointerY !== "number") {
        return;
    }

    addMetaballFromClientPosition(pointerX, pointerY);
}

function touchStarted(event) {
    const touch = event?.changedTouches?.[0] ?? event?.touches?.[0];

    if (!touch) {
        return false;
    }

    addMetaballFromClientPosition(touch.clientX, touch.clientY);
    return false;
}

function addMetaballFromClientPosition(clientX, clientY) {
    if (!canvasInstance) {
        return;
    }

    const rect = canvasInstance.elt.getBoundingClientRect();

    if (
        clientX < rect.left ||
        clientX > rect.right ||
        clientY < rect.top ||
        clientY > rect.bottom
    ) {
        return;
    }

    const localX = map(clientX, rect.left, rect.right, 0, width);
    const localY = map(clientY, rect.top, rect.bottom, 0, height);

    addMetaball(localX, localY);
}