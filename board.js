// Board class
const rows = 16;
const cols = 16;

// Constructor
function Board(rows, cols, image, colorImage, grid){
    this.rows = rows;
    this.cols = cols;
    this.score = 0;
    this.targetScore = 0;
    this.strikes = 0;
    this.gameOver = false;
    this.image = image;
    this.colorImage = colorImage;
    this.grid = grid;
}

window.onload = function(){
    const selectedPuzzle = selectRandomPuzzle(jsonPuzzleData);
    loadPuzzle(selectedPuzzle);
}

function selectRandomPuzzle(jsonPuzzleData) {
    const puzzles = jsonPuzzleData.puzzles;
    const randomIndex = Math.floor(Math.random() * puzzles.length);
    return puzzles[randomIndex];
}

function loadPuzzle(puzzleData) {
    console.log("loading image with dimensions:", puzzleData.width, "x", puzzleData.height);
    console.log(puzzleData.pixels);
    document.getElementById("title").innerHTML = puzzleData.title;
    document.getElementById("subtitle").innerHTML = puzzleData.subtitle;
    var grid = createEmptyGrid(puzzleData.height, puzzleData.width);
    var board = new Board(puzzleData.height, puzzleData.width, puzzleData.pixels, puzzleData.colors, grid);
    createTiles(board);
    populateBoard(board);
    document.getElementById("goal").innerHTML = board.targetScore;
    console.log(board)
    document.getElementById("helpMode").addEventListener("click", () => activateHelpMode(board));
}

function createEmptyGrid(rows, cols){
    let arr = new Array(rows);
    for (let i = 0; i < rows; i++){
        arr[i] = new Array(cols);
    }
    return arr;
}

function createTiles(board){
    for (let r = 0; r < board.rows; r++){
        for(let c = 0; c < board.cols; c++){
            let revealed = false;
            let goodTile = false;
            if (isGoodTile(board.image[r][c])){
                goodTile = true;
                board.targetScore++;
            }
            let flagged = false;
            let color = getImageColor(board.colorImage, r, c);
            board.grid[r][c] = new Tile(revealed, goodTile, flagged, color);
        }
    }
}

function isGoodTile(tile){
    return tile[0] == 0 && tile[1] == 0 && tile[2] == 0
}

function getImageColor(image, row, col){
    let r = image[row][col][0];
    let g = image[row][col][1];
    let b = image[row][col][2];
    return rgbToHex(r, g, b);
}

function populateBoard(board){
    for (let r = 0; r < board.rows; r++){
        for(let c = 0; c < board.cols; c++){
            let tile = board.grid[r][c];
            let neighbours = calculateNeighbours(board.grid, r, c, board.rows, board.cols);
            let clue = calculateTileClue(neighbours);
            let elem = createBoardElement(r, c, clue);
            addClickEventsTo(elem, r, c, board);
            tile.elem = elem;
            tile.clue = clue;
            tile.neighbours = neighbours;
            tile.numNeighbours = neighbours.length;
            tile.numRevealedNeighbours = 0;
        }
    }
}

function calculateNeighbours(grid, r, c, rows, cols) {
    let R = rows-1;
    let C = cols-1;
    let neighbours = [];
    if (r>0 && c>0) { neighbours.push(grid[r-1][c-1]) };
    if (r>0       ) { neighbours.push(grid[r-1][c  ]) };
    if (r>0 && c<C) { neighbours.push(grid[r-1][c+1]) };
    if (       c>0) { neighbours.push(grid[r  ][c-1]) };
    if (       c<C) { neighbours.push(grid[r  ][c+1]) };
    if (r<R && c>0) { neighbours.push(grid[r+1][c-1]) };
    if (r<R       ) { neighbours.push(grid[r+1][c  ]) };
    if (r<R && c<C) { neighbours.push(grid[r+1][c+1]) };
    return neighbours;
}

function calculateTileClue(neighbours){
    let clue = 0;
    for (let i = 0; i < neighbours.length; i++){
        if (neighbours[i].goodTile) { clue++ }
    }
    return clue;
}

