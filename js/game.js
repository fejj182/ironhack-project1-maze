$(document).ready(function(){

	// Draw maze
	var myMaze = createMaze(), disp, selector;

	function drawMaze(myMaze) {
		disp = myMaze.visitedCells;
		$("#maze > tbody").remove();
		$("#maze").append("<tbody></tbody>");
		for (var i = 0; i < disp.length; i++) {
				$("#maze > tbody").append("<tr>");
				for (var j = 0; j < disp[i].length; j++) {
						selector = i+"-"+j;
						$("#maze > tbody").append("<td id='"+selector+"'>&nbsp;</td>");
						if (disp[i][j][0] == 0) { $("#"+selector).css("border-top", "2px solid black"); }
						if (disp[i][j][1] == 0) { $("#"+selector).css("border-right", "2px solid black"); }
						if (disp[i][j][2] == 0) { $("#"+selector).css("border-bottom", "2px solid black"); }
						if (disp[i][j][3] == 0) { $("#"+selector).css("border-left", "2px solid black"); }
				}
				$("#maze > tbody").append("</tr>");
		}
		$("#0-0").css("border-top","none");
		$("#" + selector).css("border-right","none");
		$("#" + selector).html("<i class='fa fa-child' aria-hidden='true'></i>");
	}

	drawMaze(myMaze);

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
	// Character prototype & methods
	///////////////////

	function Character(name,health,weapon) {
		this.name = name;
		this.health = health;
		this.weapon = weapon;
	}

	Character.prototype.attack = function(){
	  return this.weapon["attackPower"];
	};

	Character.prototype.receiveAttack = function(attacker){
	  this.health -= attacker.attack();

		//if player dies...game over;
		if (this.health <= 0 && this.name === "the Wee Man"){
			$("#attack-button").off("click");
			$(document).off("keyup");

			this.health = 0;
			$("#" + player.xpId).html(this.health + "XP.");
			$("#player-health-bar").append("<p style='width: 200px; font-size: 40px;'>You died.</p>");
			console.log(this.name + " has died in act of combat. Game Over.");

	  }
		//sequence which takes place when enemy is killed in battle, i.e. to restart the game
	  else if (attacker.health <= 0){
			$("#attack-button").off("click");
	    attacker.health = 5; 																						//reset enemy health
			$("#enemy-health-bar").css("width",attacker.health * 50 + "px"); //reset enemy health bar
			$("#attack-bar-white").css("animation","none"); 							//stop attack bar animation

	    console.log("You killed " + attacker.name + ", nice.");
			console.log(this.name + " has " + this.health + "XP left.");

			$(".battle").toggleClass("hide"); 														//hide all battle specific elements
			playerControls();																							//reinitialise controls for wee man
			randomBattleMode(attacker); 																	//restart random encounters
	  }
	};

	///////////////////
	// Player Prototype
	///////////////////

	function Player1(name,health,weapon) {
		Character.call(this,name,health,weapon);
		this.name = name;
		this.location = [(disp[0].length-1),(disp.length-1)];
		this.health = health;
		this.weapon = weapon;
		this.xpId = "your-xp";
	}

	Player1.prototype = Object.create(Character.prototype);

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

	function playerControls(){
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
						player.location = [(disp[0].length-1),(disp.length-1)];
						var newMaze = createMaze();
						drawMaze(newMaze);
					}
				}
				if(e.which==39 && checkForWall("right") && (player.location[1]+1) < myMaze.columns) {
					//right
					movePlayer(player.location[1]++);
				}
				if(e.which==40 && checkForWall("bottom")) {
					//down
					movePlayer(player.location[0]++);
				}
		})
	}

	var player;

	function createPlayer(){
		player = new Player1("the Wee Man",50,weapons[0]);
		playerControls();
		$("#your-xp").html(player.health + "XP");
		console.log(player);
	}

	createPlayer();

	/////////////////
	// Enemy Prototype
	/////////////////

	function Enemy(name,health,weapon) {
		Character.call(this,name,health,weapon);
		this.name = name;
		this.health = health;
		this.weapon = weapon;
		this.xpId = "enemy-xp";
	}

	Enemy.prototype = Object.create(Character.prototype);

	// create Goblin
	var goblin = new Enemy("Goblin",5,weapons[1]);
	console.log(goblin);

	// add Crow and Ogre - next

	//////////////////////
	// Random battle generator
	//////////////////////

	// STARTS THE GAME

	randomBattleMode(goblin);

	///////////////////////
	//	Game functions
	///////////////////////

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
		// Enemy turn
		attackSequence(goblin,player);
	};

	function attackSequence(attacker,receiver) {
		// Character prototypal methods
		attacker.attack();
		receiver.receiveAttack(attacker);
		// Update HTML XP and health bar
		$("#" + receiver.xpId).html(receiver.health + "XP");
		if (receiver.name == "the Wee Man") {
			$("#player-health-bar").css("width",receiver.health * 5 + "px");
		}
		else if (receiver.name == "Goblin") {
			$("#enemy-health-bar").css("width",receiver.health * 50 + "px");
		}
	}

})
