$(document).ready(function(){

	//draw maze

	var disp = createMaze();
	for (var i = 0; i < disp.length; i++) {
			$('#maze > tbody').append("<tr>");
			for (var j = 0; j < disp[i].length; j++) {
					var selector = i+"-"+j;
					$('#maze > tbody').append("<td id='"+selector+"'>&nbsp;</td>");
					if (disp[i][j][0] == 0) { $('#'+selector).css('border-top', '2px solid black'); }
					if (disp[i][j][1] == 0) { $('#'+selector).css('border-right', '2px solid black'); }
					if (disp[i][j][2] == 0) { $('#'+selector).css('border-bottom', '2px solid black'); }
					if (disp[i][j][3] == 0) { $('#'+selector).css('border-left', '2px solid black'); }
			}
			$('#maze > tbody').append("</tr>");
	}

	$("#0-0").css("border-top","none");
	$("#19-19").css("border-right","none");
	$("#19-19").html("<i class='fa fa-child' aria-hidden='true'></i>");

	//Player functions

	function Player1() {
		this.name = "Jeff";
		this.location = [(disp[0].length-1),(disp.length-1)];
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
					player.location[0];
					selector = player.location[0] + '-' + player.location[1]
					$("#" + selector).html("<i class='fa fa-child' aria-hidden='true'></i>");
				}
		});
	}

	var player = new Player1();
	player.movePlayer();

})
