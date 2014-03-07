
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
			var showDelayT = 300;
			var checkDisplayStatus = function(){
				var brandTimer = setTimeout(function(){
					var zIndex = (+$('#brand').css('z-index'))+1;
					clearTimeout(brandTimer);
					if(brandSelectActive == true){
						$('#nav-item-brand').css({border:'1px solid #fc7000',
																				'border-right':'1px solid #fff',
																				'z-index':zIndex});
						$('#brand').show().animate({width:'690px'},showDelayT);
					}else{
						$('#brand').animate({width:'0px'},showDelayT,function() {
							$('#brand').hide();
							$('#nav-item-brand').css({border:'1px solid #fff','z-index':0});
						});
					}
				},showDelayT);
			};

			var brandSelectActive = false;

			$('#nav-item-brand,#brand').on('mouseenter',function(){
				brandSelectActive=true;
				checkDisplayStatus();
				
			}).on('mouseleave',function(){
				brandSelectActive =false;
				checkDisplayStatus();
			});

			//carlife effect
			var $clItems = $('.carlife-item');
			var clIndex = 0
				,clLength = $clItems.size()
				,clAnimateStop =false;
			var height = $clItems.height();
			var clAnimation = function(){
					if(clAnimateStop) return;
					$clItems.each(function(index,ele){
						if(index===clIndex){	
							$('.front',ele).animate({'top':-height});
							$('.back',ele).animate({'top':-height});
							//$(this).animate({top:-height});
						}else{						
							$('.front',ele).animate({'top':0});
							$('.back',ele).animate({'top':0});
							//$(this).animate({top:0});
						}
					});
					if(clIndex==clLength-1){clIndex=0;}
					else{clIndex++;}
			}
			setInterval(clAnimation,3000);
			


			$('.carlife .bd').on('mouseenter','.carlife-item',function(e){
				clAnimateStop=true;
				var target = e.currentTarget;
				$clItems.each(function(index,ele){
					if(ele !=target ){
						$('.front',ele).stop(true,true).animate({'top':0});
						$('.back',ele).stop(true,true).animate({'top':0});
					}else{
						$('.front',ele).css({'top':-height});
						$('.back',ele).css({'top':-height});
					}
				})
			}).on('mouseleave','.carlife-item',function(e){
				//$clItems.css({top:0});
				clAnimateStop = false;
			});
			
			/*$clItems.on('mouseenter',function(e){
				//clAnimateStop = true;
				var self =this;
				$clItems.each(function(index,ele){
					if(ele !=self ){
						$('.front',ele).stop(true,true).animate({'top':0});
						$('.back',ele).stop(true,true).animate({'top':0});
					}else{
						$('.front',ele).css({'top':-height});
						$('.back',ele).css({'top':-height});
					}
				})
				e.stopPropagation();
			}).on('mouseleave',function(e){
				//$clItems.css({top:0});
				//clAnimateStop = false;
			});*/

		}
	}
})();

define(['index/qiugou','souche/down-counter'], function (QiuGou,downCounter){
	QiuGou.init();
	$('.down-counter').each(function(){
		var $this = $(this);
		downCounter($this);
	});
	return Souche.Index;
});


