const videoContainer = document.getElementById("jsVideoPlayer");
const videoPlayer = document.querySelector("#jsVideoPlayer video");
const playButton = document.getElementById("jsPlayButton");

if (videoContainer) {
  init();
}

function init() {
  playButton.addEventListener("click", handlePlayButtonClick);
}

function handlePlayButtonClick() {
  if (videoPlayer.paused) {
    videoPlayer.play();
  } else {
    videoPlayer.pause();
  }
}
