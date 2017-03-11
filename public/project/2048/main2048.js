var border = new Array();
var score = 0;
var hasConflicted = new Array();
var isLose = false;

var startx = 0,
	starty = 0,
	endx = 0,
	endy = 0;

$(document).ready(function() {
	prepareForMobile();
	newGame();
});

function prepareForMobile() {
	var width = gridContainerWidth - 2 * cellSpace;
	$('#grid-container').css({
		'width': width,
		'height': width,
		'padding': cellSpace
	});

	$('.grid-cell').css({
		'width': cellLength,
		'height': cellLength
	});
}

function newGame() {
	//init
	init();

	//两个格子随机生成数字
	generateNumber();
	generateNumber();
}

function init() {
	for(var i = 0;i < 4; i++) {
		for(var j = 0; j < 4; j++) {
			var gridCell = $('#grid-cell-'+i+'-'+j);
			gridCell.css('top',getPosTop(i,j));
			gridCell.css('left',getPosLeft(i,j));
		}
	}

	for(var i = 0;i < 4; i++) {
		border[i] = new Array();
		hasConflicted[i] = new Array();
		for(var j = 0; j < 4; j++) {
			border[i][j] = 0;
			hasConflicted[i][j] = false;
		}
	}

	updateBorderView();

	isLose = false;
	score = 0;
	updateScore(score);
}

function updateBorderView() {
	$('.number-cell').remove();
	for(var i = 0;i < 4; i++) {
		for(var j = 0; j < 4; j++) {
			$('#grid-container').append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"'+'></div>');
			var theNumberCell = $('#number-cell-'+i+'-'+j);

			if(border[i][j] === 0) {
				theNumberCell.css({
					'height': 0,
					'width': 0,
					'top': getPosTop(i,j) + cellLength/2,
					'left': getPosLeft(i,j) + cellLength/2
				});
			}else{
				theNumberCell.css({
					'height': cellLength,
					'width': cellLength,
					'top': getPosTop(i,j),
					'left': getPosLeft(i,j),
					'background': getNumberBackground(border[i][j])
				}).text(border[i][j]);
			}

			hasConflicted[i][j] = false;
		}
	}

	$('.number-cell').css({
		'line-height': cellLength + 'px',
		'fontSize': cellLength * 0.4 + 'px'
	});
}

function generateNumber() {
	if(nospace(border)) {
		return false;
	}

	//随机位置
	do{
		var randx = parseInt(Math.floor(Math.random() * 4));
		var randy = parseInt(Math.floor(Math.random() * 4));
	}while(border[randx][randy] !== 0);

	//随机数字
	var randNum = Math.random() < 0.5 ? 2 : 4;

	border[randx][randy] = randNum;
	showNumAnimation(randx, randy, randNum);

	return true;
}

/*
	键盘事件与触摸事件
*/
$(document).keydown(function(e){

	$('.number-cell').stop(true,true);

	switch(e.keyCode) {
		case 37: // left
			if(moveLeft()) {
				setTimeout(generateNumber,210);
				setTimeout(isGameOver,300);
			}
			break;
		case 38: // up
			if(moveUp()) {
				setTimeout(generateNumber,210);
				setTimeout(isGameOver,300);
			}
			break;
		case 39: // right
			if(moveRight()) {
				setTimeout(generateNumber,210);
				setTimeout(isGameOver,300);
			}
			break;
		case 40: // down
			if(moveDown()) {
				setTimeout(generateNumber,210);
				setTimeout(isGameOver,300);
			}
	}
});

function isGameOver() {
	if(nospace(border) && nomove() && !isLose) {
		isLose = true;
		gameOver();
	}

}

function gameOver() {
	alert('you die!!!');
}

function moveLeft() {
	if(!canMoveLeft(border)) {
		return false;
	}

	for(var i = 0;i < 4; i++) {
		for(var j = 1; j < 4; j++) {
			if(border[i][j] !== 0) {
				for(var k = 0; k < j; k++) {
					if(border[i][k] === 0 && noBlockHorizantal(i, k, j, border)) {
						showMoveAnimation(i, j, i, k);
						border[i][k] = border[i][j];
						border[i][j] = 0;
						continue;
					}else if(border[i][k] === border[i][j] && noBlockHorizantal(i, k, j, border) && !hasConflicted[i][k]) {
						showMoveAnimation(i, j, i, k);
						border[i][k] += border[i][k];
						border[i][j] = 0;

						score += border[i][k];
						updateScore(score);

						hasConflicted[i][k] = true;

						continue;
					}
				} 
			}
		}
	}

	setTimeout(updateBorderView,200);

	return true;
}

function moveUp() {
	if(!canMoveUp(border)) {
		return false;
	}

	for(var j = 0; j < 4; j++) {
		for(var i = 1;i < 4; i++) {
			if(border[i][j] !== 0) {
				for(var k = 0; k < i; k++) {
					if(border[k][j] === 0 && noBlockVert(j, k, i, border)) {
						showMoveAnimation(i, j, k, j);
						border[k][j] = border[i][j];
						border[i][j] = 0;
						continue;
					}else if(border[k][j] === border[i][j] && noBlockVert(j, k, i, border) && !hasConflicted[k][j]) {
						showMoveAnimation(i, j, k, j);
						border[k][j] += border[i][j];
						border[i][j] = 0;

						score += border[k][j];
						updateScore(score);

						hasConflicted[k][j] = true;

						continue;
					}
				}
			}
		}
	}

	setTimeout(updateBorderView,200);

	return true;
}

function moveRight() {
	if(!canMoveRight(border)) {
		return false;
	}

	for(var i = 0;i < 4; i++) {
		for(var j = 2; j >= 0; j--) {
			if(border[i][j] !== 0) {
				for(var k = 3; k > j; k--) {
					if(border[i][k] === 0 && noBlockHorizantal(i, j, k, border)) {
						showMoveAnimation(i, j, i, k);
						border[i][k] = border[i][j];
						border[i][j] = 0;
						continue;
					}else if(border[i][k] === border[i][j] && noBlockHorizantal(i, j, k, border) && !hasConflicted[i][k]) {
						showMoveAnimation(i, j, i, k);
						border[i][k] += border[i][k];
						border[i][j] = 0;

						score += border[i][k];
						updateScore(score);

						hasConflicted[i][k] = true;

						continue;
					}
				} 
			}
		}
	}

	setTimeout(updateBorderView,200);

	return true;
}

function moveDown() {
	if(!canMoveDown(border)) {
		return false;
	}

	for(var j = 0; j < 4; j++) {
		for(var i = 2;i >= 0; i--) {
			if(border[i][j] !== 0) {
				for(var k = 3; k > i; k--) {
					if(border[k][j] === 0 && noBlockVert(j, i, k, border)) {
						showMoveAnimation(i, j, k, j);
						border[k][j] = border[i][j];
						border[i][j] = 0;
						continue;
					}else if(border[k][j] === border[i][j] && noBlockVert(j, i, k, border) && !hasConflicted[k][j]) {
						showMoveAnimation(i, j, k, j);
						border[k][j] += border[i][j];
						border[i][j] = 0;

						score += border[k][j];
						updateScore(score);

						hasConflicted[k][j] = true;

						continue;
					}
				}
			}
		}
	}

	setTimeout(updateBorderView,200);

	return true;
}
