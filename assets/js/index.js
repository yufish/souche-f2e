
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
			var checkSidebar = function(){
				var windowTop = $(window).scrollTop();
				//顶部对齐
				if(windowTop>(contentTop-20)){
					$("#side_bar").css({
						top:10
					})
				}else{
					$("#side_bar").css({
						top:contentTop-windowTop
					})
				}
			}
			checkSidebar()
			$(window).on("scroll",function(e){
				checkSidebar();
				//底部对其
				// if(sidebarHeight+windowTop>contentTop+contentHeight){
				// 	$("#side_bar").css({
				// 		top:contentHeight-sidebarHeight
				// 	})
				// }
			})

			//brand 出来，隐藏效果
			$('#nav-item-brand').on('mouseover',function(){

			}).on('mouseout',function(){
				
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


