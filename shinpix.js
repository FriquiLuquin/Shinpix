const rows = 16;
const cols = 16;

var score = 0;
var targetScore = 0;
var gameOver = false;
var colorImage;
var image;
var board;

window.onload = function(){
    image = readImage("shinpix");
    colorImage = readImage("answer");
    removeCanvasAndImages("shinpix", "answer");
    board = createEmptyBoard(rows, cols);
    populateBoard(board, image, colorImage);
}

function readImage(id){
    let canvas = document.querySelector("canvas");
    let img = document.getElementById(id);
    let ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    let data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    return data;
}

function removeCanvasAndImages(id1, id2){
    let canvas = document.querySelector("canvas");
    document.querySelector("body").removeChild(canvas);
    let img1 = document.getElementById(id1);
    document.querySelector("body").removeChild(img1);
    let img2 = document.getElementById(id2);
    document.querySelector("body").removeChild(img2);
}

function createEmptyBoard(rows, cols){
    let arr = new Array(rows);
    for (let i = 0; i < rows; i++){
        arr[i] = new Array(cols);
    }
    return arr;
}

function populateBoard(board, image, colorImage){
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
            let color = getImageColor(colorImage, r, c);
            board[r][c] = new Tile(state, correctState, clue, elem, color);
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
    elem.addEventListener('contextmenu', (e) => { rightClickManager(e, elem); }, false);
}

function getImageColor(image, row, col){
    let r = image[((row * cols) + col) * 4];
    let g = image[((row * cols) + col) * 4 + 1];
    let b = image[((row * cols) + col) * 4 + 2];
    return rgbToHex(r, g, b);
}

function leftClickManager(row, col, elem){
    if (gameOver) return;
    flipTile(elem, () => changeColor(elem));
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

function flipTile(elem, colorManager){
    elem.classList.add("flip-in");
    setTimeout(() => {  
        colorManager(elem);
        elem.classList.remove("flip-in");
        elem.classList.add("flip-out");
    }, 200);
    setTimeout(() => { 
        elem.classList.remove("flip-out");
    }, 400);
}

function changeColor(elem){
    if (elem.classList.contains("off")){
        elem.classList.remove("off");
        elem.classList.add("on");
    } 
    else if (elem.classList.contains("on")){
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
        showBoardColors();
    }
}

function showBoardColors(){
    for (let r = 0; r < rows; r++){
        for(let c = 0; c < cols; c++){
            setTimeout(() => {
                let elem = board[r][c].elem;
                flipTile(elem, () => showTileColor(r, c, elem));
            }, (r+c)*200)
        }
    }
}

function showTileColor(row, col, elem){
    let color = board[row][col].color;
    elem.innerText = "";
    elem.classList.remove("on", "off", "marked");
    let answerStyle = "background-color: " + color + "; border: 1px solid " + color + ";";
    elem.style = answerStyle;
}

function changeMark(elem){
    if (elem.classList.contains("marked")){
        elem.classList.remove("marked")
    } else {
        elem.classList.add("marked");
    }
    return false;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}