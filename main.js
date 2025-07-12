let model = null;
let video = document.getElementById('video');
let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let stream = null;

let isRunning = false;
let cameraCount = 0;
let peopleCount = 0;
let phoneCount = 0;

async function loadModel() {
    console.log("Loading COCO-SSD model...");
    model = await cocoSsd.load();
    console.log("Model loaded!");
}

async function startExam() {
    document.getElementById('startExam').disabled = true;
    document.getElementById('stopExam').disabled = false;
    document.body.classList.add('loading');

    await loadModel();

    stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    video.srcObject = stream;
    video.onloadedmetadata = () => {
        video.play();
        document.body.classList.remove('loading');
        isRunning = true;
        cameraCount = peopleCount = phoneCount = 0;
        detectFrame();
    };
}

function stopExam() {
    document.getElementById('startExam').disabled = false;
    document.getElementById('stopExam').disabled = true;
    isRunning = false;

    if (stream) stream.getTracks().forEach(track => track.stop());

    alert(`Exam Ended:\nCamera Active: ${cameraCount}\nPeople Detected: ${peopleCount}\nPhones Detected: ${phoneCount}`);
}

async function detectFrame() {
    if (!isRunning) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const predictions = await model.detect(video);

    predictions.forEach(pred => {
        if (pred.class === 'person') {
            peopleCount++;
            document.getElementById('peopleCount').textContent = peopleCount;
        }
        if (pred.class === 'cell phone') {
            phoneCount++;
            document.getElementById('phoneCount').textContent = phoneCount;
        }
        drawBox(pred);
    });

    cameraCount++;
    document.getElementById('cameraCount').textContent = cameraCount;

    requestAnimationFrame(detectFrame);
}

function drawBox(pred) {
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    ctx.strokeRect(...pred.bbox);
    ctx.fillStyle = 'red';
    ctx.font = '16px Arial';
    ctx.fillText(`${pred.class} (${Math.round(pred.score * 100)}%)`, pred.bbox[0], pred.bbox[1] - 5);
}

document.getElementById('startExam').addEventListener('click', startExam);
document.getElementById('stopExam').addEventListener('click', stopExam);
