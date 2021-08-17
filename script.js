// Element Selectors
const startBtn = document.querySelector('.game-control__start');
const audioTracks = document.querySelectorAll('audio');
const audioMap = {
  ArrowUp: document.querySelector('[data-track="twinke-echo"]'),
  ArrowLeft: document.querySelector('[data-track="electric-guitar"]'),
  ArrowDown: document.querySelector('[data-track="computer-sound"]'),
  ArrowRight: document.querySelector('[data-track="telephone"]'),
}
const keyMap = {
  ArrowUp: document.querySelector('.game-window__btn.--up'),
  ArrowLeft: document.querySelector('.game-window__btn.--left'),
  ArrowDown: document.querySelector('.game-window__btn.--down'),
  ArrowRight: document.querySelector('.game-window__btn.--right'),
};
const soundEffects = {
  applause: document.querySelector('[data-track="applause"]'),
  tryAgain: document.querySelector('[data-track="try-again"]'),
  gameOver: document.querySelector('[data-track="game-over')
}
const motivation = {
  nice: document.querySelector('[data-track="nice"]'),
  wayToGo: document.querySelector('[data-track="way-to-go"]'),
  allRight: document.querySelector('[data-track="all-right"]')
}
const audioBackground = document.querySelector('.audio-background');
const keyPressNotifier = document.querySelector('.game-window__keypress');
const gamePoints = document.querySelector('.game-window__points');
const recentScoresList = document.querySelector('.recent-scores__list');

// Event Listeners
window.addEventListener('keyup',trackKey);
window.addEventListener('load', updateAudioDurations)
startBtn.addEventListener('click',startGame);
startBtn.addEventListener('transitionend',function(){this.classList.remove('--active')});
for (const node in keyMap) {
  keyMap[node].addEventListener('transitionend',function(){
    this.classList.remove('--active');
  })
  keyMap[node].addEventListener('click',trackKey)
}
keyPressNotifier.addEventListener('transitionend',function(){this.classList.remove('--active')})

// Control Variables

let keySequenceTarget = [];
let keySequence = [];
let isComputersTurn = true;
let fibonacci = [0,1]
const keyDirection = {
  ArrowUp: 'Up!',
  ArrowLeft: 'Left!' ,
  ArrowDown: 'Down!',
  ArrowRight: 'Right!',
}

// Functions

function checkAchievement(){
  let tiers = [3,5,8,10,15,20,25];
  if (tiers.includes(keySequenceTarget.length)){
    soundEffects.applause.play();
    audioTracks.forEach(audio => audio.playbackRate += .1);
    updateAudioDurations()
  } 
}

function gameReset(){
  keySequenceTarget = [];
  keySequence = [];
  isComputersTurn = true;
  fibonacci = [0,1];
  gamePoints.value = 0;
  audioTracks.forEach(audio => audio.playbackRate = 1);
  updateAudioDurations();
  audioBackground.pause();
}

async function trackKey(e){
  if (isComputersTurn) return;
  let direction;
  e.type == 'click' ? direction = this.dataset.direction : direction = e.key;
  keySequence.push(direction);
  if(typeof audioMap[direction] == 'undefined') return;
  playEntry(direction);
  let currentIndex = keySequence.length-1
  if (keySequence[currentIndex] !== keySequenceTarget[currentIndex]) {
    let listNode = document.createElement('li');
    listNode.className = `recent-scores__entry`;
    listNode.textContent = `${gamePoints.value}`;
    recentScoresList.appendChild(listNode);
    gameReset();
    await audioPromise(soundEffects.tryAgain, -500);
    soundEffects.gameOver.play();
    return;
  }
  if (keySequence.length == keySequenceTarget.length) {
    const praise = ['nice','wayToGo','allRight'];
    motivation[praise[Math.floor(Math.random()*3)]].play()
    let prevFibonacciNum = fibonacci[1]
    let nextFibonacciNum = fibonacci[0]+prevFibonacciNum;
    gamePoints.value = nextFibonacciNum;
    fibonacci.splice(0,1,prevFibonacciNum,nextFibonacciNum)
    keySequence.length = 0;
    isComputersTurn = true;
    checkAchievement()
    beginTurnToggle()
  }
}

function startGame(){
  this.classList.add('--active');
  document.activeElement.blur()
  audioBackground.currentTime = 0;
  audioBackground.play();
  beginTurnToggle();
}

function randomSequence(){
  let seqOptions = ['ArrowUp','ArrowLeft','ArrowDown','ArrowRight',]
  return seqOptions[Math.floor(Math.random()*4)]
}

function beginTurnToggle(){
  if(isComputersTurn) {
    let sequenceEntry = randomSequence();
    keySequenceTarget.push(sequenceEntry);
    playSequence();
  }
}