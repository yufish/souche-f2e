Souche.Inside = (function() {
    var config = {
        fav_api: ""
    }

    function updateFav( favCtn, favOrNot ){
        var favCount = favCtn.find('.fav-count');
        alert(favCount)
        var favCountAttr, lastFavCount;
        // list里的
        if( favCount.length > 0 ){
            favCountAttr = 'data-favcount';
            lastFavCount = Number(favCount.attr(favCountAttr));
        }
        // guess-like里的
        else{
            favCountAttr = 'data-num';
            lastFavCount = Number(favCtn.attr(favCountAttr));
        }

        // 计算 操纵样式
        var newFavCount = 0;
        if(favOrNot){
            // 添加active类 兼容guess-like中的收藏
            favCtn.addClass("faved active");
            // 判断是NaN
            if(lastFavCount !== 0 && !Boolean(lastFavCount) ){
                newFavCount = 1;
            }
            else{
                newFavCount = lastFavCount + 1;
            }
        }
        else{
            favCtn.removeClass("faved active");
            if(lastFavCount !== 0 && !Boolean(lastFavCount) ){
                newFavCount = 0;
            }
            else{
                newFavCount = lastFavCount - 1 ;
            }
        }

        // list里的
        if( favCount.length > 0 ){
            favCount.attr(favCountAttr, newFavCount);
            favCount.html( newFavCount );
        }
        // guess-like里的
        else{
            favCtn.attr(favCountAttr, newFavCount);
            favCtn.find('.fav-count').html( newFavCount );
        }
        
    }
    $(document).ready(function() {
        //			var setImgHeight = function(img, wrapH, wrapW){
        //				if(img.height() < wrapH){
        //					img.height(wrapH).width("auto");
        //					var index = (img.width() - wrapW)/2;				
        //					img.css("margin-left","-" + index + "px");
        //				}
        //			};
        //			$(".recommend img").each(function(){ 	
        //				setImgHeight($(this),150,216);
        //			}); 
        
        // list页面的图片懒加载, 兼容旧版
        $(".list_items img, .car-wrap img").lazyload({
            effect: "fadeIn",
            threshold: 250

        });
        $(".recommend img").lazyload({
            effect: "fadeIn",
            threshold: 250
        });
        if ($(".car-nav").length != 0) {
            var chooseTop = $(".car-nav").offset().top;
        }
        var isIE = !! $.browser.msie;
        $(window).scroll(function() {
            var targetTop = $(window).scrollTop();
            //列表页条件栏固定
            if (targetTop >= chooseTop) {
                $(".car-nav").addClass("car-nav-fixed");
            } else {
                $(".car-nav").removeClass("car-nav-fixed");
            };
        });
        
        var shouCustomTimer = null;
        $('.custom-price .custom-title').on('mouseenter', function(){
            shouCustomTimer = setTimeout(function(){
                var customPriceCtn = $(".custom-price");
                customPriceCtn.removeClass("no-active");
                var minInput = customPriceCtn.find('#minprice');
                minInput.focus();
            }, 30);
        });
        $('.custom-price').on('mouseleave', function(){
            clearTimeout(shouCustomTimer);
            var customPriceCtn = $(".custom-price");
            customPriceCtn.addClass("no-active");
        });

        //列表页查看更多品牌
        var listBrand = true;
        var listTimer = null;
        var listBrandHover = function() {
            clearTimeout(listTimer);
            if (listBrand == true) {
                listTimer = setTimeout(function() {
                    $(".nav_brand").addClass("nav_brand_active");
                    $(".list_allBrand").show().animate({
                        "width": "710px"
                    }, 300);
                }, 100);
            } else {
                clearTimeout(listBrand);
                listBrand = setTimeout(function() {
                    $(".list_allBrand").animate({
                        "width": "0px"
                    }, 300, function() {
                        $(".list_allBrand").hide();
                        $(".nav_brand").removeClass("nav_brand_active");
                    });
                }, 100);
            }

        };
        $(".nav_list_more").mouseenter(function() {
            listBrand = true;
            listBrandHover();
        }).mouseleave(function() {
            $(".nav_brand").mouseenter(function() {
                listBrandHover();
            }).mouseleave(function() {
                listBrand = false;
                listBrandHover();
                $(".nav_brand").unbind("mouseenter").unbind("mouseleave");
            });
        });

        //快速求购位置
        if ($(".list_noResult").length == 0) {
            $(window).scroll(function() {
                if ($(window).scrollTop() >= $(document).height() - $(window).height() - 270) {
                    $("#quick_buy").fadeIn(200);
                } else {
                    $("#quick_buy").fadeOut(200);
                }
            });
        }

    });

    return {
        init: function(_c) {
            for (var i in _c) {
                config[i] = _c[i]
            }
            this._bind()
        },
        _bind: function() {
            $.ajax({
                url:config.api_favCounts,
                data:{
                    siteId: $.cookie("siteId"),
                    shopId:$.cookie("shopId"),
                    carIds:(function(){
                        var ids =[];
                        $(".carItem").each(function(i,item){
                            ids.push($(item).attr("data-id"))
                        })
                        return ids;
                    })().join(",")
                },
                dataType:"jsonp",
                success:function(data){
                    console.log(data)

                    if(data.code==200){
                        for(var key in data){
                            var arr = key.split("_")
                            if(arr.length>1){
                                var carId = arr[1];
                                $(".carItem[data-id="+carId+"] .fav-count").html(data[key])
                            }
                        }
                    }
                }
            })
            var phoneReg = /^1[3458][0-9]{9}$/;
            var fav_carId = null;
            var favSubmit = function() {
                $.ajax({
                    url: config.fav_api,
                    data: {
                        crmUserId: $.cookie("crmUserId"),
                        siteId:$.cookie("siteId"),
                        shopId:$.cookie("shopId"),
                        carId: fav_carId //$(self).attr("data-carid")
                    },
                    dataType: "jsonp",
                    type: "post",
                    success: function(data) {
                        if (data.code==402) {
                            alert("您已经收藏过这辆车")
                            var favCtn = $(".fav[data-carid=" + fav_carId + "], .guess-like .carCollect[data-carid=" + fav_carId + "]");
                            $(favCtn).addClass("faved");
                        } else {
                            var favCtn = $(".fav[data-carid=" + fav_carId + "], .guess-like .carCollect[data-carid=" + fav_carId + "]");
                            $(favCtn).find(".fav-count").html($(favCtn).find(".fav-count").html() * 1 + 1);
                            $(favCtn).addClass("faved");
                        }
                    }
                })
            }

            var cancelFavSubmit = function() {
                $.ajax({
                    url: config.fav_api,
                    data: {
                        crmUserId: $.cookie("crmUserId"),
                        siteId:$.cookie("siteId"),
                        shopId:$.cookie("shopId"),
                        platform : 'PLATFORM_WEB',
                        carId: fav_carId //$(self).attr("data-carid")
                    },
                    dataType: "jsonp",
                    type: "post",
                    success: function(data) {
                        if (data.errorMessage) {
                            alert(data.errorMessage)
                        } else {
                            var favCtn = $(".fav[data-carid=" + fav_carId + "], .guess-like .carCollect[data-carid=" + fav_carId + "]");
                            $(favCtn).find(".fav-count").html($(favCtn).find(".fav-count").html() * 1 + 1);
                            $(favCtn).removeClass("faved");
                        }
                    }
                })
            }

            //降价通知提交
            $("#fav-form").submit(function(e) {
                e.preventDefault();
                if (!phoneReg.test($("#fav-phone").val())) {
                    $(".warning", this).removeClass("hidden");
                    return;
                } else {
                    $("#fav-popup").addClass("hidden");
                    $(".fav-wrapGrayBg").hide();
                    Souche.PhoneRegister($("#fav-phone").val(), function() {
                        favSubmit()
                    })
                }
            })
            $("#fav-popup .apply_close").click(function() {
                $("#fav-popup").addClass("hidden");
                $(".fav-wrapGrayBg").hide();
            });
            $(".fav").click(function(e) {
                e.preventDefault();
                fav_carId = $(this).attr("data-carid")
                if ($(this).hasClass("faved")){
//                    cancelFavSubmit()
                }else{
                    Souche.MiniLogin.checkLogin(function(){
                        favSubmit()
                    })
                }
            });
            // guess-like区域的事件代理
            $('.guess-like').on('click', '.carCollect', function(e){
                e.preventDefault();
                fav_carId = $(this).attr("data-carid")
                if ($(this).hasClass("active")){
                    cancelFavSubmit()
                }else{
                    Souche.MiniLogin.checkLogin(function(){
                        favSubmit()
                    })
                }
            })

        }
    };
})();