var rows = 16;
var cols = 16;

var gameOver = false;

window.onload = function(){
    initialize();
}

function initialize(){
    // Create the game board
    for (let r = 0; r < rows; r++){
        for(let c = 0; c < cols; c++){
            let tile = document.createElement("span");
            tile.id = r.toString() + "-" + c.toString();
            tile.classList.add("tile");
            tile.innerText = "0";
            tile.addEventListener("click", (e) => {
            // document.addEventListener("DOMContentLoaded", (e) => {
                if (gameOver) return;
            
                alert(tile.id);
            });
            document.getElementById("board").appendChild(tile);
        }
    }
}