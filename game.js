// import DOM objects
import {
  startScreen,
  mainScreen,
  gameOverScreen,
  scoreField,
  highScoreField,
  startHighScore,
  board,
  startBtn,
  restartBtn,
  gameOverMessage,
  ui,
} from './dom.js';

import { playSound, mergeSound, mergeBigSound } from './sounds.js';

// import dimentions for game objects
import {
  ballSize,
  cell,
  gap,
  colN,
  rowN,
  boardX,
  boardY,
  boardH,
  boardW,
  setBoardSizes,
  getLeftFromCol,
  getTopFromRow,
} from './dimentions.js';

// import color control functions
import { changeColorTheme, refreshColors, gameBrekpoints } from './colors.js';

// import ball constructor
import Ball from './ball.js';

// import delta value for smooth animation independent from fps
import { delta, setDelta } from './animation.js';
// let delta = 1; //for debagging

// call setDelta every requestAnimationFrame
requestAnimationFrame(setDelta);

const key = 'highscore';

let grid = [[], [], [], [], []];

let canGrabBall = true;
let score = 0;
let highscore = localStorage.getItem(key) ?? 0;
// reset highscore
// localStorage.setItem(key, 0);

// show highscore on the start screen if it more then 0
if (highscore > 0) {
  startHighScore.innerText = `best score: ${highscore}`;
  startHighScore.classList.remove('hidden');
}

// start game
startBtn.addEventListener('click', init);

function init() {
  startScreen.classList.add('hidden');
  mainScreen.classList.remove('hidden');
  // set gamefield sizes;
  setBoardSizes();
  // start game
  start();
}

function start() {
  // remove html elements from DOM
  board.innerHTML = '';

  //set default values
  grid = [[], [], [], [], []];
  canGrabBall = true;
  score = 0;
  highscore = localStorage.getItem(key) ?? 0;
  highScoreField.innerText = `highscore: ${highscore}`;
  // hide gameover screen
  gameOverScreen.classList.add('hidden');
  gameOverMessage.classList.remove('game-over-anim');
  // start new game
  refreshColors();
  updateScore(score);
  updateHighscore();
  addNewBalls();
  liftBalls();
}

function addNewBalls() {
  for (let i = 0; i < colN; i++) {
    const ball = new Ball();
    ball.setPos(i, -1);
    grid[i].unshift(ball);
  }
}

async function liftBalls() {
  return new Promise(resolve => {
    let ballsMoving = 0;
    for (let col = 0; col < colN; col++) {
      for (let row = 0; row < grid[col].length; row++) {
        let ball = grid[col][row];
        //increase counter when start moving current ball
        ballsMoving++;
        //as new row has index -1 and for loop starts from 0 -> final row index is already has +1
        moveBall(ball, col, row, () => {
          ball.setPos(col, row);
          //decrease counter when ball ends moving
          ballsMoving--;
          //resolve when all balls finished moving
          if (ballsMoving === 0) {
            resolve();
          }
        });
      }
    }
  });
}

function moveBall(ball, col, row, onAnimationFinished) {
  const left = getLeftFromCol(col);
  const top = getTopFromRow(row);
  const repeat = function () {
    requestAnimationFrame(() => moveBall(ball, col, row, onAnimationFinished));
  };

  if (ball.getLeft() != left || ball.getTop() != top) {
    //do animation
    canGrabBall = false;

    let deltaTop;
    let deltaLeft;

    if (ball.getTop() < top) {
      // move down
      deltaTop = ball.getTop() + delta > top ? top : ball.getTop() + delta;
    } else {
      // move up
      deltaTop = ball.getTop() - delta < top ? top : ball.getTop() - delta;
    }

    if (ball.getLeft() < left) {
      //move right
      deltaLeft = ball.getLeft() + delta > left ? left : ball.getLeft() + delta;
    } else {
      // move left
      deltaLeft = ball.getLeft() - delta < left ? left : ball.getLeft() - delta;
    }

    // move ball on delta distance
    ball.setLeftTop(deltaLeft, deltaTop);
    // repeat untill ball will get the target
    repeat();
  } else {
    canGrabBall = true;
    // call next actions after animation
    onAnimationFinished();
  }
}

function updateScore(score) {
  scoreField.innerText = `score:  ${score}`;
}

function updateHighscore() {
  if (score > highscore) {
    localStorage.setItem(key, score);
    highscore = localStorage.getItem(key) ?? score;
    highScoreField.innerText = `highscore: ${highscore}`;
  }
}

// Prevent browser default drag'n'drop behaviour
// board.ondragstart = function () {}
board.addEventListener('dragstart', e => e.preventDefault());

//board.onpointerdown = function (e) {}
board.addEventListener('pointerdown', onPointerDown);

function onPointerDown(e) {
  // define cell under the pointer
  let { pointerX, pointerY, col, row } = defineCoordinates(e);
  // console.log(col, row);
  if (
    pointerX !== undefined ||
    pointerY !== undefined ||
    col !== undefined ||
    row !== undefined
  ) {
    // if top cell in column contain the ball then can move ball
    if (grid[col][row] && row === grid[col].length - 1) {
      let ball = grid[col][row];
      // check if pointer down exactly on the ball than grab the ball
      if (pointerX > ball.getX() && pointerY > ball.getY() && canGrabBall) {
        grabBall(ball, pointerX, pointerY);
        showAims(col);
      }
    }
  }
}

