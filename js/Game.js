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

Game.prototype.drawMaze = function(myMaze) {
	var disp, selector;

	disp = this.maze;
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

Game.prototype.initializeControls = function playerControls(){
	// move function used in multiple locations within bind function below
	var selector = player.location[0] + "-" + player.location[1];

	$(document).bind("keyup", function(e){
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

Game.prototype.setUpBattles = function(){
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
}

var newGame = new Game();
newGame.drawMaze();
newGame.initializeControls();
newGame.initializePlayers();
newGame.setUpBattles();
