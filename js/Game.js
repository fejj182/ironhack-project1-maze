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
var selector, randomBoxSelector, randomItem;

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

	$("#0-0").css({"border-top":"none", "background-color":"chartreuse"});
	$("#" + selector).css("border-right","none");
	$("#" + selector).html("<i class='fa fa-child' aria-hidden='true'></i>");
	$("#your-hp").html(player.health + "HP");

	var randomBox = [Math.floor(Math.random()*maze.length),Math.floor(Math.random()*maze.length)];
	randomBoxSelector = randomBox[0] + "-" + randomBox[1];
	$("#" + randomBoxSelector).html("<img src=" + mysteryBoxes.image + " class='mystery-box'>");

	var randomItemNumber = Math.floor(Math.random()*2);
	randomItem = mysteryBoxes["items"][randomItemNumber];
	if (randomItemNumber == 0) {
		randomItem = mysteryBoxes["items"][randomItemNumber]["fullHealth"];
	}
	else if (randomItemNumber == 1) {
		randomItem = mysteryBoxes["items"][randomItemNumber]["class"];
	}
}

Game.prototype.showInstructions = function() {
	setTimeout(function(){
		$("h2:first-child").toggleClass("disappear");
		$("h2:nth-child(2)").toggleClass("disappear"); //becomes first child when first one is removed
	},2000)
	setTimeout(function(){
		$("h2:nth-child(2)").toggleClass("disappear");
		$(".instructions").toggleClass("disappear")
		$("#arrow, #space-bar").css("animation","none");
	},4000)
	setTimeout(function(){
		$("#0-0").css({"border-top":"none", "background-color":"chartreuse", "animation":"flashing 0.4s infinite"});
		$("#arrows-pic").css("animation","flashing 0.4s infinite");
	},4000)
	setTimeout(function(){
		$("#0-0").css({"animation":"none"});
		$("#arrows-pic").css({"animation":"none"});
		$("#start-game").toggleClass("hide");
		$("#start-game").css("animation","flashing 1s infinite");
	},6000)
}

var level = 1;

