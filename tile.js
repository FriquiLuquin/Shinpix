// Tile class

// Constructor
function Tile(revealed, goodTile, flagged, color){
    this.revealed = revealed;
    this.goodTile = goodTile;
    this.flagged = flagged;
    this.color = color;
    this.elem;
    this.clue;
    this.neighbours;
    this.numNeighbours;
    this.numRevealedNeighbours;
}

