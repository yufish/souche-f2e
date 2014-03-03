require.config({
	baseUrl: "/assets/js"
});
require(['souche/select'], function (Select){
　　　　
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

define(function (){
　　　　return Souche.Index;
　　});