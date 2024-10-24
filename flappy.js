//board
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

//bird
let birdWidth = 80; //width/height ratio = 408/228 = 17/12
let birdHeight = 60;
let birdX = boardWidth / 32;
let birdY = boardHeight / 8;
let birdImg;

let bird = {
    x: birdX,
    y: birdY,
    width: birdWidth,
    height: birdHeight
}

//pipes
let pipeArray = [];
let pipeWidth = 64; //width/height ratio = 384/3072 = 1/8
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

//physics
let velocityX = -2; //pipes moving left speed
let velocityY = 0; //bird jump speed
let gravity = 0.4;

let gameOver = false;
let score = 0;
let highscore = 0;

window.onload = function () {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d"); //used for drawing on the board

    // Load skor dan highscore dari localStorage
    highscore = localStorage.getItem("highscore") ? parseFloat(localStorage.getItem("highscore")) : 0;
    score = 0; // Memulai permainan baru, jadi score di-reset

    //load images
    birdImg = new Image();
    birdImg.src = "./flappybird.png";
    birdImg.onload = function () {
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    }

    topPipeImg = new Image();
    topPipeImg.src = "./toppipe.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "./bottompipe.png";

    requestAnimationFrame(update);
    setInterval(placePipes, 3000); //every 3 seconds
    document.addEventListener("keydown", moveBird);
}
document.getElementById('start-button').addEventListener('click', function() {
    // Logika untuk memulai permainan
    alert('Permainan dimulai!');
    // Di sini Anda bisa menambahkan kode untuk memulai permainan
});

document.getElementById('highscore-button').addEventListener('click', function() {
    // Logika untuk menampilkan daftar high score
    alert('Menampilkan daftar high score...');
    // Di sini Anda bisa menambahkan kode untuk menampilkan high score
});

document.getElementById('credits-button').addEventListener('click', function() {
    // Logika untuk menampilkan kredit
    alert('Kredit permainan ini...');
    // Di sini Anda bisa menambahkan kode untuk menampilkan kredit
});

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    //bird
    velocityY += gravity;
    bird.y = Math.max(bird.y + velocityY, 0); //apply gravity to current bird.y, limit the bird.y to top of the canvas
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    if (bird.y > board.height) {
        gameOver = true;
        checkHighscore();
    }

    //pipes
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5; //0.5 karena ada 2 pipa (atas dan bawah), jadi 0.5*2 = 1 untuk setiap set pipa
            pipe.passed = true;
        }

        if (detectCollision(bird, pipe)) {
            gameOver = true;
            checkHighscore();
        }
    }

    //clear pipes
    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift(); //removes first element from the array
    }

    // Display score dan highscore
    context.fillStyle = "black";
    context.font = "35px sans-serif";
    context.fillText("Score:", 5, 30);
    context.fillText(score, 5, 70);

    context.fillText("Highscore:", 200, 30);
    context.fillText(highscore, 200, 70);

}

function placePipes() {
    if (gameOver) {
        return;
    }

    let randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
    let openingSpace = board.height / 3;

    let topPipe = {
        img: topPipeImg,
        x: pipeX,
        y: randomPipeY,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    }
    pipeArray.push(topPipe);

    let bottomPipe = {
        img: bottomPipeImg,
        x: pipeX,
        y: randomPipeY + pipeHeight + openingSpace,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    }
    pipeArray.push(bottomPipe);
}

function moveBird(e) {
    if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX") {
        //jump
        velocityY = -8;

        //reset game
        if (gameOver) {
            bird.y = birdY;
            pipeArray = [];
            score = 0;
            gameOver = false;
        }
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&   //a's top left corner doesn't reach b's top right corner
        a.x + a.width > b.x &&   //a's top right corner passes b's top left corner
        a.y < b.y + b.height &&  //a's top left corner doesn't reach b's bottom left corner
        a.y + a.height > b.y;    //a's bottom left corner passes b's top left corner
}

function checkHighscore() {
    if (score > highscore) {
        highscore = score;
        localStorage.setItem("highscore", highscore);
        alert("game over" +"<br>"+"Selamat Anda mencetak rekor nilai tertinggi baru: " + highscore);
    } else {
        context.fillText("game over", 100, 100);
    }
}
