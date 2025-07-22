import { reflect } from './utils.js';

export default class Ball {
    constructor(x, y, vx, vy, radius = 5) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.radius = radius;
    }

    static randomInside(hexagon) {
        const angle = Math.random() * Math.PI * 2;
        const r = hexagon.radius * Math.sqrt(Math.random());
        const x = hexagon.cx + r * Math.cos(angle);
        const y = hexagon.cy + r * Math.sin(angle);
        const speed = 100;
        const vx = (Math.random() * 2 - 1) * speed;
        const vy = (Math.random() * 2 - 1) * speed;
        return new Ball(x, y, vx, vy);
    }

    update(dt, hexagon) {
        this.x += this.vx * dt;
        this.y += this.vy * dt;

        const edges = hexagon.edges();
        for (const [p1, p2] of edges) {
            const edge = { x: p2.x - p1.x, y: p2.y - p1.y };
            const cross = edge.x * (this.y - p1.y) - edge.y * (this.x - p1.x);
            if (cross < 0) {
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

    draw(ctx) {
        ctx.save();
        ctx.fillStyle = '#0ff';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}
