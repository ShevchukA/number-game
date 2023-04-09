import { soundBtn } from './dom.js';

const sounds = {
  merge: {
    url: './sounds/merge.wav',
  },
  mergeBig: {
    url: './sounds/merge-big.wav',
  },
  gameStart: {
    url: './sounds/game-start.wav',
  },
  gameOver: {
    url: './sounds/game-over.wav',
  },
  addBalls: {
    url: './sounds/add-balls.wav',
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

soundBtn.addEventListener('click', () => {
  if (soundsOn) {
    soundsOn = false;
    soundBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
  } else {
    soundsOn = true;
    soundBtn.innerHTML = '<i class="fa-solid fa-volume-low"></i>';
  }
});

export { playSound, loadSounds, sounds };
