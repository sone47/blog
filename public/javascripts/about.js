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
      'left' : $('#nav .nav_content li').width() * 4
    })
  });
});