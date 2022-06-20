clues = [[1,2,3,3,3,2,1],
         [2,2,3,2,2,1,1],
         [3,4,7,6,6,4,2],
         [2,2,3,2,3,2,2],
         [2,4,6,6,7,4,3],
         [1,1,2,2,3,2,2],
         [1,2,3,3,3,2,1]];

ruleBoards = document.getElementsByClassName("rule-board");
for (let board = 0; board < 4; board++){
    for (let row = 0; row < 7; row++){
        for(let col = 0; col < 7; col++){
            let elem = document.createElement("div");
            elem.id = board.toString() + ":" + row.toString() + "-" + col.toString();
            elem.classList.add("tile", "off");
            elem.innerText = clues[row][col];
            ruleBoards[board].appendChild(elem);
        }
    }
}