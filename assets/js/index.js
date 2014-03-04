
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

define(['souche/custom-select','souche/down-counter'], function (CustomSelect){
	var brandSelect = new CustomSelect("brand_select");



	return Souche.Index;
});

