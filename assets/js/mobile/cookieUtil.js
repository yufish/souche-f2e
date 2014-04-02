var CookieUtil = function(){
	function initCookie(){
		var cookie = document.cookie;
		cookie.split(';').forEach(function(item){
			var kvPair = item.split('=');
			var key = kvPair[0];
			var value = kvPair[1];
			cookieMap[key.trim()] = value.trim();
		})
	}
	var cookieMap = {};
	return {
		init:function(){
			initCookie();
		},
		getCookie:function(cName){
			return cookieMap[cName];
		}
	}
}()

var CompletePhone =function($input){
	var phoneReg = /^1[3458][0-9]{9}$/;
	var username = CookieUtil.getCookie('username')
	if(phoneReg.test(username)){
		$input.val(username);
		return;
	}
	var noregisteruser = CookieUtil.getCookie('noregisteruser');
	if(phoneReg.test(noregisteruser)){
		$input.val(username);
		return;
	}
}