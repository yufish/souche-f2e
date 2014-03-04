
Souche.Index = (function(){
	var config = {
		
	};
	return {
		init:function(_config){
			$.extend(config,_config);

			$('.down-counter').each(function(){
		      var $this = $(this);
		      downCounter($this);
		    });
		}
	};
	
})();

define(['index/qiugou','souche/down-counter'], function (QiuGou){
	QiuGou.init();

	return Souche.Index;
});

