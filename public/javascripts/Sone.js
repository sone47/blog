//避免公用同一个方法
var $ = function(nodename){
	return new Sone(nodename);
};


/*
 * 基础库
 */
function Sone(nodename){
	//保存节点的数组
	this.elements = [];

	//获取节点
	if(nodename){
		if (typeof nodename === 'object') {

			this.elements[0] = nodename;

		}else if(typeof nodename ==='string'){

			if(nodename.indexOf(' ') === -1){

				switch(nodename.charAt(0)){

					case '#':
						this.elements.push(document.getElementById(nodename.substr(1)));
						break;

					case '.':
						this.elements = getClass(nodename.substr(1));
						break;

					default:
						var tags = document.getElementsByTagName(nodename);

						for(var i = 0;i < tags.length;i ++){

							this.elements.push(tags[i]);

						}

				}

			}else{

				if(document.querySelectorAll){
					this.elements = document.querySelectorAll(nodename);
				}else{
					nodename = nodename.replace(/^\s+|\s+$/,'');

					var ele = nodename.split(' ');
					var child = [];
					var parent = [];

					for(var i = 0;i < ele.length;i ++){

						parent = (parent.length == 0)?[document]:parent;

						switch(ele[i].charAt(0)){

							case '#':
								child = [];
								child.push(document.getElementById(ele[i].substr(1)));
								parent = child;
								break;

							case '.':
								child = getClass(ele[i].substr(1),parent);
								parent = child;
								break;

							default:
								child = [];
								for(var k = 0;k < parent.length; k ++){

									var tags = parent[k].getElementsByTagName(ele[i]);

									for(var j = 0;j < tags.length;j ++){
										child.push(tags[j]);
									}

								}
								parent = child;

						}
					}
					this.elements = child;
				}
			}
		}else if(typeof nodename === 'function'){

			addEvent(document,'DOMContentLoaded',nodename);

		}
	}

}
function getClass(clsName,parent){

	var ele = [];
	parent = parent || document;
	if(!(parent instanceof Array)){
		var temp = parent;
		parent = [];
		parent.push(temp);
	}

	for(var k = 0;k < parent.length;k ++){

		var arr = parent[k].getElementsByTagName('*');

		for(var j = 0; j < arr.length;j ++){
			if(new RegExp('(\\s|^)' + clsName + '(\\s|$)').test(arr[j].className)){
				ele.push(arr[j]);
			}

		}
	}

	return ele;
}

//获取首个节点
Sone.prototype.first = function(){
	var temp = this.elements[0];
	this.elements = [];
	this.elements[0] = temp;
	return this;
};
//获取最后一个节点
Sone.prototype.last = function(){
	var temp = this.elements[this.elements.length - 1];
	this.elements = [];
	this.elements[0] = temp;
	return this;
};

//查找某一节点下的子节点
Sone.prototype.find = function(str){

	var child = [];

	for(var i = 0,length = this.elements.length;i < length; i ++){

		switch(str.charAt(0)){

			case '#':
				child.push(document.getElementById(str.substr(1)));
				break;

			case '.':
				child = getClass(str.substr(1),this.elements[i]);
				break;

			default:
				var tags = this.elements[i].getElementsByTagName(str);

				for(var j = 0;j < tags.length;j ++){
					child.push(tags[j]);
				}
		}
	}

	this.elements = child;

	return this;
};

//获取当前节点的下一个同级节点
Sone.prototype.next = function(){
	for(var i = 0,len = this.elements.length;i < len;i ++){
		if(this.elements[i].nextElementSibling){
			this.elements[i] = this.elements[i].nextElementSibling;
		}else{
			var sib = this.elements[i].nextSibling;
			while(sib && sib.nodeType !== 1)
				this.elements[i] = sib.nextSibling;
		}
	}
	return this;
};
//获取当前节点的上一个同级节点
Sone.prototype.prev = function(){
	for(var i = 0,len = this.elements.length;i < len;i ++){
		if(this.elements[i].previousElementSibling){
			this.elements[i] = this.elements[i].previousElementSibling;
		}else{
			var sib = this.elements[i].previousSibling;
			while(sib && sib.nodeType !== 1)
				this.elements[i] = sib.previousSibling;
		}
	}
	return this;
};
//在被选元素的结尾插入内容
Sone.prototype.append = function (node) {
	for(var i = 0,len = this.elements.length;i < len;i ++){
		this.elements[i].innerHTML = this.elements[i].innerHTML + node;
	}
};
//在被选元素的开头插入内容
Sone.prototype.prepend = function (node) {
	for(var i = 0,len = this.elements.length;i < len;i ++){
		this.elements[i].innerHTML = node + this.elements[i].innerHTML;
	}
};
//获取某一个节点,返回这个节点对象
Sone.prototype.get = function(num){
	return this.elements[num];
};
//获取某一个节点,返回Base对象
Sone.prototype.eq = function(num){
	var temp = this.elements[num];
	this.elements = [];
	this.elements[0] = temp;
	return this;
};
//获取某一节点的索引
Sone.prototype.index = function(){
	var children = this.get(0).parentNode.children;
	for(var i = 0,len = children.length;i < len;i ++){
		if(this.get(0) === children[i]){
			return i;
		}
	}

};

