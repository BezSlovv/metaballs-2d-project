function initializeField() {
    cols = floor(width / gridSize) + 1;
    rows = floor(height / gridSize) + 1;
    field = new Array(cols);

    for (let i = 0; i < cols; i++) {
        field[i] = new Array(rows).fill(0);
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

    for (const metaball of metaballs) {
        const dx = x - metaball.x;
        const dy = y - metaball.y;
        const distanceSquared = dx * dx + dy * dy;

        sum += metaball.getEffectiveStrength(strengthMultiplier) / (distanceSquared + APP_CONFIG.epsilon);
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
            const r = lerp(8, 36, intensity);
            const g = lerp(18, 180, intensity);
            const b = lerp(35, 165, intensity);
            const alpha = lerp(18, 175, intensity);

            fill(r, g, b, alpha);
            rect(x, y, gridSize, gridSize);
        }
    }
}

function drawGrid() {
    stroke(71, 85, 105, 110);
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

            fill(intensity, intensity, intensity, 100);
            circle(x, y, 4);
        }
    }
}