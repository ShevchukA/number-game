// set animation speed independent from screen fps;
let delta = 0;
let fps = 0;
let accumulator = [];
let lastTime = 0;
const animationSpeed = 600; // 60fps * 10px

function setDelta() {
  let currentTime = performance.now();
  let deltaTime = (currentTime - lastTime) / 1000; // delta time in seconds
  lastTime = currentTime;
  fps = 1 / deltaTime;
  accumulator.push(fps);
  // define average fps of 10 last values
  if (accumulator.length > 10) accumulator.shift();
  let averageFPS =
    accumulator.reduce((sum, fps) => (sum += fps), 0) / accumulator.length;

  delta = animationSpeed / averageFPS;
  // console.log(delta);
  requestAnimationFrame(setDelta);
}

export { delta, setDelta };
