import Hexagon from './hexagon.js';
import Ball from './ball.js';
// no utils needed here

// UI elements
const controls = {
    balls: document.getElementById('balls'),
    outerSpeed: document.getElementById('outerSpeed'),
    innerSpeed: document.getElementById('innerSpeed'),
    outerScale: document.getElementById('outerScale'),
    innerRatio: document.getElementById('innerRatio'),
    ballSpeed: document.getElementById('ballSpeed'),
    ballRadius: document.getElementById('ballRadius'),
    ballsValue: document.getElementById('ballsValue'),
    outerSpeedValue: document.getElementById('outerSpeedValue'),
    innerSpeedValue: document.getElementById('innerSpeedValue'),
    outerScaleValue: document.getElementById('outerScaleValue'),
    innerRatioValue: document.getElementById('innerRatioValue'),
    ballSpeedValue: document.getElementById('ballSpeedValue'),
    ballRadiusValue: document.getElementById('ballRadiusValue')
};

export const canvas = document.getElementById('canvas');
export const ctx = canvas.getContext('2d');

let last = 0;
let fps = 0;
let fpsInterval = 0;
let outerHexagon;
let innerHexagon;
const balls = [];

// Simulation parameters (initial values from controls)
let numBalls = parseInt(controls.balls.value, 10);
let outerSpeed = parseFloat(controls.outerSpeed.value);
let innerSpeed = parseFloat(controls.innerSpeed.value);
let outerScale = parseFloat(controls.outerScale.value);
let innerRatio = parseFloat(controls.innerRatio.value);
let ballSpeed = parseFloat(controls.ballSpeed.value);
let ballRadius = parseFloat(controls.ballRadius.value);

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function updateControlValues() {
    controls.ballsValue.textContent = numBalls;
    controls.outerSpeedValue.textContent = outerSpeed.toFixed(2);
    controls.innerSpeedValue.textContent = innerSpeed.toFixed(2);
    controls.outerScaleValue.textContent = outerScale.toFixed(2);
    controls.innerRatioValue.textContent = innerRatio.toFixed(2);
    controls.ballSpeedValue.textContent = ballSpeed.toFixed(0);
    controls.ballRadiusValue.textContent = ballRadius.toFixed(1);
}

function createHexagons() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const outerRadius = Math.min(canvas.width, canvas.height) * outerScale / 2;
    const innerRadius = outerRadius * innerRatio;

    outerHexagon = new Hexagon(centerX, centerY, outerRadius, outerSpeed);
    innerHexagon = new Hexagon(centerX, centerY, innerRadius, innerSpeed, 0);
}

function createBalls() {
    balls.length = 0;
    for (let i = 0; i < numBalls; i++) {
        balls.push(Ball.randomInside(outerHexagon, ballSpeed, ballRadius));
    }
}

function setupControlEvents() {
    const upd = () => {
        numBalls = parseInt(controls.balls.value, 10);
        outerSpeed = parseFloat(controls.outerSpeed.value);
        innerSpeed = parseFloat(controls.innerSpeed.value);
        outerScale = parseFloat(controls.outerScale.value);
        innerRatio = parseFloat(controls.innerRatio.value);
        ballSpeed = parseFloat(controls.ballSpeed.value);
        ballRadius = parseFloat(controls.ballRadius.value);

        outerHexagon.omega = outerSpeed;
        innerHexagon.omega = innerSpeed;
        outerHexagon.setRadius(Math.min(canvas.width, canvas.height) * outerScale / 2);
        innerHexagon.setRadius(outerHexagon.radius * innerRatio);

        for (const b of balls) {
            b.setSpeed(ballSpeed);
            b.setRadius(ballRadius);
        }

        if (balls.length !== numBalls) {
            createBalls();
        }

        updateControlValues();
    };

    Object.values(controls).forEach(el => {
        if (el instanceof HTMLInputElement && el.type === 'range') {
            el.addEventListener('input', upd);
        }
    });
}

function init() {
    resize();
    createHexagons();
    createBalls();
    updateControlValues();

    window.addEventListener('resize', () => {
        resize();
        createHexagons();
    });

    setupControlEvents();
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
