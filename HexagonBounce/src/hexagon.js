import { rotatePoint } from './utils.js';

export default class Hexagon {
    constructor(cx, cy, radius, omega = 0) {
        this.cx = cx;
        this.cy = cy;
        this.radius = radius;
        this.angle = 0;
        this.omega = omega;
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
            edges.push([rotated[i], rotated[(i + 1) % 6]]);
        }
        return edges;
    }

    draw(ctx) {
        ctx.save();
        ctx.strokeStyle = '#0f0';
        ctx.lineWidth = 2;
        ctx.beginPath();
        const pts = this.edges().map(e => e[0]);
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < pts.length; i++) {
            ctx.lineTo(pts[i].x, pts[i].y);
        }
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
    }
}
