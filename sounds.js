import { soundBtn } from './dom.js';

let kickBass = new Audio('sounds/kick-bass.mp3');

let soundsOn = true;

function playSound(soundName) {
  if (soundsOn) {
    soundName.currentTime = 0;
    soundName.play();
  }
}

soundBtn.innerHTML = '<i class="fa-solid fa-volume-low"></i>';
soundBtn.addEventListener('click', () => {
  if (soundsOn) {
    soundsOn = false;
    soundBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
  } else {
    soundsOn = true;
    soundBtn.innerHTML = '<i class="fa-solid fa-volume-low"></i>';
  }
});

export { playSound, kickBass };
