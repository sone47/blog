function Slider(opts) {
	this.wrap = opts.wrap;
	this.list = opts.list;
	this.width = opts.width;
	this.height = opts.height;

	this.init();
	this.renderDOM();
	this.bindDOM();
	this.autoPlay();
}

Slider.prototype.init = function() {
	this.ratio = this.height / this.width;

	this.idx = 0;
};

Slider.prototype.renderDOM = function() {
	var wrap = this.wrap;
	var data = this.list;
	var len = data.length;
	var width = this.width;
	var height = this.height;
	var btnWrap = document.createElement('div');

	this.outer = document.createElement('ul');
	btnWrap.className = 'swipe-btn';

	for(var i = 0; i < len; i++) {
		var li = document.createElement('li');
		var btn = document.createElement('a');
		var item = data[i];

		li.style.transform = 'translateX(' + width*i + 'px)';
		li.innerHTML = this.imgReponsive(item);

		this.outer.appendChild(li);
		btnWrap.appendChild(btn);
	}

	this.btn = btnWrap;
	wrap.style.height = this.height + 'px';
	wrap.appendChild(this.outer);
	wrap.appendChild(btnWrap);

	var btns = this.wrap.getElementsByClassName('swipe-btn')[0].getElementsByTagName('a');
	btns[this.idx].className = 'on';
};

Slider.prototype.imgReponsive = function(data) {
	if(data['height']/data['width'] > this.ratio) {
		return '<img height="' + this.height + 'px" src="' + data['img'] + '">';
	}

	return '<img width="' + this.width + 'px" src="' + data['img'] + '">';
};

Slider.prototype.bindDOM = function() {
	var self = this;
	var width = this.width;
	var outer = this.outer;
	var btn = this.btn;
	var data = this.list;
	var len = data.length;

	var startHandler = function(e) {
		self.startX = e.touches[0].pageX;
		self.offsetX = 0;
		self.startTime = new Date() * 1;
	};

	var moveHandler = function(e) {
		e.preventDefault();

		self.offsetX = e.touches[0].pageX - self.startX;

		var lis = outer.getElementsByTagName('li');
		var i = self.idx;
		var prev = (i - 1 >= 0)? (i - 1): (len - 1);
		var next = (i + 1 <= len - 1)? (i + 1): 0;

		for(var j = 0; j < len; j++) {
			lis[j].style.transition = 'transform 0s ease-out';
		}
		lis[i].style.transform = 'translateX(' + self.offsetX + 'px)';
		lis[prev].style.transform = 'translateX(' + (-self.width + self.offsetX) + 'px)';
		lis[next].style.transform = 'translateX(' + (self.width + self.offsetX) + 'px)';

	};

	var endHandler = function(e) {
		var boundary = width / 6;
		var endTime = new Date() * 1;
		var lis = outer.getElementsByTagName('li');

		if(endTime - self.startTime > 800) {
			if(self.offsetX >= boundary) {
				self.go('-1');
			} else if(self.offsetX < -boundary) {
				self.go('+1');
			} else if(self.offsetX !== 0) {
				self.go('0');
			}
		} else {
			if(self.offsetX > 50) {
				self.go('-1');
			} else if(self.offsetX < -50) {
				self.go('+1');
			} else if(self.offsetX !== 0) {
				self.go('0');
			}
		}
	};

	var btnHandler = function(e) {
		e.preventDefault();
		e.stopPropagation();

		var tidx = 0;
		if(e.target.nodeName.toLowerCase() === 'a') {
			var btns = self.wrap.getElementsByClassName('swipe-btn')[0].getElementsByTagName('a');
			for(var j = 0; j < len; j++) {
				if(btns[j] === e.target) {
					tidx = j;
					btns[j].className = 'on';
					self.go(j);
					continue;
				}
				btns[j].className = '';
			}
		}
	};

	var enterHandler = function() {
		self.pausePlay();
	};

	var leaveHandler = function() {
		self.autoPlay();
	};

	var resizeHandler = function() {
		self.width = window.innerWidth;
		self.go(self.idx);
		self.ratio = self.height / self.width;

		var lis = outer.getElementsByTagName('li');

		for(var i = 0; i < len; i++) {
			lis[i].innerHTML = self.imgReponsive(data[i]);
		}
	};

	outer.addEventListener('touchstart', startHandler);
	outer.addEventListener('touchmove', moveHandler);
	outer.addEventListener('touchend', endHandler);
	btn.addEventListener('click', btnHandler);
	this.wrap.addEventListener('mouseenter', enterHandler);
	this.wrap.addEventListener('mouseleave', leaveHandler);
	window.addEventListener('resize', resizeHandler);
};

Slider.prototype.autoPlay = function () {
	this.pausePlay();
	var self = this;

	this.tid = setTimeout(function() {
		self.go('+1');
		self.autoPlay();
	}, 5000);
}

Slider.prototype.pausePlay = function() {
	clearTimeout(this.tid);
};

Slider.prototype.go = function(n) {
	this.pausePlay();

	var idx = this.idx;
	var cidx;
	var lis = this.outer.getElementsByTagName('li');
	var len = lis.length;
	var btns = this.wrap.getElementsByClassName('swipe-btn')[0].getElementsByTagName('a');
	var width = this.width;
	var isNext = true;

	if(typeof n === 'number') {
		cidx = n;
	} else if(typeof n === 'string') {
		cidx = idx + n * 1;
	}
	cidx - idx <= 0 && (isNext = false);

	if(cidx > len-1){
		cidx = 0;
	}else if(cidx < 0){
		cidx = len - 1;
	}

	this.idx = cidx;
	var prev = (cidx - 1 >= 0)? (cidx - 1): (len - 1);
	var next = (cidx + 1 <= len - 1)? (cidx + 1): 0;
	lis[cidx].style.transform = 'translateX(0px)';
	lis[prev].style.transform = 'translateX(-' + width + 'px)';
	lis[next].style.transform = 'translateX(' + width + 'px)';
	
	for(var j = 0; j < len; j++) {
		lis[j].style.transition = 'transform 0s ease-out';
		btns[j].className = '';
	}
	btns[cidx].className = 'on';

	lis[cidx].style.transition = 'transform 0.2s ease-out';
	isNext && (lis[prev].style.transition = 'transform 0.2s ease-out');
	!isNext && (lis[next].style.transition = 'transform 0.2s ease-out');


	this.autoPlay();
};