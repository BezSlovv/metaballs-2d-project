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

            const centerValue = (aValue + bValue + cValue + dValue) / 4;

            drawMarchingSquaresCase(state, top, right, bottom, left, centerValue);
        }
    }
}

function interpolatePoint(p1, p2, value1, value2) {
    const denominator = value2 - value1;

    if (abs(denominator) < 0.000001) {
        return createVector((p1.x + p2.x) * 0.5, (p1.y + p2.y) * 0.5);
    }

    const t = constrain((threshold - value1) / denominator, 0, 1);

    return createVector(
        lerp(p1.x, p2.x, t),
        lerp(p1.y, p2.y, t)
    );
}

function drawMarchingSquaresCase(state, top, right, bottom, left, centerValue) {
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
            if (centerValue >= threshold) {
                drawSegment(top, right);
                drawSegment(left, bottom);
            } else {
                drawSegment(top, left);
                drawSegment(bottom, right);
            }
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
            if (centerValue >= threshold) {
                drawSegment(top, left);
                drawSegment(bottom, right);
            } else {
                drawSegment(top, right);
                drawSegment(left, bottom);
            }
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