//DOM加载
Sone.prototype.ready = function(fn){

	if(this.elements[0]){
		addEvent(this.elements[0],'DOMContentLoaded',fn);
	}else{
		addEvent(document,'DOMContentLoaded',fn);
	}
};

//设置/获取样式
Sone.prototype.css = function(attr,value){

	if(typeof attr === 'object'){

		for(var i = 0;i < this.elements.length;i ++){
			for(var j in attr){
				this.elements[i].style[j] = attr[j];
			}
		}

	}else{

		if(value !== undefined){

			for(var i = 0;i < this.elements.length;i ++){
				this.elements[i].style[attr] = value;
			}

		}else{

			for(var i = 0;i < this.elements.length;i ++){

				if(window.getComputedStyle){

					return window.getComputedStyle(this.elements[i],null)[attr];

				}else if(this.elements[i].currentStyle){

					return this.elements[i].currentStyle[attr];

				}else{

					return this.elements[i].style[attr];

				}

			}

		}

	}

	return this;

};

//获取外联样式
Sone.prototype.getStyle = function(attr){
	for(var i = 0;i < this.elements.length;i ++){

		if(window.getComputedStyle){

			return window.getComputedStyle(this.elements[i],null)[attr];

		}else if(this.elements[i].currentStyle){

			return this.elements[i].currentStyle[attr];

		}

	}
};

//获取相对定位元素的left/top值
Sone.prototype.position = function(value){
	 if(value !== undefined){
	 	for(var i in value){
	 		this.css(i,value[i]);
	 	}
		this.css({
			'left' : parseInt(value['left']) + 'px',
			'top' : parseInt(value['top']) + 'px'
		});
	 	return this;
	 }
	return {
		"left" : parseInt(this.css('left')),
		"top" : parseInt(this.css('top'))
	}
};
//获取元素的left/top值(相对于文档的偏移)
Sone.prototype.offset = function(){
	var top = 0,
		left = 0,
		ele = this.get(0);
	if(ele.offsetTop){
		top = ele.offsetTop;
		left = ele.offsetLeft;
	}else{
		while(ele){
			top += ele.offsetTop;
			left += ele.offsetLeft;
			ele = ele.offsetParent;
		}
	}
	return {
		"left" : left,
		"top" : top
	}
};

//获取width/height | innerWidth/innerHeight | outerWidth/outerHieght
Sone.prototype.width = function(value){
	if (value) {
		this.css('width',value + 'px');
		return this;
	}else{
		if(this.get(0).nodeType === 9){
			return document.documentElement.offsetWidth || document.body.offsetWidth;
		}else if(this.get(0).toString() === '[object Window]'){
			return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
		}else{
			return parseInt(this.css('width'));
		}
	}
};
Sone.prototype.height = function(value){
	if (value) {
		this.css('height',value + 'px');
		return this;
	}else{
		if(this.get(0).nodeType === 9){
			return document.documentElement.offsetHeight || document.body.offsetHeight;
		}else if(this.get(0).toString() === '[object Window]'){
			return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
		}else{
			return parseInt(this.css('height'));
		}

	}
};
Sone.prototype.innerWidth = function(){
	return this.get(0).clientWidth;
};
Sone.prototype.innerHeight = function(){
	return this.get(0).clientHeight;
};
Sone.prototype.outerWidth = function(){
	return this.get(0).offsetWidth;
};
Sone.prototype.outerHeight = function(){
	return this.get(0).offsetHeight;
};
Sone.prototype.scrollTop = function(value){
	if(value){
		this.get(0).scrollTop = value;
		return this;
	}else{
		if(typeof this.get(0) === 'object' || this.get(0).toString() === '[object Window]'){
			return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
		}else{
			return this.get(0).scrollTop;
		}
	}
};
Sone.prototype.scrollLeft = function(value){
	if(value){
		this.get(0).scrollLeft = value;
		return this;
	}else{
		if(this.get(0).nodeType === 9 || this.get(0).toString() === '[object Window]'){
			return window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft;
		}else{
			return this.get(0).scrollLeft;
		}
	}
};

