function showNumAnimation(i ,j, num) {
	var numberCell = $('#number-cell-'+i+'-'+j);

	numberCell.css({
		'background': getNumberBackground(num),
		'color': getNumberColor(num)
	}).text(num);

	numberCell.animate({
		'width': cellLength,
		'height': cellLength,
		'top': getPosTop(i,j),
		'left': getPosLeft(i,j)
	},50);
}

function showMoveAnimation(fromx, fromy, tox, toy) {
	var numberCell = $('#number-cell-'+fromx+'-'+fromy);
	numberCell.animate({
		'top': getPosTop(tox, toy),
		'left': getPosLeft(tox, toy)
	},200);
}

function updateScore(score) {
	$('#score').text(score);
}