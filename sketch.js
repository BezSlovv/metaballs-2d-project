function setup() {
    const canvas = createCanvas(900, 600);
    canvas.parent("canvas-container");
}

function draw() {
    background(15, 23, 42);

    stroke(100, 116, 139);
    strokeWeight(1);

    for (let x = 0; x <= width; x += 30) {
        line(x, 0, x, height);
    }

    for (let y = 0; y <= height; y += 30) {
        line(0, y, width, y);
    }

    noStroke();
    fill(226, 232, 240);
    textAlign(CENTER, CENTER);
    textSize(24);
    text("Metaballs 2D - etap startowy", width / 2, height / 2);
}