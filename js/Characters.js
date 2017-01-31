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
	this.location = [(maze[0].length-1),(maze.length-1)];
	this.health = health;
	this.weapon = weapon;
	this.xpId = "your-xp";
}

Player1.prototype = Object.create(Character.prototype);

var player = new Player1("the Wee Man",50,weapons[0]);

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
