//2015.8.24
var loop = new Loop({ keyname: 'loop_test', appkey: '', link: '' });
var iuser=importUser();

function importUser(){
	
	var user={};
	user.info={};
	
	user.init=function(callback) {
	    loop.login(function () {
		    loop.getuser(function (data) {
		    	initCallback(data,callback);
		    });
		});
	}//end func	
	
	function initCallback(data,callback){
		console.log('获得微信用户数据');
		icom.objectPrint(data);
		user.info=data;
		if(callback) callback(data);
	}//end func
	
	return user;
	
}//end func


