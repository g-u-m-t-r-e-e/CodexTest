import Hexagon from './hexagon.js';
import Ball from './ball.js';
import { clamp } from './utils.js';

export const canvas = document.getElementById('canvas');
export const ctx = canvas.getContext('2d');

let last = 0;
let fps = 0;
let fpsInterval = 0;
let outerHexagon;
let innerHexagon;
const balls = [];
const NUM_BALLS = 10;
const ROTATION_SPEED = Math.PI / 8; // rad/sec

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function init() {
    resize();
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const outerRadius = Math.min(canvas.width, canvas.height) / 4;
    const innerRadius = outerRadius * 0.6; // Inner hexagon is 60% the size
    
    // Create outer hexagon (complete)
    outerHexagon = new Hexagon(centerX, centerY, outerRadius, ROTATION_SPEED);
    
    // Create inner hexagon with missing side (side 0 is missing for the gap)
    innerHexagon = new Hexagon(centerX, centerY, innerRadius, -ROTATION_SPEED, 0);
    
    for (let i = 0; i < NUM_BALLS; i++) {
        balls.push(Ball.randomInside(outerHexagon));
    }
    
    window.addEventListener('resize', () => {
        resize();
        const newOuterRadius = Math.min(canvas.width, canvas.height) / 4;
        const newInnerRadius = newOuterRadius * 0.6;
        const newCenterX = canvas.width / 2;
        const newCenterY = canvas.height / 2;
        
        outerHexagon.setRadius(newOuterRadius);
        outerHexagon.setCenter(newCenterX, newCenterY);
        innerHexagon.setRadius(newInnerRadius);
        innerHexagon.setCenter(newCenterX, newCenterY);
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
    outerHexagon.update(dt);
    innerHexagon.update(dt);
    for (const b of balls) {
        b.update(dt, outerHexagon, innerHexagon);
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    outerHexagon.draw(ctx); // Green outer hexagon
    innerHexagon.draw(ctx, '#ff0'); // Yellow inner hexagon
    
    for (const b of balls) {
        b.draw(ctx);
    }
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'right';
    ctx.fillText(`${fps} FPS`, canvas.width - 10, 20);
}

init();
