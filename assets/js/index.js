
Souche.Index = (function(){
	var config = {
		
	};
	return {
		init:function(_config){
			$.extend(config,_config);
		}
	};
	
})();

define(['index/qiugou'], function (QiuGou){
	QiuGou.init();
	return Souche.Index;
});