function grabBall(ball, pointerX, pointerY) {
  // add some shadow to the grabbed ball
  ball.html.classList.add('ball-grabbed');

  // define shift between pointer and ball coordinates
  let shiftX = ball.getX() - pointerX;
  let shiftY = ball.getY() - pointerY;
  // console.log(ball);

  board.addEventListener('pointermove', onPointerMoveBall);
  function onPointerMoveBall(e) {
    let { pointerX, pointerY } = defineCoordinates(e);
    // set relative to the board coordinates
    let left = pointerX - boardX + shiftX;
    let top = pointerY - boardY + shiftY;
    ball.setLeftTop(left, top);
    checkBoundaries(ball);
  }

  function checkBoundaries(ball) {
    if (
      ball.getX() < boardX ||
      ball.getY() < boardY ||
      ball.getX() + ballSize > boardX + boardW ||
      ball.getY() + ballSize > boardY + boardH
    ) {
      // remove event handlers
      board.removeEventListener('pointermove', onPointerMoveBall);
      board.removeEventListener('pointerup', onPointerUp);
      //board.onpointerup = null;
      // hide all aims
      hideAims();
      // return to previous position
      ball.setPos(ball.col, ball.row);
      ball.html.classList.remove('ball-grabbed');
    }
  }

  //board.onpointerup = function (e) {}
  board.addEventListener('pointerup', onPointerUp);
  function onPointerUp(e) {
    board.removeEventListener('pointermove', onPointerMoveBall);
    hideAims();
    ball.html.classList.remove('ball-grabbed');
    dropBall(ball, e);
    board.removeEventListener('pointerup', onPointerUp);
  }
}

function dropBall(ball, e) {
  // define cell under the pointer
  let { col, row } = defineCoordinates(e);

  // if gamer places selected ball in another column above top ball
  if (ball.col != col && row >= grid[col].length) {
    // animate drop movement
    moveBall(ball, col, grid[col].length, onDropFinish);

    // callback events after animation
    function onDropFinish() {
      // delete ball from previous column
      grid[ball.col].pop(ball);
      // set new position of the ball
      ball.setPos(col, grid[col].length);
      // add to selected column
      grid[col].push(ball);
      // check match between 2 last balls in column after gamer turn
      canGrabBall = false;
      if (!checkMatch(grid[col])) {
        if (!checkGameOver()) {
          setTimeout(async () => {
            addNewBalls();
            await liftBalls();
            // check fo matches in all columns
            let matches = [];
            grid.forEach(col => matches.push(checkMatch(col)));
            //if there are no matches after adding new row than can play next
            if (!matches.includes(true)) canGrabBall = true;
            checkCanPlay();
          }, 600); //600ms delay
        }
      }
    }
  } else {
    // return to previous position
    moveBall(ball, ball.col, ball.row, () => {
      ball.setPos(ball.col, ball.row);
    });
  }
}

function defineCoordinates(e) {
  let pointerX = e.clientX;
  let pointerY = e.clientY;
  let col = Math.trunc((pointerX - boardX) / (gap + cell));
  let row = Math.trunc(rowN - (pointerY - boardY) / (gap + cell));
  return { pointerX, pointerY, col, row };
}

function checkMatch(col) {
  // if column has more than 1 ball and last 2 balls have same points than match
  if (col.length > 1 && col.at(-1).points === col.at(-2).points) {
    // console.log('match!');
    let achievedPoints = col.at(-1).points * 2;
    score += achievedPoints;
    updateScore(score);

    // merge balls after small delay
    setTimeout(() => mergeBalls(col, achievedPoints), 150); //150ms delay

    return true;
  } else {
    return false;
  }
}

function mergeBalls(col, achievedPoints) {
  let ball = col.pop();
  //move ball down to merge with next ball
  moveBall(ball, ball.col, ball.row - 1, () => {
    if (achievedPoints === gameBrekpoints[0]) {
      playSound(mergeBigSound);
    } else {
      playSound(mergeSound);
    }
    // merge two balls
    col.at(-1).updatePoints(achievedPoints);
    ball.html.classList.add('ball-merged');
    // remove merged balls from DOM
    setTimeout(() => {
      document.querySelectorAll('.ball-merged').forEach(ball => ball.remove());
    }, 300);
    // change color theme if necessary
    changeColorTheme(achievedPoints);
    // check match again
    checkMatch(col);
  });
}

function addAim(col, row) {
  const aim = document.createElement('div');
  aim.classList.add('aim');
  aim.style.width = `${ballSize}px`;
  aim.style.height = `${ballSize}px`;
  aim.style.left = `${getLeftFromCol(col)}px`;
  aim.style.top = `${getTopFromRow(row)}px`;
  board.appendChild(aim);
}

function showAims(exept) {
  // for each column show possible aim for user except current column
  for (let col = 0; col < grid.length; col++) {
    let row = grid[col].length;
    if (col != exept && row < rowN) {
      addAim(col, row);
    }
  }
}

function hideAims() {
  // remove all aims from the board
  const aims = document.querySelectorAll('.aim');
  aims.forEach(aim => aim.remove());
}

function checkGameOver() {
  // if one of columns is full than gameover
  if (grid.find(col => col.length === rowN)) {
    gameOver();
    return true;
  } else {
    return false;
  }
}

function checkCanPlay() {
  // if there are no columns with empty cells then game over
  if (!grid.find(col => col.length < rowN)) gameOver();
}

function gameOver() {
  updateHighscore();
  // show gameOverScreen
  gameOverScreen.classList.remove('hidden');
  gameOverMessage.classList.add('game-over-anim');
  ui.style.zIndex = 3;
  restartBtn.onclick = function () {
    start();
  };
}
