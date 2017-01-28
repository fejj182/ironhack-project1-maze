function Player1() {
	this.name = "Jeff";
	this.location = [19,19];
}

Player1.prototype.movePlayer = function(){

	$(document).bind('keyup', function(e){
		var selector = player.location[0] + "-" + player.location[1];
			if(e.which==37) {
				//left
				$("#" + selector).html("");
				player.location[1]--;
				selector = player.location[0] + '-' + player.location[1];
				$("#" + selector).html("<i class='fa fa-child' aria-hidden='true'></i>");
			}
			if(e.which==38) {
				//up
				$("#" + selector).html("");
				player.location[0]--;
				selector = player.location[0] + '-' + player.location[1]
				$("#" + selector).html("<i class='fa fa-child' aria-hidden='true'></i>");
			}
			if(e.which==39) {
				//right
				$("#" + selector).html("");
				player.location[1]++;
				selector = player.location[0] + '-' + player.location[1]
				$("#" + selector).html("<i class='fa fa-child' aria-hidden='true'></i>");
			}
			if(e.which==40) {
				//down
				$("#" + selector).html("");
				player.location[0]++;
				selector = player.location[0] + '-' + player.location[1]
				$("#" + selector).html("<i class='fa fa-child' aria-hidden='true'></i>");
			}
	});
}

var player = new Player1();
player.movePlayer();
