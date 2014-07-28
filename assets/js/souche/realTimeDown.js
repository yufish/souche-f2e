/**
 * Created by Administrator on 2014/7/11.
 */
define(function() {
    var down = {};
    var ajaxOption = {};
    var afterShow = undefined;
    var downWidth;
    var maxDownHeight;
    var top,lef;

    var _bind = function () {

    }

    var callback = function (result) {
        var list=[]
        var len = result.items.length>=10?10:result.items.length;

        if(len==0)
        {
            $(".realTimeDown").remove();
            return ;
        }

        for(var index=0;index<len;index++) {
            list.push(result.items[index]);
        }

        var downList = "<div class='realTimeDown'>";
        for (var index = 0, len = list.length; index < len; index++) {
            if(index%2) {
                downList += "<span class='list'><a href='"+list[index].url+"'>" + list[index].name + "</a><\/span>";
            }
            else
            {
                downList += "<span class='list'><a href='"+list[index].url+"'>" + list[index].name+"<span class='enterChexi'>进入车系»</span>" + "</a><\/span>";
            }
        }
        downList+="<\/div>";
        var top=$(".search").offset().top+$(".search").height();
        var width = $(".search").offset().left;

        $(".realTimeDown").remove();
        var element = $(downList).css(
            {
                top:top+2,
                left:left,
                width:$(".search .search-text").width()+20,
                position:"absolute"
            }
        );

        $("body").append(element);
    }

    var init = function ($element, option,downHeight) {
        downWidth = $element.width();
        maxDownHeight = downHeight;
        top = $element.offset().top + $element.height();
        left = $element.offset().left;

        ajaxOption.url = option.url;
        ajaxOption.data = option.data || {};
        ajaxOption.dataType = option.dataType;
        ajaxOption.type = option.type;

        afterShow = option.success;

        var manager = Souche.AjaxManager.init({
            aborted:true,
            delayTime:500,
            predicate:function()
            {
                return  this.url.substr(0, this.url.indexOf("?"));
            }
        });

        $element.find("input").keyup(function (e) {
            if(e.keyCode == 40) {
                var num = $(".realTimeDown .hover").index();
                var index = (num+1)%$(".realTimeDown .list").length;

                $(".realTimeDown .hover").removeClass("hover");
                $(".realTimeDown .list").eq(index).addClass("hover");
                return ;
            }
            if(e.keyCode == 38) {
                var num = $(".realTimeDown .hover").index();
                var index = (num-1)%$(".realTimeDown .list").length;

                $(".realTimeDown .hover").removeClass("hover");
                $(".realTimeDown .list").eq(index).addClass("hover");
                return ;
            }

            var hasParam =!!(ajaxOption.url.indexOf("?")+1);
            if($(this).val()) {
                ajaxOption.url = ajaxOption.url.substr(0, hasParam ? (ajaxOption.url.indexOf("?")) : ajaxOption.url.length) + "?words=" + $(this).val();
                //Souche.DelayAjax.addAjax(ajaxOption, callback, 300, true, true);
                manager.addAjax(
                    ajaxOption,callback
                );
            }
            else {
                $(".realTimeDown").remove();
            }
        });

        $element.find("input").focus(function () {
            var hasParam =!!(ajaxOption.url.indexOf("?")+1);
            if($(this).val()) {
                ajaxOption.url = ajaxOption.url.substr(0, hasParam ? (ajaxOption.url.indexOf("?")) : ajaxOption.url.length) + "?words=" + $(this).val();
                //Souche.DelayAjax.addAjax(ajaxOption, callback, 300, true, true);
                manager.addAjax(
                    ajaxOption,callback
                );
            }
            else {
                $(".realTimeDown").remove();
            }
        });

        $(".realTimeDown .list").live("mouseenter",function()
        {
            $(".realTimeDown .hover").removeClass("hover");
            $(this).addClass("hover");
        });

        $(".realTimeDown .list").live("mouseleave",function()
        {
           // console.log(2);
            $(this).removeClass("hover");
        });

       $("body").click(function()
       {
           $(".realTimeDown").remove();
       });

    }
    down.init = init;
    return  down;
});