

$(document).ready(function(){
	var is_shousuo = [];
	var shousuoStatus = 0;
	var shousuoCount = 0;
	var shousuoStatus = [0,0,0,0]
	var lastHeight = []
	$(".toggle-nav .nav-list").each(function(i,list){
		lastHeight[i]=$(list).height()
	})
	var shousuo = function(i){
		// var now = (new Date()).getTime()
		// console.log(now-lastTime)
		// 			if(now-lastTime<2){
		// 				//lastTime = now;
		// 				return;
		// 			}
		// 			lastTime = now;
		if(shousuoStatus[i]){
			return ;
		}else{
			shousuoStatus[i] =1;
		}
		if(is_shousuo[i]){
			return;
		}else{
			is_shousuo[i]=1;
		}
	// $(".toggle-nav .nav-list").each(function(i,list){
	// 	if(i<)
	// 	var x= $(list).offset().left;
	// 	var y = $(list).offset().top;
	// 	$(list).css({"position":"relative"})
	// 	list.last_h = $(list).height()
	// 	// $(".nav-list li",list).each(function(i,l){
	// 	// 	l.last_x = $(l).offset().left-x;
	// 	// 	l.last_y = $(l).offset().top-y;
	// 	// })
	// 	// $(".nav-list li",list).each(function(i,l){
	// 	// 	$(l).css({
	// 	// 		position:"absolute",
	// 	// 		left:l.last_x ,
	// 	// 		top:l.last_y
	// 	// 	}).stop().animate({
	// 	// 		left:150,
	// 	// 		top:30,
	// 	// 		opacity:0
	// 	// 	},500)
	// 	// })

	// 		$(list).stop().animate({height:0},400);
	// })

$(".toggle-nav:eq("+i+")  .nav-list").stop().animate({height:0},500);
$(".toggle-nav:eq("+i+") .sc-option").removeClass("hidden");
setTimeout(function(){is_shousuo[i]=0;},400)
}
var is_zhankai = [];
var zhankaiCount = 0;
var zhankaiStatus = []
var zhankai = function(i){
	// var now = (new Date()).getTime()
	// 				if(now-lastTime<200){
	// 					//lastTime = now;
	// 					return;
	// 				}
	// 				lastTime = now;
	if(shousuoStatus[i]==0){
		return ;
	}else{
		shousuoStatus[i] =0;
	}
	if(is_zhankai[i]){
		return;
	}else{
		is_zhankai[i]=1;
	}
	$(".toggle-nav:eq("+i+")  .nav-list").stop().animate({height:lastHeight[i]},400);
	$(".toggle-nav:eq("+i+") .sc-option").addClass("hidden");
	setTimeout(function(){is_zhankai[i]=0;},400)
}
var checkShousuo=function(){
	var scrollTop = $(window).scrollTop();
	if(scrollTop<=nav_top+100){
		shousuoCount = 0;
	}
	if(scrollTop>nav_top+100&&scrollTop<nav_top+350){
		shousuoCount = 1;
	}
	if(scrollTop>nav_top+350&&scrollTop<nav_top+600){
		shousuoCount = 2;
	}
	if(scrollTop>nav_top+600&&scrollTop<nav_top+850){
		shousuoCount = 3;
	}
	if(scrollTop>nav_top+850&&scrollTop<nav_top+1100){
		shousuoCount = 4;
	}
	if(scrollTop>nav_top+1100){
		shousuoCount = 5;
	}
	for(var i=0;i<=shousuoCount-1;i++){
		
		shousuo(i)

		
	}
	for(var i=shousuoCount;i<=5;i++){
		zhankai(i)
	}


}
var checkZhankai=function(){
				// var scrollTop = $(window).scrollTop();
				// if(scrollTop<nav_top+100){
				// 	zhankaiCount = 0;
				// }
				// if(scrollTop<nav_top+300){
				// 	zhankaiCount = 1;
				// }
				// if(scrollTop<nav_top+500){
				// 	zhankaiCount = 2;
				// }
				// if(scrollTop<nav_top+700){
				// 	zhankaiCount = 3;
				// }
				// if(scrollTop<nav_top){
				// 	for(var i=0;i<=zhankaiCount;i++){
				// 		zhankai(i)
				// 	}

				// }
			}
			var timer1 = null
			var nav_top = $(".list_nav_contain").offset().top;
			var nav_height = $(".list_nav_contain").height();
			var yushouTitle = $(".yushou_title").height()?50:-10;
			var isIE6 = 0;
			if ($.browser.msie && ($.browser.version == "6.0")) {
				isIE6 = 1;
			}
			var footerTop = $("#footer").offset().top
			var lastP = null;
			var lastTime = null;
			var stopSign = 1 ;
			var stopEvent = function(){
				setTimeout(function(){
					if(speed<0.5){
						stopSign = 0;
					//	checkShousuo()
					}
				},200)
			}
			var speed = 0;
			var lastP = null;
			var lastTime = null;
			setInterval(function(){
				var scrollTop = $(window).scrollTop()
				var nowTime = new Date().getTime()
				if(lastP===null){
					lastP = scrollTop
					lastTime = nowTime
				}
				speed = Math.abs((scrollTop - lastP)/(nowTime-lastTime))*100
				if(speed>15){
					stopSign = 1;
				}
				if (speed<0.5&&stopSign ==1){
					stopEvent()
					
				}
				lastTime = nowTime;
				lastP = scrollTop;
			},50)

			if($(".list_nav_contain").height()<$(".list_main").height()){
						
					
			$(window).scroll(function(){
				
				if(!isIE6){
					
					
					
					if($(window).scrollTop()>=nav_top-55){
						$(".list_nav_contain").css({
							position:"fixed",
							top:50
						})
					}else{
						$(".list_nav_contain").css({
							position:"relative",
							top:0
						})
					}
					// 	checkShousuo()

						if($(".list_nav_contain").height()+$(".list_nav_contain").offset().top+52>footerTop){
					$(".list_nav_contain").css({position:"absolute",top:$("#list_wrap").height()-$(".list_nav_contain").height()-52})
				}
				}
				
				
				
			})
		}
		})