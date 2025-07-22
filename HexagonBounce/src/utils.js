export function rotatePoint(px, py, cx, cy, angle) {
    const s = Math.sin(angle);
    const c = Math.cos(angle);
    const x = px - cx;
    const y = py - cy;
    return {
        x: x * c - y * s + cx,
        y: x * s + y * c + cy
    };
}

export function reflect(velocity, normal) {
    const dot = velocity.x * normal.x + velocity.y * normal.y;
    return {
        x: velocity.x - 2 * dot * normal.x,
        y: velocity.y - 2 * dot * normal.y
    };
}

export function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}
