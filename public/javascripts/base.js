$(function(){
    /*
     * 导航菜单
     */
    (function (){
        var nav_lis = $('#nav .nav-content li'),
            slide = $('#nav .nav_bg'),
            left = slide.css('left');

        nav_lis.hover(function(){
            slide.position({left: this.offsetLeft});
        },function(){
            slide.position({left: left});
        });
    })();

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
     响应式
     */

    //点击菜单
    (function () {
        var nav = $('#nav'),
            btn = $('.nav-btn');

        $(document).bind('touchstart', hidenav);

        btn.bind('click' ,function (e) {
            e.stopPropagation();
            var height = $('#nav .nav-li').height() * $('#nav .nav-li').length;

            if(btn.attr('class').indexOf('toggle-animate') >  -1){
                hidenav();
            } else {
                nav.animate({
                    'height' : height
                });
                btn.addClass('toggle-animate');
            }
        });

        function hidenav(e){
            if(e && e.target && $('#header').get(0).contains(e.target)) {
                return false;
            }

            nav.animate({
                'height' : '0'
            });
            btn.removeClass('toggle-animate');
        }
    })();

    $(window).bind('resize', function() {
        if($(window).width() >= 960) {
            $('#nav').css('height', '');
            $('.nav-btn').removeClass('toggle-animate');
        }
    });
});