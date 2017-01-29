$(document).ready(function(){

	// Draw maze

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

	///////////////////
	// Items and weapons
	///////////////////

	var weapons = [
		{	type: "fists",
			attackPower: 2
		},
		{	type: "Pitchfork",
			attackPower: 4
		}
	];

	///////////////////
	// Player Prototype
	///////////////////

	function Player1() {
		this.name = "Jeff";
		this.location = [(disp[0].length-1),(disp.length-1)];
		this.health = 50;
		this.weapon = weapons[0];
	}

	Player1.prototype.checkForWall = function(direction){
		var checkSelector = this.location[0] + "-" + (player.location[1]);
		var border = $("#" + checkSelector).css("border-" + direction);
		var borderCheck = border.indexOf("2px") == -1;

		return borderCheck;
	}

	Player1.prototype.movePlayer = function(){

	// move function used in multiple locations within bind function below
	function move(newLocationCommand) {
		$("#" + selector).html("");
		newLocationCommand;
		//overwrite selector after move
		selector = player.location[0] + '-' + player.location[1];
		$("#" + selector).html("<i class='fa fa-child' aria-hidden='true'></i>");
	}

		$(document).bind('keyup', function(e){
			var selector = player.location[0] + "-" + player.location[1];
				if(e.which==37 && player.checkForWall("left")) {
					//left
					move(player.location[1]--);
				}
				if(e.which==38 && player.checkForWall("top")) {
					//up
					move(player.location[0]--);
				}
				if(e.which==39 && player.checkForWall("right")) {
					//right
					move(player.location[1]++);
				}
				if(e.which==40 && player.checkForWall("bottom")) {
					//down
					move(player.location[0]++);
				}
		})
	}

	var player = new Player1();
	player.movePlayer();

	/////////////////
	//Enemy Prototype
	/////////////////

	function Enemy(name,health,weaponNumber) {
		this.name = name;
		this.health = health;
		this.weapon = weapons[weaponNumber];
	}

	var goblin = new Enemy("Goblin",20,1);

	console.log(player);
	console.log(goblin);

})