//修改className
Sone.prototype.addClass = function(clsName){

	var pattern = new RegExp('([^-]|^)\\b' + clsName + '\\b([^-]|$)');
	var trim = /^\s+|\s+$/;

	for(var i = 0;i < this.elements.length;i ++){

		if(!this.elements[i].className.match(pattern)){

			this.elements[i].className += ' ' + clsName;
			this.elements[i].className = this.elements[i].className.replace(trim,'');

		}

	}

	return this;
};

Sone.prototype.removeClass = function(clsName){

	var pattern = new RegExp('([^-]|^)\\b' + clsName + '\\b([^-]|$)');
	var trim = /^\s+|\s+$/;

	for(var i = 0;i < this.elements.length;i ++){
		this.elements[i].className = this.elements[i].className.replace(pattern,' ').replace(trim,'');
	}

	return this;
};

//设置/获取innerHTML
Sone.prototype.html = function(str){

	if(str !== undefined){

		for(var i = 0;i < this.elements.length;i ++){
			this.elements[i].innerHTML = str;
		}

		return this;

	}else{

		return this.elements[0].innerHTML;

	}
};
//设置/获取innerText/textContent
Sone.prototype.text = function(str){

	if(str !== undefined){

		for(var i = 0;i < this.elements.length;i ++){
			if(this.elements[i].innerText === undefined){
				this.elements[i].textContent = str;
			}else{
				this.elements[i].innerText = str;
			}
		}

		return this;

	}else{
		if(this.elements[0].innerText === undefined){
			return this.elements[0].textContent;
		}else{
			return this.elements[0].innerText;
		}

	}
};

//获取value值
Sone.prototype.val = function(str){
	if(str !== undefined){
		for(var i = 0;i < this.elements.length;i ++){
			//this.elements[i].setAttribute('value',str);
			this.elements[i].value = str;
		}
		return this;
	}else{
		// return this.elements[0].getAttribute('value');
		return this.elements[0].value;
	}
};

//获取元素个数
Sone.prototype.__defineGetter__('length', function () {
	return this.elements.length;
});
Sone.prototype.length = function () {
	this.length = this.elements.length;
}

//获取/修改节点属性
Sone.prototype.attr = function(attr,value){
	if(value != undefined){
		for(var i = 0;i < this.elements.length;i ++){
			this.elements[i].setAttribute(attr,value);
		}
		return this;
	}else{
		if(typeof attr === 'object'){
			for(var i = 0;i < this.elements.length;i ++){
				for(var j in attr){
					this.elements[i].setAttribute(j,attr[j]);
				}
			}
			return this;
		}else{
			return this.elements[0].getAttribute(attr);
		}
	}
};
//删除节点属性
Sone.prototype.removeAttr = function(attr){
	for(var i = 0;i < this.elements.length;i ++){
		this.elements[i].removeAttribute(attr);
	}
	return this;
};

/*
 * 事件
 */
//设置鼠标移入移出hover方法
Sone.prototype.hover = function(enter,leave){
	for(var i = 0;i < this.elements.length;i++){
		addEvent(this.elements[i],'mouseenter',enter);
		addEvent(this.elements[i],'mouseleave',leave);
	}
	return this;
};
event('click');
event('mouseover');
event('mouseout');
event('mousedown');
event('mouseup');
event('mouseover');
event('resize');
event('scroll');
event('focus');
event('blur');
event('change');
event('keydown');
event('keyup');
event('submit');
function event(name){
	Sone.prototype[name] = function(fn){
		for(var i = 0;i < this.elements.length;i++){
			addEvent(this.elements[i],name,fn);
		}
		return this;
	}
}
//任意事件绑定
Sone.prototype.bind = function(type,fn){
	if(type.indexOf(' ') == -1){
		for(var i = 0;i < this.elements.length;i++){
			addEvent(this.elements[i],type,fn);
		}
	}else{
		var arr = type.split(' ');
		for(var i = 0;i < this.elements.length;i++){
			for(var j = 0,len = arr.length;j < len;j++){
				addEvent(this.elements[i],arr[j],fn);
			}
		}
	}

	return this;
};

//事件解绑*****未完成******
Sone.prototype.unbind = function(type,fn){
	if(type){
		if(type.indexOf(' ') == -1){
			for(var i = 0;i < this.elements.length;i++){
				removeEvent(this.elements[i],type,fn);
			}
		}else{
			var arr = type.split(' ');
			for(var i = 0;i < this.elements.length;i++){
				for(var j = 0,len = arr.length;j < len;j++){
					removeEvent(this.elements[i],arr[j],fn);
				}
			}
		}
	}
	return this;
};

