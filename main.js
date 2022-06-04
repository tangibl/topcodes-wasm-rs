const worker = new Worker("topcodes.js", {type: "module"});
const topcodes = [];

window.onload = () => {
  const video = document.querySelector("video");
  const canvas = document.getElementById("annotation-canvas");
  const ctx = canvas.getContext("2d");
  const videoCanvas = new OffscreenCanvas(640, 480);
  const videoCtx = videoCanvas.getContext("2d");

  const constraints = {
    audio: false,
    video: true
  };

  function handleSuccess(stream) {
    window.stream = stream; // make stream available to browser console
    video.srcObject = stream;
    video.play();
  }

  function sendImageBufferToWorker() {
    const imageData = videoCtx.getImageData(0, 0, 640, 480);
    const arrayBuffer = imageData.data.buffer;

    worker.postMessage({
      type: "SEND_IMAGE_BUFFER",
      payload: {
        arrayBuffer
      }
    });
  }

  sendImageBufferToWorker();

  worker.onmessage = e => {
    const {type, payload} = e.data;

    switch (type) {
      case "TOPCODE_RESULT":
        topcodes.splice(0, topcodes.length, ...payload.topcodes);
        sendImageBufferToWorker();
        break;
      case "SCANNER_NOT_INITIALIZED":
      case "TOPCODE_INVALID_INPUT":
        setTimeout(sendImageBufferToWorker, 200);
        break;
    }
  };

  function animate(timestamp) {
    ctx.clearRect(0, 0, 640, 480);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

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

    videoCtx.drawImage(video, 0, 0, videoCanvas.width, videoCanvas.height);

    requestAnimationFrame(animate);
  }

  animate();

  navigator.mediaDevices.getUserMedia(constraints).then(handleSuccess);
};

