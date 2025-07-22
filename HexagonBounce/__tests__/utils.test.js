import { rotatePoint, reflect } from '../src/utils.js';

test('rotatePoint rotates around center', () => {
    const p = rotatePoint(1, 0, 0, 0, Math.PI / 2);
    expect(p.x).toBeCloseTo(0);
    expect(p.y).toBeCloseTo(1);
});

test('reflect reflects velocity around normal', () => {
    const v = { x: 1, y: 0 };
    const n = { x: 0, y: 1 };
    const r = reflect(v, n);
    expect(r.x).toBe(1);
    expect(r.y).toBe(0);
});