Game.prototype.initializeControls = function playerControls(){
	// move function used in multiple locations within bind function below

	$(document).bind("keyup", function controls(e){
		e.preventDefault();
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
				mazeObject = new mazeBuilder(15,15);
				mazeObject.populateCellsArrays();
				mazeObject.checkNeighbours();
				maze = mazeObject.maze;
				newGame.drawMaze();
				level++;
				$("#level").html(level);
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
		var border;
		switch(direction) {
			case "left":
				border = document.getElementById(checkSelector).style.borderLeft;
				break;
			case "top":
				border = document.getElementById(checkSelector).style.borderTop;
				break;
			case "right":
				border = document.getElementById(checkSelector).style.borderRight;
				break;
			case "bottom":
				border = document.getElementById(checkSelector).style.borderBottom;
				break;
		}
		// border.indexOf("2px") == -1 ? true : false;
		if (border.indexOf("2px") == -1) {
			return true;
		}
		return false;
	}

	function movePlayer(newLocationCommand) {

		$("#" + selector).html("");
		newLocationCommand;
		//overwrite selector after move
		selector = player.location[0] + "-" + player.location[1];
		if(selector == randomBoxSelector) {
			if (randomItem == "upsideDownMap") {
				$("#maze").toggleClass("upsideDownMap");
				randomBoxSelector = [0,0];
				setTimeout(function(){
					$("#maze").toggleClass("upsideDownMap")
				},25000)
			}
			else if (randomItem === "50") {
				player.health = 50;
				$("#your-hp").html(player.health + "HP");
				$("#player-health-bar").css("width","300px");
			}
		}
		$("#" + selector).html("<i class='fa fa-child' aria-hidden='true'></i>");
	}

	function uxHelp(){
		$("#attack-button").on("click",function(){
			$("#battle-instructions p:first-child").toggleClass("hide");
			setTimeout(function(){
				$("#battle-instructions p:first-child").toggleClass("hide");
			},2000)
		})
		$("#dodge-button").on("click",function(){
			$("#battle-instructions p:nth-child(2)").toggleClass("hide");
			setTimeout(function(){
				$("#battle-instructions p:nth-child(2)").toggleClass("hide");
			},2000)
		})
	}

	uxHelp();
}

Game.prototype.spaceBarFunction = function(mode) {

	$(document).bind("keyup", function(e){
	e.preventDefault();
		if(e.which == 32){
			if (mode === "attack") {
				newGame.spaceAttack();
			}
			else if (mode === "defend") {
				newGame.spaceDodge();
			}
		}
	})
}

Game.prototype.runBattles = function(){
	randomBattleMode(goblin);

	function randomBattleMode(enemy) {
		//Starts a battle every X seconds
		var battleTime = Math.floor(((Math.random() * 5) + 7.5)*1000);
		// var battleTime = Math.floor(((Math.random() * 1) + 1)*1000);

		setTimeout(function(){
			$(document).off("keyup");									// turn off controls
			$("#enemy-hp").html(enemy.health + "HP"); // set enemy hp for specific enemy
			$(".battle").toggleClass("hide");					//display all battle elements
			$(".dodge-bar").toggleClass("hide");

			newGame.spaceBarFunction("attack");

		},battleTime);
	}
}

var clickNumber = 1;

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
		if (clickNumber ==1) {
			$("#attack-bar-white").css("animation","upDown 1.25s linear infinite");
			clickNumber = 2;
		}
		//on second click, attacks
		else {
			clickNumber = 1;

			var whiteValue = Number($("#attack-bar-white").css("top").replace(/px/g,""))+9;
			var redValue = Number($("#attack-bar-red").css("top").replace(/px/g,""));
			var yellowValue = Number($("#attack-bar-yellow").css("top").replace(/px/g,""));
			var multiplier;

			if (whiteValue > redValue && whiteValue < redValue + 16) {
				multiplier = 1.5;
				$("#attack-button").css("animation","flashRed 0.5s");
				$("#attack-bar-blue").append("<p id='hit-power' style='margin-left: 75px; width: 250px'>Damage: " + (multiplier*player.weapon.attackPower) + " HP. POWER BOOST!!!</p>");
				removeHitPower();
			}
			else if (whiteValue > yellowValue && whiteValue < yellowValue + 75){
				multiplier = 1;
				$("#attack-button").css("animation","flashYellow 0.5s");
				$("#attack-bar-blue").append("<p id='hit-power' style='margin-left: 75px; width: 250px'>Damage: " + (multiplier*player.weapon.attackPower) + " HP. Great hit!</p>");
				removeHitPower();
			}
			else {
				multiplier = 0;
				$("#attack-button").css("animation","flashBlue 0.5s");
				$("#attack-bar-blue").append("<p id='hit-power' style='margin-left: 75px; width: 250px'>Miss!</p>");
				removeHitPower();
			}
			$("#attack-bar-white").css("animation","none");
			$("#attack-bar-white").css("top",whiteValue + "px");
			$("#dodge-button").css("animation","flashGrey 0.5s infinite");

			// After attack run dodge functionality
			$(document).off("keyup"); 												// remove attack function from space bar
			newGame.spaceBarFunction("defend"); 							//	assign defend function onto space bar
			$(".dodge-bar").toggleClass("hide");							//	remove hide from dodge bar elements
			$("#dodge-bar-white").css("animation","leftRight 1.25s linear infinite");	//animate moving dodge bar

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

		// Update HTML HP and health bar
		$("#" + receiver.hpId).html(receiver.health + "HP");
		if (receiver.name === "the Wee Man") {
			$("#player-health-bar").css("width",receiver.health * 6 + "px");
		}
		else {
			$("#enemy-health-bar").css("width",receiver.health * 30 + "px");
		}

	}

	function isSomeoneDead(character) {

		// no matter who dies
		if (character.health <= 0) {
			character.health = 0;																		// health cannot go below zero
			$("#" + character.hpId).html(character.health + "HP."); // health updated to zero
			$(document).off("keyup");																// remove all controls
		}

		//if player dies...game over sequence;
		if (character.health <= 0 && character.name == "the Wee Man"){
			setTimeout(function(){
				$("#player-health-bar").append("<p style='width: 250px; font-size: 40px;'>You died.</p>");
				$("#attack-button").css("animation","none");
			},1500)
		}
		//sequence which takes place when enemy is killed in battle, i.e. to restart the game
		else if (character.health <= 0 && character.name != "the Wee Man"){
			$(".dodge-bar").toggleClass("hide");
			setTimeout(function(){
				character.health = 10; 																						//reset enemy health
				$("#enemy-health-bar").css("width",character.health * 30 + "px"); //reset enemy health bar
				$("#attack-bar-white").css("animation","none");										//stop attack bar animation
				$("#attack-bar-white").css("top: 0"); 														//reset attack bar position
				$("#attack-button").css("animation","flashGrey 0.5s infinite");
				$("#dodge-button").css("animation","none");
				$("#keep-fighting").append("<p id='keep-running'>ENEMY DEAD. KEEP RUNNING!</p>");

				$(".battle").toggleClass("hide"); 															//hide all battle specific elements
				$(".dodge-bar").toggleClass("hide");
				newGame.initializeControls();																		//reinitialise controls for wee man
				newGame.runBattles(); 																		//restart random encounters
			},750)
			setTimeout(function(){
				$("#keep-running").remove();
			},1500)

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

	if (whiteValue > greenValue && whiteValue < greenValue + 25) {
		multiplier = 0;
		$("#dodge-button").css("animation","flashGreen 0.75s");
		$("#dodge-bar-blue").append("<p id='nice-dodge' style='width: 250px'>Nice dodge! No damage taken</p>");
		$("#keep-fighting").append("<p id='try-again'>KEEP FIGHTING!</p>");

		setTimeout(function(){
			$("#nice-dodge").remove();
			$("#attack-button").css("animation","flashGrey 0.5s infinite");
		},1000)
		setTimeout(function(){
			$("#try-again").remove();
		},2000)

	}
	else {
		$("#dodge-button").css("animation","flashBlue 0.5s");
		multiplier = 1;
		$("#dodge-bar-blue").append("<p id='nice-dodge' style='width: 250px'>You lost " + (goblin.weapon.attackPower) + " HP. Ouch!</p>");
		$("#keep-fighting").append("<p id='try-again'>KEEP FIGHTING!</p>");
		setTimeout(function(){
			$("#nice-dodge").remove();
			$("#attack-button").css("animation","flashGrey 0.5s infinite");
		},1000)
		setTimeout(function(){
			$("#try-again").remove();
		},2000)
	}

	// resets space bar to be able to start next attack
	$(document).off("keyup");
	newGame.spaceBarFunction("attack");

	newGame.runAttack(goblin,player,multiplier);

	setTimeout(function(){
		$(".dodge-bar").toggleClass("hide");
	},750)

}

Game.prototype.runGame = function(){
	setTimeout(function(){
		$(document).on("keyup",function(e){
			e.preventDefault();
			if (e.which == 32) {
				$("#second-col").prepend("<h1>RUN!</h1>");
				$("#start-game").remove();
				$(".instructions").remove();
				newGame.initializeControls();
				newGame.runBattles();
				setTimeout(function(){
					$("#second-col h1").remove();
				},1500)
			}
		})
	},6000)
}

var newGame = new Game();
newGame.drawMaze();
newGame.showInstructions();
newGame.runGame();
