require.config({
	baseUrl: "/assets/js"
});
require(['souche/select'], function (Select){
　　　　alert(math.add(1,1));
　　});
Souche.Index = (function(){
	var config = {
		api_isLogin:'',
		api_saveBuyInfo:'',
		api_detail:'',
		api_changeCars:''
	};
	return {
		init:function(_config){
			Souche.Util.mixin(config,_config);
			
		}

	};
	
})();

