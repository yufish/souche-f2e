
Souche.Index = (function(){
	var config = {
		
	};
	return {
		init:function(_config){
			$.extend(config,_config);
			//sidebar自动顶住
			var contentTop = $("#content").offset().top;
			var contentHeight = $("#content").height();
			var sidebarHeight = $("#side_bar").height();
			$(window).on("scroll",function(e){
				var windowTop = $(window).scrollTop();
				//顶部对齐
				if(windowTop>(contentTop-10)){
					$("#side_bar").css({
						top:windowTop-contentTop+10
					})
				}else{
					$("#side_bar").css({
						top:0
					})
				}
				//底部对其
				if(sidebarHeight+windowTop>contentTop+contentHeight){
					$("#side_bar").css({
						top:contentHeight-sidebarHeight
					})
				}
			})
		}
	};
	
})();

define(['index/qiugou','souche/down-counter'], function (QiuGou,downCounter){
	QiuGou.init();
	$('.down-counter').each(function(){
	      var $this = $(this);
	      downCounter($this);
	});
	return Souche.Index;
});


