const videoContainer = document.getElementById("jsVideoPlayer");
const videoPlayer = document.querySelector("#jsVideoPlayer video");
const playButton = document.getElementById("jsPlayButton");
const volumeButton = document.getElementById("jsVolumeButton");
const fullScreenButton = document.getElementById("jsFullScreenButton");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const volumeRange = document.getElementById("jsVolume");

if (videoContainer) {
  init();
}

function init() {
  playButton.addEventListener("click", handlePlayButtonClick);
  volumeButton.addEventListener("click", handleVolumeButtonClick);
  fullScreenButton.addEventListener("click", enterFullScreen);
  videoPlayer.volume = 0.5;
  videoPlayer.addEventListener("loadedmetadata", setTotalTime);
  videoPlayer.addEventListener("ended", handleEnded);
  volumeRange.addEventListener("input", handleRangeDrag);
}

function handlePlayButtonClick() {
  if (videoPlayer.paused) {
    videoPlayer.play();
    playButton.innerHTML = '<i class="fas fa-pause"></i>';
  } else {
    videoPlayer.pause();
    playButton.innerHTML = '<i class="fas fa-play"></i>';
  }
}

function handleVolumeButtonClick() {
  if (videoPlayer.muted) {
    videoPlayer.muted = false;
    volumeButton.innerHTML = '<i class="fas fa-volume-up"></i>';
    volumeRange.value = videoPlayer.volume;
  } else {
    videoPlayer.muted = true;
    volumeButton.innerHTML = '<i class="fas fa-volume-mute"></i>';
    volumeRange.value = 0;
  }
}

function enterFullScreen() {
  if (videoContainer.requestFullscreen) {
    videoContainer.requestFullscreen();
  } else if (videoContainer.mozRequestFullScreen) {
    videoContainer.mozRequestFullScreen();
  } else if (videoContainer.webkitRequestFullscreen) {
    videoContainer.webkitRequestFullscreen();
  } else if (videoContainer.msRequestFullscreen) {
    videoContainer.msRequestFullscreen();
  }

  fullScreenButton.innerHTML = '<i class="fas fa-compress"></i>';
  fullScreenButton.removeEventListener("click", enterFullScreen);
  fullScreenButton.addEventListener("click", exitFullScreen);
}

function exitFullScreen() {
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
}

function formatTime(seconds) {
  const secNum = parseInt(seconds, 10);
  let hh = Math.floor(secNum / 3600);
  let mm = Math.floor((secNum - hh * 3600) / 60);
  let ss = secNum - hh * 3600 - mm * 60;
  if (hh < 10) hh = `0${hh}`;
  if (mm < 10) mm = `0${mm}`;
  if (ss < 10) ss = `0${ss}`;
  return `${hh}:${mm}:${ss}`;
}

function getCurrentTime() {
  currentTime.innerHTML = formatTime(videoPlayer.currentTime);
}

function setTotalTime() {
  const totalTimeString = formatTime(videoPlayer.duration);
  totalTime.innerHTML = totalTimeString;
  setInterval(getCurrentTime, 500);
}

function registerView() {
  const videoId = window.location.href.split("/videos/")[1];
  fetch(`/api/${videoId}/view`, { method: "post" });
}

function handleEnded() {
  registerView();
  videoPlayer.currentTime = 0;
  playButton.innerHTML = '<i class="fas fa-play"></i>';
}

function handleRangeDrag(event) {
  const {
    target: { value }
  } = event;
  videoPlayer.volume = value;
  if (value >= 0.6) {
    volumeButton.innerHTML = '<i class="fas fa-volume-up"></i>';
  } else if (value >= 0.2) {
    volumeButton.innerHTML = '<i class="fas fa-volume-down"></i>';
  } else {
    volumeButton.innerHTML = '<i class="fas fa-volume-off"></i>';
  }
}
