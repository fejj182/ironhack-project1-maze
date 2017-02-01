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

	$(document).bind("keyup", function controls(e){
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

Game.prototype.spaceBarFunction = function(mode) {

	$(document).bind("keyup", function(e){
		if(e.which === 32){
			if (mode === "attack") {
				console.log("attack");
				newGame.spaceAttack();
			}
			else if (mode === "defend") {
				console.log("defence");
				newGame.spaceDodge();
			}
		}
	})
}

Game.prototype.runBattles = function(){
	randomBattleMode(goblin);

	function randomBattleMode(enemy) {
		//Starts a battle every X seconds
		var battleTime = Math.floor(((Math.random() * 1) + 1)*1000);
		console.log(battleTime);

		setTimeout(function(){
			$(document).off("keyup");									// turn off controls
			console.log("Battle!");
			$("#enemy-xp").html(enemy.health + "XP"); // set enemy xp for specific enemy
			$(".battle").toggleClass("hide");					//display all battle elements
			$(".dodge-bar").toggleClass("hide");

			newGame.spaceBarFunction("attack");

		},battleTime);
	}
}

Game.prototype.spaceAttack = function(){
	function removeHitPower(){
		setTimeout(function(){
			$("#hit-power").remove();
		},750)
	}

	onPressAttack();

	// Attack bar functionality
	function onPressAttack(){
		// on first click, initialises attack bar
		if ($("#attack-bar-white").css("animation").indexOf("upDown") == -1) {
			$("#attack-bar-white").css("animation","upDown 1s linear infinite");
		}
		//on second click, attacks
		else {
			var whiteValue = Number($("#attack-bar-white").css("top").replace(/px/g,""))+9;
			var redValue = Number($("#attack-bar-red").css("top").replace(/px/g,""));
			var yellowValue = Number($("#attack-bar-yellow").css("top").replace(/px/g,""));
			var multiplier;

			if (whiteValue > redValue && whiteValue < redValue + 16) {
				multiplier = 1.5;
				$("#attack-bar-blue").append("<p id='hit-power' style='margin-left: 75px; width: 200px'>POWER BOOST!!!</p>");
				removeHitPower();
			}
			else if (whiteValue > yellowValue && whiteValue < yellowValue + 75){
				multiplier = 1;
				$("#attack-bar-blue").append("<p id='hit-power' style='margin-left: 75px; width: 200px'>Great hit!</p>");
				removeHitPower();
			}
			else {
				multiplier = 0;
				$("#attack-bar-blue").append("<p id='hit-power' style='margin-left: 75px; width: 200px'>Miss!</p>");
				removeHitPower();
			}
			$("#attack-bar-white").css("animation","none");
			$("#attack-bar-white").css("top",whiteValue + "px");

			// After attack run dodge functionality

			$(document).off("keyup"); 												// remove attack function from space bar
			newGame.spaceBarFunction("defend"); 							//	assign defend function onto space bar
			$(".dodge-bar").toggleClass("hide");							//	remove hide from dodge bar elements
			$("#dodge-bar-white").css("animation","leftRight 1s linear infinite");	//animate moving dodge bar

			newGame.runAttack(player,goblin,multiplier);

		}
	}
}

Game.prototype.runAttack = function(attacker,receiver,multiplier) {

	attackSequence(attacker,receiver,multiplier)
	isSomeoneDead(receiver);

	function attackSequence(attacker,receiver,multiplier) {
		// Character prototypal methods
		attacker.attack(multiplier);
		receiver.receiveAttack(attacker,multiplier);

		// Update HTML XP and health bar
		$("#" + receiver.xpId).html(receiver.health + "XP");
		if (receiver.name === "the Wee Man") {
			$("#player-health-bar").css("width",receiver.health * 5 + "px");
		}
		else {
			$("#enemy-health-bar").css("width",receiver.health * 25 + "px");
		}

	}

	function isSomeoneDead(character) {

		// no matter who dies
		if (character.health <= 0) {
			character.health = 0;																		// health cannot go below zero
			$("#" + character.xpId).html(character.health + "XP."); // health updated to zero
			$(document).off("keyup");																// remove all controls
		}

		//if player dies...game over sequence;
		if (character.health <= 0 && character.name == "the Wee Man"){
			setTimeout(function(){
				$("#player-health-bar").append("<p style='width: 200px; font-size: 40px;'>You died.</p>");
			},1500)
		}
		//sequence which takes place when enemy is killed in battle, i.e. to restart the game
		else if (character.health <= 0 && character.name != "the Wee Man"){
			$(".dodge-bar").toggleClass("hide");
			setTimeout(function(){
				character.health = 10; 																						//reset enemy health
				$("#enemy-health-bar").css("width",character.health * 25 + "px"); //reset enemy health bar
				$("#attack-bar-white").css("animation","none");										//stop attack bar animation
				$("#attack-bar-white").css("top: 0"); 														//reset attack bar position

				$(".battle").toggleClass("hide"); 															//hide all battle specific elements
				$(".dodge-bar").toggleClass("hide");
				newGame.initializeControls();																		//reinitialise controls for wee man
				newGame.runBattles(); 																		//restart random encounters
			},750)
		}
	}
}

Game.prototype.spaceDodge = function(){

	//runs only once, as the dodge bar has already been activate on the second press of the attack space bar
	var whiteValue = Number($("#dodge-bar-white").css("left").replace(/px/g,""))+9;
	var greenValue = Number($("#dodge-bar-green").css("left").replace(/px/g,""));
	var multipler;
	$("#dodge-bar-white").css("animation","none");
	$("#dodge-bar-white").css("left",whiteValue + "px");

	if (whiteValue > greenValue && whiteValue < greenValue + 20) {
		multiplier = 0;
		$("#dodge-bar-blue").append("<p id='nice-dodge' style='width: 200px'>Nice dodge!</p>");
		setTimeout(function(){
			$("#nice-dodge").remove();
		},1000)
	}
	else {
		multiplier = 1;
	}

	newGame.runAttack(goblin,player,multiplier);

	setTimeout(function(){
		$(".dodge-bar").toggleClass("hide");
	},750)

	// resets space bar to be able to start next attack
	$(document).off("keyup");
	newGame.spaceBarFunction("attack");

}

var newGame = new Game();
newGame.drawMaze();
newGame.initializeControls();
newGame.initializePlayers();
newGame.runBattles();
