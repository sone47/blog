var WINDOW_WIDTH = 1024;
var WINDOW_HEIGHT = 600;
var RADIUS = 5;
var DOT_RADIUS = Math.round(RADIUS/5);
var MARGIN_TOP = 60;
var MARGIN_LEFT = 170;

var curShowTimeSeconds = 0;

var balls = [];
const color = '#000';
const maxBallNum = 400;

document.addEventListener('DOMContentLoaded',function(){

	WINDOW_HEIGHT = window.innerHeight;
	MARGIN_TOP = Math.round(WINDOW_HEIGHT/3);

	var canvas = document.getElementById('canvas');
	var context = canvas.getContext('2d');

	canvas.width = WINDOW_WIDTH;
	canvas.height = WINDOW_HEIGHT;

	curShowTimeSeconds = getCurrentShowTimeSeconds();

	setInterval(function(){
		render( context );
		update();
	},50);
});

function getCurrentShowTimeSeconds() {
	var curTime = new Date();
	var ret = curTime.getHours() * 3600 + curTime.getMinutes() *60 + curTime.getSeconds();

	return ret;
}

function update() {
	var nextShowTimeSeconds = getCurrentShowTimeSeconds();

	var nextHours = parseInt(nextShowTimeSeconds/3600);
	var nextMinutes = parseInt(( nextShowTimeSeconds - nextHours*3600 ) / 60);
	var nextSeconds = nextShowTimeSeconds % 60;

	var curHours = parseInt(curShowTimeSeconds/3600);
	var curMinutes = parseInt(( curShowTimeSeconds - curHours*3600 ) / 60);
	var curSeconds = curShowTimeSeconds % 60;

	if(nextSeconds != curSeconds) {
		//hour
		if(parseInt(curHours/10) != parseInt(nextHours/10)) {
			addBalls(MARGIN_LEFT, MARGIN_TOP, parseInt(curHours / 10));
		}
		if(parseInt(curHours%10) != parseInt(nextHours%10)) {
			addBalls(MARGIN_LEFT + 15 * (RADIUS + 1), MARGIN_TOP, parseInt(curHours % 10));
		}
		//minute
		if(parseInt(curMinutes/10) != parseInt(nextMinutes/10)) {
			addBalls(MARGIN_LEFT + 39 * (RADIUS + 1), MARGIN_TOP, parseInt(curMinutes / 10));
		}
		if(parseInt(curMinutes%10) != parseInt(nextMinutes%10)) {
			addBalls(MARGIN_LEFT + 54 * (RADIUS + 1), MARGIN_TOP, parseInt(curMinutes % 10));
		}
		//second
		if(parseInt(curSeconds/10) != parseInt(nextSeconds/10)) {
			addBalls(MARGIN_LEFT + 78 * (RADIUS + 1), MARGIN_TOP, parseInt(curSeconds / 10));
		}
		if(parseInt(curSeconds%10) != parseInt(nextSeconds%10)) {
			addBalls(MARGIN_LEFT + 93 * (RADIUS + 1), MARGIN_TOP, parseInt(curSeconds % 10));
		}
		curShowTimeSeconds = nextShowTimeSeconds;
	}
	updateBalls();
}

function updateBalls() {
	for(var i = 0;i < balls.length; i ++) {
		balls[i].x += balls[i].vx;
		balls[i].y += balls[i].vy;
		balls[i].vy += balls[i].g;

		if(balls[i].y >= WINDOW_HEIGHT - RADIUS) {
			balls[i].y = WINDOW_HEIGHT - RADIUS;
			balls[i].vy = -balls[i].vy * 0.75;
		}
	}
	for(var j = 0; j < balls.length; j++) {
		if((balls[j].x <= -DOT_RADIUS) || (balls[j].x >= WINDOW_WIDTH + DOT_RADIUS)){
			balls.splice(j, 1);
		}
	}
	if(balls.length >= maxBallNum) {
		for(var k = balls.length - maxBallNum; k > 0; k--) {
			balls.shift(balls[0]);
		}
	}
}

function addBalls(x, y, num) {
	for(var i = 0; i < digit[num].length; i ++) {
		for(var j = 0; j < digit[num][i].length; j ++) {
			if(digit[num][i][j] === 1) {
				for (var k = 0; k < 2; k++) {
					var aBall = {
						x: x+j*2*(RADIUS+1)+(RADIUS+1),
						y: y+i*2*(RADIUS+1)+(RADIUS+1),
						g: 1.5 + Math.random(),
						vx: Math.pow(-1,Math.ceil(Math.random()*1000))*Math.ceil(Math.random()*30),
						vy: Math.pow(-1,Math.ceil(Math.random()*1000))*Math.ceil(Math.random()*30),
						color: color
					};

					balls.push(aBall);
				}
			}
		}
	}
}

function render(cxt) {

	cxt.clearRect(0,0,WINDOW_WIDTH,WINDOW_HEIGHT);

	var hours = parseInt(curShowTimeSeconds/3600);
	var minutes = parseInt(( curShowTimeSeconds - hours*3600 ) / 60);
	var seconds = curShowTimeSeconds % 60;

	renderDigit(MARGIN_LEFT, MARGIN_TOP, parseInt(hours/10), cxt);
	renderDigit(MARGIN_LEFT + 15 * (RADIUS + 1), MARGIN_TOP, parseInt(hours%10), cxt);
	renderDigit(MARGIN_LEFT + 30 * (RADIUS + 1), MARGIN_TOP, 10, cxt);
	renderDigit(MARGIN_LEFT + 39 * (RADIUS + 1), MARGIN_TOP, parseInt(minutes/10), cxt);
	renderDigit(MARGIN_LEFT + 54 * (RADIUS + 1), MARGIN_TOP, parseInt(minutes%10), cxt);
	renderDigit(MARGIN_LEFT + 69 * (RADIUS + 1), MARGIN_TOP, 10, cxt);
	renderDigit(MARGIN_LEFT + 78 * (RADIUS + 1), MARGIN_TOP, parseInt(seconds/10), cxt);
	renderDigit(MARGIN_LEFT + 93 * (RADIUS + 1), MARGIN_TOP, parseInt(seconds%10), cxt);

	for(var i = 0;i < balls.length; i++) {
		cxt.fillStyle = balls[i].color;

		cxt.beginPath();
		cxt.arc(balls[i].x, balls[i].y, DOT_RADIUS, 0, 2*Math.PI);
		cxt.closePath();

		cxt.fill();
	}
}

function renderDigit(x, y, num, cxt) {
	cxt.fillStyle = color;

	for(var i = 0; i < digit[num].length; i ++) {
		for(var j = 0; j < digit[num][i].length; j ++) {
			if(digit[num][i][j] === 1) {
				for (var k = 0; k < 5; k++) {
                    for (var l = 0; l < 5; l++) {
                        cxt.beginPath();
                        cxt.arc(x+j*2*(RADIUS+1)+(RADIUS+1)+l*2*(DOT_RADIUS+1)+(DOT_RADIUS+1),
                        	y+i*2*(RADIUS+1)+(RADIUS+1)+k*2*(DOT_RADIUS+1)+(DOT_RADIUS+1),
                        	DOT_RADIUS,0,2*Math.PI);
                        cxt.closePath();
                        cxt.fill();
                    };
                };
			}
		}
	}
}