
Souche.Index = (function(){
	var config = {
		
	};
	return {
		init:function(_config){
			$.extend(config,_config);
		}
	};
	
})();

define(['souche/custom-select'], function (CustomSelect){
	var brandSelect = new CustomSelect("brand_select");
	return Souche.Index;
});

