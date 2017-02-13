$(function(){

	/*
	 * 导航菜单
	 */

	(function (){
		var nav_lis = $('#nav .nav-content li'),
			slide = $('#nav .nav_bg'),
			target = nav_lis.get(0);
		slide.position({left: target.offsetLeft});

		nav_lis.hover(function(){
			slide.position({left: this.offsetLeft});
		},function(){
			slide.position({left: target.offsetLeft});
		});

		$(window).resize(function() {
			slide.position({left: target.offsetLeft});
		});
	})();

	/*
	 * 轮播器
	 */
	(function (){
		//初始化
		var banner = $('#banner'),
				banner_img = $('#banner .img'),
				imgs = $('#banner .img img'),
				btn = $('#banner .btn a');
		banner.timer = null;
		banner.index = 1;
		clearInterval(banner.timer);
		imgs.bind('load', function () {
			banner_img.css('margin-left',- imgs.width() + 'px');
		});

		//手动
		btn.bind('click',function(){
			banner.index = $(this.parentNode).index() + 1;
			btn.html('○');
			$(this).html('●');
			$('#banner p').html($('#banner .img img').eq(banner.index).attr('title'));
			banner_img.animate({
				'margin-left' : - banner.width() * banner.index
			});
		});

		//自动
		banner.timer = setInterval(function(){
			banner.index ++;
			move();
		},3000);
		banner.hover(function(){
			clearInterval(banner.timer);
		},function(){
			banner.timer = setInterval(function(){
				banner.index ++;
				move();
			},5000);
		});

		//调整浏览器大小时,banner不能乱
		$(window).resize(function () {
			banner_img.css({
				'margin-left' : - banner.width() * banner.index + 'px'
			});
		});

		function move(){
			btn.html('○');

			if(banner.index >= $('#banner .img li').length){
				banner_img.css({
					'margin-left' : - banner.width()
				});
				banner.index = 1;
				$('#banner .btn a').eq(0).html('●');
			}else{
				if(banner.index <= btn.length){
					$('#banner .btn a').eq(banner.index-1).html('●');
				}else{
					$('#banner .btn a').eq(0).html('●');
				}
				banner_img.animate({
					'margin-left' :  - banner.width() * banner.index
				}, function () {
					if(banner.index == btn.length + 1){
						banner.index = 1;
						banner_img.css({
							'margin-left' : - banner.width() + 'px'
						});
					}
				});
			}
			$('#banner p').html($('#banner .img img').eq(banner.index).attr('title'));
		}

		//触屏
		banner.bind('touchstart', function (e) {
			e.preventDefault();
			// 自动播放停止
			clearInterval(banner.timer);

			banner.startX = e.touches[0].pageX;
			banner.offsetX = 0;
			banner.startTime = new Date() * 1;
		});
		banner.bind('touchmove', function (e) {

			e.preventDefault();

			banner.offsetX = e.touches[0].pageX - banner.startX;

			banner_img.css('margin-left',-(banner.index * banner.width()) + banner.offsetX + 'px');

		});
		banner.bind('touchend', function () {
			// 开启自动播放
			banner.timer = setInterval(function(){
				banner.index ++;
				move();
			},5000);

			var boundrary = banner.width() / 2,
					endTime = new Date() * 1;

			if(endTime - banner.startTime > 500){
				if(banner.offsetX >= boundrary){
					//上一张
					go('-1');
				}else if(banner.offsetX <= -boundrary){
					//下一张
					go('+1');
				}else{
					//本张
					go('0');
				}
			}else{
				if(banner.offsetX > 50){
					go('-1');
				}else if(banner.offsetX < -50){
					go('+1');
				}else{
					go('0');
				}
			}
		});
		function go(n){
			var index = 0,
					lis = $('#banner .img li'),
					len = lis.length,
					scale = banner.width();
			banner.index = banner.index + n * 1;

			banner_img.animate({
				'margin-left' : - scale * banner.index
			});
			if(banner.index == len - 1){
				banner.index = 1;
			}else if(banner.index == 0){
				banner.index = len - 2;
			}

			index = banner.index;
			if(index > $('#banner .btn li').length){
				index = 1;
			}else if(index < 1){
				index = $('#banner .btn li').length;
			}
			btn.html('○');
			$('#banner .btn a').eq(index-1).html('●');
			$('#banner p').html($('#banner .img img').eq(banner.index).attr('title'));

		}
	})();

	/*
	 * 左侧菜单
	 */
	(function sidebar(){
		for(var i = 0,len = $('#sidebar ul').elements.length;i < len;i ++){
			(function(i){
				var sidebar_ul = $('#sidebar ul').eq(i);
				$('#sidebar h2').eq(i).click(function(){
					sidebar_ul.slideToggle();
				})
			})(i);
		}
	})();

	/*
	 * 右侧留言板
	 */
	(function () {
		var message_textarea = $('#message .publish textarea'),
				btn = $('#message .publish a');
		message_textarea.focus(function () {
			$(this).bind('input keydown', function (e) {
				e = e || window.event;
				if(message_textarea.val() !== '' && !(/^\s+$/.test(message_textarea.val()))){
					btn.attr('class','usable');
				}else{
					btn.attr('class','');
				}
				//input事件没有keyCode属性
				setTimeout(function () {
					if(e.keyCode == 13 && e.ctrlKey){
						if(!(/^\s+$/.test(message_textarea.val()))){
							publish();
						}
					}
				},30);
			});

		});
		//发布留言
		btn.click(publish);
	})();

	function publish(){
		if($('#message .publish a').attr('class') === 'usable'){
			var content = $('#message .publish textarea').val(),
					name = $('#message .publish input').val().replace('/\s/','');
			if(name === '' || /^\s+$/.test(name)){
				name = '路人甲';
			}
			content.replace(/\s/,'');
			Sone.ajax({
				method : 'post',
				url : 'add_message.php',
				data : $('#message form').serialize(),
				async : true,
				success : function (text) {
					if(text != ''){
						var li = document.createElement('li'),
								ul = $('#message ul').get(0),
								date = new Date();
						var time = date.getFullYear()+'-'+check_time(date.getMonth()+1)+'-'+check_time(date.getDate())+' '+check_time(date.getHours())+':'+check_time(date.getMinutes())+':'+check_time(date.getSeconds());
						li.innerHTML = content+ '<a href="javascript:void(0);"><img src="images/head/head1.png" alt="" width="50"><span class="name">'+name+'</span></a><span class="time">'+time+'</span>';
						if(ul.children){
							ul.insertBefore(li,ul.children[0]);
						}else{
							ul.appendChild(li);
						}
						var marginTop = $(li).css('margin-top');
						$(li).css('margin-top',- $(li).outerHeight() + 'px').animate({
							'margin-top' : marginTop
						});
						$('#message form').get(0).reset();
						$('#message .publish .success').css('display','block');
						setTimeout(function(){
							$('#message .publish .success').css('display','none');
						},1000);
					}
				}
			});
		}
	}
	function check_time(t){
		if(t < 10){
			return t = '0' + t;
		}
		return t;
	}
	//获取后台留言
	Sone.ajax({
		method : 'post',
		url : 'get_message.php',
		async : true,
		success : function (text) {
			var json = JSON.parse(text),
					ul = $('#message .message_border').get(0);
			for(var i in json){
				var li = document.createElement('li');
				json[i] = JSON.parse(json[i]);
				li.innerHTML = json[i]['message']+ '<a href="javascript:void(0);"><img src="images/head/head1.png" alt="" width="50"><span class="name">'+json[i]['name']+'</span></a> <span class="time">'+json[i]['date']+'</span>';
				if(ul.children.length){
					ul.insertBefore(li,ul.children[1]);
				}else{
					ul.appendChild(li);
				}
			}
		}
	});


});