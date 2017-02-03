# the Wee Man

A frustrating and fast paced maze game with random battles.

## Inspiration

Wanted to improve my skills with grids in the form of an adventure game.


## Built with

* CSS3 - for the design and the animations
* Bootstrap - for the layouts, classes and buttons
* Javascript - for the main logic of the game
* jQuery - for the DOM manipulations

## Methodology

1. Wrote a lot of code - wanted to know what the game would function and look like. Wrote Javascript
first and then HTML and CSS around it.

2. Refactor and restructure. I was originally working with two Javascript files but ended up with four.  Major restructuring led to a game Class with the properties of the game contained inside.

3. Built an Minimum Viable Product (MVP).

4. Conducted UX testing.

5. Polished the functionality and design in order to present it.

## Structure

```
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

```

At the bottom of Game.js it only runs  the end only run 3 functions, which in turn run many other functions.

```
var newGame = new Game();
newGame.drawMaze();
newGame.showInstructions();
newGame.runGame();

```

I can do this because all the other Javascript files have been fed in before Game.JS at the bottom of the index.html file.

```	...
		</div>
	</div>
<script src="js/Maze.js"></script>
<script src="js/Items.js"></script>
<script src="js/Characters.js"></script>
<script src="js/Game.js"></script>
</body>

```

## Challenges

My main challenges concerned the playability of the game - whether the user would understand how to play it. I changed halfway through the project to use the space bar instead of the mouse due to its better compatibility with my attack/dodge functionality. However the user was still keen to click on things and I made a number of changes to try and counteract this.

* First I added a main instructions screen which the user has to read before starting the game.
* Second I chose to start the game on the space-bar button instead of clicking to get the user used to how
the game would be played.
* I put messages on my start/dodge blinkers to show a message telling the user to use the space-bar instead of the mouse.

I feel like the combination of these three things means the user finds it easy to understand how the game is played.

## Possible Next Steps

Wanted to do many other things with the game but due to time constraints decided to take an MVP approach and add in features from there. Some features which could be added next are:

* More items especially collectibles and weapons/armour
* Increase difficulty as the game progress i.e. each level make enemies more difficult or make the attack and dodge bar move quicker.
* Theme Music

## Deployment

The game is deployed using Github pages which is a reliable and free way of presenting a front end project.

## Acknowledgments

* Thanks to the teachers at Ironhack. Thor, Charlie and Matias.
* My classmates in the January Web Dev cohort at Ironhack Barcelona.
* My UX testers from the January UX Design cohort at Ironhack Barcelona.
