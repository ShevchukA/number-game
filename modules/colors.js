import { root } from './dom.js';

let currentColorTheme = 0;
let gameBrekpoints = [128, 256, 512, 1024];

const colorTheme = [
  { darkColor: '#28b485', lightColor: '#7ed56f' }, // green
  { darkColor: '#5643fa', lightColor: '#2998ff' }, // blue
  { darkColor: '#ff7730', lightColor: '#ffb900' }, // orange
  { darkColor: '#bf2e34', lightColor: '#753682' }, // pink
  { darkColor: '#007f7f', lightColor: '#00bfbf' }, // Teal-Cyan
  //{ darkColor: '#ffcc00', lightColor: '#ffe680' }, // Yellow-Gold
];

function setColorTheme(color) {
  if (color < colorTheme.length) {
    root.style.setProperty('--color-dark', colorTheme[color].darkColor);
    root.style.setProperty('--color-light', colorTheme[color].lightColor);
  }
}

// change color theme of game when player achives breakpoints
function changeColorTheme(points) {
  if (points === gameBrekpoints[0]) {
    currentColorTheme++;
    setColorTheme(currentColorTheme);
    gameBrekpoints.shift();
    // console.log(gameBrekpoints);
  }
}

function refreshColors() {
  gameBrekpoints = [128, 256, 512, 1024];
  currentColorTheme = 0;
  setColorTheme(currentColorTheme);
}

export { changeColorTheme, refreshColors, gameBrekpoints };
