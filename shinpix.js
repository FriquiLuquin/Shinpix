const rows = 16;
const cols = 16;

var score = 0;
var targetScore = 0;
var gameOver = false;
var board;

window.onload = function(){
    setupBoard();
}

function setupBoard(){
    // Read puzzle image
    var image = readImage();
    // Create the game board
    board = createEmptyBoard(rows, cols);
    for (let r = 0; r < rows; r++){
        for(let c = 0; c < cols; c++){
            let state = false;
            let correctState = image[((r * cols) + c) * 4] == 0;
            let clue = calculateCellClue(image, r, c);
            let elem = createBoardElement(r, c, clue);
            // let color = getCellColor(image, r, c);
            board[r][c] = new Cell(state, correctState, clue, elem);
        }
    }
}

function readImage(){
    canvas = document.querySelector("canvas");
    image = document.querySelector("img");
    ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0);
    data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    return data;
}

function createEmptyBoard(rows, cols){
    let arr = new Array(rows);
    for (let i = 0; i < arr.length; i++){
        arr[i] = new Array(cols);
    }
    return arr;
}

function calculateCellClue(image, r, c){
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

function getCellColor(image, row, col){
    let r = image[((row * cols) + col) * 4];
    let g = image[((row * cols) + col) * 4 + 1];
    let b = image[((row * cols) + col) * 4 + 2];
}

function createBoardElement(row, col, clue){
    let elem = document.createElement("div");
    elem.id = row.toString() + "-" + col.toString();
    elem.classList.add("cell", "off");
    elem.innerText = clue.toString();
    elem.addEventListener("click", (e) => {
        if (gameOver) return;
        changeColor(elem);
    });
    elem.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        if (!gameOver)
            changeMark(elem);
        return false;
    }, false);
    document.getElementById("board").appendChild(elem);
    return elem;
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

function changeMark(elem){
    if (elem.classList.contains("marked")){
        elem.classList.remove("marked")
    } else {
        elem.classList.add("marked");
    }
    return false;
}

function helloWorld(elem){
    console.log(elem.id);
}