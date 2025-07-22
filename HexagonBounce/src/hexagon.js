import { rotatePoint } from './utils.js';

export default class Hexagon {
    constructor(cx, cy, radius, omega = 0, missingSide = null) {
        this.cx = cx;
        this.cy = cy;
        this.radius = radius;
        this.angle = 0;
        this.omega = omega;
        this.missingSide = missingSide; // null or 0-5 to indicate which side to omit
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
            // Skip the missing side if specified
            if (this.missingSide !== null && i === this.missingSide) {
                continue;
            }
            edges.push([rotated[i], rotated[(i + 1) % 6]]);
        }
        return edges;
    }

    draw(ctx, strokeStyle = '#0f0') {
        ctx.save();
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        const edges = this.edges();
        if (edges.length > 0) {
            // Start from the first edge's first point
            ctx.moveTo(edges[0][0].x, edges[0][0].y);
            
            // Draw each edge
            for (const [p1, p2] of edges) {
                ctx.lineTo(p2.x, p2.y);
            }
            
            // Only close the path if no side is missing
            if (this.missingSide === null) {
                ctx.closePath();
            }
        }
        
        ctx.stroke();
        ctx.restore();
    }
}
