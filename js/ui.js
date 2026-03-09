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

    startButton = document.getElementById("start-button");
    stopButton = document.getElementById("stop-button");
    resetButton = document.getElementById("reset-button");
    randomizeButton = document.getElementById("randomize-button");
    addButton = document.getElementById("add-button");
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
        gridValueLabel.textContent = String(gridSize);
        initializeField();
    });

    ballSlider.addEventListener("input", () => {
        createInitialMetaballs(Number(ballSlider.value));
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

    startButton.addEventListener("click", () => {
        isAnimating = true;
    });

    stopButton.addEventListener("click", () => {
        isAnimating = false;
    });

    resetButton.addEventListener("click", resetApplicationState);

    randomizeButton.addEventListener("click", () => {
        createInitialMetaballs(Number(ballSlider.value));
    });

    addButton.addEventListener("click", () => {
        addMetaball();
    });

    removeButton.addEventListener("click", () => {
        if (metaballs.length > 1) {
            metaballs.pop();
            syncBallControls();
        }
    });
}

function resetApplicationState() {
    threshold = APP_CONFIG.defaultThreshold;
    gridSize = APP_CONFIG.defaultGridSize;
    speedMultiplier = APP_CONFIG.defaultSpeedMultiplier;
    strengthMultiplier = APP_CONFIG.defaultStrengthMultiplier;
    isAnimating = true;

    thresholdSlider.value = threshold;
    gridSlider.value = gridSize;
    speedSlider.value = speedMultiplier;
    strengthSlider.value = strengthMultiplier;
    ballSlider.value = APP_CONFIG.defaultBallCount;

    thresholdValueLabel.textContent = threshold.toFixed(1);
    gridValueLabel.textContent = String(gridSize);
    speedValueLabel.textContent = speedMultiplier.toFixed(1);
    strengthValueLabel.textContent = strengthMultiplier.toFixed(1);

    createInitialMetaballs(APP_CONFIG.defaultBallCount);
    initializeField();

    applyDefaultView();
    updateResponsiveCanvasSize();
}

function applyDefaultView() {
    showGrid = false;
    showFieldPoints = false;
    showScalarBackground = true;
    showMetaballs = true;

    showGridCheckbox.checked = false;
    showFieldPointsCheckbox.checked = false;
    showScalarBackgroundCheckbox.checked = true;
    showMetaballsCheckbox.checked = true;
}

function syncBallControls() {
    ballSlider.value = metaballs.length;
    ballValueLabel.textContent = String(metaballs.length);
}

function updateStatusPanel() {
    statusAnimation.textContent = isAnimating ? "running" : "stopped";
    statusCells.textContent = `${cols - 1} x ${rows - 1}`;
    statusThreshold.textContent = threshold.toFixed(1);
    statusMetaballs.textContent = String(metaballs.length);
    statusSpeed.textContent = speedMultiplier.toFixed(1);
    statusStrength.textContent = strengthMultiplier.toFixed(1);

    ballValueLabel.textContent = String(metaballs.length);
}