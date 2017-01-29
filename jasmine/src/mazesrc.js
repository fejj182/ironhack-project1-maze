///////////////
//////////PART 1 - maze.js
///////////

function Maze(x,y) {
	this.columns = x;
	this.rows = y;
	this.totalCells = this.columns * this.rows;
	this.currentCell = [Math.floor(Math.random()*y), Math.floor(Math.random()*x)];
	this.path = [];
	this.visitedCells = [];
	this.numberVisited = 0;
	this.unvisitedCells = [];
}

Maze.prototype.populateCellsArrays = function(){
	var cols = this.columns;
	var rows = this.rows;
	var current = this.currentCell;
	var vis = this.visitedCells;
	var unvis = this.unvisitedCells;

	//	Visited Cells - grid represented by arrays of [border-top,border-right,border-bottom,border-left]
	//	Unvisited Cells - grid represented by whether cell has been visited as part of maze generation process

	for (var i=0; i < rows; i++) {
		vis.push([]);
		unvis.push([]);
			for (var j=0; j < cols; j++) {
				vis[i].push([0,0,0,0]);
				unvis[i].push(true);
			}
	}

	//	Mark current cell as visited within the unvisited array & increase the number of visited cells by 1
	this.path.push(current);
	unvis[current[0]][current[1]] = false;
	this.numberVisited++;

}

Maze.prototype.checkNeighbours = function(){
	var vis = this.visitedCells;
	var unvis = this.unvisitedCells;
	var path = this.path;

	// loop until all cells have been visited

	while (this.numberVisited < this.totalCells) {
		var current = this.currentCell;

		// create an array of all neighbours
		// index [0]&[1] representing the position of the neighbours and index [2]&[3] representing the
		// border between the current cell and the neighbour, the first being from the perspective of the
		// current cell and the second from the perspective of the neighbour cell

		// i.e. if a neighbour above is chosen, the top wall of the current cell and the bottom wall of the
		// neighbour cell will  be 'dissolved'

		var neighbours = [[current[0]-1, current[1],0,2],
											[current[0], current[1]+1,1,3],
											[current[0]+1, current[1],2,0],
											[current[0], current[1]-1,3,1]];
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

			//remove border between two cells, by changing the matching value in each array
			vis[current[0]][current[1]][next[2]] = 1;
			vis[next[0]][next[1]][next[3]] = 1;

			// Mark the neighbor as visited, and set it as the current cell
			unvis[next[0]][next[1]] = false;
			this.numberVisited++;
			this.currentCell = [next[0], next[1]];
			path.push(this.currentCell);
		}
			else {
					this.currentCell = path.pop();
		}

	}
}

function createMaze() {
	var myMaze = new Maze(20,20);
	myMaze.populateCellsArrays();
	myMaze.checkNeighbours();
	return myMaze;
}

////////////
////////// PART 2 - game.js
////////////

var myMaze = createMaze();
var disp = myMaze.visitedCells;
for (var i = 0; i < disp.length; i++) {
		$('#maze > tbody').append("<tr>");
		for (var j = 0; j < disp[i].length; j++) {
				var selector = i+"-"+j;
				$('#maze > tbody').append("<td id='"+selector+"'>&nbsp;</td>");
				if (disp[i][j][0] == 0) { $('#'+selector).css('border-top', '2px solid black'); }
				if (disp[i][j][1] == 0) { $('#'+selector).css('border-right', '2px solid black'); }
				if (disp[i][j][2] == 0) { $('#'+selector).css('border-bottom', '2px solid black'); }
				if (disp[i][j][3] == 0) { $('#'+selector).css('border-left', '2px solid black'); }
		}
		$('#maze > tbody').append("</tr>");
}

$("#0-0").css("border-top","none");
$("#19-19").css("border-right","none");
$("#19-19").html("<i class='fa fa-child' aria-hidden='true'></i>");

//Player functions

function Player1() {
	this.name = "Jeff";
	this.location = [(disp[0].length-1),(disp.length-1)];
}

Player1.prototype.movePlayer = function(){

	$(document).bind('keyup', function(e){
		var selector = player.location[0] + "-" + player.location[1];
			if(e.which==37) {
				//left
				$("#" + selector).html("");
				player.location[1]--;
				selector = player.location[0] + '-' + player.location[1];
				$("#" + selector).html("<i class='fa fa-child' aria-hidden='true'></i>");
			}
			if(e.which==38) {
				//up
				$("#" + selector).html("");
				player.location[0]--;
				selector = player.location[0] + '-' + player.location[1]
				$("#" + selector).html("<i class='fa fa-child' aria-hidden='true'></i>");
			}
			if(e.which==39) {
				//right
				$("#" + selector).html("");
				player.location[1]++;
				selector = player.location[0] + '-' + player.location[1]
				$("#" + selector).html("<i class='fa fa-child' aria-hidden='true'></i>");
			}
			if(e.which==40) {
				//down
				$("#" + selector).html("");
				player.location[0]++;
				selector = player.location[0] + '-' + player.location[1]
				$("#" + selector).html("<i class='fa fa-child' aria-hidden='true'></i>");
			}
	});
}

function createPlayer(){
	var player = new Player1();
	player.movePlayer();
	return player;
}
