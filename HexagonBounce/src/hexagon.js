import { rotatePoint } from './utils.js';

export default class Hexagon {
    constructor(cx, cy, radius, omega = 0, missingSide = null, highlightSide = null) {
        this.cx = cx;
        this.cy = cy;
        this.radius = radius;
        this.angle = 0;
        this.omega = omega;
        this.missingSide = missingSide; // null or 0-5 to indicate which side to omit
        this.highlightSide = highlightSide; // null or 0-5 to indicate side drawn differently
        this.points = this.calculatePoints();
    }

    setRadius(r) {
        this.radius = r;
        this.points = this.calculatePoints();
    }

    setCenter(x, y) {
        this.cx = x;
        this.cy = y;
    }

    calculatePoints() {
        const pts = [];
        for (let i = 0; i < 6; i++) {
            const a = Math.PI / 3 * i;
            pts.push({ x: this.cx + this.radius * Math.cos(a), y: this.cy + this.radius * Math.sin(a) });
        }
        return pts;
    }

    update(dt) {
        this.angle += this.omega * dt;
    }

    edges() {
        const rotated = [];
        for (let i = 0; i < 6; i++) {
            const angle = this.angle + Math.PI / 3 * i;
            rotated.push({ x: this.cx + this.radius * Math.cos(angle), y: this.cy + this.radius * Math.sin(angle) });
        }
        const edges = [];
        for (let i = 0; i < 6; i++) {
            if (this.missingSide !== null && i === this.missingSide) {
                continue;
            }
            edges.push({ p1: rotated[i], p2: rotated[(i + 1) % 6], index: i });
        }
        return edges;
    }

    draw(ctx, strokeStyle = '#0f0') {
        ctx.save();
        ctx.lineWidth = 2;
        const edges = this.edges();
        for (const { p1, p2, index } of edges) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = (this.highlightSide !== null && index === this.highlightSide) ? '#f00' : strokeStyle;
            ctx.stroke();
        }
        ctx.restore();
    }
}
