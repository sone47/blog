$(function(){
	/*
	 * 轮播器
	 */
	new Slider({
		wrap: document.getElementById('banner'),
		list: [{
			height: 452,
			width: 1212,
			img: './images/banner1.jpg'
		},{
			height: 452,
			width: 1212,
			img: './images/banner2.jpg'
		},{
			height: 452,
			width: 1212,
			img: './images/banner3.jpg'
		}],
		width: window.innerWidth,
		height: 200
	});

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
			btn = $('#message .publish .btn');
		message_textarea.focus(function () {
			$(this).bind('input keydown', function (e) {
				e = e || window.event;
				if(message_textarea.val() !== '' && !(/^\s+$/.test(message_textarea.val()))){
					btn.addClass('usable');
				}else{
					btn.removeClass('usable');
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
		if($('#message .publish .btn').get(0).classList.contains('usable')){
			var content = $('#message .publish textarea').val(),
				name = $('#message .publish .name').val().replace('/\s/',''),
				email = $('#message .publish .email').val().replace('/\s/',''),
				date = new Date();
			if(name === '' || /^\s+$/.test(name)){
				alert('名字格式错误！');
				return;
			}
			if(!/^\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}$/.test(email)) {
				alert('邮箱格式错误');
				return;
			}
			content.replace(/\s/,'');
			var time = date.getFullYear()+'-'+('0'+(date.getMonth()+1)).slice(-2)+'-'+('0'+date.getDate()).slice(-2)+' '+('0'+date.getHours()).slice(-2)+':'+('0'+date.getMinutes()).slice(-2)+':'+('0'+date.getSeconds()).slice(-2);
			Sone.ajax({
				method : 'post',
				url : '/message',
				data : {
					name: name,
					email: email,
					content: content,
					createTime: date
				},
				async : true,
				success : function (text) {
					if(text === '1'){
						var li = document.createElement('li'),
							ul = $('#message .message_list').get(0);
						li.innerHTML = '<p>'+content+'</p><div class="info"><span class="name">'+name+'</span><span class="time">'+time+'</span></div>';
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
	//获取后台留言
	Sone.ajax({
		method : 'get',
		url : '/message',
		async : true,
		success : function (data) {
			var ul = $('#message .message_list').get(0);
			var reg = /(\d{4}-\d{2}-\d{2}).(\d{2}:\d{2}:\d{2})/;
			data = JSON.parse(data);

			data.forEach(function(message) {
				var li = document.createElement('li');
				var time = reg.exec(message['createTime']).slice(1).join(' ');
				
				li.innerHTML = '<p>'+message['content']+'</p><div class="info"><span class="name">'+message['name']+'</span><span class="time">'+time+'</span></div>';
				ul.insertBefore(li,ul.children[0]);
			});
		}
	});

});