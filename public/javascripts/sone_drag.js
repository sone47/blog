Sone.extend('drag',function(draged){

	for(var i = 0;i < this.elements.length;i++){

		addEvent(this.elements[i],'mousedown',function(e){

			e.preventDefault();
			e.preventDefault();
			var posX = e.clientX - draged.position().left;
			var posY = e.clientY - draged.position().top;

			addEvent(document,'mousemove',move);

			addEvent(document,'mouseup',up);


			//鼠标移动时
			function move(e){
				e = e || window.event;
				e.preventDefault();

				var l = e.clientX - posX;
				var h = e.clientY - posY;
				var lMax = $(window).width() - draged.outerWidth();
				var hMax = $(window).height() + $(document).scrollTop() - draged.outerHeight();

				if(l < 0){
					l = 0;
				}else if(l > lMax){
					l = lMax;
				}

				if(h < $(document).scrollTop()){
					h = $(document).scrollTop();
				}else if(h > hMax){
					h = hMax;
				}

				draged.css('left',l + 'px');
				draged.css('top',h + 'px');
			}

			//鼠标抬起时
			function up(){
				removeEvent(document,'mousemove',move);
				removeEvent(document,'mouseup',up);
			}

		});
	}

	return this;

});
