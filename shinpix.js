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
    // image = readImage();
    // Create the game board
    board = createEmptyBoard(rows, cols);
    for (let r = 0; r < rows; r++){
        for(let c = 0; c < cols; c++){
            elem = createBoardElement(r, c);
            // board[r][c] = new Cell();
        }
    }
}

function readImage(){
    var canvas = document.createElement("canvas");
    canvas.height = 100;
    canvas.width = 100;
    canvas.style = "border: 1px solid";
    document.getElementsByTagName("body")[0].appendChild(canvas);
    var ctx = canvas.getContext("2d");
    var img = new Image();
    img.src = "./images/Shinpix01.png";
    ctx.drawImage(img, 0, 0);
    return canvas;
}

function createEmptyBoard(rows, cols){
    let arr = new Array(rows);
    for (let i = 0; i < arr.length; i++){
        arr[i] = new Array(cols);
    }
    return arr;
}

function createBoardElement(row, col){
    let elem = document.createElement("div");
    elem.id = row.toString() + "-" + col.toString();
    elem.classList.add("cell", "off");
    elem.innerText = "0";
    elem.addEventListener("click", (e) => {
        if (gameOver) return;
        changeColor(elem);
    });
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

function helloWorld(elem){
    console.log(elem.id);
}