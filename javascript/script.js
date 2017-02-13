$(function(){

	//判断用户是否已经登录
	if(sessionStorage.name !== undefined){
		$('#header .center').css('display','block');
		$('#header .info').css('display','block').html(sessionStorage.name + '，您好');
		$('#header .reg').css('display','none');
		$('#header .login').css('display','none');
		$('#header .exit').css('display','block');
	}

	/*
	 * 个人中心
	 */
	(function () {
		var selection = $('#header .selection');
		$('#header .menu').hover(function(){
			selection.animate({
				'height' : '110px',
				'opacity' : '1'
			});
			selection.css('display','block');
		},function(){
			selection.animate({
				'height' : '0',
				'opacity' : '0'
			},function(){
				selection.css('display','none');
			});
		});
	})();

	//退出
	$('#header .exit').click(function () {
		window.location = 'index.html';
		sessionStorage.removeItem('name');
		this.css('display','none');
	});

	/*
	 * 登录/注册
	 */

	//登录
	$('#header .login').click(function (e) {
		pop('login',e);
	});
	$('#login .login .submit').click(login);
	$('#login .login input').keydown(function (e) {
		e = e || e.window;
		if(e.keyCode == 13){
			login();
		}
	});
	function login(){
		var passlen = $('#login .pass input').val().length,
				email = $('#login .email input').val(),
				submit = $('#login .button input'),
				input = $('#login input');
		submit.val('登 录').addClass('usable');
		if(/^[\w\.\-]+\@[\w\-]+(\.[a-zA-Z]{2,4}){1,2}$/.test(email) &&  passlen >= 6 && passlen <= 16){
			submit.val('登录中...').removeClass('usable');
			input.attr('disabled','disabled');
			$('#login .loading').css('display','block');
			Sone.ajax({
				url : 'is_login.php',
				data : $('#login form').serialize(),
				method : 'post',
				async : true,
				success : function(text){
					$('#login input').removeAttr('disabled');
					submit.val('登 录').addClass('usable');
					if(text === ''){ // 失败
						$('#login .info').css('opacity','1');
						submit.val('登 录');
					}else{ // 成功
						$('#login .info').css('opacity','0');
						submit.val('登录成功');

						setTimeout(function(){
							$('#login').css('display','none');
							$('#screen').unlock();
							//个人中心出现,注册登录消失
							$('#header .center').css('display','block');
							$('#header .info').css('display','block').html(text + '，您好');
							$('#header .reg').css('display','none');
							$('#header .login').css('display','none');
							$('#header .exit').css('display','block');
							submit.val('登 录');
						},500);
						sessionStorage.name = text;
					}
					$('#login .loading').css('display','none');
				}
			});
		}else{
			$('#login .info').css('opacity','1');
		}
	}

	function pop(name,e){
		//登录/注册框
		var screen = $('#screen'),
			act = $('#' + name);
		//点击登录/注册
		e = e || window.event;
		e.stopPropagation();

		if(e.target.className.split(' ').indexOf(name) > -1){
			act.show().center();
			screen.lock();
		}

		//调整浏览器大小时
		$(window).resize(function(){
			if(act.css('display') === 'block'){
				screen.lock();
			}

			act.center();
		});

		//关闭登录/注册框
		$('#' + name + ' .close').click(function(){
			act.hide();
			screen.unlock();
		});

		//登录/注册框拖拽
		$('#' + name +' h2').drag(act);
	}

	/*
	 * 注册验证
	 */
	 //初始化
	 $('#reg .reg').get(0).reset();

	//昵称验证
	$('#reg .name input').focus(function(){
		$(this).css('border-color','');
		var span = $('#reg .name span');
		span.html('请输入昵称').attr('class','name-input');
		$(this).keyup(function(){
			if($('#reg .name input').val().length == 12){
				span.html('不能超过12个字符').attr('class','name-over');
			}else{
				span.html('请输入昵称').attr('class','name-input');
			}
		});
	}).blur(function(){
		$(this).css('border-color','');
		var span = $('#reg .name span');
		span.html('').attr('class','');
		if(check_name()){
			span.attr('class','ok');
		}else{
			span.html('昵称不能为空').attr('class','name-empty');
			$(this).css('border-color','rgb(225,106,106)');
		}
	});
	function check_name(){
		var value = $('#reg .name input').val();
		if(value && !(/^\s+$/.test(value))){
			return true;
		}
		return false;
	}

	//密码验证
	$('#reg .pass input').focus(function(){

		$(this).css('border-color','');
		var value = $('#reg .pass input').val(),
			b = $('#reg .pass div b'),
			input = $('#reg .pass input');
		$('#reg .pass div').css('display','block');
		$('#reg .pass span').attr('class','strength').html('');
		$('#reg .pass span').attr('class','').html('');

		$(this).bind('input',function(){

			value = $('#reg .pass input').val();
			change(value.length < 6, 'length');
			change(/\s/.test(value),'space');
			change(value.length <= 9 && !(/[^0-9]/.test(value)),'number');
			attention();

		});
		attention();

		//改变在输入时判断条件的图标变化
		function change(condi,name){
			name = $('#reg .pass div .' + name);
			if(condi){
				name.css('background-position','0 -282px');
			}else{
				name.css('background-position','0 -248px');
			}
		}
		//当没有输入密码时,使所有的判断条件只是注意图标
		function attention(){
			if(value.length == 0){
				b.css('background-position','0 -216px');
			}
		}

	}).blur(function(){
		var value = $(this).val(),
			span = $('#reg .pass span'),
			codelength = 0;
		if(check_pass(value)){
			if(/[\d]/.test(value)){
				codelength ++;
			}
			if(/[a-z]/.test(value)){
				codelength ++;
			}
			if(/[A-Z]/.test(value)){
				codelength ++;
			}
			if(/[^0-9a-zA-Z]/.test(value)){
				codelength ++;
			}

			switch(codelength){
				case 1:
				  span.addClass('pass-strength-1').html('安全度弱');
				  break;
				case 2:
				  span.addClass('pass-strength-2').html('安全度中等');
				  break;
				default:
				  span.addClass('pass-strength-3').html('安全度强');
			}
			$('#reg .pass div').css('display','none');
		}else{
			$(this).css('border-color','rgb(225,106,106)');
		}
	});
	function check_pass(value){
		if((value.length >= 6) && !(/\s/.test(value)) && !(value.length <= 9 && !(/[^0-9]/.test(value)))){
			return true;
		}
		return false;
	}
	//密码确认验证
	$('#reg .confirm input').focus(function(){
		$(this).css('border-color','');
		var span = $('#reg .confirm span');
		var value = $(this).val();
		$(this).keyup(function(){
			var value = $(this).val();
			if(value === $('#reg .pass input').val().substr(0,value.length)){
				span.attr('class','confirm-focus').html('请再次输入密码');
			}else{
				span.attr('class','confirm-diff').html('密码不一致');
			}
		})
	}).blur(function(){
		var span = $('#reg .confirm span'),
			value = $(this).val(),
			password = $('#reg .pass input').val();
		if(value){
			if(check_pass(password)){
				if(value === password){
					span.attr('class','ok').html('');
					$(this).css('border-color','');
				}else{
					span.attr('class','confirm-diff').html('密码不一致');
					$(this).css('border-color','rgb(225,106,106)');
				}
			}else{
				span.attr('class','').html('');
			}

		}else{
			span.attr('class','confirm-blur').html('请再次输入密码');
			$(this).css('border-color','rgb(225,106,106)');
		}

	});
	$('#reg input').focus(function(){
		if($('#reg .pass input').val() !== $('#reg .confirm input').val()){
			$('#reg .confirm span').attr('class','confirm-diff').html('密码不一致');
			$('#reg .confirm input').css('border-color','rgb(225,106,106)');
		}
	});

	//选择密保问题
	$('#reg .ques select').change(function(){
		$(this).css('border-color','');
		if(check_ques()){
			$('#reg .ques span').html('').attr('class','');
		}else{
			$('#reg .ques span').html('您还未选择密保问题').attr('class','unselected');
			$(this).css('border-color','rgb(225,106,106)');
		}
	});
	function check_ques(){
		if($('#reg .ques select').val() == 0){
			return false;
		}
		return true;
	}

	//答案验证
	$('#reg .ans input').focus(function(){
		var span = $('#reg .ans span'),
			select = $('#reg .ques select');
		span.html('请输入问题答案').attr('class','');
		$(this).css('border-color','');
		select.css('border-color','');
		if(select.val() == 0){
			$('#reg .ques span').html('您还未选择密保问题').attr('class','unselected');
			select.css('border-color','rgb(225,106,106)');
		}
	}).blur(function(){
		$(this).val($(this).val().replace(/\s/g,''));
		var span = $('#reg .ans span'),
			value = $(this).val();

		if(value){
			if(/\s/.test(value)){
				span.attr('class','ans-error').html('答案不能为空');
			}else{
				span.attr('class','ok').html('');
			}
		}else{
			span.attr('class','ans-empty').html('请输入问题答案');
			$(this).css('border-color','rgb(225,106,106)');
		}
	});
	function check_ans(){
		var value = $('#reg .ans input').val();
		if(value && !/\s/.test(value)){
			return true;
		}
		return false;
	}

	//邮箱验证
	$('#reg .email input').focus(function(){
		$(this).css('border-color','');
		var span = $('#reg .email span'),
			lis = $('#reg .all-email li'),
			length = lis.length,
			index = -1,
			all_email = $('#reg .all-email');
		span.html('请输入您常用的电子邮箱').attr('class','');
		//邮箱自动补全
		$(this).keyup(function(e){
			e = e || window.event;
			var value = $(this).val();
			if(e.keyCode !== 13){
				$('#reg .all-email').css('display','block');
			}
			if(value.indexOf('@') > 0){
				$('#reg .all-email b').html(value.substring(0,value.indexOf('@')));
			}else{
				$('#reg .all-email b').html(value);
			}
		});
		$(this).keydown(function(e){
			e =  e || window.event;
			lis.removeClass('on');
			//keyCode:下键40,上键38,回车13
			switch(e.keyCode){
				case 13:
					$('#reg .email input').val($('#reg .all-email li').eq(index).text());
					all_email.css('display','none');
					index = -1;
					break;
				case 38:
					if(index <= 0){
						index = length;
					}
					change(--index);
					break;
				case 40:
					if(index >= length - 1){
						index = -1;
					}
					change(++index);
			}
			lis.hover(function(){
				lis.removeClass('on');
				$(this).addClass('on');
				index = $(this).val();
			},function(){
				$(this).removeClass('on');
			});
			function change(index){
				lis.removeClass('on');
				$('#reg .all-email li').eq(index).addClass('on');
			}
		});
	}).blur(function(){
		var value = $(this).val(),
			span = $('#reg .email span');
		if(value){
			if(check_email()){
				$('#reg .email span').attr('class','loading').html('');
				$('#reg .submit input').attr("disabled","disabled");
				$('#reg .submit').removeClass('usable');
			}
		}else{
			span.attr('class','email-empty').html('请输入邮箱');
			$(this).css('border-color','rgb(225,106,106)');
		}
		$('#reg .all-email').css('display','none');
	});
	//点击选择自动补全邮箱内容
	$('#reg .all-email').mousedown(function(e){
		e = e || window.event;
		$('#reg .email input').val($(e.target).text());
	});

	function check_email(){
		var flag = true,
			span = $('#reg .email span');
		if(!(/^[\w\.\-]+\@[\w\-]+(\.[a-zA-Z]{2,4}){1,2}$/.test($('#reg .email input').val()))){
			span.attr('class','email-error').html('邮箱格式错误');
			$('#reg .email input').css('border-color','rgb(225,106,106)');
			return false;
		}else{
			Sone.ajax({
				url : 'is_user.php',
				data : $('#reg form').serialize(),
				method : 'post',
				async : true,
				success : function(text){
					if(text == 1){
						span.attr('class','email-error').html('该邮箱已被注册了');
						$('#reg .email input').css('border-color','rgb(225,106,106)');
						flag = false;
					}else{
						span.attr('class','ok').html('');
						$('#reg .submit input').removeAttr("disabled");
						$('#reg .submit').addClass('usable');
						flag = true;
					}
				},
				faild : function () {
					setTimeout(function(){
						span.attr('class','ok').html('');
						$('#reg .submit input').removeAttr("disabled");
						$('#reg .submit').addClass('usable');
						flag = true;
					},500);
				}
			});
			return flag;
		}
	}

	//设置生日
	(function () {
		var year = $('#reg .birthday .year'),
				month = $('#reg .birthday .month');
		for(var i = 1950;i <= 2016;i++){
			year.get(0).options[2016+1-i] = new Option(i,i);
		}
		for(var j = 1;j <= 12;j++){
			month.get(0).options[j] = new Option(j,j);
		}
		year.bind('change',function(){
			setDay();
		});
		month.bind('change',function(){
			setDay();
		});
	})();
	function setDay(){
		$('#reg .birthday .day').get(0).options.length = 1;
		var year = $('#reg .birthday .year').val(),
			month = $('#reg .birthday .month').val(),
			days = 0;
		if(year != 0){
			if(/4|6|9|11/.test(month)){
				days = 30;
			}else if(/1|3|5|7|8|10|12/.test(month)){
				days = 31;
			}
			if(month == 2){
				if((!(year % 4) && (year % 100)) || !(year % 400)){
					days = 29;
				}else{
					days = 28;
				}
			}
			for(var i = 1;i <= days;i++){
				$('#reg .birthday .day').get(0).options[i] = new Option(i,i);
			}
		}
	}

	//备注限制字数
	$('#reg .ps textarea').bind('input',function(){
		var maxlength = 200;
		var show_num = maxlength - $('#reg .ps textarea').val().length,
				ps_num = $('#reg .ps-num');

		if(show_num > 0){
			ps_num.html('还可以输入<b>200</b>字');
			$('#reg .ps-num b').css('color','');
		}else{
			ps_num.html('已超出<b></b>字');
			$('#reg .ps-num b').css('color','#F00');
			show_num = - show_num;
		}
		$('#reg .ps-num b').html(show_num);
	});
	function check_ps(){
		var maxlength = 200;
		if($('#reg .ps textarea').val().length <= maxlength){
			return true;
		}
		return false;
	}

	//JS模拟submit提交
	$('#reg .submit input').click(function(){
		var flag = true;
		if(!check_name()){
			flag = false;
			$('#reg .name span').html('昵称不能为空').attr('class','name-empty');
			$('#reg .name input').css('border-color','rgb(225,106,106)');
		}
		if(!check_pass($('#reg .pass input').val())){
			flag = false;
			$('#reg .pass div').css('display','none');
			$('#reg .pass span').attr('class','error').html('密码输入不合法');
			$('#reg .pass input').css('border-color','rgb(225,106,106)');
		}
		if($('#reg .pass input').val() !== $('#reg .confirm input').val()){
			flag = false;
			$('#reg .confirm span').attr('class','error').html('密码不一致');
			$('#reg .confirm input').css('border-color','rgb(225,106,106)');
		}
		if(!check_ques()){
			flag = false;
			$('#reg .ques span').html('您还未选择密保问题').attr('class','unselected');
			$('#reg .ques select').css('border-color','rgb(225,106,106)');
		}
		if(!check_ans()){
			flag = false;
			$('#reg .ans span').attr('class','error').html('答案格式错误');
			$('#reg .ans input').css('border-color','rgb(225,106,106)');
		}
		if(!check_email()){
			flag = false;
		}
		if(!check_ps()){
			flag = false;
			var maxlength = 200;
			$('#reg .ps-num').html('已超出<b></b>字');
			$('#reg .ps-num b').css('color','#F00').html($('#reg .ps textarea').val().length - maxlength);
		}
		if(flag){
			$('#loading').css('display','block').center();
			$('#loading p').html('正在注册...');
			$('#reg input').attr("disabled","disabled");
			$('#reg .submit').removeClass('usable');
			$('#reg select').attr("disabled","disabled");
			$('#reg textarea').attr("disabled","disabled");
			Sone.ajax({
				url : 'add_user.php',
				data : $('#reg form').serialize(),
				method : 'post',
				async : true,
				success : function(){
					$('#loading').css('display','none');
					$('#success').css('display','block').center();
					$('#success p').html('恭喜注册成功!');
					$('#reg form').get(0).reset();
					$('#reg dd span').attr('class','').html('');
					$('#reg .submit').addClass('usable');
					$('#reg input').removeAttr("disabled");
					$('#reg select').removeAttr("disabled");
					$('#reg textarea').removeAttr("disabled");
					setTimeout(function(){
						$('#screen').unlock();
						$('#success').css('display','none');
						$('#reg').css('display','none');
						$('#screen').hide();
					},1500);
				}
			});
		}else{
			$('#loading').css('display','none');
		}
	});

	/*
	 * 分享
	 */
	(function (){
		var share = $('#share'),
				win = $(window);
		share.css('top',(win.height() - share.height())/2 + win.scrollTop() + 'px');
		$(window).scroll(function(){
			share.animate({'top' : Math.round((win.height() - share.height())/2 + win.scrollTop()) +'px'});
		});
	})();

	/*
	 * 导航菜单
	 */
	(function (){
		var nav_lis = $('#nav .nav_content li'),
				slide = $('#nav .nav_bg');
		nav_lis.hover(function(){
			var target = $(this).get(0).offsetLeft;
			slide.animate({
				'left' : target
			})
		},function(){
			slide.animate({
				'left' : 0
			})
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
		btn.bind('click touchend',function(){
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
			}, function () {
				banner_img.css({
					'margin-left' : - scale * banner.index + 'px'
				});
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

	/*
	响应式
	 */

	//点击菜单
	(function () {
		var nav = $('#header .nav'),
			btn = $('.nav-btn');
		btn.click(function (e) {
			e = e || window.event;
			if(nav.css('display') === 'block'){
				hidenav();
			}else{
				nav.css('display','block');
				nav.animate({
					'right' : 0
				});
				btn.addClass('toggle-animate');
			}
			e.stopPropagation();
		});
		$(document).bind('click touchend',hidenav);

		function hidenav(){
			nav.animate({
				'right' : '-202px'
			}, function () {
				nav.css('display','none');
			});
			btn.removeClass('toggle-animate');
		}
	})();

	//点击注册
	(function () {
		var reg = $('#reg');
		$('#header .reg').click(function (e) {
			e = e || window.event;
			e.stopPropagation();
			if($(window).width() <= 600){
				reg.addClass('slidedown').css({
					'display' : '',
					'opacity' : '',
					'left' : '',
					'top' : ''
				});
				$('#reg .pass input').bind('input focus',function(){
					$('#reg .pass div').css('display','none');
				});
			}else{
				pop('reg',e);
			}
		});

		$(document).bind('click touchstart',function (e) {
			e = e || window.event;
			var name = e.target.nodeName.toLowerCase();
			if(name != 'input' && name != 'textarea' && name != 'select'){
				reg.removeClass('slidedown');
			}
		});
	})();

	//调整窗口大小时,使网页内容恢复原状
	(function(){
		$(window).resize(function () {
			if($(window).width() >= 960){
				$('#header .nav').css('display','none');
				$('#header .nav-btn').removeClass('toggle-animate');
			}
		});
	})();
});