const rows = 16;
const cols = 16;

var score = 0;
var targetScore = 0;
var gameOver = false;
const image = new Array();
const board = new Array();

window.onload = function(){
    initialize();
}

function initialize(){
    // Create the game board
    for (let r = 0; r < rows; r++){
        for(let c = 0; c < cols; c++){
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            tile.classList.add("tile", "off");
            tile.innerText = "0";
            tile.addEventListener("click", (e) => {
            // document.addEventListener("DOMContentLoaded", (e) => {
                if (gameOver) return;
                changeColor(tile);
                //helloWorld(tile);
            });
            document.getElementById("board").appendChild(tile);
        }
    }
}

function changeColor(tile){
    if (tile.classList.contains("off")){
        tile.classList.remove("off");
        tile.classList.add("on");
    } else {
        tile.classList.remove("on");
        tile.classList.add("off");
    }
}

function helloWorld(tile){
    console.log(tile.id);
}