const recordContainer = document.getElementById("jsRecordContainer");
const recordButton = document.getElementById("jsRecordButton");
const recordPreview = document.getElementById("jsRecordPreview");

let recorder;

const handleVideoData = event => {
  const { data: videoFile } = event;
  const link = document.createElement("a");
  link.href = URL.createObjectURL(videoFile);
  link.download = "recorded.webm";
  document.body.appendChild(link);
  link.click();
};

const initRecorder = async () => {
  try {
    // stream
    const streamObject = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: { width: 1280, height: 720 }
    });
    // recorder
    recorder = new MediaRecorder(streamObject);
    recorder.addEventListener("dataavailable", handleVideoData);
    // preview
    recordPreview.srcObject = streamObject;
    recordPreview.muted = true;
    recordPreview.play();
    return true;
  } catch (error) {
    console.log(error.message);
    return false;
  }
};

const updateRecordButtonCaption = () => {
  let caption = "Can't record";
  if (recorder) {
    if (recorder.state === "inactive") {
      caption = "Start Recording";
    } else {
      caption = "Stop Recording";
    }
  }
  recordButton.innerHTML = caption;
};

const toggleRecord = () => {
  if (!recorder) return;
  if (recorder.state === "inactive") {
    recorder.start();
  } else {
    recorder.stop();
  }
  updateRecordButtonCaption();
};

const init = () => {
  initRecorder();
  updateRecordButtonCaption();
  recordButton.addEventListener("click", toggleRecord);
};

if (recordContainer) init();
