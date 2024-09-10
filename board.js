// Board class
const rows = 16;
const cols = 16;

// Constructor
function Board(rows, cols, image, colorImage, grid){
    this.rows = rows;
    this.cols = cols;
    this.score = 0;
    this.targetScore = 0;
    this.gameOver = false;
    this.image = image;
    this.colorImage = colorImage;
    this.grid = grid;
}

window.onload = function(){
    const selectedImage = selectRandomImage(jsonData);
    processImage(selectedImage);
}

function selectRandomImage(jsonData) {
    const puzzles = jsonData.puzzles;
    const randomIndex = Math.floor(Math.random() * puzzles.length);
    return puzzles[randomIndex];
}

function processImage(imageData) {
    console.log("Processing image with dimensions:", imageData.width, "x", imageData.height);
    console.log(imageData.pixels);
    var grid = createEmptyGrid(rows, cols);
    var board = new Board(rows, cols, imageData.pixels, imageData.pixels, grid);
    populateBoard(board);
}

function createEmptyGrid(rows, cols){
    let arr = new Array(rows);
    for (let i = 0; i < rows; i++){
        arr[i] = new Array(cols);
    }
    return arr;
}

function populateBoard(board){
    for (let r = 0; r < board.rows; r++){
        for(let c = 0; c < board.cols; c++){
            let revealed = false;
            let goodTile = false;
            if (isGoodTile(board.image[r][c])){
                goodTile = true;
                board.targetScore++;
            }
            let flagged = false;
            let clue = calculateTileClue(board.image, r, c, board.rows, board.cols);
            let elem = createBoardElement(r, c, clue);
            addClickEventsTo(elem, r, c, board);
            // let color = getImageColor(board.colorImage, r, c, board.cols);
            board.grid[r][c] = new Tile(revealed, goodTile, flagged, clue, elem);
        }
    }
    console.log(board)
}

function isGoodTile(tile){
    return tile[0] == 0 && tile[1] == 0 && tile[2] == 0
}

function calculateTileClue(image, r, c, rows, cols){
    let R = rows-1;
    let C = cols-1;
    let clue = 0;
    // Count neighbours that must be revealed
    if (r>0 && c>0 && isGoodTile(image[r-1][c-1])) { clue++; };
    if (r>0        && isGoodTile(image[r-1][c  ])) { clue++; };
    if (r>0 && c<C && isGoodTile(image[r-1][c+1])) { clue++; };
    if (       c>0 && isGoodTile(image[r  ][c-1])) { clue++; };
    if (       c<C && isGoodTile(image[r  ][c+1])) { clue++; };
    if (r<R && c>0 && isGoodTile(image[r+1][c-1])) { clue++; };
    if (r<R        && isGoodTile(image[r+1][c  ])) { clue++; };
    if (r<R && c<C && isGoodTile(image[r+1][c+1])) { clue++; };
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

function addClickEventsTo(elem, row, col, board){
    // Add left and right click listeners
    elem.addEventListener("click", () => leftClickManager(row, col, elem, board));
    elem.addEventListener('contextmenu', (e) => { rightClickManager(e, elem, board); }, false);
}

function getImageColor(image, row, col, cols){
    let r = image[((row * cols) + col) * 4];
    let g = image[((row * cols) + col) * 4 + 1];
    let b = image[((row * cols) + col) * 4 + 2];
    return rgbToHex(r, g, b);
}

function leftClickManager(row, col, elem, board){
    if (board.gameOver) return;
    flipTile(elem, () => changeColor(elem));
    changeState(board.grid, row, col);
    updateScore(board, row, col);
    checkForGameOver(board);
}

function rightClickManager(e, elem, board){
    e.preventDefault();
    if (!board.gameOver)
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

function changeState(grid, row, col){
    grid[row][col].state = !grid[row][col].state;
}

function updateScore(board, row, col){
    if (board.grid[row][col].state == board.grid[row][col].correctState){
        board.score++;
    }
    else {
        board.score--;
    }
}

function checkForGameOver(board){
    if (board.score == board.targetScore){
        board.gameOver = true;
        showBoardColors(board);
    }
}

function showBoardColors(board){
    for (let r = 0; r < board.rows; r++){
        for(let c = 0; c < board.cols; c++){
            setTimeout(() => {
                let elem = board.grid[r][c].elem;
                flipTile(elem, () => showTileColor(r, c, elem, board.grid));
            }, (r+c)*100)
        }
    }
}

function showTileColor(row, col, elem, grid){
    let color = grid[row][col].color;
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