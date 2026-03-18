let gameseq = [];
let userseq = [];

let btnColors = ["yellow", "red", "purple", "green"];

let started = false;
let level = 0;

let h2 = document.querySelector("h2");
let startBtn = document.querySelector("#start-btn");

startBtn.addEventListener("click", function () {
  if (!started) {
    started = true;
    levelUp();
  }
});

function gameFlash(btn) {
  btn.classList.add("flash");
  setTimeout(() => {
    btn.classList.remove("flash");
  }, 250);
}

function userFlash(btn) {
  btn.classList.add("userflash");
  setTimeout(() => {
    btn.classList.remove("userflash");
  }, 250);
}

function levelUp() {
  userseq = [];
  level++;
  h2.innerText = `Level ${level}`;

  let randIdx = Math.floor(Math.random() * btnColors.length);
  let randColor = btnColors[randIdx];
  let randBtn = document.querySelector(`#${randColor}`);

  gameseq.push(randColor);
  gameFlash(randBtn);

  console.log("GameSeq:", gameseq);
}

function checkAns(idx) {
  if (userseq[idx] === gameseq[idx]) {
    if (userseq.length === gameseq.length) {
      setTimeout(levelUp, 1000);
    }
  } else {
    gameOver();
  }
}

function btnPress() {
  if (!started) return;

  let btn = this;
  userFlash(btn);

  let userColor = btn.getAttribute("id");
  userseq.push(userColor);

  console.log("UserSeq:", userseq);

  checkAns(userseq.length - 1);
}

let allBtns = document.querySelectorAll(".btn");
for (let btn of allBtns) {
  btn.addEventListener("click", btnPress);
}

function gameOver() {
  h2.innerHTML = `Game Over! Your score: <b>${level}</b><br><br>Click Start to play again`;

  document.body.style.backgroundColor = "red";

  setTimeout(() => {
    document.body.style.backgroundColor = "black";
  }, 200);

  reset();
}

function reset() {
  gameseq = [];
  userseq = [];
  level = 0;
  started = false;
}

//for the alert
const alert = document.querySelector(".success");
if (alert) {
  window.history.replaceState(null, "", "/home");
  setTimeout(() => {
    alert.remove();
  }, 5000);
}
