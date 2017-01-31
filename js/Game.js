function Game(){
	this.maze = maze;

	this.characters = {
		player : player,
		enemies : [goblin]
	};

	this.items = {
		weapons: weapons,
		playerItems : [],
		collectibles : []
	};
}


//investigate scope issue with selector variable
var selector;

Game.prototype.drawMaze = function() {

	$("#maze > tbody").remove();
	$("#maze").append("<tbody></tbody>");
	for (var i = 0; i < maze.length; i++) {
			$("#maze > tbody").append("<tr>");
			for (var j = 0; j < maze[i].length; j++) {
					selector = i+"-"+j;
					$("#maze > tbody").append("<td id='"+selector+"'>&nbsp;</td>");
					if (maze[i][j][0] == 0) { $("#"+selector).css("border-top", "2px solid black"); }
					if (maze[i][j][1] == 0) { $("#"+selector).css("border-right", "2px solid black"); }
					if (maze[i][j][2] == 0) { $("#"+selector).css("border-bottom", "2px solid black"); }
					if (maze[i][j][3] == 0) { $("#"+selector).css("border-left", "2px solid black"); }
			}
			$("#maze > tbody").append("</tr>");
	}
	$("#0-0").css("border-top","none");
	$("#" + selector).css("border-right","none");
	$("#" + selector).html("<i class='fa fa-child' aria-hidden='true'></i>");
}

Game.prototype.initializeControls = function playerControls(){
	// move function used in multiple locations within bind function below

	$(document).bind("keyup", function(e){
	var selector = player.location[0] + "-" + player.location[1];
			if(e.which==37 && checkForWall("left")) {
				//left
				movePlayer(player.location[1]--);
			}
			if(e.which==38 && checkForWall("top")) {
				//up
				movePlayer(player.location[0]--);
				//	DRAW NEW MAZE IF PLAYER WINS
				if (player.location[0] < 0) {
					player.location = [(maze[0].length-1),(maze.length-1)];
					console.log(player.location);
					mazeObject = new mazeBuilder(15,15);
					mazeObject.populateCellsArrays();
					mazeObject.checkNeighbours();
					maze = mazeObject.maze;
					newGame.drawMaze();
				}
			}
			if(e.which==39 && checkForWall("right") && (player.location[1]+1) < mazeObject.columns) {
				//right
				movePlayer(player.location[1]++);
			}
			if(e.which==40 && checkForWall("bottom")) {
				//down
				movePlayer(player.location[0]++);
			}
	})

	function checkForWall(direction){
		var checkSelector = player.location[0] + "-" + (player.location[1]);
		var border = $("#" + checkSelector).css("border-" + direction);
		var borderCheck = border.indexOf("2px") == -1;
		return borderCheck;
	}

	function movePlayer(newLocationCommand) {

		$("#" + selector).html("");
		newLocationCommand;
		//overwrite selector after move
		selector = player.location[0] + "-" + player.location[1];
		$("#" + selector).html("<i class='fa fa-child' aria-hidden='true'></i>");
	}
}

Game.prototype.initializePlayers = function() {
	$("#your-xp").html(player.health + "XP");
}

Game.prototype.runBattles = function(){
	randomBattleMode(goblin);

	function randomBattleMode(enemy) {
		//Starts a battle every X seconds
		var battleTime = Math.floor(((Math.random() * 5) + 5)*1000);
		console.log(battleTime);

		setTimeout(function(){
			$(document).off("keyup");									// turn off controls
			console.log("Battle!");
			$("#enemy-xp").html(enemy.health + "XP"); // set enemy xp for specific enemy
			$(".battle").toggleClass("hide");					//display all battle elements

			onClickAttack();
		},battleTime);
	}

	// Attack bar functionality

	function onClickAttack(){
		$("#attack-button").on("click",function(){
			// on first click, initialises attack bar
			if ($("#attack-bar-white").css("animation").indexOf("upDown") == -1) {
				$("#attack-bar-white").css("animation","upDown 2.5s linear infinite");
			}
			//on second click, attacks
			else {
				var whiteValue = Number($("#attack-bar-white").css("top").replace(/px/g,""));
				var redValue = Number($("#attack-bar-red").css("top").replace(/px/g,""));
				if (whiteValue > redValue && whiteValue < redValue + 20) {
					$("#attack-bar-blue").append("<p style='margin-left: 75px; width: 200px'>Bad Mutha POWER BOOST!!!</p>");
				};
				$("#attack-bar-white").css("animation","none");
				attackInTurns();
			}
		})
	}

	// Dodge bar functionality - will go here

	//////////////////
	// Attack in turns
	//////////////////

	function attackInTurns() {
		// Player turn
    attackSequence(player,goblin)
		isSomeoneDead(goblin);
		// Enemy turn
		attackSequence(goblin,player);
		isSomeoneDead(player);
	};

	function isSomeoneDead(character) {
		//if player dies...game over sequence;
		if (character.health <= 0 && character.name == "the Wee Man"){
			$("#attack-button").off("click");
			$(document).off("keyup");

			character.health = 0;
			$("#" + character.xpId).html(character.health + "XP.");
			$("#player-health-bar").append("<p style='width: 200px; font-size: 40px;'>You died.</p>");
			console.log(character.name + " has died in act of combat. Game Over.");

		}
		//sequence which takes place when enemy is killed in battle, i.e. to restart the game
		else if (character.health <= 0 && character.name != "the Wee Man"){
			$("#attack-button").off("click");
			character.health = 5; 																						//reset enemy health
			$("#enemy-health-bar").css("width",character.health * 50 + "px"); //reset enemy health bar
			$("#attack-bar-white").css("animation","none"); 							//stop attack bar animation

			console.log("You killed " + character.name + ", nice.");
			console.log(player.name + " has " + player.health + "XP left.");

			$(".battle").toggleClass("hide"); 														//hide all battle specific elements
			newGame.initializeControls();																							//reinitialise controls for wee man
			randomBattleMode(character); 																	//restart random encounters
		}
	}

	function attackSequence(attacker,receiver) {
		// Character prototypal methods
		attacker.attack();
		receiver.receiveAttack(attacker);

		// Update HTML XP and health bar
		$("#" + receiver.xpId).html(receiver.health + "XP");
		if (receiver.name === "the Wee Man") {
			$("#player-health-bar").css("width",receiver.health * 5 + "px");
		}
		else {
			$("#enemy-health-bar").css("width",receiver.health * 50 + "px");
		}

	}
}

var newGame = new Game();
newGame.drawMaze();
newGame.initializeControls();
newGame.initializePlayers();
newGame.runBattles();