/*
 * 动画
 */

//设置隐藏/显示
Sone.prototype.show = function(){
	for(var i = 0;i < this.elements.length;i ++){
		this.css('display','block');
		this.animate({'opacity':'1'});
	}
	return this;
};
Sone.prototype.hide = function(){

	var _this = this;
	for(var i = 0;i < this.elements.length;i ++){
		this.animate({'opacity':'0'},function(){
			_this.css('display','none');
		});
	}
	return this;
};
Sone.prototype.toggle = function(){
	if(this.css('display') === 'none'){
		this.show();
	}else{
		this.hide();
	}
};

//向下/向上滑动
Sone.prototype.slideDown = function(){

	//将行内样式去除
	this.css({
		'height' : '',
		'display' : 'block',
		'overflow' : 'hidden'
	});

	this.height = this.css('height');

	this.css('height' ,'0');

	return this.animate({
		'height' : this.height
	});

};
Sone.prototype.slideUp = function(){

	var _this = this;

	this.css('overflow','hidden');

	return this.animate({
		'height' : '0'
	},function(){
		_this.css({
			'display':'none',
			'height' : ''
		});
	});
};
Sone.prototype.slideToggle = function(){
	if(this.css('display') === 'none'){
		this.slideDown();
	}else{
		this.slideUp();
	}
};

//设置动画
Sone.prototype.animate = function(json,fn){

	clearInterval(this.timer);

	for(var i = 0,length = this.elements.length;i < length;i ++){

		var _this = this,
				speed = null;

		times = 5;

		this.timer = setInterval(function(){

			var stop = true;

			for(var attr in json){

				var cur = parseFloat(_this.css(attr));

				//判断属性值是否是自增/自减量
				if(isNaN(parseFloat(json[attr]))){
					switch(json[attr].charAt(0)){
						case '+' :
							json[attr] = parseFloat(json[attr].substr(2)) + cur;
							break;
						case '-' :
							json[attr] = -parseFloat(json[attr].substr(2)) + cur;
					}
				}

				//计算速度
				speed = (parseFloat(json[attr]) - cur)/times;

				if(attr === 'opacity'){
					speed *= 100;
				}

				speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);

				if(cur != parseFloat(json[attr])){
					stop = false;
				}

				//随时间改变属性值
				if(attr === 'opacity'){
					//不兼容ie6/7/8的写法

					speed /= 100;
					//此处这么写是为了解决浮点数的不精确导致无法得到stop=true
					if(((cur + speed) <= 0.01 && speed < 0) || ((cur + speed) > 1 && speed > 0)){

						if(speed < 0){
							_this.css(attr, '0');
						}else{
							_this.css(attr, '1');
						}

					}else{
						_this.css(attr, cur + speed);
					}

				}else{
					_this.css(attr, Math.floor(cur + speed) + 'px');
				}
			}

			//计时器停止及条件
			if(stop){
				clearInterval(_this.timer);
				if(fn){
					fn();
				}
			}
		},30);
	}
	return this;
};

//元素居中显示
Sone.prototype.center = function(){
	var win = $(window);
	var top = (win.height() - this.height())/2 + win.scrollTop();
	var left = (win.width() - this.width())/2;
	this.css('top',top+'px').css('left',left+'px');
	return this;
};

//锁屏
Sone.prototype.lock = function(){

	var win = $(window);

	this.show().css({
		'width':win.width() + 'px',
		'height' : win.height() + $(document).scrollTop() + 'px'
	});
	if(document.documentElement){
		document.documentElement.style.overflow = 'hidden';
	}else{
		document.body.style.overflow = 'hidden';
	}
	return this;
};

//解除锁屏
Sone.prototype.unlock = function(){
	this.hide();
	if(document.documentElement){
		document.documentElement.style.overflow = 'auto';
	}else{
		document.body.style.overflow = 'auto';
	}
	return this;
};

//插件插入
Sone.extend = function(name,fn){
	Sone.prototype[name] = fn;
};

/*
 * 兼容问题
 */

