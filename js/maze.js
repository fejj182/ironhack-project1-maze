function Maze(x,y) {
	this.totalCells = x*y;
	this.firstCell = [Math.floor(Math.random()*x), Math.floor(Math.random()*y)];
	this.visitedCells = [];
	this.numberVisited = 0;
}

var myMaze = new Maze(5,5);

console.log(myMaze.path);
