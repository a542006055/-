$(document).ready(function () {

	//-----------------------------------------定义和初始化变量----------------------------------------
	var loadBox = $('aside.loadBox');
	var articleBox = $('article');
	var soundList;

	//compass
	var compassPanel = $('<div id="compassPanel"><h3>电子罗盘</h3><p>alpha：<span class="alpha"></span></p><p>beta：<span class="beta"></span></p><p>gamma：<span class="gamma"></span></p><p>指北针：<span class="heading"></span></p>').appendTo($('body'));
	var compassAlpha = compassPanel.find('.alpha');
	var compassBeta = compassPanel.find('.beta');
	var compassGamma = compassPanel.find('.gamma');
	var compassHeading = compassPanel.find('.heading');

	var angXMax = 20, angXOrg, angXLast, angYMax = 10, angYOrg, angYLast;

	var stage = $(".stage");


	//----------------------------------------页面初始化----------------------------------------
	icom.orient(init);//屏幕翻转初始化
	icom.screenTo169(true, false);//把非16:9屏幕的article标签拉伸至16:9,第一个参数是iphone4，第二个参数是非物理系统按键的安卓

	function init() {
		loadBox.show();
		load_handler();
	}//edn func



	sound_handler();

	//----------------------------------------加载声音及处理----------------------------------------
	function sound_handler() {
		soundList = iaudio.on([{ src: 'sound/sound1.mp3' }]);
	}//end func



	//----------------------------------------加载页面图片----------------------------------------
	function load_handler() {
		var loader = new PxLoader();
		loader.addImage('images/common/turn.png');
		loader.addImage('images/i_avtar.png');
		loader.addImage('images/txtimg.png');
		loader.addImage('images/i_play.png');
		loader.addImage('images/btn_bg1.png');
		loader.addImage('images/btn_bg2.png');
		loader.addImage('images/b1.png');
		loader.addImage('images/b2.png');
		loader.addImage('images/shadow.png');
		for (var i = 1; i <= 13; i++) loader.addImage('images/piece' + i + '.png');



		loader.addCompletionListener(function () {
			init_handler();
			loader = null;
		});
		loader.start();
	}//end func


	//----------------------------------------页面逻辑代码----------------------------------------
	function init_handler() {
		console.log('init handler');
		icom.fadeOut(loadBox, 500);

		$('.btn').one("click", btn_click);
		var bubbleBox = $('.bubble');

		$('.txt1').css({ y: -50, opacity: 0, transform: 'translate3d(0,0,0.5rem)' }).show().transition({ y: 0, opacity: 1, transform: 'translate3d(0,0,0.5rem)', delay: 0 }, 750);
		$('.txt2').css({ y: -50, opacity: 0, transform: 'translate3d(0,0,0.5rem)' }).show().transition({ y: 0, opacity: 1, transform: 'translate3d(0,0,0.5rem)', delay: 200 }, 750);
		$('.txt3').css({ y: -50, opacity: 0, transform: 'translate3d(0,0,0.5rem)' }).show().transition({ y: 0, opacity: 1, transform: 'translate3d(0,0,0.5rem)', delay: 400 }, 750);

		$('.ani_txtimg').css({ scale: 0 }).transition({ scale: 1, delay: 600 }, 750).transition({ scale: 0.7 }, 100).transition({ scale: 0.9 }, 100).transition({ scale: 0.8 }, 100);

		$('.txt4').css({ y: -50, opacity: 0, transform: 'translate3d(0,0,0.5rem)' }).show().transition({ y: 0, opacity: 1, transform: 'translate3d(0,0,0.5rem)', delay: 1000 }, 750);
		$('.btn').css({ y: 300 }).show().transition({ y: 0, transform: 'translate3d(0,0,1rem)', delay: 1000 }, 1000);

		var bubble = $('span.bubble').css({ left: "45%", top: "12rem" }).show();
		bubble.eq(0).transition({ left: '1rem', top: '2rem', delay: 200 }, 800, 'out');
		bubble.eq(1).transition({ left: "5.5rem", top: "1rem", delay: 300 }, 800, 'out');
		bubble.eq(2).transition({ left: "4.28rem", top: "1.02rem", delay: 400 }, 800, 'out');
		bubble.eq(3).transition({ left: "4.14rem", top: "2.64rem", delay: 500 }, 800, 'out');
		bubble.eq(4).transition({ left: "1.04rem", top: "3.26rem", delay: 600 }, 800, 'out');
		bubble.eq(5).transition({ left: "4rem", top: "3.72rem", delay: 700 }, 800), 'out';
		bubble.eq(6).transition({ left: "4.5rem", top: "4rem", delay: 800 }, 800, 'out');
		bubble.eq(7).transition({ left: "1.86rem", top: "5.13rem", delay: 900 }, 800, 'out');
		bubble.eq(8).transition({ left: "5.06rem", top: "5.23rem", delay: 1000 }, 800, 'out');
		bubble.eq(9).transition({ left: "1.3rem", top: "5.92rem", delay: 1100 }, 800, 'out');
		bubble.eq(10).transition({ left: "4.87rem", top: "6.5rem", delay: 1200 }, 800, 'out');
		bubble.eq(11).transition({ left: "1.59rem", top: "8.25rem", delay: 1300 }, 800, 'out');
		bubble.eq(12).transition({ left: "4.06rem", top: "8.5rem", delay: 1400 }, 800, 'out');


		// 开启冒泡
		// bubbleBox.each(function(i,n){
		// 	$(n).bubbleOn({num:10,x:$(window).width()*0.5,y:$(window).height()});
		// });
		// compassPanel.show();

		setTimeout(function () {
			$(window).on('deviceorientation', deviceorientationHandler);
		}, 1000)

	}//end func

	function deviceorientationHandler(e) {
		compassAlpha.html(Number(e.originalEvent.alpha).toFixed(2));//屏幕面对你竖直向上拿手机,绕y轴360度自旋，范围0-360
		compassBeta.html(Number(e.originalEvent.beta).toFixed(2));//屏幕面对你竖直向上拿手机,绕x轴自旋，范围-90-90,竖直向上为90度，水平为0度，竖直向下为-90度
		compassGamma.html(Number(e.originalEvent.gamma).toFixed(2));//屏幕朝上水平向前拿手机,绕水平轴自旋，范围-90-90,自旋到屏幕朝下后数值会扩展到90至180或-90至-180
		compassHeading.html(Number(e.originalEvent.webkitCompassHeading).toFixed(2));//指南针

		//横向移动
		if (!angXOrg) {
			angXOrg = angXLast = e.originalEvent.gamma;
			angYOrg = angYLast = e.originalEvent.beta;
		}//end if
		else {
			var angX = e.originalEvent.gamma;
			var angY = e.originalEvent.beta;
			if (angY > 90) angX = -angX;
			if (angX != angXLast || angY != angYLast) {

				angXLast = angX;
				var x = (angX - angXOrg) * 0.5;
				x = Math.max(-angXMax, Math.min(x, angXMax));

				angYLast = angY;
				var y = -(angY - angYOrg) * 0.5;
				y = Math.max(-angYMax, Math.min(y, angYMax));

				stage.css({ rotateY: x, rotateX: y });
			}//end if
		}//end else


	}//end func

	function btn_click() {
		icom.fadeOut($('.i_play'), 1000);
		icom.fadeIn($('.i_avtar'), 1000);
		soundList.sound1.play();
		soundList.sound1.onEnded = function () {
			icom.fadeOut($('.i_avtar'), 1000);
			icom.fadeIn($('.i_play'), 1000);
			$('.btn').one("click", btn_click);
		}
	}


});//end ready
