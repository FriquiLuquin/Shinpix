// Tile class

// Constructors
function Tile(state, correctState, clue, elem){
    this.state = state;
    this.correctState = correctState;
    this.clue = clue;
    this.elem = elem
}

function Tile(state, correctState, clue, elem, color){
    this.state = state;
    this.correctState = correctState;
    this.clue = clue;
    this.elem = elem;
    this.color = color;
}

