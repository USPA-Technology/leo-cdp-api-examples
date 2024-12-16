const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
const spinButton = document.getElementById('spinButton');

const wheelRadius = canvas.width / 2 - 20;
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const prizes = [
  "Chúc bạn may mắn lần sau!",
  "50.000 VND",
  "Yamaha Exciter 150GP 2019",
  "10.000 VND",
  "500.000 VND",
  "100.000 VND",
  "Xiaomi Redmi S2 64GB"
];

const prizeColors = ["#ff0000", "#ff4000", "#ff7300", "#ff9d00", "#ffc100", "#ffe000", "#ffff00"];

let rotationAngle = 0;
let spinAnimation;
let isSpinning = false;

// Calculate initial offset to align the 10.000 VND to the pointer
const numSlices = prizes.length;
const sliceAngle = 2 * Math.PI / numSlices;
const initialOffset = -2 * sliceAngle
rotationAngle = initialOffset;


function drawWheel() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
   

    for (let i = 0; i < numSlices; i++) {
        const startAngle = i * sliceAngle + rotationAngle;
        const endAngle = startAngle + sliceAngle;
        ctx.fillStyle = prizeColors[i % prizeColors.length];
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, wheelRadius, startAngle, endAngle);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = 'black';
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(startAngle + sliceAngle / 2);
        ctx.textAlign = 'center';
        ctx.fillText(prizes[i], wheelRadius/2, 10);
        ctx.restore();
    }

    //draw arrow
     ctx.fillStyle = 'black';
     ctx.beginPath();
     ctx.moveTo(centerX, 10);
     ctx.lineTo(centerX - 10, 25);
     ctx.lineTo(centerX + 10, 25);
     ctx.closePath();
     ctx.fill();
}

function spinWheel() {
    if (isSpinning) {
        return;
    }
    isSpinning = true;
    let spinSpeed = Math.random() * 0.2 + 0.15;
    let deceleration = 0.001;

    function animateSpin() {
        if (spinSpeed > 0) {
            rotationAngle += spinSpeed;
            spinSpeed -= deceleration;
            drawWheel();
            spinAnimation = requestAnimationFrame(animateSpin);
        } else {
            isSpinning = false;
            cancelAnimationFrame(spinAnimation);

           const normalizedAngle = (rotationAngle) % (2 * Math.PI);
           const winningSlice = Math.floor((normalizedAngle / (2 * Math.PI)) * numSlices)
            const winningPrizeIndex = (numSlices - 1) - winningSlice ;
            alert("You win: " + prizes[winningPrizeIndex]);

        }
    }

    animateSpin();
}

drawWheel();

spinButton.addEventListener('click', spinWheel);