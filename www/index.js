import {scan} from "topcodes-wasm";

const topcodes = [];

const WIDTH = 640;
const HEIGHT = 480;

let lastUpdate = Date.now();
let deltaTime = 0;

const video = document.querySelector("video");
const canvas = document.getElementById("annotation-canvas");
const ctx = canvas.getContext("2d");
const videoCanvas = document.getElementById("video-canvas");
const videoCtx = videoCanvas.getContext("2d");
const statistics = document.getElementById("statistics");

const constraints = {
  audio: false,
  video: true,
  width: WIDTH,
  height: HEIGHT,
};

function handleSuccess(stream) {
  window.stream = stream; // make stream available to browser console
  video.srcObject = stream;
  video.play();
}

async function scanImageBuffer() {
  const imageData = videoCtx.getImageData(0, 0, WIDTH, HEIGHT);
  const buffer = imageData.data;

  lastUpdate = Date.now();

  const result = await new Promise(resolve => {
    resolve(scan(buffer, WIDTH, HEIGHT).map(json => JSON.parse(json)));
  });
  deltaTime = Date.now() - lastUpdate;
  topcodes.splice(0, topcodes.length, ...result);

  setTimeout(() => scanImageBuffer(), 0);
}

scanImageBuffer();

function animate() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  statistics.innerText = `Scan time: ${deltaTime}ms`;

  for (const topcode of topcodes) {
    const {x, y, unit, orientation, code} = topcode;
    const radius = unit * 4;
    ctx.beginPath();
    ctx.fillStyle = "#ff000055";
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.lineWidth = radius / 10;
    ctx.strokeStyle = "#0077ff88";
    ctx.moveTo(x, y);
    ctx.lineTo(x + radius * Math.cos(orientation), y + radius * Math.sin(orientation), radius);
    ctx.stroke();

    ctx.font = `${radius / 2}px Calibri`;
    ctx.fillStyle = "#fff";
    ctx.fillText(code, x, y);
  }

  requestAnimationFrame(animate);
}

function drawVideoToCanvas() {
  videoCtx.drawImage(video, 0, 0, videoCanvas.width, videoCanvas.height);

  requestAnimationFrame(drawVideoToCanvas);
}

animate();
drawVideoToCanvas();

navigator.mediaDevices.getUserMedia(constraints).then(handleSuccess);
