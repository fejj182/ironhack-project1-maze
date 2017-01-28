//Depth first maze generation
//
//1.Start at a random cell
//
//2.Mark the current cell as visited, and get a list of its neighbours.
//	For each neighbour, starting with a randomly selected neighbour:
//
//	If that neighbour hasn't been visited, remove the wall between this cell and
//	that neighbour, and then recurse with that neighbour as the current cell.

function Maze(x,y) {
	this.columns = x;
	this.rows = y;
	this.totalCells = this.columns * this.rows;
	this.currentCell = [Math.floor(Math.random()*y), Math.floor(Math.random()*x)];
	this.visitedCells = [];
	this.numberVisited = 0;
	this.unvisitedCells = [];
}

Maze.prototype.populateCellsArrays = function(){
	var cols = this.columns;
	var rows = this.rows;

	//Visited Cells - grid represented by arrays of [border-top,border-right,border-bottom,border-left]
	//Unvisited Cells - grid represented by whether cell has been visited as part of maze generation process

	for (var i=0; i < rows; i++) {
		this.visitedCells.push([]);
		this.unvisitedCells.push([]);
			for (var j=0; j < cols; j++) {
				this.visitedCells[i].push([0,0,0,0]);
				this.unvisitedCells[i].push(true);
			}
	}

}

Maze.prototype.checkNeighbours = function(){
		var current = this.currentCell;
		var vis = this.visitedCells;
		var unvis = this.unvisitedCells;
	// loop until all cells have been visited

	// while (this.numberVisited < this.totalCells) {

		// create an array of all neighbours
		var neighbours = [[current[0]-1, current[1]],
											[current[0], current[1]+1],
											[current[0]+1, current[1]],
											[current[0], current[1]-1]];
		var notChecked = [];

		// if neighbour has not been checked - is in the unvisited cells array -
		// and inside the game matrix then push to the notChecked array

		for (var k = 0; k < neighbours.length; k++){
			if (neighbours[k][0] > -1
				&& neighbours[k][0] < this.rows
				&& neighbours[k][1] > -1
				&& neighbours[k][1] < this.columns
				&& unvis[neighbours[k][0]][neighbours[k][1]]) {
				notChecked.push(neighbours[k]);
			}
		}

		//if at least one of the neighbours is in the unvisitedCells array, then select one at random
		if (notChecked.length) {
			var next = notChecked[Math.floor(Math.random()*notChecked.length)];

			console.log(current);
			console.log(next);
		}
	// }
}

function createMaze() {
	var myMaze = new Maze(4,6);
	myMaze.populateCellsArrays();
	myMaze.checkNeighbours();
}

createMaze();
