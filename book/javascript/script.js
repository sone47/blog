$(function(){

	function pop(name){
		//登录/注册框
		var screen = $('#screen'),
				act = $('#' + name);
		//点击登录/注册
		$('.' + name).click(function(e){

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
		});
	}

	/*
	 * 书籍封面图延迟加载
	 */
	$('#photo .load').css('opacity','0');
	if($(document).scrollTop() + $(document).height() >= $('#photo .load').offset().top){
		(function (){
			var load = $('#photo .load'),
				length = load.length;
			for(var i = 0;i < length;i ++){
				var _load = load.get(i);
				$(_load).attr('src',$(_load).attr('_src')).animate({
					'opacity' : 1
				});
			}
		})();
	}else{
		$(window).bind('resize scroll',function(){
			var doc = $(document),
				load = $('#photo .load'),
				length = $('#photo .load').length;

			if(doc.scrollTop() + doc.height() >= load.offset().top){
				for(var i = 0;i < length;i ++){
					var _load = load.get(i);
					$(_load).attr('src',$(_load).attr('_src')).animate({
						'opacity' : 1
					});
				}
			}
		});
	}

	/*
	 * 书籍目录预加载
	 */
	pop('load');
	// 打开目录/查看上,下一本书的目录/查看本书上,下一页目录
	$('.load').click(changebook);
	// 关闭预加载窗口时,图片要更改为加载图片
	$('#load .close').click(function(){
		var timer = setInterval(function () {
			if($('#load').css('display') === 'none'){
				$('#load .big img').attr('src','images/loading.gif');
				clearTimeout(timer);
			}
		},1000);
	});
	//换书
	function changebook(){
		//创建一个临时的图片对象使之在后台加载图片
		var temp_img = new Image(),
				prev_book = new Image(),
				next_book = new Image(),
				children = this.parentNode.parentNode,
				photo = $('#photo').get(0),
				len = children.parentNode.children.length,
				img = $('#load .big img'),
				book_index = $(children).index(),
				prev = book_index - 1,
				next = book_index + 1;
		$(temp_img).bind('load',function(){
			img.attr('src',temp_img.src).css({
				'opacity':'0'
			}).animate({
				'opacity' : 1
			});
		});
		temp_img.src = 'images/pic' + (book_index + 1) + '-1.png';

		changeBook();

		//切换书
		$('#load .left').click(function(){
			changeBook('prev');
		});
		$('#load .right').click(function(){
			changeBook('next');
		});

		function changeBook(value){
			if(value){
				img.attr('src','images/loading.gif').css('opacity','0').animate({
					'opacity':1
				});
				$(temp_img).bind('load',function(){
					img.attr('src',temp_img.src).css({
						'opacity':'0'
					}).animate({
						'opacity' : 1
					});
				});
				if(value == 'prev'){
					if(book_index == 0){
						book_index = len - 1;
					}else{
						book_index --;
					}
				}else{
					if(book_index == len - 1){
						book_index = 0;
					}else{
						book_index ++;
					}
				}
				temp_img.src = 'images/pic' + (book_index + 1) + '-1.png';
			}
			// 预加载前后图片

			prev = book_index - 1;
			next = book_index + 1;
			if(prev == -1){
				prev = len - 1;
			}
			if(next == len){
				next = 0;
			}
			prev_book.src = 'images/pic' + (prev + 1) + '-1.png';
			next_book.src = 'images/pic' + (next + 1) + '-1.png';

			$('#load h2 span').html($(photo.children[0].children[book_index]).text());


		}
	}

	/*
	 * 导航菜单
	 */
	var nav_lis = $('#nav .nav_content li'),
		slide = $('#nav .nav_bg');
	nav_lis.hover(function(){
		var target = $(this).get(0).offsetLeft;
		slide.animate({
			'left' : target
		});
	},function(){
		slide.animate({
			'left' : $('#nav .nav_content li').width() * 2
		})
	});


});