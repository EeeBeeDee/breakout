const rules = document.getElementById('rules')
const rulesBtn = document.getElementById('rules-btn')
const closeBtn = document.getElementById('close-btn')

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

let bricks = []

let brickRowCount = 9
let brickColumnCount = 5

let score = 0

// create paddle object
const paddle = {
    x: canvas.width / 2 - 40,
    y: canvas.height - 20,
    width: 80,
    height: 10,
    speed: 8,
    dx: 0,
    dy: 0
}

//create Ball object 
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: 10,
    speedX: 4,
    speedY: 4,
    dx: 0,
    dy: 0
}

// single brick info 
const brickInfo = {
    offsetX: 45,
    offsetY: 60,
    width: 70,
    height: 20,
    padding: 10,
    visible: true 
}

//create bricks with individual X and Y corordanates 

    for (let i = 0; i < brickRowCount; i++) {
        bricks[i] = []
        for(let j = 0; j < brickColumnCount; j++) {
            x = i * (brickInfo.width + brickInfo.padding)  + brickInfo.offsetX
            y = j * (brickInfo.height + brickInfo.padding) + brickInfo.offsetY 
            bricks[i][j] = { x, y, ...brickInfo }
        }

    }

function drawPaddle() {
    ctx.beginPath()
    ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height)
    ctx.fillStyle = '#0095dd'
    ctx.fill()
    ctx.closePath()
}
function drawBall() {
    ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2)
    ctx.fillStyle = '#0095dd'
    ctx.fill()
}

function drawBricks() {
    bricks.forEach(column => {
        column.forEach(brick => {
            ctx.beginPath()
            ctx.rect(brick.x, brick.y, brick.width, brick.height)
            ctx.fillStyle = brick.visible ? '#0095dd' : 'transparent'
            ctx.fill()
            ctx.closePath()
        })
    })
}

function drawScore() {
    ctx.font = '20px Arial'
    ctx.fillStyle = '#0095dd'
    ctx.fillText(`Score: ${score}`, 700, 40)
    ctx.fill()
    ctx.closePath()
}

//movement functions 
function movePaddle() {
    paddle.x += paddle.dx

    if (paddle.x < 0) {
        paddle.x = 0
    }

    if (paddle.x > canvas.width - paddle.width) {
        paddle.x = canvas.width - paddle.width
    }
}

function moveBall() {

    if (ball.x + ball.size > canvas.width) {
         ball.speedX *= -1
    
    }

    if(ball.x < 10) {
        ball.speedX *= -1
    }
    
    ball.dx = ball.speedX
    ball.x += ball.dx 

    if (ball.y -ball.size < 0) {
        ball.speedY *= -1
    }

    if (ball.y + ball.size > canvas.height) {
        ball.speedY *= -1

    }

    //paddle colision

    if (ball.y + ball.size > paddle.y &&
         ball.x - ball.size > paddle.x && 
         ball.x + ball.size < paddle.x + paddle.width) 
           {
        ball.speedY *= -1
        console.log('hello')
    }
    ball.dy = ball.speedY
    ball.y += - ball.dy

    //brick colision

    bricks.forEach(column => {
        column.forEach(brick => {
            if (brick.visible) {
                if (ball.x - ball.size > brick.x &&
                    ball.x + ball.size < brick.x + brick.width &&
                    ball.y + ball.size > brick.y &&
                    ball.y - ball.size < brick.y +brick.height) {
                        brick.visible = false
                        ball.speedY *= -1
                        score += 1
                    }
            }

            if (ball.y + ball.size > canvas.height) {
                brick.visible = true
                score = 0
            }
        })
    })


   
}

function draw() {
    drawPaddle()
    drawBall()
    drawBricks()
    drawScore() 
}

function update() {
    //clear canvas every frame
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    draw()
    movePaddle() 
    moveBall()   

    requestAnimationFrame(update)
}


update()

//right and left arrow key functionality 
function keyDown(e) {
    if (e.key === 'ArrowLeft' || e.key === 'Left') {
        paddle.dx = - paddle.speed
    }

    if (e.key === 'ArrowRight' || e.key === 'Right') {
        paddle.dx =  paddle.speed
    }
}

function keyUp(e) {
    if(e.key === 'ArrowLeft' || e.key === 'Left' || e.key === 'ArrowRight' || e.key === 'Right') {
        paddle.dx = 0
    }
}

//Event listeners for left and right keys

window.addEventListener('keydown', keyDown)
window.addEventListener('keyup', keyUp)

closeBtn.addEventListener('click', () => {
    rules.classList.remove('show')
})

rulesBtn.addEventListener('click', () => {
    rules.classList.add('show')
})