$(function(){
	/*
	 * 导航菜单
	 */
	var nav_lis = $('#nav .nav_content li'),
		slide = $('#nav .nav_bg');
	nav_lis.hover(function(){
		var target = $(this).get(0).offsetLeft;
		slide.animate({
			'left' : target
		})
	},function(){
		slide.animate({
			'left' : $('#nav .nav_content li').width() * 1
		})
	});

	/*
	* 简易目录
	* */
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

});