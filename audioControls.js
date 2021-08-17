function updateAudioDurations(){
  audioTracks.forEach(audio => audio.setAttribute('data-duration',(audio.duration/audio.playbackRate)));
}

function playEntry(key){
  audioMap[key].currentTime = 0;
  audioMap[key].play();
  keyMap[key].classList.add('--active');
  keyPressNotifier.textContent = keyDirection[key];
  keyPressNotifier.classList.add('--active');
}

function playSequence(){
  let timeLog = 1500;
  keySequenceTarget.forEach((key,i) => {
    if(i!==0) {
      timeLog += (parseFloat(audioMap[key].dataset.duration * 1000)-500)
    }
    setTimeout(() => {
      playEntry(key)
      if(i==keySequenceTarget.length-1) {
        isComputersTurn = false;
      }
    }, timeLog);
  })
}

async function audioPromise(audio,timeModifier = 0){
  return new Promise((resolve,reject) => {
    audio.play();
    setTimeout(() => {
      resolve();
    }, (audio.duration*1000) + timeModifier);
  })
}