function createBoardElement(row, col, clue){
    // Create HTML element for the tile
    let elem = document.createElement("div");
    elem.id = row.toString() + "-" + col.toString();
    elem.classList.add("tile", "hidden");
    elem.innerText = clue.toString();
    document.getElementById("board").appendChild(elem);
    return elem;
}

function addClickEventsTo(elem, row, col, board){
    // Add left and right click listeners
    elem.addEventListener("click", () => leftClickManager(row, col, board));
    elem.addEventListener('contextmenu', (e) => { rightClickManager(e, row, col, board); }, false);
}

function leftClickManager(row, col, board){
    if (board.gameOver) return;
    let tile = board.grid[row][col];
    if (tile.flagged) {
        alert("Flagged tiles cannot be revealed");
        return;
    }
    if (tile.revealed) return;
    tile.revealed = true;
    if (tile.goodTile) {
        board.score++;
        document.getElementById("score").innerHTML = board.score;
    }
    else {
        board.strikes++;
        document.getElementById("strikes").innerHTML = board.strikes;
    }
    flipTile(tile, () => changeColor(tile));
    checkForGameOver(board);
}

function rightClickManager(e, row, col, board){
    e.preventDefault();
    if (board.gameOver) return false;
    let tile = board.grid[row][col];
    if (tile.revealed) return false;
    if (tile.flagged) {
        tile.flagged = false;
    }
    else {
        tile.flagged = true
    }
    changeFlag(tile);
    return false;
}

function flipTile(tile, colorManager){
    tile.elem.classList.add("flip-in");
    setTimeout(() => {  
        colorManager(tile);
        tile.elem.classList.remove("flip-in");
        tile.elem.classList.add("flip-out");
    }, 200);
    setTimeout(() => { 
        tile.elem.classList.remove("flip-out");
    }, 400);
}

function changeColor(tile){
    if (tile.revealed){
        tile.elem.classList.remove("hidden");
        if (tile.goodTile){
            tile.elem.classList.add("correct");
        }
        else {
            tile.elem.classList.add("wrong");
        }
    }
}

function changeFlag(tile){
    if (tile.flagged){
        tile.elem.classList.add("flagged");
    }
    else {
        tile.elem.classList.remove("flagged");
    }
    return false;
}

function checkForGameOver(board){
    if (board.score == board.targetScore) {
        board.gameOver = true;
        showBoardColors(board);
        // alert("GAME CLEARED")
    }
    else if (board.strikes == 3) {
        board.gameOver = true;
        // alert("GAME OVER");
    }
}

function showBoardColors(board){
    for (let r = 0; r < board.rows; r++){
        for(let c = 0; c < board.cols; c++){
            setTimeout(() => {
                let tile = board.grid[r][c];
                flipTile(tile, () => showTileColor(tile));
            }, (c*100)) //(r*(board.rows-1)+c)*100)
        }
    }
}

function showTileColor(tile){
    tile.elem.innerText = "";
    // tile.elem.classList.remove("on", "off", "marked");
    let answerStyle = "background-color: " + tile.color + "; border: 3px solid " + tile.color + ";";
    tile.elem.style = answerStyle;
}

function activateHelpMode(board) {
    let R = board.rows-1;
    let C = board.cols-1;
    for (let r = 0; r < board.rows; r++){
        for (let c = 0; c < board.cols; c++){
            let tile = board.grid[r][c];
            if ((tile.clue == 3 && tile.numNeighbours == 3) ||
                (tile.clue == 5 && tile.numNeighbours == 5) ||
                (tile.clue == 8)){
                revealNeighbours(tile, board)
            }
            else if (tile.clue == 0){
                flagNeighbours(tile, board)
            }
        }
    }
}

function revealNeighbours(tile, board){
    for (let i = 0; i < tile.numNeighbours; i++){
        if (tile.neighbours[i].revealed == false){
            tile.neighbours[i].revealed = true;
            flipTile(tile.neighbours[i], () => changeColor(tile.neighbours[i]));
            board.score++;
            document.getElementById("score").innerHTML = board.score;
        }
    }
}

function flagNeighbours(tile, board){
    for (let i = 0; i < tile.numNeighbours; i++){
        if (tile.neighbours[i].flagged == false){
            tile.neighbours[i].flagged = true;
            changeFlag(tile.neighbours[i]);
        }
    }
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}