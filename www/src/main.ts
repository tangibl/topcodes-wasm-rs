import './style.css'
import {scan, TopCode} from "@tangibl/topcodes-wasm";

const topcodes: TopCode[] = [];

const WIDTH = 640;
const HEIGHT = 480;

let lastUpdate = Date.now();
let deltaTime = 0;

const video = document.querySelector("video")! as HTMLVideoElement;
const canvas = document.getElementById("annotation-canvas")! as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;
const videoCanvas = document.getElementById("video-canvas")! as HTMLCanvasElement;
const videoCtx = videoCanvas.getContext("2d")!;
const statistics = document.getElementById("statistics")! as HTMLDivElement;

const constraints = {
  audio: false,
  video: true,
  width: WIDTH,
  height: HEIGHT,
};

function handleSuccess(stream: MediaStream) {
  video.srcObject = stream;
  video.play();
}

async function scanImageBuffer() {
  const imageData = videoCtx.getImageData(0, 0, WIDTH, HEIGHT);
  const buffer = imageData.data;

  lastUpdate = Date.now();

  const result = await new Promise<TopCode[]>(resolve => {
    resolve(scan(buffer, WIDTH, HEIGHT));
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
    ctx.lineTo(x + radius * Math.cos(orientation), y + radius * Math.sin(orientation));
    ctx.stroke();

    ctx.font = `${radius / 2}px Calibri`;
    ctx.fillStyle = "#fff";
    ctx.fillText(code.toString(), x, y);
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
