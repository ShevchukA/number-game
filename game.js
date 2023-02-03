const balls = document.querySelectorAll(".ball");
const grid = document.querySelector(".grid");
const scoreField = document.querySelector(".score");

let gridWidth = grid.clientWidth;
let cell = gridWidth / 6;

for (let i = 0; i < balls.length; i++) {
  balls[i].style.bottom = `${cell}px`;
  balls[i].style.left = `${(i + 1) * cell}px`;
  balls[i].style.transform = "translate(-50%, 50%)";
}

let gridX = grid.getBoundingClientRect().left;
let gridY = grid.getBoundingClientRect().bottom;
let shiftX = 0;
let shiftY = 0;
let mouseX = 0;
let mouseY = 0;

// ?????????????
balls[0].ondragstart = function () {
  return false;
};

// balls[0].onpointerdown = function(){}
balls[0].addEventListener("pointerdown", function (e) {
  shiftX = this.getBoundingClientRect().left + this.clientWidth / 2 - e.clientX;
  shiftY =
    this.getBoundingClientRect().bottom - this.clientHeight / 2 - e.clientY;
  console.log(shiftX, shiftY);

  grid.addEventListener("pointermove", moveBall);

  function moveBall(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;

    //console.log(this, mouseX, gridX, shiftX);
    balls[0].style.left = `${mouseX - gridX + shiftX}px`;
    balls[0].style.bottom = `${gridY - mouseY - shiftY}px`;
    balls[0].style.zIndex = "1";
  }

  balls[0].addEventListener("pointerup", function () {
    grid.removeEventListener("pointermove", moveBall);
    balls[0].style.zIndex = "0";
    // какой эквивалетн в случае eventListener?
    balls[0].onpointerup = null;
  });
});

function Ball(ball, posX, posY, points) {
  this.ball = ball;
  this.points = points;
  this.rowPos = posX;
  this.colPox = posY;
}
