let model = null;
let video = document.getElementById('video');
let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let stream = null;

let isRunning = false;
let cameraCount = 0;
let backgroundPeopleCount = 0;
let phoneCount = 0;

document.getElementById('themeToggle').addEventListener('change', function () {
    document.body.classList.toggle('light', this.checked);
});


let backgroundPeoplePositions = [];


let examStartTime;
let timerInterval;

function startTimer() {
    examStartTime = Date.now();
    timerInterval = setInterval(() => {
        const elapsed = Date.now() - examStartTime;
        const hours = String(Math.floor(elapsed / 3600000)).padStart(2, '0');
        const minutes = String(Math.floor((elapsed % 3600000) / 60000)).padStart(2, '0');
        const seconds = String(Math.floor((elapsed % 60000) / 1000)).padStart(2, '0');
        document.getElementById('time').textContent = `${hours}:${minutes}:${seconds}`;
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
    document.getElementById('time').textContent = "00:00:00";
}

function showAlert(message) {
    const alertList = document.getElementById('alertList');
    const li = document.createElement('li');
    li.textContent = message;
    alertList.appendChild(li);
    setTimeout(() => {
        li.remove();
    }, 2000); 
}

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
        cameraCount = backgroundPeopleCount = phoneCount = 0;
        backgroundPeoplePositions = [];
        document.getElementById('cameraCount').textContent = 0;
        document.getElementById('peopleCount').textContent = 0;
        document.getElementById('phoneCount').textContent = 0;
        document.getElementById('alertList').innerHTML = '';
        startTimer(); 
        detectFrame();
    };
}

function stopExam() {
    document.getElementById('startExam').disabled = false;
    document.getElementById('stopExam').disabled = true;
    isRunning = false;

    if (stream) stream.getTracks().forEach(track => track.stop());

    stopTimer(); 

    alert(`Exam Ended:\nCamera Active: ${cameraCount}\nBackground People Detected: ${backgroundPeopleCount}\nPhones Detected: ${phoneCount}`);
}

async function detectFrame() {
    if (!isRunning) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const predictions = await model.detect(video);

    let currentPeopleCount = 0;

    predictions.forEach(pred => {
        if (pred.class === 'person') {
            currentPeopleCount++;

            let [x, y, width, height] = pred.bbox;
            let area = width * height;
            let totalArea = canvas.width * canvas.height;
            let areaRatio = area / totalArea;

            if (areaRatio < 0.2) { 
                let centerX = x + width / 2;
                let centerY = y + height / 2;

                
                let found = backgroundPeoplePositions.some(pos => {
                    let dx = pos.x - centerX;
                    let dy = pos.y - centerY;
                    return Math.sqrt(dx * dx + dy * dy) < 50; 
                });

                if (!found) {
                    backgroundPeoplePositions.push({ x: centerX, y: centerY });
                    backgroundPeopleCount++;
                    document.getElementById('peopleCount').textContent = backgroundPeopleCount;
                    showAlert("⚠️ Background person detected!");
                }
            }
        }

        if (pred.class === 'cell phone' && pred.score > 0.7) {
            phoneCount++;
            document.getElementById('phoneCount').textContent = phoneCount;
            showAlert("📱 Phone detected!");
        }

        drawBox(pred);
    });

    if (currentPeopleCount > 1) {
        showAlert("👥 Multiple people detected!");
    }

    cameraCount++;
    document.getElementById('cameraCount').textContent = cameraCount;

    requestAnimationFrame(detectFrame);
}

function drawBox(pred) {
    ctx.strokeStyle = (pred.class === 'person') ? 'blue' : 'red';
    ctx.lineWidth = 2;
    ctx.strokeRect(...pred.bbox);
    ctx.fillStyle = ctx.strokeStyle;
    ctx.font = '16px Arial';
    ctx.fillText(`${pred.class} (${Math.round(pred.score * 100)}%)`, pred.bbox[0], pred.bbox[1] - 5);
}

document.getElementById('startExam').addEventListener('click', startExam);
document.getElementById('stopExam').addEventListener('click', stopExam);
