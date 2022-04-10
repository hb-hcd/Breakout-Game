const rulesBtn = document.getElementById('rules-btn');
const rules = document.getElementById('rules');
const closeBtn = document.getElementById('close-btn');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let score = 0;
let canvasRow = 5;
let canvasColumn = 9;


const brickInfo = {
    w: 70,
    h: 20,
    padding: 10,
    offsetX: 45,
    offsetY: 60,
    visible: true
}

const ballInfo = {
    x: canvas.width / 2,
    y: canvas.height - 50,
    radius: 10,
    speed: 4,
    dx: 4,
    dy: -4,
    visible: true
}
const racket = {
    x: canvas.width / 2 - 40,
    y: canvas.height - 40,
    w: 80,
    h: 10,
    speed: 8,
    dx: 0,
    visible: true
}

const bricks = [];
for (let i = 0; i < canvasRow; i++) {
    bricks[i] = [];
    for (let j = 0; j < canvasColumn; j++) {
        let x = j * (brickInfo.padding + brickInfo.w) + brickInfo.offsetX;
        let y = i * (brickInfo.padding + brickInfo.h) + brickInfo.offsetY;
        bricks[i][j] = { x, y, ...brickInfo }
        // console.log(bricks[i][j]);
    }
}

//draw racket
function moveRacket() {
    racket.x += racket.dx;
    //bounce back when hit the wall
    if (racket.x + racket.w > canvas.width) {
        racket.x = canvas.width - racket.w;
    }
    if (racket.x < 0) {
        racket.x = 0;
    }
}

//draw score on canvas
function drawScore() {
    ctx.font = '20px Serif';
    ctx.fillStyle = 'coral';
    ctx.fillText(`SCORE:${score}`, canvas.width - 130, 30);
}

//drawScore();
//draw paddle on canvas
function drawRacket() {
    ctx.beginPath();
    ctx.rect(racket.x, racket.y, racket.w, racket.h);
    ctx.fillStyle = racket.visible ? 'navy' : 'transparent';
    ctx.fill();
    // ctx.stroke();
    ctx.closePath();
}
//drawRacket();

//draw ball on canvas
function drawBall() {
    ctx.beginPath();
    ctx.arc(ballInfo.x, ballInfo.y, ballInfo.radius, 0, Math.PI * 2);
    ctx.fillStyle = ballInfo.visible ? 'red' : 'transparent';
    ctx.fill();
    ctx.closePath();
}

//drawBall();
function moveBall() {
    ballInfo.x += ballInfo.dx;
    ballInfo.y += ballInfo.dy;

    //side wall detection(Left/Right)
    if (ballInfo.x - ballInfo.radius < 0 || ballInfo.x + ballInfo.radius > canvas.width) {
        ballInfo.dx *= -1;
    }
    //top/bottom wall detection
    if (ballInfo.y + ballInfo.radius < 0 || ballInfo.y + ballInfo.radius > canvas.height) {
        ballInfo.dy *= -1;
    }
    //racket detection
    if (ballInfo.x - ballInfo.radius > racket.x &&
        ballInfo.x + ballInfo.radius < racket.x + racket.w &&
        ballInfo.y + ballInfo.radius > racket.y
    ) {
        ballInfo.dy = -ballInfo.speed;
    }
    //brick detection
    bricks.forEach(row => {
        row.forEach(brick => {
            if (brick.visible) {
                if (
                    ballInfo.y + ballInfo.radius > brick.y && //ball doesn't cross the brick top
                    ballInfo.y - ballInfo.radius < brick.y + brick.h && //ball touches the brick bottom
                    ballInfo.x + ballInfo.radius < brick.x + brick.w &&
                    ballInfo.x - ballInfo.radius > brick.x
                ) {
                    ballInfo.dy *= -1;
                    brick.visible = false;
                    increaseScore();
                }
            }
        })
    })


    //restart game if lost
    if (ballInfo.y + ballInfo.radius > canvas.height) {
        showAllBricks();
        score = 0;
    }
}
//update score
function increaseScore() {
    score++;

    if (score % (canvasColumn * canvasRow) === 0) {
        ballInfo.visible = false;
        racket.visible = false;
        //restart game 
        setTimeout(() => {
            resetGame();
        }, 3000);
    }
}

function resetGame() {
    showAllBricks();
    score = 0;
    ballInfo.x = canvas.width / 2;
    ballInfo.y = canvas.height - 50;
    racket.x = canvas.width / 2 - 40;
    racket.y = canvas.height - 40;
    ballInfo.visible = true;
    racket.visible = true;
}

function showAllBricks() {
    bricks.forEach(row => {
        row.forEach(brick => {
            brick.visible = true;
        })
    })
}


//draw bricks on canvas
function drawBricks() {
    bricks.forEach(row => {
        row.forEach(brick => {
            ctx.beginPath();
            ctx.rect(brick.x, brick.y, brick.w, brick.h);
            ctx.fillStyle = brick.visible ? 'teal' : 'transparent';
            ctx.fill();
            ctx.closePath();
        })
    })
}
//drawBricks();



function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawRacket();
    drawBricks();
    drawScore();
}

function update() {
    moveRacket();
    moveBall();
    draw();
    requestAnimationFrame(update);
}

update();

//keydown event
function keyDown(e) {

    if (e.key === 'Right' || e.key === 'ArrowRight') {
        racket.dx = racket.speed;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        racket.dx = -racket.speed;
    }
}

//keyUp event
function keyUp(e) {
    if (
        e.key === 'Right' ||
        e.key === 'ArrowRight' ||
        e.key === 'Left' ||
        e.key === 'ArrowLeft'
    ) {
        racket.dx = 0;
    }
}


//keyboard event handler
document.addEventListener('keyup', keyUp);
document.addEventListener('keydown', keyDown);

rulesBtn.addEventListener('click', () => rules.classList.add('showRules'));
closeBtn.addEventListener('click', () => rules.classList.remove('showRules'));