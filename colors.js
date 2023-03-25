import { root } from './dom.js';

let currentColorTheme = 0;
let colorBrekpoints = [128, 256, 512, 1024];

const colorTheme = [
  { darkColor: '#28b485', lightColor: '#7ed56f' }, // green
  { darkColor: '#5643fa', lightColor: '#2998ff' }, // blue
  { darkColor: '#ff7730', lightColor: '#ffb900' }, // orange
  { darkColor: '#bf2e34', lightColor: '#753682' }, // pink
];

function setColorTheme(color) {
  root.style.setProperty('--color-dark', colorTheme[color].darkColor);
  root.style.setProperty('--color-light', colorTheme[color].lightColor);
}

// change color theme of game when player achives breakpoints
function changeColorTheme(points) {
  if (points === colorBrekpoints[0]) {
    currentColorTheme++;
    setColorTheme(currentColorTheme);
    colorBrekpoints.shift();
    // console.log(colorBrekpoints);
  }
}

function refreshColors() {
  colorBrekpoints = [128, 256, 512, 1024];
  currentColorTheme = 0;
  setColorTheme(currentColorTheme);
}

export { changeColorTheme, refreshColors };
