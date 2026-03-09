class Metaball {
    constructor(x, y, vx, vy, baseStrength, radius) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.baseStrength = baseStrength;
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

    getEffectiveStrength(strengthMultiplier) {
        return this.baseStrength * this.radius * this.radius * strengthMultiplier;
    }

    draw() {
        noStroke();
        fill(96, 165, 250, 60);
        circle(this.x, this.y, this.radius * 2);
    }
}