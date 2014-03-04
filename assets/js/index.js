
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
			$('.down-counter').each(function(){
<<<<<<< HEAD
		      var $this = $(this);
		      downCounter($this);
		    });
=======
	      var $this = $(this);
	      downCounter($this);
	    });

>>>>>>> e48b5f3a9531fe29364fb7dfe9381a54e9ba5728
		}
	};
	
})();

define(['index/qiugou','souche/down-counter'], function (QiuGou){
	QiuGou.init();

	return Souche.Index;
});

