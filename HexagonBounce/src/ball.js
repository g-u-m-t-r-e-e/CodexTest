import { reflect } from './utils.js';

export default class Ball {
    constructor(x, y, vx, vy, radius = 5) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.radius = radius;
    }

    setSpeed(speed) {
        const angle = Math.atan2(this.vy, this.vx);
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
    }

    setRadius(r) {
        this.radius = r;
    }

    static randomInside(hexagon, speed = 100, radius = 5) {
        const angle = Math.random() * Math.PI * 2;
        const r = hexagon.radius * Math.sqrt(Math.random());
        const x = hexagon.cx + r * Math.cos(angle);
        const y = hexagon.cy + r * Math.sin(angle);
        const vx = (Math.random() * 2 - 1) * speed;
        const vy = (Math.random() * 2 - 1) * speed;
        return new Ball(x, y, vx, vy, radius);
    }

    static atCenter(hexagon, speed = 100, radius = 5) {
        const angle = Math.random() * Math.PI * 2;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;
        return new Ball(hexagon.cx, hexagon.cy, vx, vy, radius);
    }

    reset(x, y, speed) {
        const angle = Math.random() * Math.PI * 2;
        this.x = x;
        this.y = y;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
    }

    update(dt, outerHexagon, innerHexagons = []) {
        this.x += this.vx * dt;
        this.y += this.vy * dt;

        // Check collision with outer hexagon (balls bounce off inner walls)
        this.checkCollision(outerHexagon, innerHexagons[0]);

        // Check collision with inner hexagon if it exists (balls bounce off outer walls)
        for (const hex of innerHexagons) {
            if (hex) {
                this.checkInnerCollision(hex);
            }
        }
    }

    checkCollision(hexagon, innerHexagon) {
        const edges = hexagon.edges();
        for (const { p1, p2, index } of edges) {
            const edge = { x: p2.x - p1.x, y: p2.y - p1.y };
            const cross = edge.x * (this.y - p1.y) - edge.y * (this.x - p1.x);
            if (cross < 0) {
                if (hexagon.highlightSide !== null && index === hexagon.highlightSide) {
                    this.reset(innerHexagon.cx, innerHexagon.cy, Math.hypot(this.vx, this.vy));
                    return;
                }
                const len = Math.hypot(edge.x, edge.y);
                const normal = { x: edge.y / len, y: -edge.x / len };
                const dist = -cross / len;
                this.x += normal.x * dist;
                this.y += normal.y * dist;
                const vel = { x: this.vx, y: this.vy };
                const refl = reflect(vel, normal);
                this.vx = refl.x;
                this.vy = refl.y;
            }
        }
    }

    checkInnerCollision(hexagon) {
        const edges = hexagon.edges();
        for (const [p1, p2] of edges) {
            const edge = { x: p2.x - p1.x, y: p2.y - p1.y };
            const cross = edge.x * (this.y - p1.y) - edge.y * (this.x - p1.x);
            // For inner hexagon, we want to bounce when cross > 0 (inside the inner shape)
            if (cross > 0) {
                const len = Math.hypot(edge.x, edge.y);
                const normal = { x: -edge.y / len, y: edge.x / len }; // Invert normal for inner collision
                const dist = cross / len;
                this.x += normal.x * dist;
                this.y += normal.y * dist;
                const vel = { x: this.vx, y: this.vy };
                const refl = reflect(vel, normal);
                this.vx = refl.x;
                this.vy = refl.y;
            }
        }
    }

    draw(ctx) {
        ctx.save();
        const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
        grad.addColorStop(0, '#fff');
        grad.addColorStop(1, '#0cf');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}
