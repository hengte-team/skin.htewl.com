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
    canvasApp();
	function canvasApp(){
		//获取画布信息
		var theCanvas = document.getElementById('pzCanvas');
		theCanvas.height = theCanvas.width;
		var context = theCanvas.getContext("2d");
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
		//点击抽奖
		$('.pzCanvas').on('click','.pzclick',function(){
            if ( turnplate.rotateSum <= 0 ) {
                $('.pzclick').attr('src', 'images/grayArrow.png');
                return ;
            }
			if(turnplate.bRotate)return;
                turnplate.bRotate = !turnplate.bRotate;
            $.getJSON(hostUrl() + 'lottery/ajaxGetDraw',
            function(json) {
                if ( json.status ) {
                    $index = code.indexOf(parseInt(json.prize));
                    rotateFn(parseInt($index)+1, json.prize, json.text, json.drawNum);
                } else {
                    if (json.prize == -1) {
                        alert(json.text);
                    } else {
                        prompt(num);
                    }
                }
            });
		});


        function prompt(num) {
            if ( parseInt(num) <= 0 ) {
                var msg = [
                    '人生最重要的两个字是<br><b>坚持</b>，明天继续！',
                    '攒攒人品，<br>明天再来。',
                    '你来或不来，奖品都在<br>那里，等你…明天继续！',
                    '不要灰心，<br>明天继续！',
                    '太可惜了，你没中奖！<br>明天再来。',
                    '好可惜，竟然与奖品<br>擦肩而过，明天继续。',
                    '手滑了，奖品<br>溜走了，明天再来！',
                    '哎呀！今天手气<br>不佳，明天继续。',
                    '今天抽奖次数已用完，<br>明天再来！'
                ];
                $('#my-false .tip-head').html(msg[Math.round(Math.random()*msg.length)]);
                $('#my-false .draw-details').html('<a href="http://m.bzezt.com" >去贝竹首页</a>');
            } else {
                var msg = [
                    '很遗憾！<br>空手而归。',
                    '哎呀，<br>差一点点就中了。',
                    '太可惜了！你<i>颜值</i>太高，<br>奖品被你亮瞎眼了。',
                    '抽不中啊，<br>洗个手再来！',
                    '好可惜，竟然与奖品<br>擦肩而过。',
                    '人少奖品多为什么还没<br>中？？？？？',
                    '手一抖，<br>错过了大奖。',
                    '太可惜了，<br>你没中奖！',
                    '哎呀！<br>运气太差了。'
                ];
                $('#my-false .tip-head').html(msg[Math.round(Math.random()*msg.length)]);
            }
            $('#my-false').modal();
        }

		//旋转转盘 item:奖品位置; txt：提示语;
		var rotateFn = function (item, prize, txt, num){
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
				callback:function () {
					if (prize > 0 && item >= 0) {
						$('.draw-botrue').html(txt);
						$('#my-true').modal();
					} else {
                        prompt(num);
					}
                    turnplate.rotateSum = parseInt(num);
                    if (turnplate.rotateSum <= 0) {
                        $('.pzclick').attr('src', 'images/grayArrow.png');
                    } else {
                        turnplate.bRotate = !turnplate.bRotate;
                    }
                }
			});
		};
		drawScreen();
	};

});