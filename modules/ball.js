import { ballSize, getLeftFromCol, getTopFromRow } from './dimensions.js';

import { board } from './dom.js';

function Ball() {
  // coordinates at board grid
  this.col = 0;
  this.row = 0;
  this.points = getRandomPoints();
  this.html = createHtmlElement(this.points);

  // get absolute screen coordinates
  this.getX = function () {
    return this.html.getBoundingClientRect().left;
  };

  this.getY = function () {
    return this.html.getBoundingClientRect().top;
  };

  // get relative to the board coordinates
  this.getLeft = function () {
    return Number(this.html.style.left.replace('px', ''));
  };

  this.getTop = function () {
    return Number(this.html.style.top.replace('px', ''));
  };

  // get and set new points
  this.updatePoints = function (newPoints) {
    this.points = newPoints;
    this.html.innerText = newPoints;
  };

  // set position in the board grid
  this.setPos = function (col, row) {
    this.col = col;
    this.row = row;
    // set coordinates relative to the board
    let left = getLeftFromCol(col);
    let top = getTopFromRow(row);
    this.setLeftTop(left, top);
  };

  // set coordinates relative to the board
  this.setLeftTop = function (left, top) {
    this.html.style.left = `${left}px`;
    this.html.style.top = `${top}px`;
  };

  function createHtmlElement(points) {
    const ball = document.createElement('div');
    ball.innerText = points;
    ball.classList.add('ball');
    ball.style.width = `${ballSize}px`;
    ball.style.height = `${ballSize}px`;
    board.appendChild(ball);
    return ball;
  }

  function getRandomPoints() {
    const points = [2, 4, 8];
    let randomNum = Math.trunc(Math.random() * 3);
    return points[randomNum];
  }
}

export default Ball;