//事件绑定函数
function addEvent(obj,type,fn){

	if(obj.addEventListener){

		obj.addEventListener(type, fn, false);

	}else{

		//创建一个存放事件的哈希表
		if(!obj.events){
			obj.events = {};
		}

		//第一次
		if(!obj.events[type]){

			//创建一个存放事件的数组
			obj.events[type] = [];

			if(obj['on'+type]){
				obj.events[type][0] = fn;
			}

		}else{
			if(addEvent.equal(obj.events[type],fn)){
				return false;
			}
		}

		//从第二次开始用事件计数器存储
		obj.events[type][addEvent.id ++] = fn;

		obj['on' + type] = addEvent.exec;
	}

}
addEvent.id = 1; // 为每个事件分配一个计数器,实现累加
//当函数相同时
addEvent.equal = function(es,fn){
	for(var i in es){
		if(es[i] === fn){
			return true;
		}
	}
	return false;
};
//执行事件处理函数
addEvent.exec = function(event){

	event = event || addEvent.fixEvent(window.event);
	var es = this.events[event.type];

	for(var i in es){
		es[i].call(this,event);
	}

};

addEvent.fixEvent = function(event){
	event.preventDefault = addEvent.fixEvent.preventDefault;
	event.stopPropagation = addEvent.fixEvent.stopPropagation;
	return event;
};
addEvent.fixEvent.preventDefault = function(){
	this.returnValue = false;
};
addEvent.fixEvent.stopPropagation = function(){
	this.cancelBubble = true;
};

//删除事件绑定
function removeEvent(obj,type,fn){
	if(obj.removeEventListener){
		obj.removeEventListener(type, fn, false);
	}else{
		if(obj.events){
			for(var i in obj.events[type]){
				if(obj.events[type][i] === fn){
					delete obj.events[type][i];
				}
			}
		}
	}
}

//浏览器检测
var userAgent = navigator.userAgent.toLowerCase();
Sone.browser = {

	'opera' : /(opr)[\/]([\d.]+)/.test(userAgent) && /(opr)[\/]([\d.]+)/.exec(userAgent)[2],

	'chrome' : /(chrome)[\/]([\d.]+)/.test(userAgent) && /(chrome)[\/]([\d.]+)/.exec(userAgent)[2],

	'safari' : /version[\/]([\d.]+).*(safari)/.test(userAgent) && /version[\/]([\d.]+).*(safari)/.exec(userAgent)[1],

	'firefox' : /(firefox)[\/]([\d.]+)/.test(userAgent) && /(firefox)[\/]([\d.]+)/.exec(userAgent)[2],

	'ie' : /(mise\s|trident.*rv:)([\d.]+)/.test(userAgent) && /(mise\s|trident.*rv:)([\d.]+)/.exec(userAgent)[2]

};

//ajax包装
Sone.ajax = function (obj){

	var request = window.XMLHttpRequest?new XMLHttpRequest():new ActiveXObject('Microsoft.XMLHTTP');
	var url = obj.url+'?time='+new Date().getTime();
	var data = (function (data){

		if(!data) return;

		var pairs = [];

		for(var name in data){

			if(!data.hasOwnProperty(name)) continue;
			if(typeof data[name] === 'function') continue;

			var value = data[name].toString();
			name = encodeURIComponent(name.replace('%20','+'));
			value = encodeURIComponent(value.replace('%20','+'));
			pairs.push(name + '=' + data[name]);
		}
		return pairs.join('&');
	})(obj.data);
	url = (obj.method.toUpperCase() === 'GET') ? url + '&' + data : url;

	//异步时
	if(obj.async === true){
		request.onreadystatechange = function () {
			if(request.readyState === 4){
				callback();
			}
		};
	}

	request.open(obj.method,url,obj.async);

	if(obj.method.toUpperCase() === 'POST'){
		request.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
		request.send(data);
	}else if(obj.method.toUpperCase() === 'GET'){
		request.send(null);
	}

	//同步时
	if(obj.async === false){
		callback();
	}

	//检测request.status后执行的函数
	function callback(){
		if(request.status === 200){
			obj.success(request.responseText);
		}else{
			obj.faild();
		}
	}

};

//表单序列化
Sone.prototype.serialize = function (){
	var form = this.get(0);
	var obj = {},
			file = null;
	for(var i = 0,len = form.elements.length;i < len;i ++){
		file = form.elements[i];
		switch(file.type){
			case undefined :
			case 'submit' :
			case 'reset' :
			case 'file' :
			case 'button' :
				break;
			case 'radio' :
			case 'checkbox' :
				if(!file.selected)
					break;
			case 'select-one':
			case 'select-multiple':
				for(var j = 0;j < file.options.length;j ++){
					var option = file.options[j];
					if(option.selected){
						var value = '';
						if(option.hasAttribute){
							value = option.hasAttribute('value') ? option.value : option.text ;
						}else{
							value = option.attributes('value').specified ? option.value : option.text;
						}
						obj[file.name] = value;
						break;
					}
				}
				break;
			default :
				obj[file.name] = file.value;
		}
	}
	return obj;
};
