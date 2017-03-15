$(document).ready(function () {

	//-----------------------------------------定义和初始化变量----------------------------------------
	var loadBox = $('aside.loadBox');
	var articleBox = $('article');
	var gameTime = 60;
	var _gameTimeCount = gameTime;

	var windowWd = $(window).width(), windowHt = $(window).height();


	//----------------------------------------页面初始化----------------------------------------
	icom.orient(init); //屏幕翻转初始化
	icom.screenTo169(true, false); //把非16:9屏幕的article标签拉伸至16:9,第一个参数是iphone4，第二个参数是非物理系统按键的安卓

	var soundList;
	sound_handler();
	//----------------------------------------加载声音及处理----------------------------------------
	function sound_handler() {
		// ibgm.init({src:'sound/bgm.mp3',webAudio:0});
		soundList = iaudio.on([{ src: 'sound/sound1.mp3' }, { src: 'sound/sound2.mp3' }, { src: 'sound/sound3.mp3' }, { src: 'sound/sound4.mp3' }]);
	}//end func

	function init() {
		loadBox.show();
		load_handler();
	} //edn func
	//----------------------------------------加载页面图片----------------------------------------
	function load_handler() {
		var loader = new PxLoader();
		loader.addImage('images/common/turn.png');
		loader.addCompletionListener(function () {
			init_handler();
			loader = null;
		});
		loader.start();
	} //end func


	//----------------------------------------页面逻辑代码----------------------------------------
	function init_handler() {
		icom.fadeOut(loadBox, 500);

		bginit();
		$('.timeUI').html(gameTime)

		$('.get').on("click",restart_handler);

		monitor_handler();
	} //end func

	function restart_handler() {
		location.reload()
	}

	function bginit() {
		var Sprite = Laya.Sprite;
		var Stage = Laya.Stage;
		var Texture = Laya.Texture;
		var Text = Laya.Text;
		var Browser = Laya.Browser;
		var Handler = Laya.Handler;
		var Event = laya.events.Event;
		var Tween = Laya.Tween;
		var playernPosition, beginPosition;
		var palyerWidth = 100;
		var palyerHeight = 10;
		var stageWidth = 640;
		var stageHeight = 1030;
		var speed = 5000;
		var bonecont = 20;
		var scores = 0;

		var move_timer = null;
		var hit_timer = null;
		var game_timer = null;

		var dot = [];
		var dotwh = [{ x: 141, y: 141, score: 5, sound: "sound2" }, { x: 141, y: 140, score: 5, sound: "sound2" }, { x: 141, y: 141, score: 5, sound: "sound2" }, { x: 141, y: 141, score: 5, sound: "sound2" },
			{ x: 141, y: 141, score: 3, sound: "sound3" }, { x: 122, y: 120, score: 3, sound: "sound3" }, { x: 100, y: 99, score: 1, sound: "sound4" }, { x: 99, y: 107, score: 0 }];
		for (i = 0; i < 8; i++) {
			dot.push("images/game/dot" + (i + 1) + ".png");
		}

		//所有适配模式
		var modes = ["noscale", "exactfit", "showall", "noborder", "full", "fixedwidth", "fixedheight"];
		//全局文本信息
		var txt;

		(function () {
			Laya.init(stageWidth, stageHeight);

			Laya.stage.alignV = "center";
			Laya.stage.alignH = "middle";
			Laya.stage.scaleMode = "exactfit";
			Laya.stage.bgColor = null;

			// laya.utils.Stat.show();
			//实例一个背景
			var bg = new Sprite();
			Laya.stage.addChild(bg);
			bg.loadImage("images/game/bg.jpg", 0, 0, stageWidth, stageHeight);
			var player = new Sprite();
			Laya.stage.addChild(player);
			player.loadImage("images/game/pen.png", 0, 0, 183, 251);
			player.x = 232
			player.y = 734
			var width;

			player.on(Event.MOUSE_DOWN, this, onMouseDown);
			function onMouseDown(e) {
				width = parseInt(player.width) / 2
				//添加鼠标移到侦听
				Laya.stage.on(Event.MOUSE_MOVE, this, onMouseMove);
				playernPosition = Laya.stage.mouseX;
				beginPosition = player.x;
				Laya.stage.on(Event.MOUSE_UP, this, onMouseUp);
				Laya.stage.on(Event.MOUSE_OUT, this, onMouseUp);
			}
			/**移到事件处理*/
			function onMouseMove(e) {
				var left = Laya.stage.mouseX - playernPosition + beginPosition
				if (left < -width) {
					left = -width;
				} else if (left > stageWidth - width) {
					left = stageWidth - width
				}
				player.x = left
			}
			/**抬起事件处理*/
			function onMouseUp(e) {
				Laya.stage.off(Event.MOUSE_MOVE, this, onMouseMove);
				Laya.stage.off(Event.MOUSE_UP, this, onMouseUp);
				Laya.stage.off(Event.MOUSE_OUT, this, onMouseUp);
			}

			Laya.loader.load(dot, Handler.create(this, function () {
				item_move();
			}));

			move_timer = Laya.timer.loop(speed / 5, this, item_move)
			Laya.timer.loop(66, this, hittestFn)
			Laya.timer.loop(1000, this, _gameTimerFunc)



			var itemBox = new Sprite();
			var l = 0;
			itemBox.cacheAsBitmap = true;
			Laya.stage.addChild(itemBox);


			function item_move() {
				Laya.timer.clear(this, item_move);
				Laya.timer.loop(speed / 5, this, item_move)
				var ape = new Sprite();
				var num = 0;
				var n = parseInt(Math.random() * 100);
				if (n < bonecont) {
					num = 7
				} else {
					num = imath.randomRange(0, 6);
				}
				var t = Laya.loader.getRes(dot[num]);

				ape.graphics.drawTexture(t, 0, 0);
				itemBox.addChild(ape);

				ape.width = dotwh[num].x;
				ape.height = dotwh[num].y;
				ape.score = dotwh[num].score;
				ape.sound = dotwh[num].sound;
				player.w = palyerWidth;
				player.h = palyerHeight;

				l = imath.randomRange(0, stageWidth - ape.width);
				ape.pos(l, -ape.height);
				var tween = Tween.to(ape,
					{
						y: stageHeight
					}, speed, null, Handler.create(this, function () {
						ape.destroy();
					}));

			}

			function _gameTimerFunc() {
				_gameTimeCount--;
				var left = _gameTimeCount / gameTime;
				$(".line span").css({ width: $(".line").width() * left })
				$('.timeUI').html(_gameTimeCount);
				if (_gameTimeCount <= 0) {
					timerover();
				}
			}

			function timerover() {
				Laya.timer.clear(this, item_move);
				Laya.timer.clear(this, hittestFn);
				Laya.timer.clear(this, _gameTimerFunc);

				soundList.sound1.play();
				$(".index").hide();
				$('.results .score span').html(scores)
				icom.fadeIn($('.results '), 500);
				$('#layaContainer').remove();
			}

			function hittestFn() {

				for (var i = 0; i < itemBox.numChildren; i++) {
					// debugger;
					var char = itemBox.getChildAt(i)
					if (hitTestObj(char, player)) {
						scores += char.score;

						if (char.score != 0) {
							var soundname = char.sound
							if (soundname == "sound2") {
								soundList.sound2.play();
							} else if (soundname == "sound3") {
								soundList.sound3.play();
							} else if (soundname == "sound4") {
								soundList.sound4.play();
							}

							var text = new Text();
							text.color = "#FFFFFF";
							text.fontSize = 70;
							Laya.stage.addChild(text);
							text.text = "+" + char.score;
							console.log(text)
							text.align="center";
							text.x = player.x + (player.width - text.width) / 2
							text.y = 650;

							var tween = Tween.to(text,
								{
									alpha: 0,
									scaleY: 0,
									scaleX: 0,
								}, 500, Laya.Ease.linearNone, Handler.create(this, function () {
									text.destroy();
									tween.clear();

								}));

							if (speed > 1500) {
								speed -= 300;
							}

						} else {
							timerover();
						}

						$('.scoreUI span').html(scores);
						char.destroy()
					}
				}

			}


		})();

	};


	function hitTestObj(obj1, obj2) {

		if (obj1 && obj2) {
			var pos1 = [obj1.x + obj1.width / 2, obj1.y + obj1.height / 2];
			var pos2 = [obj2.x + obj2.w / 2 + 70, obj2.y + obj2.h / 2 + 130];
			var disX = Math.abs(pos2[0] - pos1[0]);
			var disY = Math.abs(pos2[1] - pos1[1]);
			var disXMin = (obj1.width + obj2.w) / 2;
			var disYMin = (obj1.height + obj2.h) / 2;
			if (disX <= disXMin && disY <= disYMin) {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	}

	//----------------------------------------页面监测代码----------------------------------------
	function monitor_handler() {
		//		imonitor.add({obj:$('a.btnTest'),action:'touchend',category:'首页',label:'测试按钮'});
	} //end func

}); //end ready