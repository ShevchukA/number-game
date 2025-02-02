import { soundBtnOn, soundBtnOff } from './dom.js';
import merge from '../sounds/merge.wav';
import mergeBig from '../sounds/merge-big.wav';
import gameStart from '../sounds/game-start.wav';
import gameOver from '../sounds/game-over.wav';
import addBalls from '../sounds/add-balls.wav';

const sounds = {
  merge: {
    url: merge,
  },
  mergeBig: {
    url: mergeBig,
  },
  gameStart: {
    url: gameStart,
  },
  gameOver: {
    url: gameOver,
  },
  addBalls: {
    url: addBalls,
  },
};

let soundsOn = true;

const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext();

async function loadSounds() {
  //get array of promises, each async arrow function returns a promise
  const loadSoundsPromises = Object.keys(sounds).map(async soundKey => {
    // get sound object by key
    const sound = sounds[soundKey];
    //load sound from server
    const response = await fetch(sound.url);
    //create buffer of response data
    const buffer = await response.arrayBuffer();
    //decode buffer in audio
    const decodedBuffer = await audioContext.decodeAudioData(buffer);
    // put decoded audio in sounds array
    sound.buffer = decodedBuffer;
  });

  return Promise.all(loadSoundsPromises);
}

function playSound(soundName) {
  if (soundsOn) {
    // if audioContext unavaliable than resume
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }

    const source = audioContext.createBufferSource();
    source.buffer = soundName.buffer;
    source.connect(audioContext.destination);
    source.start();
  }
}

soundBtnOn.addEventListener('click', () => {
  soundsOn = false;
  soundBtnOn.style.display = 'none';
  soundBtnOff.style.display = 'block';
});
soundBtnOff.addEventListener('click', () => {
  soundsOn = true;
  soundBtnOn.style.display = 'block';
  soundBtnOff.style.display = 'none';
});

export { playSound, loadSounds, sounds };
