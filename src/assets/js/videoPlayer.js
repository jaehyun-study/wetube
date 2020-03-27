const videoPlayer = document.getElementById("jsVideoPlayer");
const video = document.getElementById("jsVideo");
const videoControls = document.getElementById("jsVideoControls");
const playButton = document.getElementById("jsPlayButton");
const muteButton = document.getElementById("jsMuteButton");
const progressBar = document.getElementById("jsProgressBar");
const currentTime = document.getElementById("jsCurrentTime");
const totalTime = document.getElementById("jsTotalTime");
const fullScreenButton = document.getElementById("jsFullScreenButton");

const replaceButton = (button, value) => {
  if (button) {
    button.innerHTML = `<i class="${value}"></i>`;
  }
};

const formatTime = seconds => {
  const secNum = parseInt(seconds, 10);
  let hh = Math.floor(secNum / 3600);
  let mm = Math.floor((secNum - hh * 3600) / 60);
  let ss = secNum - hh * 3600 - mm * 60;
  if (hh < 10) hh = `0${hh}`;
  if (mm < 10) mm = `0${mm}`;
  if (ss < 10) ss = `0${ss}`;
  if (hh > 0) {
    return `${hh}:${mm}:${ss}`;
  } else {
    return `${mm}:${ss}`;
  }
};

const setDuration = () => {
  if (video.readyState < 2) {
    setTimeout(setDuration, 500);
  } else {
    progressBar.max = video.duration;
    totalTime.innerHTML = formatTime(video.duration);
  }
};

const handleSeek = () => {
  video.currentTime = progressBar.value;
};

const togglePlay = () => {
  if (video.paused) {
    video.play();
    replaceButton(playButton, "fas fa-pause");
    hideControls();
  } else {
    video.pause();
    replaceButton(playButton, "fas fa-play");
    showControls();
  }
};

const handleTimeUpdate = () => {
  currentTime.innerHTML = formatTime(video.currentTime);
  progressBar.value = video.currentTime;
};

const registerView = () => {
  const videoId = window.location.href.split("/videos/")[1];
  fetch(`/api/${videoId}/view`, { method: "post" });
};

const handleVideoEnded = () => {
  registerView();
  showControls();
};

const toggleMute = () => {
  video.muted = !video.muted;
  if (video.muted) {
    replaceButton(muteButton, "fas fa-volume-mute");
  } else {
    replaceButton(muteButton, "fas fa-volume-up");
  }
};

const toggleFullScreen = () => {
  if (document.fullscreen) {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  } else {
    if (videoPlayer.requestFullscreen) {
      videoPlayer.requestFullscreen();
    } else if (videoPlayer.mozRequestFullScreen) {
      videoPlayer.mozRequestFullScreen();
    } else if (videoPlayer.webkitRequestFullscreen) {
      videoPlayer.webkitRequestFullscreen();
    } else if (videoPlayer.msRequestFullscreen) {
      videoPlayer.msRequestFullscreen();
    }
  }
};

const handleFullScreenChange = () => {
  if (document.fullscreen) {
    replaceButton(fullScreenButton, "fas fa-compress");
  } else {
    replaceButton(fullScreenButton, "fas fa-expand");
  }
};

const handleKeyPress = event => {
  if (document.activeElement.tagName.toLowerCase() === "input") return;
  if (event.keyCode === 32) {
    event.preventDefault();
    togglePlay();
  }
};

const showControls = () => {
  video.classList.add("show");
  videoControls.classList.add("show");
};

let hideHandle;
const hideControls = () => {
  clearTimeout(hideHandle);
  hideHandle = setTimeout(() => {
    video.classList.remove("show");
    videoControls.classList.remove("show");
  }, 1000);
};

const init = () => {
  video.addEventListener("loadedmetadata", setDuration);
  setTimeout(setDuration, 100);
  video.addEventListener("click", togglePlay);
  video.addEventListener("timeupdate", handleTimeUpdate);
  video.addEventListener("ended", handleVideoEnded);
  playButton.addEventListener("click", togglePlay);
  muteButton.addEventListener("click", toggleMute);
  progressBar.addEventListener("input", handleSeek);
  fullScreenButton.addEventListener("click", toggleFullScreen);
  document.addEventListener("fullscreenchange", handleFullScreenChange);
  document.addEventListener("keypress", handleKeyPress);
  videoPlayer.addEventListener("mouseenter", showControls);
  videoPlayer.addEventListener("mousemove", () => {
    showControls();
    hideControls();
  });
  videoPlayer.addEventListener("mouseleave", hideControls);
};

if (videoPlayer) init();
