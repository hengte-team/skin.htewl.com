window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          window.oRequestAnimationFrame 	 ||
          window.msRequestAnimationFrame     ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

$(function(){
	if(cavasSupport()){
		canvasApp();
	}else{
		alert('您的浏览器不支持canvas');
	}

	function canvasApp(){
		//获取画布信息
		var theCanvas = document.getElementById('pzCanvas');
		theCanvas.height = theCanvas.width;
		var context = theCanvas.getContext("2d");
		context.backgroundAlpha = 0
		//根据奖品个数计算圆周角度
		var arc = Math.PI / (turnplate.restaraunts.length/2);
		
		//每一帧
		function drawScreen (){
			//清空画布
			context.clearRect(0,0,theCanvas.width,theCanvas.height);
			//创建颜色笔
			context.strokeStyle="#FFBE04";
			for(var i = 0; i < turnplate.restaraunts.length; i++) {
				 var angle = turnplate.startAngle + i * arc;
				 context.fillStyle = turnplate.colors[i];
				 context.beginPath();
				 //arc(x,y,r,起始角,结束角,绘制方向) 方法创建弧/曲线（用于创建圆或部分圆）
				 context.arc(theCanvas.width/2, theCanvas.height/2,theCanvas.width/2-1, angle, angle + arc, false);
				 context.arc(theCanvas.width/2, theCanvas.height/2,theCanvas.width/10, angle + arc, angle, true);
				 context.stroke();
				 context.fill();
				 //保存
				 context.save();

				 //绘制奖项
				context.fillStyle = "#823B16";
				var text = turnplate.restaraunts[i];
				context.translate(theCanvas.width/2 + Math.cos(angle + arc / 2) * theCanvas.height/6, theCanvas.width/2 + Math.sin(angle + arc / 2) * theCanvas.height/6);
				context.rotate(angle + arc / 2 + Math.PI / 2);
				context.font ='16px Microsoft YaHei';
				context.fillText(text, -context.measureText(text).width/2,-theCanvas.height/6);
				
				//把当前画布返回（调整）到上一个save()状态之前
		  		context.restore();
			}
		}

		function prompt(num) {
			var msg =[
				'大奖君正在</br>翻山越岭......',
				'哎呀，</br>人品还没爆发</br>没事就天天来抽呗~',
				'大奖马上来，</br>擦擦手再接再厉!',
				'朝南拜一拜，</br>好运自然来！'
			];

			var random = msg[Math.round(Math.random()*(msg.length-1))];
			var text = '<div class="botrue-text"><h4><span>'+random+'</span></h4>';
            $('.pz-chance').text('你今天还有'+ num +'次抽奖机会');
	        if(parseInt(num)<=0){
	        	// text+='<p>今天的运气已经用完了</br>明天再来吧！</p><div class="draw-details"><a href="http://m.bzezt.com">去贝竹首页</a></div></div>'
	            text+='<p>今天的运气已经用完了</br>明天再来吧！</p>';
                $('#my-last .draw-false').html(text);
                $('#my-last').modal();
            }else{
	        	text+='<p>期待让人更努力</br>您还有'+num+'次机会</p></div>';
                $('#my-false .draw-false').html(text);
                $('#my-false').modal();
	        }

            turnplate.rotateSum = parseInt(num);
            if (turnplate.rotateSum <= 0) {
                if ($('.pz-draw-71').size() > 0) {
                    $('.pzclick').attr('src', 'images/grayArrow-1.png');
                } else {
                    $('.pzclick').attr('src', 'images/grayArrow.png');
                }
            } else {
                turnplate.bRotate = !turnplate.bRotate;
            }
	    }

		//点击抽奖
		$('.pzCanvas').on('click','.pzclick',function(){
			if(turnplate.bRotate)return;
			if ( turnplate.rotateSum <= 0 ) {
                $('.pzclick').attr('src', 'images/grayArrow.png');
                return ;
            }
			turnplate.bRotate = !turnplate.bRotate;
			$.getJSON(hostUrl() + 'lottery/ajaxGetDraw',
            function(json) {
                if (json.status) {
                    $index = code.indexOf(parseInt(json.prize));
                    rotateFn(parseInt($index)+1, json);
                } else {
                    alert(json.messages);
                    // $('.pzclick').attr('src', 'images/grayArrow.png');
                }
            });
		});

		//旋转转盘 item:奖品位置; tor：是否中奖;
		var rotateFn = function (item, json) {
			var angles = item * (360 / turnplate.restaraunts.length) - (360 / (turnplate.restaraunts.length*2));
			if(angles<270){
				angles = 270 - angles; 
			}else{
				angles = 360 - angles + 270;
			}
			$('#pzCanvas').stopRotate();
			$('#pzCanvas').rotate({
				angle:0,
				animateTo:angles+1800,
				duration:8000,
				callback:function (){
					if(json.prize > 0){
                        $('.pz-chance').text('你今天还有'+ json.drawNum +'次抽奖机会');
						$('.botrue-img img').attr('src', json.img);
						$('.botrue-text h5').text(json.text);
                        $('.botrue-text p').html('期待让人更努力</br>您还有'+json.drawNum+'次机会');
                        if (parseInt(json.drawNum) > 0) {
                            $('#my-true').modal();
                        } else {
                            $('#my-true-end').modal();
                            if ($('.pz-draw-71').size() > 0) {
                                $('.pzclick').attr('src', 'images/grayArrow-1.png');
                            } else {
                                $('.pzclick').attr('src', 'images/grayArrow.png');
                            }
                        }
                        turnplate.bRotate = !turnplate.bRotate;
					} else {
                        prompt(json.drawNum);
					}
				}
			});
		};

		drawScreen();
	};

	function cavasSupport(){
		return Modernizr.canvas;
	}
});