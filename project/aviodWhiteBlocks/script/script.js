/**
 * Created by sone on 16/5/30.
 */

window.onload = function () {

    var timer = null,
        speed = 0,
        isStop = false,
        isStart = false;

    /**
     * 初始化
     */
    function init(){
        //内容重置
        var con = $('container');
        con.innerHTML = '';
        con.style.top = '-150px';
        //分数清零
        $('score').innerHTML = 0;
        //速度、暂停重置
        speed = 4;
        window.onkeydown = stop;
        isStop = false;
        isStart = false;

        for(var j = 0;j < 5;j++){
            createRow();
        }

        con.children[con.children.length - 1].pass = 1;
        $('main').onclick = function (ev) {
            judge(ev);
        }
    }

    /**
     * 判断输赢(事件委托)
     */
    function judge(ev){
        ev = ev || window.event;
        if(ev.target.className.indexOf('black') >= 0){
            ev.target.className ='cell';
            score();
            ev.target.parentNode.pass = 1;
        }else{
            alert('You have tapped a white tile!');
            fail();
        }
    }

    /**
     * 游戏结束
     */
    function fail(){
        clearInterval(timer);
        $('main').onclick = null;
        window.onkeydown = null;
    }

    /**
     * start()启动
     */
    function start(){
        clearInterval(timer);
        timer = setInterval(function () {
            move();
        },30);
    }

    /**
     * 游戏暂停/继续
     */
    function stop(ev) {
        ev = ev || window.event;
        if(ev.keyCode == 32){
            if(!isStop){
                clearInterval(timer);
                $('main').onclick = null;
                isStop = true;
            }else{
                start();
                $('main').onclick = function (ev) {
                    judge(ev);
                };
                isStop = false;
            }
        }
    }

    /**
     * 游戏（重新）开始
     */
    $('restart').onclick = function(){
        init();
        start();
        $('restart').innerHTML = 'RESTART';
    };

    /**
     * 动画
     */
    function move(){
        var con = $('container');
        var top = parseInt(getStyle(con,'top'));
        var rows = con.children;
        top +=speed;
        con.style.top = top + 'px';

        if(top >= 0){
            createRow();
            con.style.top = -150 + 'px';
            delRow();
        }else if(top >= -5){
            if(rows[rows.length-1].pass != 1){
                alert('You missed a black tile!');
                fail();
            }
        }
    }

    /**
     * 获取当前样式
     */
    function getStyle(obj,name){
        if(obj.currentStyle){
            return obj.currentStyle[name];
        }else{
            return getComputedStyle(obj,false)[name];
        }
    }

    /**
     * 记分
     */
    function score(){
        var score = parseInt($('score').innerHTML);
        $('score').innerHTML = score + 1;
        if((speed < 12) && (score % 5 == 0)){
            speed += 1;
        }
    }

    /**
     * 创建div.row
     */
    function createRow(){
        var con = $('container');
        var row = createDiv('row');
        var clsNames = createSn();
        for(var i = 0;i < clsNames.length;i ++){
            row.appendChild(createDiv(clsNames[i]));
        }

        con.insertBefore(row,con.firstChild);
    }

    /**
     * 删除最后一行
     */
    function delRow(){
        var con = $('container');
        con.removeChild(con.children[con.children.length-1]);
    }

    /**
     * 创建div
     */
    function createDiv(clsName){
        var div = document.createElement('div');
        div.className = clsName;
        return div;
    }

    /**
     * 返回一个数组，随机其中1个单元className为'cell black',其他三个为cell
     */
    function createSn(){
        var arr = ['cell','cell','cell','cell'];
        if(!isStart){
            isStart = true;
        }else{
            var index = Math.floor(Math.random()*4);
            arr[index] = 'cell black';
        }
        return arr;
    }

    /**
     * 按id获取对象
     */
    function $(id){
        return document.getElementById(id);
    }

};
