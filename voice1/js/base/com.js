//2016.7.29
var icom=importCom();

function importCom(){
	var com={};
	
	/*
	 * screenTo169(iphone4,android)：把article作为页面的根容器，如果屏幕高宽比不是16：9，则拉伸到16:9
		 * iphone4：让iphone4下的article标签高度拉伸到与iphone5一致，默认值true
		 * android：把article作为页面的根容器，使用虚拟系统按键安卓机的拉升至16:9，默认值true
	 	 * 如果页面是长页面，则注释掉这个方法
	*/ 
	com.screenTo169=function(iphone4,android){
		iphone4=iphone4!=null?iphone4:true;
		android=android!=null?android:true;
		var article=$('article');
		if(article.length>0){
			if(os.iphone4){
				if(iphone4){
					if(os.weixin) article.css({height:'121.2%'});
					else article.css({height:'123.6%'});
				}//end if
				else com.screenScrollUnable();
			}//end if
			else{
				if(os.android && !os.screen169 && android) article.css({height:'109%'});
				else com.screenScrollUnable();
			}//end if
		}//end if
	}//end func
	
	com.screenToPx=function(wd,ht,iphone4){
		if(wd && wd>0){
			iphone4=iphone4!=null?iphone4:true;
			var article=$('article');
			if(article.length>0){
				article.css({'-webkit-transform-origin':'0 0 0'});
				if(ht && ht>0){
					com.screenScrollUnable();
					var zoomX=$(window).width()/wd;
					var zoomY=$(window).height()/ht;
					if(os.iphone4 && iphone4) article.css({scale:zoomY,x:($(window).width()-wd*zoomY)*0.5/zoomY});
					else article.css({scaleX:zoomX,scaleY:zoomY});
				}//end if
				else article.css({scale:$(window).width()/wd});
			}//end if
		}//end if
	}//end func
	
	com.screenScrollEnable=function(){
		$(document).off('touchmove',noScroll);
	}//end func
	
	com.screenScrollUnable=function(){
		$(document).on('touchmove',noScroll);
	}//end func
	
	function noScroll(e){
		e.preventDefault();
	}//end func
	
	//取代jquery的fadeIn
	com.fadeIn=function(obj,dur,callback){
		if(obj){
			dur=dur||500;
			obj.show().css({opacity:0}).transition({opacity:1},dur,function(){
				if(callback) callback($(this));
			});
		}//end if
	}//end func
	
	//取代jquery的fadeOut
	com.fadeOut=function(obj,dur,callback){
		if(obj){
			dur=dur||500;
			obj.transition({opacity:0},dur,function(){
				$(this).hide().css({opacity:1});
				if(callback) callback($(this));
			});
		}//end if
	}//end func
	
	com.popOn=function(obj,options){
		if(obj && obj.length>0){
			var defaults = {closeEvent:'touchend',closeType:'button',closeBtn:obj.find('a.close'),remove:false};
			var opts = $.extend(defaults,options);
			if(opts.text) obj.find('.text').html(opts.text);
			if(opts.fade) com.fadeIn(obj,opts.fade);
			else obj.show();
			if(opts.closeBtn.length>0 && opts.closeType=='button') opts.closeBtn.one(opts.closeEvent,obj_close);
			else obj.one(opts.closeEvent,obj_close);
			obj.on('close',obj_close);
		}//end if
		function obj_close(e){
			if(opts.closeBtn.length>0 && opts.closeType=='button') opts.closeBtn.off(opts.closeEvent,obj_close);
			else obj.off(opts.closeEvent,obj_close);
			if(opts.fade) com.fadeOut(obj,opts.fade,function(){
				if(opts.remove) obj.remove();
			});
			else if(opts.remove) obj.remove();
			else obj.hide();
			obj.off('close',obj_close);
			if(opts.onClose) opts.onClose(obj);
		}//end func
	}//end func
	
	com.popOff=function(obj){
		if(obj && obj.length>0) obj.trigger('close');
	}//end func
	
	//取代系统alert
	com.alert=function(text,callback){
		if(text && text!=''){
			var box=$('<aside class="alertBox"><div><p class="text"></p><p class="btn"><a href="javascript:;" class="close">确定</a></p></div></aside>').appendTo('body');
			com.popOn(box,{text:text,onClose:callback,remove:true,closeEvent:'click'});
		}//end if
	}//end func
	
	//获得http url参数
	com.getQueryString=function(name) {
		if(name && name!=''){
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
			var r = window.location.search.substr(1).match(reg);
			if (r != null) return decodeURIComponent(r[2]); return null;
		}//end if
		else return null;
	}//end func
	
	//获得http url文件名末尾的数字
	com.getQueryInt=function(len){
		len=len!=null?len:1;
		var path=window.location.pathname.split('/');
		var file=path[path.length-1];
		var str=file.split('.');
		return parseInt(str[0].substr(str[0].length-len));
	}//end func
	
	//载入图片函数
	com.imageLoad=function(src,callback){
		if(src && src!=''){
			var loader = new PxLoader();
			if($.type(src) === "string" && src!='') loader.addImage(src);
			else if($.type(src) === "array" && src.length>0){
				for(var i=0; i<src.length; i++){
					loader.addImage(src[i]);
				}//end for
			}//end else
			loader.addCompletionListener(function() {
				console.log('images load complete');
				loader=null;
				if(callback) callback(src);
			});			
			loader.start();	
		}//end if
	}//end func	
	
	//新增测试版提示信息
	com.addSignBar=function(text){
		if(text && text!=''){
			var sign=$('#signBar');
			if(sign.length>0) sign.find('.text').html(text);
			else{
				sign=$('<div id="signBar"></div>').appendTo('body');
				$('<span></span>').html(text).appendTo(sign);
			}//end if
		}//end if
	}//end func
	
	//打印object数据
	com.objectPrint=function(data){
		if(data){
			console.log("-----------------------------------------------------------------------------");
			var info="";
			for(var i in data) info+=i+":"+data[i]+"  "
			console.log(info);
			console.log("-----------------------------------------------------------------------------");
		}//end if
	}//end func
	
	//常用正则
	com.checkStr=function(str,type){
		if(str && str!=''){
			type=type||0;
			switch(type){
				case 0:
					var reg= new RegExp(/^1[3-9]\d{9}$/);//手机号码验证
					break;
				case 1:
					var reg= new RegExp(/^[1-9]\d{5}$/);//邮政编码验证
					break;
				case 2:
					var reg= new RegExp(/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/);//匹配EMAIL
					break;
				case 3:
					var reg= new RegExp(/^\d+$/);//是否为0-9的数字
					break;
				case 4:
					var reg= new RegExp(/^[a-zA-Z\u0391-\uFFE5]*[\w\u0391-\uFFE5]*$/);//不能以数字或符号开头
					break;
				case 5:
					var reg= new RegExp(/^\w+$/);//匹配由数字、26个英文字母或者下划线组成的字符串
					break;
				case 6:
					var reg= new RegExp(/^[\u0391-\uFFE5]+$/);//匹配中文
					break;
				case 7:
					var reg= new RegExp(/^[a-zA-Z\u0391-\uFFE5]+$/);//不能包含数字和符号
					break;
			}//end switch
			if(reg.exec($.trim(str))) return true;
			else return false;
		}//end if
		else return false;
	}//end func
	
	//使用post方法进行php中间件通讯
	com.post=function(url,data,callback){
		if(url && url!='') post_handler(url,data,callback,'post');
	}//end func
	
	//使用get方法进行php中间件通讯
	com.get=function(url,data,callback){
		if(url && url!='') post_handler(url,data,callback,'get');
	}//end func
	
	function post_handler(url,data,callback,action){
		if(data && $.isPlainObject(data)) data=JSON.stringify(data);
		$.post("./http/httpPost.php",{api_url:url,post_data:data,action:action},function(resp){
			if(callback) callback(resp);
		}, "json");
	}//edn func
	
	//修改微信浏览器的标题文字
	com.title=function(value){
		$('title').html(value);
		var iframe = $('<iframe src="images/share.jpg"></iframe>').appendTo($('body')).one('load', function() {
			setTimeout(function(){
				iframe.remove();
			},0);
		});
	}//end func
	
	//安卓键盘压缩页面高度处理
	com.keyboard=function(input,shell,callback){
		input=input||$('input,textarea,[contenteditable="true"]');
		shell=shell||input.parents('section');
		if(input.length>0 && shell.length>0){
			if(os.ios){
				input.on('focus',function(e){
					$(document).one('touchend',ios_keyboard);
				});
			}//end if
			else{
				var windowHt=$(window).height();
				var ht=shell.height();
				$(window).on('resize',android_keyboard);
			}//edn if
		}//end if
		
		function ios_keyboard(e){
			if(e.target!=input[0]) input.blur();
		}//edn func
		
		function android_keyboard(e){
			if(ibase.dir=='portrait' && (window.orientation == 0 || window.orientation == 180) ){
				if($(window).height()<windowHt) slide_in();
				else slide_out();
			}//end portrait
			else if( ibase.dir=='landscape' && (window.orientation == 90 || window.orientation == -90) ){
				if($(window).height()<windowHt) slide_in();
				else slide_out();
			}//edn landscape
		}//edn func
		
		function slide_in(){
			shell.css({height:ht});
			if(callback) callback(true);
		}//edn func
		
		function slide_out(){
			if(callback) callback(false);
		}//edn func
		
	}//end func
	
	//物体抖动
	com.shake=function(box,options){
		if(box && box.length>0){
			var defaults = {rx:5,ry:5,delay:33,now:0,max:5,restore:true};
			var opts = $.extend(defaults,options);
			var x=imath.randomRange(-opts.rx,opts.rx);
			var y=imath.randomRange(-opts.ry,opts.ry);
			box.css({x:x,y:y});
			opts.now++;
			if(opts.now>opts.max){
				if(opts.restore) box.css({x:0,y:0});
				if(opts.onComplete) opts.onComplete();
			}//end if
			else setTimeout(com.shake,opts.delay,box,opts);
		}//end if
	}//end func
	
	//获取textarea里的回车和空格
	com.textareaGet=function(textarea,row){
		row=row||0;
		var str1=textarea.val();
		if(str1=='') return '';
		else{
			var str2=str1.replaceAll("\n","<br/>");
			return row_cut(str2,row);
		}//end else
	}//edn func
	
	//输入textarea里的回车和空格
	com.textareaSet=function(textarea,str){
		if(str=='') textarea.val('');
		else textarea.val(str.replaceAll("<br/>","\n"));
	}//edn func
	
	//限制textarea输入文字的行数
	com.textareaLock=function(textarea){
		if(textarea && textarea.length>0){
			var timer;
			var row=parseInt(textarea.attr('rows'))||0;
			var col=parseInt(textarea.attr('cols'))||0;
			var max=parseInt(textarea.attr('maxlength'))||0;
			max=max==0?row*col:max;
			if(row>0 && col>0 && max>0) textarea.one('focus',textarea_focus);
		}//end if
		
		function textarea_focus(e){
			clearInterval(timer);
			timer=setInterval(textarea_lock,100);
			$(this).one('blur',textarea_blur);
		}//edn func
		
		function textarea_blur(e){
			clearInterval(timer);
			$(this).one('focus',textarea_focus);
			var first=com.textareaGet(textarea,row);
			if(first.indexOf('<br/>')!=-1){
				var str2=first.split('<br/>');
				var str3='';
				for(var i=0; i<str2.length; i++){
					str3+=col_break(str2[i],col);
					if(i<str2.length-1) str3+='<br/>';
				}//end for
				str3=row_cut(str3,row);
				var final=str3.replaceAll("<br/>","\n");
				textarea.val(final);
			}//end if
		}//edn func
		
		function textarea_lock(){
			var first=com.textareaGet(textarea,row);
			if(first.indexOf('<br/>')==-1) textarea.attr({maxlength:max});
			else textarea.attr({maxlength:max+(first.split('<br/>').length-1)*2});
		}//edn func
	}//edn func
	
	function row_cut(str,row){
		row=row||0;
		var str2=str.split('<br/>');
		if(row<=0 || str2.length<=row ) return str;
		else{
			var str3='';
			for(var i=0; i<row; i++){
				str3+=str2[i];
				if(i<row-1) str3+='<br/>';
			}//edn for
			return str3;
		}//end else
	}//end func
	
	function col_break(str,col){
		var line=Math.ceil(str.length/col);
		if(line==1) return str;
		else{
			var str1='';
			for(var i=0; i<line; i++){
				if(i==0) str1+=str.substr(0,col)+'<br/>';
				else if(i<line-1) str1+=str.substr(i*col,col)+'<br/>';
				else str1+=str.substr(i*col);
			}//edn for
			return str1;
		}//end else
	}//end func
	
	function col_cut(str,col){
		if(str.length>col) return str.substr(0,col);
		else return str;
	}//end func
	
	//限制textarea输入文字的行数
	com.textareaUnlock=function(textarea){
		textarea.off();	
	}//edn func
	
	com.orient=function(callback){
		lock_dected();
		if(os.android){
			var input=$('input,textarea,[contenteditable="true"]');
			if(input.length>0){
				var turnBox=$(ibase.turnBox);
				input.on('focus',input_focus).on('blur',input_blur);
			}//edn if
		}//edn if
		function input_focus(e){
			ibase.keyboard=true;
		}//edn if
		function input_blur(e){
			ibase.keyboard=false;
		}//edn if
		function lock_dected(){
			if(ibase.lock) requestAnimationFrame(lock_dected);
			else if(callback) callback();
		}//edn func
	}//edn fuc
	
	
	return com;
	
	String.prototype.replaceAll = function(s1,s2){
		return this.replace(new RegExp(s1,"gm"),s2);
	}
	
}//end import