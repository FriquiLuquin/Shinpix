const rows = 16;
const cols = 16;

var score = 0;
var targetScore = 0;
var gameOver = false;
var image;
var board;

window.onload = function(){
    image = readImage();
    board = createEmptyBoard(rows, cols);
    populateBoard(board, image);
}

function readImage(){
    canvas = document.querySelector("canvas");
    img = document.querySelector("img");
    ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    return data;
}

function createEmptyBoard(rows, cols){
    let arr = new Array(rows);
    for (let i = 0; i < rows; i++){
        arr[i] = new Array(cols);
    }
    return arr;
}

function populateBoard(board, image){
    for (let r = 0; r < rows; r++){
        for(let c = 0; c < cols; c++){
            let state = false;
            let correctState = false;
            if (isPixelBlack(image, r, c)){
                correctState = true;
                targetScore++;
            }
            let clue = calculateTileClue(image, r, c);
            let elem = createBoardElement(r, c, clue);
            addClickEventsTo(elem, r, c);
            // let color = getCellColor(image, r, c);
            board[r][c] = new Tile(state, correctState, clue, elem);
        }
    }
}

function isPixelBlack(image, r, c){
    return image[((r * cols) + c) * 4] == 0
}

function calculateTileClue(image, r, c){
    let clue = 0;
    // Count neighbours that must be on
    if (image[(((r-1) * cols) + (c-1)) * 4] == 0 && r>0 && c>0) { clue++; };
    if (image[(((r-1) * cols) + (c  )) * 4] == 0 && r>0) { clue++; };
    if (image[(((r-1) * cols) + (c+1)) * 4] == 0 && r>0 && c<cols-1) { clue++; };
    if (image[(((r  ) * cols) + (c-1)) * 4] == 0 && c>0) { clue++; };
    if (image[(((r  ) * cols) + (c+1)) * 4] == 0 && c<cols-1) { clue++; };
    if (image[(((r+1) * cols) + (c-1)) * 4] == 0 && r<rows-1 && c>0) { clue++; };
    if (image[(((r+1) * cols) + (c  )) * 4] == 0 && r<rows-1) { clue++; };
    if (image[(((r+1) * cols) + (c+1)) * 4] == 0 && r<rows-1 && c<cols-1) { clue++; };
    return clue;
}

function createBoardElement(row, col, clue){
    // Create HTML element for the tile
    let elem = document.createElement("div");
    elem.id = row.toString() + "-" + col.toString();
    elem.classList.add("tile", "off");
    elem.innerText = clue.toString();
    document.getElementById("board").appendChild(elem);
    return elem;
}

function addClickEventsTo(elem, row, col){
    // Add left and right click listeners
    elem.addEventListener("click", () => leftClickManager(row, col, elem));
    elem.addEventListener('contextmenu', (e) => {
        rightClickManager(e, elem)
    }, false);
}

function leftClickManager(row, col, elem){
    if (gameOver) return;
    changeColor(elem);
    changeState(row, col);
    updateScore(row, col);
    checkForGameOver();
}

function rightClickManager(e, elem){
    e.preventDefault();
    if (!gameOver)
        changeMark(elem);
    return false;
}

function changeColor(elem){
    if (elem.classList.contains("off")){
        elem.classList.remove("off");
        elem.classList.add("on");
    } else {
        elem.classList.remove("on");
        elem.classList.add("off");
    }
}

function changeState(row, col){
    board[row][col].state = !board[row][col].state;
}

function updateScore(row, col){
    if (board[row][col].state == board[row][col].correctState){
        score++;
    }
    else {
        score--;
    }
}

function checkForGameOver(){
    if (score == targetScore){
        gameOver = true;
    }
}

function changeMark(elem){
    if (elem.classList.contains("marked")){
        elem.classList.remove("marked")
    } else {
        elem.classList.add("marked");
    }
    return false;
}

function getCellColor(image, row, col){
    let r = image[((row * cols) + col) * 4];
    let g = image[((row * cols) + col) * 4 + 1];
    let b = image[((row * cols) + col) * 4 + 2];
}