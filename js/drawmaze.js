$(document).ready(function(){
	var disp = newMaze(6,8);
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
})
