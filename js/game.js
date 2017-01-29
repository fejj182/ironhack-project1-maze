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
		}

		Enemy.prototype = Object.create(Character.prototype);

		var goblin = new Enemy("Goblin",20,weapons[1]);
		console.log(goblin);

		//////////////////
		// Attack/Receive Damage
		//////////////////

		function playerAttack(enemy){
			player.attack();
			enemy.receiveDamage(player);
			console.log(enemy.name + " has received " + player.weapon["attackPower"] + " points of damage.");
		}

		function enemyAttack(enemy){
			enemy.attack();
			player.receiveDamage(enemy);
			console.log(player.name + " has received " + enemy.weapon["attackPower"] + " points of damage.");
		}

		playerAttack(goblin);
		enemyAttack(goblin);

		console.log(player);
		console.log(goblin);


})
