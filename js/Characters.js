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
