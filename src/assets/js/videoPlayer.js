const videoPlayer = document.getElementById("jsVideoPlayer");
const video = document.getElementById("jsVideo");
const playButton = document.getElementById("jsPlayButton");
const volumeButton = document.getElementById("jsVolumeButton");
const fullScreenButton = document.getElementById("jsFullScreenButton");
const currentTime = document.getElementById("jsCurrentTime");
const totalTime = document.getElementById("jsTotalTime");
const volumeRange = document.getElementById("jsVolume");

const handlePlayButtonClick = () => {
  if (video.paused) {
    video.play();
    playButton.innerHTML = '<i class="fas fa-pause"></i>';
  } else {
    video.pause();
    playButton.innerHTML = '<i class="fas fa-play"></i>';
  }
};

const handleVolumeButtonClick = () => {
  if (video.muted) {
    video.muted = false;
    volumeButton.innerHTML = '<i class="fas fa-volume-up"></i>';
    volumeRange.value = video.volume;
  } else {
    video.muted = true;
    volumeButton.innerHTML = '<i class="fas fa-volume-mute"></i>';
    volumeRange.value = 0;
  }
};

const enterFullScreen = () => {
  if (videoPlayer.requestFullscreen) {
    videoPlayer.requestFullscreen();
  } else if (videoPlayer.mozRequestFullScreen) {
    videoPlayer.mozRequestFullScreen();
  } else if (videoPlayer.webkitRequestFullscreen) {
    videoPlayer.webkitRequestFullscreen();
  } else if (videoPlayer.msRequestFullscreen) {
    videoPlayer.msRequestFullscreen();
  }

  fullScreenButton.innerHTML = '<i class="fas fa-compress"></i>';
  fullScreenButton.removeEventListener("click", enterFullScreen);
  fullScreenButton.addEventListener("click", exitFullScreen);
};

const exitFullScreen = () => {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
  fullScreenButton.innerHTML = '<i class="fas fa-expand"></i>';
  fullScreenButton.removeEventListener("click", exitFullScreen);
  fullScreenButton.addEventListener("click", enterFullScreen);
};

const formatTime = seconds => {
  const secNum = parseInt(seconds, 10);
  let hh = Math.floor(secNum / 3600);
  let mm = Math.floor((secNum - hh * 3600) / 60);
  let ss = secNum - hh * 3600 - mm * 60;
  if (hh < 10) hh = `0${hh}`;
  if (mm < 10) mm = `0${mm}`;
  if (ss < 10) ss = `0${ss}`;
  return `${hh}:${mm}:${ss}`;
};

let totalTimeString;
const getCurrentTime = () => {
  if (!totalTimeString) {
    totalTimeString = formatTime(video.duration);
    totalTime.innerHTML = totalTimeString;
  }
  currentTime.innerHTML = formatTime(video.currentTime);
};

const setTotalTime = () => {
  // totalTimeString = formatTime(video.duration);
  // totalTime.innerHTML = totalTimeString;
  setInterval(getCurrentTime, 500);
};

const registerView = () => {
  const videoId = window.location.href.split("/videos/")[1];
  fetch(`/api/${videoId}/view`, { method: "post" });
};

const handleEnded = () => {
  registerView();
  video.currentTime = 0;
  playButton.innerHTML = '<i class="fas fa-play"></i>';
};

const handleRangeDrag = event => {
  const {
    target: { value }
  } = event;
  video.volume = value;
  if (value >= 0.6) {
    volumeButton.innerHTML = '<i class="fas fa-volume-up"></i>';
  } else if (value >= 0.2) {
    volumeButton.innerHTML = '<i class="fas fa-volume-down"></i>';
  } else {
    volumeButton.innerHTML = '<i class="fas fa-volume-off"></i>';
  }
};

const init = () => {
  playButton.addEventListener("click", handlePlayButtonClick);
  volumeButton.addEventListener("click", handleVolumeButtonClick);
  fullScreenButton.addEventListener("click", enterFullScreen);
  video.volume = 0.5;
  // video.addEventListener("loadedmetadata", setTotalTime);
  setTotalTime(); // hack...
  video.addEventListener("ended", handleEnded);
  volumeRange.addEventListener("input", handleRangeDrag);
};

if (videoPlayer) {
  init();
}
