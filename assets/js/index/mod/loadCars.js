define(function(){
    var nowTabCode = 0;
    var pageInfos = {

    }
    var endInfos = {

    }
    var isLoading = false;
    var loadOtherMore = function(code){
        if(isLoading) return;
        if(endInfos[code]){
            return;
        }
        if(!pageInfos[code]){
            pageInfos[code]= 0;
        }
        pageInfos[code]++;
        var url = config.getMoreOtherCars_api;
        var carContent = $(".carsModule "+".carContent-"+code);
        isLoading = true;
        if( pageInfos[code]>2){
            carContent.append("<div class=loading></div>")
        }

        $.ajax({
            url: url,
            type: "GET",
            dataType: "json",
            data:{
                page:pageInfos[code],
                searchCode:code
            }
        }).done(function(result) {
            $(".loading",carContent).remove()
            if (result.code == 204) {

            } else {
                var list = result.pageData.items;
                if (list.length == 0) {
                    endInfos[code]=true;
                } else {
                    var template = "";
                    for (var idx = 0, len = list.length; idx < len; idx++) {
                        var url = (contextPath + "/pages/choosecarpage/choose-car-detail.html?carId=" + list[idx].id);
                        template += "<div class='carsItem carItem'><a target='_blank' href='" + url + "' class='carImg'><img src='" + (list[idx].carPicturesVO || {}).pictureBig + "' ><\/a><a target='_blank' href='" + url + "' class='car-link'>" + list[idx].carVo.carOtherAllName + "<\/a>" +
                            "<div class='info'><span class='price'>￥" + (list[idx].limitSpec || list[idx].price) + "万<\/span><span class='shangpai'>上牌：" + list[idx].carVo.firstLicensePlateDateShow + "<\/span><\/div>" +
                            "<div class='other'>" +
                            "<div title='" + list[idx].recommendReasonStr + "' class='recommended'><span class='" + (list[idx].recommendReasonStr ? "" : "hidden") + "' >推荐理由：" + list[idx].recommendReasonStr + "<\/span><\/div>" +
                            "<\/div>" +
                            "<div class='carTail clearfix'>" +
                            "<a data-carid='" + list[idx].id + "' data-num='" + list[idx].count + "' class='collect carCollect " + (list[idx].favorite ? "active" : "") + "'>收藏<span>" + list[idx].count + "<\/span><\/a>" +
                            "<div class='carConstrast' contrastid='" + list[idx].contrastId + "' carid='" + list[idx].id + "'><input type='checkbox'  " + (list[idx].contrastId ? "checked" : "") + "><span>加入对比<\/span><\/div>" +
                            "<div class='contrast-waring hidden'>对比栏已满！你可以删除不需要的车辆，再继续添加。<\/div><\/div><\/div>";
                    }
                    $(".cars",carContent).append(template);
                }
                $(".carsMore",carContent).remove();

            }
            isLoading = false;
        });
    }
    var loadOtherCars = function(code){
        if(!pageInfos[code]){
            pageInfos[code]= 0;
        }
        pageInfos[code]++;
        var url = config.getMoreOtherCars_api;
        var carContent = $(".carsModule "+".carContent-"+code);
        isLoading = true;
        $.ajax({
            url: url,
            type: "GET",
            dataType: "json",
            data:{
                page:pageInfos[code],
                searchCode:code
            }
        }).done(function(result) {

            if (result.code == 204) {

            } else {
                var list = result.pageData.items;
                if (list.length == 0) {

                } else {
                    var template = "";
                    for (var idx = 0, len = list.length; idx < len; idx++) {
                        var url = (contextPath + "/pages/choosecarpage/choose-car-detail.html?carId=" + list[idx].id);
                        template += "<div class='carsItem carItem'><a target='_blank' href='" + url + "' class='carImg'><img src='" + (list[idx].carPicturesVO || {}).pictureBig + "' ><\/a><a target='_blank' href='" + url + "' class='car-link'>" + list[idx].carVo.carOtherAllName + "<\/a>" +
                            "<div class='info'><span class='price'>￥" + (list[idx].limitSpec || list[idx].price) + "万<\/span><span class='shangpai'>上牌：" + list[idx].carVo.firstLicensePlateDateShow + "<\/span><\/div>" +
                            "<div class='other'>" +
                            "<div title='" + list[idx].recommendReasonStr + "' class='recommended'><span class='" + (list[idx].recommendReasonStr ? "" : "hidden") + "' >推荐理由：" + list[idx].recommendReasonStr + "<\/span><\/div>" +
                            "<\/div>" +
                            "<div class='carTail clearfix'>" +
                            "<a data-carid='" + list[idx].id + "' data-num='" + list[idx].count + "' class='collect carCollect " + (list[idx].favorite ? "active" : "") + "'>收藏<span>" + list[idx].count + "<\/span><\/a>" +
                            "<div class='carConstrast' contrastid='" + list[idx].contrastId + "' carid='" + list[idx].id + "'><input type='checkbox'  " + (list[idx].contrastId ? "checked" : "") + "><span>加入对比<\/span><\/div>" +
                            "<div class='contrast-waring hidden'>对比栏已满！你可以删除不需要的车辆，再继续添加。<\/div><\/div><\/div>";
                    }
                    carContent.html("<div class='clearfix cars'>"+template+"</div>");
                    carContent.append("<div class='carsMore'><span>查看更多</span></div>")
                }
                $(".carsMore",carContent).on("click",function(){
                    $("span",$(this)).html("正在加载中")
                    loadOtherMore(code);
                })

            }
            isLoading = false;
        });
    }
    var config = {}
    return {
        init:function(_config){
            config = _config;
            var isdialogShow = !$(".dialogContentContainer").hasClass("hidden");
            ///change tab
            $("#carsNav li").click(function() {
                $("#carsNav li").removeClass("active");
                $(this).addClass("active");
                var id = $(this).attr("id");
                tabID = id;
                $(window).trigger("tab_change", id)
                $(".carsContent").addClass("hidden");
                $(".carsContent." + tabID + "Content").removeClass("hidden");
                if (id === "myAdviser") {
//                    initAnimate(".myAdviser");
                    if(isdialogShow){
                        $(".dialogContentContainer").removeClass("hidden")
                    }
                } else if (id == "hotNewCars") {
                    $(".hotNewCars img").each(function(i, img) {
                        $(img).attr("src", $(img).attr("data-original"));
                    })
                    $(".hotCarImages img").each(function(i, img) {
                        $(img).attr("src", $(img).attr("data-original"));
                    })
                    if($(".new-tip").length){
                        $.ajax({
                            url:contextPath+"/pages/homePageAction/markReadHotCar.json"
                        })
                    }
                    if(isdialogShow){
                        $(".dialogContentContainer").removeClass("hidden")
                    }
                }else{
                    var carContent;
                    var code = $(this).attr("searchcode");
                    if($(".carsModule "+".carContent-"+code).length){
                        carContent = $(".carsModule "+".carContent-"+code)
                    }else{
                        carContent = $("<div class='carsContent carContent-"+code+"' data-code='"+code+"'><div class=loading></div></div>")
                        carContent.appendTo($(".otherCarsContents"))
                        loadOtherCars(code)
                    }
                    carContent.removeClass("hidden")

                    $(".dialogContentContainer").addClass("hidden")

                }

                return false;
            });
            $(window).scroll(function() {
                if($("#hotNewCars").hasClass("active")||$("#myAdviser").hasClass("active")){
                    return;
                }else{

                    var activeContent = $(".otherCarsContents .carsContent:not(.hidden)")
                    if($(".carsMore",activeContent).length){
                        return;
                    }
                    var code = activeContent.attr("data-code");
                    if (($("#footer").offset().top - 600) <= ($(window).scrollTop() + $(window).height())) {
                        loadOtherMore(code);
                    }
                }

            });
        }
    }
})