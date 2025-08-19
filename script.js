const canvas = document.getElementById('drawing-board');
const toolbar = document.getElementById('toolbar');
const ctx = canvas.getContext('2d');

const canvasOffsetX = canvas.offsetLeft;
const canvasOffsetY = canvas.offsetTop;

canvas.width = window.innerWidth - canvasOffsetX;
canvas.height = window.innerHeight - canvasOffsetY;

let isPainting = false;
let lineWidth = 5;

function getXY(e) {
    if (e.touches) {
        return {
            x: e.touches[0].clientX - canvasOffsetX,
            y: e.touches[0].clientY - canvasOffsetY
        };
    } else {
        return {
            x: e.clientX - canvasOffsetX,
            y: e.clientY - canvasOffsetY
        };
    }
}

toolbar.addEventListener('click', e => {
    if (e.target.id === 'clear') {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
});

toolbar.addEventListener('change', e => {
    if(e.target.id === 'stroke') {
        ctx.strokeStyle = e.target.value;
    }
    if(e.target.id === 'lineWidth') {
        lineWidth = e.target.value;
    }
});

// Rita-funktion
function draw(e) {
    if (!isPainting) return;
    e.preventDefault(); // stoppa scroll på mobil

    const { x, y } = getXY(e);

    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineTo(x, y);
    ctx.stroke();
}

// Start
function startPainting(e) {
    isPainting = true;
    const { x, y } = getXY(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
}

// Slut
function stopPainting() {
    isPainting = false;
    ctx.stroke();
    ctx.beginPath();
}

// ---- Events för både mus och touch ----
canvas.addEventListener('mousedown', startPainting);
canvas.addEventListener('mouseup', stopPainting);
canvas.addEventListener('mousemove', draw);

canvas.addEventListener('touchstart', startPainting);
canvas.addEventListener('touchend', stopPainting);
canvas.addEventListener('touchmove', draw);
