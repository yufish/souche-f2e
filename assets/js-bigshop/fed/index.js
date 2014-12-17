Souche.Index = (function(){

	$('.banner').flexslider({
	    animation: "slide",
	    animationSpeed: 300,
	    initDelay: 0,
	    slideshow: true,
	    slideshowSpeed: 5000
	 });
	//鼠标放到banner上停止自动切换
	$(".banner").mouseenter(function(){
		$(this).flexslider("stop");
	}).mouseleave(function(){
		$(this).flexslider("play");
	});

	//$(".feature_tab").css("opacity","0.9");
	//快速选车和快速估价切换
	var $featureTab = $(".feature_title");
	var $featureActiveTab = $(".feature_title_active");
	var $featureActiveContent = $(".feature_content_active");
	var F_Buy_Active = false;
	
	var tabTimer = null;
	$featureTab.hover(function(){
		$this = $(this);
		tabTimer = setTimeout(function(){
			clearTimeout(tabTimer);
			if(!$this.is(".feature_title_active")){
				var contentId = $this.attr("content");
				$featureActiveTab.removeClass("feature_title_active");
				$this.addClass("feature_title_active");
				$featureActiveTab = $this;
				
				$featureActiveContent.hide();
				$("#" + contentId).show();
				$featureActiveContent = $("#" + contentId);
				if(contentId=="evaluate_content"&&!F_Buy_Active){
					Bimu.select.init(['F_buybrand','F_buyset',''],"car-subdivision",['','',''],function(){});
					F_Buy_Active=true;
				}
			}
		},300);
	},function(){
		clearTimeout(tabTimer);
	});
	//快速选车鼠标hover滑出更多品牌
	var brandSelectActive = false;
	
	var brandTimer = null;
	var checkDisplayStatus = function(){
		brandTimer = setTimeout(function(){
			clearTimeout(brandTimer);
			if(brandSelectActive == true){
				$("#feature_brand").show().animate({"width": "728px"},300);
				$("#quickSelect_brand").addClass("quickSelect_brand_active quickSelect_dl_active");
			}else{
				$("#feature_brand").animate({"width": "0px"},300,function(){
					$("#quickSelect_brand").removeClass("quickSelect_brand_active");
					$("#feature_brand").hide();
				});
				$("#quickSelect_brand").removeClass("quickSelect_dl_active");
			}
		},300);
	};
	$("#quickSelect_brand").mouseenter(function(e){
		brandSelectActive = true;
		checkDisplayStatus();
	}).mouseleave(function(e){
		brandSelectActive = false;
		checkDisplayStatus();
	});
	$("#feature_brand").mouseenter(function(e){
		brandSelectActive = true;
		checkDisplayStatus();
	}).mouseleave(function(e){
		brandSelectActive = false;
		checkDisplayStatus();
	});
	
	//快速选车鼠标hover效果
	$("#quickSelect_content dl:not(:first)").mouseenter(function(){
		$(this).addClass("quickSelect_dl_active");
	}).mouseleave(function(){
		$(this).removeClass("quickSelect_dl_active");
	});
	
	//banner自动填充背景色
	$(".slides li").each(function(){
		var bgColor = $(this).attr("bgColor");
		$(this).css("background-color", "#" + bgColor);
	});
	
	//服务
	$(".service-contain").mouseenter(function(){
		$(this).addClass("service-active");
	}).mouseleave(function(){
		$(this).removeClass("service-active");
	});
	//给carBox添加鼠标经过的效果
	var oldBdColor = "";
	$(".carBox li").live("mouseenter",function(){
		var $this = $(this),
			bdColor = $this.find(".car-price").css("color");
		oldBdColor = $this.css("border-color");
		$this.css({borderColor: bdColor, zIndex: 10});
	}).live("mouseleave",function(){
		$(this).css({borderColor: oldBdColor, zIndex: 1});
	});
	//图片延迟加载
	var lazyImg = function(target,reloadFun){
		target.lazyload({
			effect: "fadeIn",
			threshold: 250,
			load: reloadFun
		});
	};
	//如果图片宽度超过240px，就将图片居中显示
	var beCenter = function(){
		var $this = $(this);
		var width = $this.width();
		if(width > 240){
			$(this).css({"margin-left":"-"+(width/2)+"px",left:"50%",position:"relative"});
		}
	};
	lazyImg($(".onsaleBox img"));
	lazyImg($(".yushouBox img"),beCenter);
	lazyImg($("#soucheDoor img"));
	lazyImg($("#includedBrand img"));
	lazyImg($("#carTejia img"));
	lazyImg($('#carBrand img'));
	lazyImg($("#carTejia img"));
	$("#carHot img").lazyload({
		threshold: 250
	});
	//换一换
	$(".changeCars").mouseenter(function(){
		$(this).animate({'width':'76px'}, 200);
	}).mouseleave(function(){
		$(this).animate({'width':'67px'}, 200);
	});
	$(".changeCars").click(function(){
		var $this = $(this);
		var index = parseInt($this.attr('index'));//页码
		var type = $this.attr('type');
		
		var num = $this.attr('num');
		if(index > num){
			index = 1;
		}
		
		Bimu.ajax.submitpost(config.api_changeCars,{index:index, type:type},function(data){
			$this.parent().parent().find('.carBox').html(data);
			$this.attr('index', index+1);
		});
	});
	//切换
	var tabHover = function(target, hoverClass){
		target.mouseenter(function(){
			target.addClass(hoverClass);
		}).mouseleave(function(){
			target.removeClass(hoverClass);
		});
	};
	var timer = null;
	var tabClick = function(paras){
		timer = setTimeout(function(){
			clearTimeout(timer);
				var animateObj = paras.animateObj,
				preObj = paras.preObj,
				nextObj = paras.nextObj,
				width = paras.objWidth,
				index = paras.tabIndex,
				dis = paras.dis,
				speed = paras.speed,
				page = paras.tabPage,
				pageActive = paras.pageActive,
				margin = animateObj.css("margin-left"),
				countedIndex;
				//计算countedIndex，左右切换按钮使用
				if(margin != "0px"){
					countedIndex = Math.floor(Math.abs(parseInt(animateObj.css("margin-left"))) / width);
				}else{
					countedIndex = 0;
				}
			//dis为1,表示要显示下一页；dis为0,表示要显示上一页
			if(dis === 1){
				index = ++countedIndex;
			}else if(dis === 0){	
				index = --countedIndex;
			}else{
				//如果是圆点切换，则直接使用index
				countedIndex = index;
			}
			animateObj.animate({marginLeft: "-" + (index * width) + "px"}, speed);
	
				var length = Math.floor(Math.abs(animateObj.width() / width));
				if(countedIndex === length - 1){
					index = countedIndex;
					nextObj.hide();
					preObj.show();
				}else if(countedIndex === 0){
					index = 0;
					preObj.hide();
					nextObj.show();
				}else{
					nextObj.show();
					preObj.show();
				}
			if(page != null){
				$("."+pageActive).removeClass(pageActive);
				page.eq(index).addClass(pageActive);
			}
		},100);
		
	};
	//异步加载
	var isTejiaEnd = false,
		nowTejiaNum = 2;
	var getTejiaDom = function(){
		!isTejiaEnd&&$.ajax({
			url: config.api_flashBuy,
			type: "POST",
			data: {"nowTejiaNum": nowTejiaNum},
			dataType: "html",
			error: function(data){
				isTejiaEnd = true;
			},
			success: function(data){
				$(".tejiaWrap .carBox").append(data);
				beginCount($(".downCounter").slice((nowTejiaNum-1)*4));
				if(data == "" || data == null){
					isTejiaEnd = true;
					return false;
				}
				nowTejiaNum = nowTejiaNum + 1;
			}
		});

	};
	
	var wrapWidth = $(".wrap").width();//根据不同的屏幕分辨率设置不同的切换距离
	//门店介绍切换
	$(".doorTab").css({opacity:0.75});
	$(".doorContain").mouseenter(function(){
		$(".doorPreTab,.doorNextTab").fadeIn(300);
	}).mouseleave(function(){
		$(".doorPreTab,.doorNextTab").fadeOut(200);
	});

	tabHover($(".doorPreTab"), "doorPreHover");
	tabHover($(".doorNextTab"), "doorNextHover");

	var doorList = $(".doorList");
	var doorWidth = 1160;
	if(wrapWidth == 1000){
		doorWidth = 960;
	}
	$(".doorPreTab").click(function(){
		tabClick({preObj:$(".doorPreTab"),nextObj:$(".doorNextTab"), animateObj:doorList, dis:0, objWidth:doorWidth, speed:300});
	});
	$(".doorNextTab").click(function(){
		
		doorList.find("li").each(function(){
			var $this = $(this);
			var img = $this.find("img");
			if(img.attr("src") == ""){
				img.attr("src",$this.attr("imgSrc"));
				return false;
			}
		});
		tabClick({preObj:$(".doorPreTab"),nextObj:$(".doorNextTab"), animateObj:doorList, dis:1, objWidth:doorWidth, speed:300});
	});

	//特价车辆切换
	var tejiaList = $(".tejiaWrap .carBox");
	var length = Math.ceil(tejiaList.attr("totalNum") / 4);
	var tejiaWidth = 1212;
	if(wrapWidth == 1000){
		tejiaWidth = 1012;
	}
	tejiaList.width(length * 1212);
	tabHover($(".tejiaPreTab"), "tejiaPreHover");
	tabHover($(".tejiaNextTab"), "tejiaNextHover");
	
	//添加翻页的小圆点
	var tejiaWrap = $(".tejiaWrap");
	var tejiaPage = $("<div class='tejiaPage'></div>").appendTo(tejiaWrap);
	for(var i=0; i<length; i++){
		var ins = "<ins></ins>";
		if(i === 0){
			ins = "<ins class='activePage'></ins>";
		}
		tejiaPage.append(ins);
	}
	
	var tejiaPageIns = $(".tejiaPage ins");
	if(length == 1){
		$(".tejiaNextTab").hide();
	}
	
	$(".tejiaPreTab").click(function(){
		tabClick({preObj:$(".tejiaPreTab"),nextObj:$(".tejiaNextTab"), animateObj:tejiaList, dis:0, objWidth:tejiaWidth, speed:500, tabPage: tejiaPageIns, pageActive:"activePage"});
	});
	$(".tejiaNextTab").click(function(){
		//getTejiaDom();
		//setTimeout(function(){
			tabClick({preObj:$(".tejiaPreTab"),nextObj:$(".tejiaNextTab"), animateObj:tejiaList, dis:1, objWidth:tejiaWidth, speed:500, tabPage: tejiaPageIns, pageActive:"activePage"});
		//},100);
		
	});
	tejiaPageIns.click(function(){
		//getTejiaDom();
		tabClick({preObj:$(".tejiaPreTab"),nextObj:$(".tejiaNextTab"),animateObj:tejiaList, tabIndex:$(this).index(), objWidth:tejiaWidth, speed:500, tabPage: tejiaPageIns, pageActive:"activePage"});
	});
	
	
	//在线客服定位
	var bdTimer = setInterval(function(){
			if($("#BDBridgeIconWrap").length != 0){
				setTimeout(function(){
					$("#BDBridgeIconWrap").hide();
				},150);
				
				clearInterval(bdTimer);
			}
	},50);
	$(window).scroll(function(){
		if($(window).scrollTop() >= 600){
			$("#BDBridgeIconWrap,#floatLayer").show();
		}else{
			$("#BDBridgeIconWrap,#floatLayer").hide();
		}
	});
	
	//门店展示
	$(".doorIntro span").css("opacity","0.8");
	
	//品牌合作专区切换
	$(".carBrand-tab li").live('click',function(){
		
		var position = $(this).attr('position');
		removeCurrent(position);
		$(this).addClass('brandTabActive');
		$(this).find('img').attr('src',$(this).find('img').attr('active'));
		Bimu.ajax.submitpost(config.api_brandCooper,{position:position},function(data){
			$('#J_brandcooperation').html(data);
		});
		
	});
	
	function removeCurrent(position){
		$('.carBrand-tab li').each(function(){
			var liPos = $(this).attr('position');
			if(liPos!=position){
				$(this).find('img').attr('src',$(this).find('img').attr('noactive'));
				$(this).removeClass('brandTabActive');
			}
		});
	}
	var initBackend = function(){
		
		
			var phoneReg = /^1[3458][0-9]{9}$/;
			var is_top_buy = false;
			//降价通知提交
			$("#qiugou-form").submit(function(e){
				e.preventDefault();
				if(!phoneReg.test($("#qiugou-phone").val())){
					$(".warning",this).removeClass("hidden");
					return;
				}else{
					Souche.PhoneRegister($("#qiugou-phone").val(),function(){
						if(is_top_buy){
							$("#F_buy_top_form").attr("action",contextPath+'/pages/quickbuy.html');
					  		//同步提交form，需要跳转到新的页面
					  		Bimu.form.syncSubmit("F_buy_top_form");
						}else{
							$("#buy-form").attr("action",contextPath+'/pages/quickbuy.html');
					  		//同步提交form，需要跳转到新的页面
					  		Bimu.form.syncSubmit("buy-form");
						}
						
					})
				}
			})
			$("#qiugou-popup .apply_close").click(function(){
				$("#qiugou-popup").addClass("hidden");
				$(".qiugou-wrapGrayBg").hide();
			});
			//快速求购同步提交
			$("#buy-form").submit(function(e){
				//校验 true,false
				if ($('#Q_buybrand' ).val()==""&&$("#Q_buyage" ).val()=="0-100"&&$('#Q_buyprice' ).val()=="0-100000000"){
			 	   $('#quick_buy .error_remind').html("请至少选择一个条件").show();
			         return false ;
			    }
				e.preventDefault();
				
				Souche.checkPhoneExist(function(is_login){
						if(is_login){
					  		$("#buy-form").attr("action",contextPath+'/pages/quickbuy.html');
					  		//同步提交form，需要跳转到新的页面
					  		Bimu.form.syncSubmit("buy-form");
					  
						}else{
							$("#qiugou-popup").removeClass("hidden");
							$(".qiugou-wrapGrayBg").show();
							is_top_buy = false;
						}
					})
			});
			//快速求购同步提交
			$("#F_buy_top_form").submit(function(e){
				//校验 true,false
				if($('#F_buybrand' ).val()==""&&$("#F_buyage" ).val()=="0-100"&&$('#F_buyprice' ).val()=="0-100000000"){
	            	   $('#evaluate_content .select_remind').hide();
	            	   $('#evaluate_content .error_remind').html("请至少选择一个条件").show();
	                    return false ;
	             }
				e.preventDefault();
				
				Souche.checkPhoneExist(function(is_login){
						if(is_login){
							$("#F_buy_top_form").attr("action",config.api_saveBuyInfo);
				    		  Bimu.form.syncSubmit("F_buy_top_form");
					  
						}else{
							$("#qiugou-popup").removeClass("hidden");
							$(".qiugou-wrapGrayBg").show();
							is_top_buy = true;
						}
					})
			});

		$('#J_continuebuy').click(function(){
			 $("#J_buybrand").get(0).selectedIndex=0;//index为索引值
			 $("#J_buyset").get(0).selectedIndex=0;
			 $("#J_buyprice").get(0).selectedIndex=0;
			 $("#buy-form").attr("action",config.api_isLogin);
			$('#J_buy').show();
            $('#J_buysuccess').hide();
		});
		
		$('#F_continuebuy,#J_continuebuy').click(function(){
			  var selectArray=$(this).parent().parent().find('select');
			  for(var i=0 ;i< selectArray.length;i++){
				  selectArray[i].selectedIndex=0;
			  }
			  var flag=$(this).attr("flag");
			  if(flag=="first"){
				  $("#F_buy_top_form").attr("action",config.api_isLogin);
					$('#F_buy_top_form').show();
                   $('#F_buysuccess').hide();
                   $('#F_buyset').empty().html("<option value=''>-请选择-</option>");

			  }else{
				  $("#buy-form").attr("action",config.api_isLogin);
				  $('#J_buy').show();
                  $('#J_buysuccess').hide();
                  $('#J_buyset').empty().html("<option value=''>-请选择-</option>");

			  }

		});
		
		
		$('select').live('change',function(){
			if($(this).get(0).selectedIndex!=0){
				$(this).parent().parent().find('.error_remind,.select_remind').html("").hide();
			}
		});
	};

	var downCounter = function(target){
		var container = target;
		var counter = {
			endYear: container.attr("endYear"),
			endMonth: container.attr("endMonth"),
			endDay: container.attr("endDay"),
			endHour: container.attr("endHour"),
			serverYear: container.attr("serverYear"),
			serverMonth: container.attr("serverMonth"),
			serverDay: container.attr("serverDay"),
			serverHour: container.attr("serverHour"),
			serverMin: container.attr("serverMin"),
			serverSec: container.attr("serverSec"),
			offHour: 0,
			offMin: 0,
			offSec: 0,
			offMSec: 0
		};
		var showDom = function(){
			var zeroH = "",zeroM = "",zeroS = "";

			if(counter.offHour<10) {
				zeroH = "0";
			}
			if(counter.offMin<10) {
				zeroM = "0";
			}
			if(counter.offSec<10) {
				zeroS = "0";
			}

			container.html("<span></span>剩余<ins>" + zeroH + counter.offHour + "</ins>时<ins>" + zeroM + counter.offMin + "</ins>分<ins>" + zeroS + counter.offSec + "." + counter.offMSec + "</ins>秒");
	 	};
		var setInitTime = function(){
			var endDate = new Date(counter.endYear, counter.endMonth, counter.endDay, counter.endHour, 0, 0);
			var serverDate = new Date(counter.serverYear, counter.serverMonth, counter.serverDay, counter.serverHour, counter.serverMin, counter.serverSec);
			var offset = Date.parse(endDate) - Date.parse(serverDate);

			if(offset < 0){
				counter.offMSec = 0;
				counter.offSec = 0;
				counter.offMin = 0;
				counter.offHour = 0;
				showDom();
				return false;
			}
			counter.offHour = Math.floor(offset/(3600*1000));
			var leave = offset%(3600*1000);
			counter.offMin = Math.floor(leave/(60*1000));
			var leave2 = leave%(60*1000);
			counter.offSec = Math.floor(leave2/1000);
			showDom();
		};
		setInitTime();//初始化
		var timer = setInterval(function(){
			--counter.offMSec;
			if(counter.offMSec < 0){
				counter.offMSec = 9;
				--counter.offSec;
				if(counter.offSec < 0){
					counter.offSec = 59;
					--counter.offMin;
					if(counter.offMin < 0){
						counter.offMin = 59;
						--counter.offHour;
						if(counter.offHour < 0){
							clearInterval(timer);
							counter.offSec = 0;
							counter.offMin = 0;
							counter.offHour = 0;	
						}
					}
				}
			}
			showDom();
		},100);
	};
	var beginCount = function(counters){
		counters.each(function(){
			var $this = $(this);
			downCounter($this);
		});
	};

	var config = {
		api_isLogin:'',
		api_saveBuyInfo:'',
		api_detail:'',
		api_changeCars:''
	};
	return {
		init:function(_config){
			Souche.Util.mixin(config,_config);
			initBackend();
			beginCount($(".downCounter"));
		}

	};
	
})();

