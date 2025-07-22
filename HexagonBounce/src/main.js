import Hexagon from './hexagon.js';
import Ball from './ball.js';
import { clamp } from './utils.js';

export const canvas = document.getElementById('canvas');
export const ctx = canvas.getContext('2d');

let last = 0;
let fps = 0;
let fpsInterval = 0;
let hexagon;
const balls = [];
const NUM_BALLS = 10;
const ROTATION_SPEED = Math.PI / 8; // rad/sec

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function init() {
    resize();
    hexagon = new Hexagon(canvas.width / 2, canvas.height / 2, Math.min(canvas.width, canvas.height) / 4, ROTATION_SPEED);
    for (let i = 0; i < NUM_BALLS; i++) {
        balls.push(Ball.randomInside(hexagon));
    }
    window.addEventListener('resize', () => {
        resize();
        hexagon.setRadius(Math.min(canvas.width, canvas.height) / 4);
        hexagon.setCenter(canvas.width / 2, canvas.height / 2);
    });
    requestAnimationFrame(loop);
}

function loop(timestamp) {
    const dt = (timestamp - last) / 1000;
    last = timestamp;

    fpsInterval += dt;
    if (fpsInterval >= 1) {
        fps = Math.round(1 / dt);
        fpsInterval = 0;
    }

    update(dt);
    draw();
    requestAnimationFrame(loop);
}

function update(dt) {
    hexagon.update(dt);
    for (const b of balls) {
        b.update(dt, hexagon);
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    hexagon.draw(ctx);
    for (const b of balls) {
        b.draw(ctx);
    }
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'right';
    ctx.fillText(`${fps} FPS`, canvas.width - 10, 20);
}

init();
