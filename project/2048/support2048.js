var docWidth = window.innerWidth;
var gridContainerWidth = docWidth * 0.92 > 500 ? 500 : docWidth * 0.92;
var cellLength = 0.18 * docWidth > 100 ? 100 : 0.18 * docWidth;
var cellSpace = 0.04 * docWidth > 20 ? 20 : 0.04 * docWidth;

function getPosTop(i, j) {

	return cellSpace + i * (cellSpace + cellLength);
}

function getPosLeft(i, j) {
	
	return cellSpace + j * (cellSpace + cellLength);
}

function getNumberBackground(num) {
	var colors = ['#ddd','#ccc','#bbb','#aaa','#999','#888','#777','#666','#555','#444','#333','#222','#111'];
	var colorNum = Math.log(num)/Math.log(2) - 1;
	if(colorNum < colors.length){
		return colors[colorNum];
	}
	return '#000';
}

function getNumberColor(num) {

	return '#fff';
}

function nospace(border) {
	for(var i = 0;i < 4; i++) {
		for(var j = 0; j < 4; j++) {
			if(border[i][j] === 0) {
				return false;
			}
		}
	}

	return true;
}

function canMoveLeft(border) {
	for(var i = 0;i < 4; i++) {
		for(var j = 1; j < 4; j++) {
			if(border[i][j] !== 0) {
				if(border[i][j-1] === 0 || border[i][j-1] === border[i][j]) {
					return true;
				}
			}
		}
	}
	return false;
}

function canMoveUp(border) {
	for(var i = 1;i < 4; i++) {
		for(var j = 0; j < 4; j++) {
			if(border[i][j] !== 0) {
				if(border[i-1][j] === 0 || border[i-1][j] === border[i][j]) {
					return true;
				}
			}
		}
	}
	return false;
}

function canMoveRight(border) {
	for(var i = 0;i < 4; i++) {
		for(var j = 2; j >= 0; j--) {
			if(border[i][j] !== 0) {
				if(border[i][j+1] === 0 || border[i][j+1] === border[i][j]) {
					return true;
				}
			}
		}
	}
	return false;
}

function canMoveDown(border) {
	for(var i = 2;i >= 0; i--) {
		for(var j = 0; j < 4; j++) {
			if(border[i][j] !== 0) {
				if(border[i+1][j] === 0 || border[i+1][j] === border[i][j]) {
					return true;
				}
			}
		}
	}
	return false;
}


function noBlockHorizantal(row, col1, col2, border) {
	for(var i = col1 + 1; i < col2; i++) {
		if(border[row][i] !== 0) {
			return false;
		}
	}
	return true;
}

function noBlockVert(col, row1, row2, border) {
	for(var i = row1 + 1; i < row2; i++) {
		if(border[i][col] !== 0) {
			return false;
		}
	}
	return true;
}

function nomove() {
	if(canMoveLeft(border) || canMoveUp(border) || canMoveRight(border) || canMoveDown(border)) {
		return false;
	}

	return true;
}