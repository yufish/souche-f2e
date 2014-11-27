define(['lib/mustache',"souche/util/image-resize"],function(Mustache,ImageResize){
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
        var carTemplate = $("#carTemplate").html();
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
                        list[idx].url = (contextPath + "/pages/choosecarpage/choose-car-detail.html?carId=" + list[idx].id);
                        list[idx].isZaishou = !!(list[idx].carVo.status == "zaishou")
                        template += Mustache.render(carTemplate,list[idx])
                    }
                    $(".cars",carContent).append(template);
                    ImageResize.init($(".img",carContent), 240, 160);
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
        var carTemplate = $("#carTemplate").html();

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
                        list[idx].url = (contextPath + "/pages/choosecarpage/choose-car-detail.html?carId=" + list[idx].id);
                        list[idx].isZaishou = !!(list[idx].carVo.status == "zaishou")
                        template += Mustache.render(carTemplate,list[idx])
                    }
                    carContent.html("<div class='clearfix cars'>"+template+"</div>");

                    carContent.append("<div class='carsMore'><span>查看更多</span></div>")
                    ImageResize.init($(".img",carContent), 240, 160);
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
                if (id === "myAdviser"||id == "hotNewCars") {
                    $(".guess-like").removeClass("hidden")
                }else{
                    $(".guess-like").addClass("hidden")
                }
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