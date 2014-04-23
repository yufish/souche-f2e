var List = function() {
    var config = {
            page:1,
            moreURL:""
    }
    var tpl_cars;
    var carList = [];
    var loadMore = function(){
       SM.LoadingTip.show("正在加载中")
       $.ajax({
         url:config.moreURL+"&index="+(++config.page),
         dataType:"json",
         success:function(data){
             //console.log(data)
			 var items = data.page.items;
			 var tpl_data,item,html;
			 var $cars = $('.cars')
             for(var i =0;i<items.length;i++){
				item = items[i];
				tpl_data={
					id:item.id,
					detailUrl:item.carVo.status=='zaishou'?'detail':'yushou-detail',
					flashPurchase:item.flashPurchase,
					fenqi:(!!item.carPriceVO&&item.carPriceVO.fenqi==1),
					downPrice:(!!item.flashPurchaseVO)?item.flashPurchaseVO.totalMasterOutPriceToString*1000:undefined,
					favorite:item.favorite,
					favCount:item.carFavoriteNum,
					year:item.carVo.yearShow,
					month:item.carVo.mouthShow,
					newPrice:item.carVo.newPriceToString,
					levelName:item.carVo.levelName,
					pictureBig:item.carPicturesVO.pictureBig,
					carOtherAllNameShow:item.carVo.carOtherAllNameShow,
					price:item.price,
					zaishou:(item.carVo.status=='zaishou')
				}
                carList.push(tpl_data);
				html  = Mustache.render (tpl_cars,{'cars':tpl_data});

				$cars.append(html);
             }
             
             if(data.totalPage==config.page){
                 $("#load_more").addClass("hidden")
             }
             SM.LoadingTip.hide();
         },
         error:function(){
             SM.LoadingTip.hide();
         }
       }) 
    }
    

    
    var store =function(){
        var db = window.localStorage;
        db.setItem('timestamp',Date.now());
        db.setItem('url',window.location.href);
        db.setItem('carlist',JSON.stringify(carList));
    }
    var recover =function(){
        var db = window.localStorage;
        var time = parseInt (db.getItem('timestamp'));
        var url = db.getItem('url');
        
        if(!checkCond({time:time,url:url})){
            return;
        }
        
        var carList = JSON.parse(db.getItem('carlist'));
        makeDom(carList);
    }
    
    var makeDom=function(carList){
        var $cars = $('.cars');
        var html;
        for(var i = 0;i<carList.length;i++){
            html  = Mustache.render (tpl_cars,{'cars':carList[i]});
            $cars.append(html);
        }
    }
    var checkCond=function(obj){
        var time = obj.time
            ,url = obj.url;
        
        //10 minutes 1000*60*10
        if(time && (Date.now()- time<600000) ){
            return ture; 
        }
        var url = db.getItem('url');
        if(url && (url ==window.location.href)){
            return true;
        }
        return false;
    }
    
    return {

        init : function(_config) {
            for ( var i in _config) {
                config[i] = _config[i]
            }
            tpl_cars = $("#tpl_cars").html();
           this.bind() 
        },
        bind:function(){
            $("#filter").css("left",-$(window).width())
            $("#list .filter .t").on("click",function(e){
            		setTimeout(function(){
                        $("#content").css("height",0)
                    },400)
                    $("#filter").animate({left:0},300)
                    $("html,body").scrollTop(0)
                    // $("#filter .action").css({
                    //         top:$(window).height()+$(window).scrollTop()-70
                    //     })
                    window.history.pushState({time:new Date().getTime()},"",window.location.href.replace(/#filter/g,"")+"#filter");
                    $("#xuan").addClass("hidden")
                
            })
          
            $("#load_more").on("click",function(e){
                e.preventDefault();
                loadMore();
            })
            
            
            //do fav
            !function(){
	             var api = {
	            	fav:contextPath+'/pages/saleDetailAction/savaCarFavorite.json',
	            	unfav:contextPath+'/pages/saleDetailAction/delCarFavorite.json'
			    };
	            
				function showPopup(){
	            	$('.wrapPhoneBg').removeClass('hidden');
					var $popup = $('#phone-popup');
	            	$popup.removeClass('hidden').css({'left':( $(window).width() - $popup.width()) / 2});
					
				}
	            function hidePopup(){
	            	$('.wrapPhoneBg').addClass('hidden');
	            	$('#phone-popup').addClass('hidden');
	            }
	            function saveFav($node){
	            	var $node = $node;
	            	$.ajax({
	      	          url:api.fav,
	      	          data:{carId:$node.attr("data-id")},
	      	          dataType:"json",
	      	          success:function(){
	      	            $node.addClass("star");
						var $numSpan = $node.find('span');
						var i = parseInt($numSpan.text());
						$numSpan.text(i+1);
	      	          }
	      	        })
	            }
	            function delFav($node){
	            	 $.ajax({
	       	          url:api.unfav,
	       	          data:{'carId':$node.attr("data-id")},
	       	          dataType:"json",
	       	          success:function(){
	       	            $node.removeClass("star");
						var $numSpan = $node.find('span');
						var i = parseInt($numSpan.text());
						$numSpan.text(i-1);
	       	          }
	       	        })
	            }
	            
	            function doFav($node){
	            	if($node.hasClass('star')){
	            		delFav($curFav);
	            	}else{
	            		saveFav($curFav);
	            	}
	            }
	            
				var isLogin = false;
	            var $curFav;
				 var phoneReg = /^1[3458][0-9]{9}$/;
	             $('#phone-form').submit(function(e) {
	                 var phoneNum = $("#phone-num").val();
	                 e.preventDefault();
	                 if (!phoneReg.test(phoneNum)) {
	                     alert('请输入正确的手机号码');
	                 } else {
	                     SM.PhoneRegister(phoneNum, function() {
	                         hidePopup();
	                         isLogin = true;
	                         doFav($curFav);
	                     })
	                 }
	             })
				
				$('#back-btn').click(function(){
					hidePopup();
				})
	            $('.cars').on('click','.fav',function(e){
	            	e.preventDefault();
	            	$curFav = $(this);
	            	
	            	if(isLogin){
						
	            		doFav($curFav);
	            		return;
	    			}
	        
	            	SM.checkPhoneExist(function(is_login) {
	    				if(is_login) {
	    					doFav($curFav);
	    				}else {
	    					showPopup()
	    				}
	    			})
	            })
            }();
            //do fav end
            
           
            
            // $(window).on("scroll",function(e){
            //     if($("#filter").offset().left==0){
            //         $("#filter .action").css({
            //             top:$(window).height()+$(window).scrollTop()-70
            //         })
            //     }
            // })
        }

    }
}();
