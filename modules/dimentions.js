import { board } from './dom.js';

const ballSize = 50;
const cell = 50;
const gap = 20;
const colN = 5;
const rowN = 7;
let boardX, boardY, boardW, boardH;

function getLeftFromCol(col) {
  return gap + col * cell + col * gap;
}

function getTopFromRow(row) {
  return gap + (rowN - row - 1) * cell + (rowN - row - 1) * gap;
}

function setBoardSizes() {
  // set gamefield sizes;
  board.style.height = `${rowN * cell + (rowN + 1) * gap}px`;
  board.style.width = `${colN * cell + (colN + 1) * gap}px`;

  boardX = board.getBoundingClientRect().left;
  boardY = board.getBoundingClientRect().top;
  boardW = board.clientWidth;
  boardH = board.clientHeight;
}

export {
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
};
