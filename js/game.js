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
	// Character prototype
	///////////////////

	function Character(name,health,weapon) {
		this.name = name;
		this.health = health;
		this.weapon = weapon;
	}

	Character.prototype.attack = function(){
	    return this.weapon["attackPower"];
	};

	Character.prototype.receiveDamage = function(attacker){
	  this.health -= attacker.attack();
	  return this.health;
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

	Player1.prototype.checkForWall = function(direction){
		var checkSelector = this.location[0] + "-" + (this.location[1]);
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
			selector = player.location[0] + "-" + player.location[1];
			$("#" + selector).html("<i class='fa fa-child' aria-hidden='true'></i>");
		}

		function newMaze(){
			player.location = [(disp[0].length-1),(disp.length-1)];
			var newMaze = createMaze();
			drawMaze(newMaze);
		}

		$(document).bind("keyup", function(e){
			var selector = player.location[0] + "-" + player.location[1];
				if(e.which==37 && player.checkForWall("left")) {
					//left
					move(player.location[1]--);
				}
				if(e.which==38 && player.checkForWall("top")) {
					//up
					move(player.location[0]--);
					if (player.location[0] < 0) {
						newMaze();
					}
				}
				if(e.which==39 && player.checkForWall("right") && (player.location[1]+1) < myMaze.columns) {
					//right
					move(player.location[1]++);
				}
				if(e.which==40 && player.checkForWall("bottom")) {
					//down
					move(player.location[0]++);
				}
		})
	}

		var player = new Player1("the Wee Man",50,weapons[0]);
		$("#your-xp").html(player.health + "XP");
		console.log(player);
		player.movePlayer();

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

		var goblin = new Enemy("Goblin",5,weapons[1]);

		console.log(goblin);

		///add Crow and Ogre

		//////////////////
		// Attack/Receive Damage
		//////////////////

		function playerAttack(enemy){
			player.attack();
			enemy.receiveDamage(player);
			$("#" + enemy.xpId).html(enemy.health + "XP");
			$("#enemy-health-bar").css("width",enemy.health * 50 + "px");
		}

		function enemyAttack(enemy){
			enemy.attack();
			player.receiveDamage(enemy);
			$("#" + player.xpId).html(player.health + "XP");
			$("#player-health-bar").css("width",player.health * 5 + "px");
		}

		//////////////////////
		// Random battle generator
		//////////////////////

		//attack sequence which runs on 'Attack' click

		var attackInTurns = function() {
		  var turn = [0,1];
		  if (turn[0] === 0){
		    playerAttack(goblin);
				console.log(goblin.health);
				turn.shift();
				turn.push(0);
		  }
		  if (turn[0] === 1){
				enemyAttack(goblin);
				console.log(player.health);
				turn.shift();
				turn.push(1);
		  }
		};

		//battle sequence which runs until someone dies

		var battle = function(enemy) {
			if (player.health > 0 && enemy.health > 0){
				attackInTurns();
			}

		  if (player.health <= 0){
				//if player dies...game over;
				player.health = 0;
				$("#" + player.xpId).html(player.health + "XP.");
				$("#player-health-bar").append("<p style='width: 200px; font-size: 40px;'>You died.</p>");
		    console.log(player.name + " has died in act of combat. Game Over.");
		  }
		  else if (enemy.health <= 0){
				//sequence which takes place when enemy is killed in battle, i.e. to restart the game
				$("#attack-button").off("click");	//turn off attack button
		    enemy.health = 5; //reset enemy health
				$("#enemy-health-bar").css("width",enemy.health * 50 + "px"); //reset enemy health bar
				$("#attack-bar-white").css("animation","none"); //stop attack bar animation
				$(".battle").toggleClass("hide"); //hide all battle specific elements
				player.movePlayer();	//reinitialise controls for wee man
		    console.log("You killed " + enemy.name + ", nice.");
				console.log(player.name + " has " + player.health + "XP left.");
				randomBattleMode(enemy); //restart random encounters
		  }
		};


		function randomBattleMode(enemy) {
			var battleTime = Math.floor(((Math.random() * 1) + 1)*1000);
			console.log(battleTime);
			setTimeout(function(){
				if(player.health > 0) {
					$("#enemy-xp").html(enemy.health + "XP");
					console.log("Battle!");
					$(".battle").toggleClass("hide");
					$(document).off("keyup");
					$("#attack-button").on("click",function(){
						if ($("#attack-bar-white").css("animation").indexOf("upDown") == -1) {
							$("#attack-bar-white").css("animation","upDown 2.5s linear infinite");
						}
						else {
							var whiteValue = Number($("#attack-bar-white").css("top").replace(/px/g,""));
							var redValue = Number($("#attack-bar-red").css("top").replace(/px/g,""));
							if (whiteValue > redValue && whiteValue < redValue + 20) {
								$("#attack-bar-blue").append("<p style='margin-left: 75px; width: 200px'>Bad Mutha POWER BOOST!!!</p>");
								$("#attack-bar-white").css("animation","none");
							};
							battle(goblin);
						}
					});
				}
				else {
					$("#attack-button").off("click");
					$(document).off("keyup");
				}
			},battleTime);
		}

		//starts the game

		randomBattleMode(goblin);

		///////////////////
		// Attack and dodge functions
		///////////////////


})
