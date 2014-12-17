/**
 * Created by Administrator on 2014/7/11.
 */
define(function() {
    var down = {};
    var ajaxOption = {};
    var afterShow = undefined;
    var downWidth;
    var maxDownHeight;
    var top, lef;

    var _bind = function() {

    }

    var activeInput ;
    var callback = function(result) {
        var list = []
        var len = result.items.length >= 10 ? 10 : result.items.length;

        if (len == 0) {
            $(".realIndexTimeDown").remove();
            return;
        }

        for (var index = 0; index < len; index++) {
            list.push(result.items[index]);
        }

        var downList = "<div class='realIndexTimeDown'>";
        for (var index = 0, len = list.length; index < len; index++) {
            var key = "carSeries";
            if (list[index].type == 0) {
                key = "carBrand"
            } else if (list[index].type == 2) {
                key = "country"
            } else if (list[index].type == 3) {
                key = "color"
            }
            list[index].url = contextPath + "/pages/onsale/sale_car_list.html" + "?" + key + "=" + list[index].code + "&pfrom=boxsearch&recommand=box";
            downList += "<span class='list'><a href='" + list[index].url + "'>" + list[index].name + "</a><\/span>";
        }

        downList += "<\/div>";
        $(".realIndexTimeDown").remove();
        var element = styleDownList( $(downList) );

        $("body").append(element);
    }

    function styleDownList($ele){
        var top = $(".search").offset().top + $(".search").height();
        var left = $(".search").offset().left;
        var width = $(".search").width()
        if(activeInput){
            var top = $(activeInput).offset().top + $(activeInput).parent().height();
            var left = $(activeInput).offset().left;
            var width = $(activeInput).width()
        }
        $ele.css({
            top: top-1,
            left: left,
            width: width +12,
            position: "absolute"
        });
        return $ele;
    }

    var init = function($element, option, downHeight, config) {
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
            aborted: true,
            delayTime: 150,
            predicate: function() {
                return this.url.substr(0, this.url.indexOf("?"));
            }
        });

        // 行为推荐 和 搜索热词
        // 推荐搜索 热门搜索 
        var hotQuery = {
            sendReq: function(){
                $.getJSON(option.url, {word: ''}, hotQuery.callback);
            },
            callback: function(data, status){
                if(status === 'success' && data && (data.history || data.hot) ){
                    // 'recommendTag' 'hotQuery'
                    var htmlStr = '';
                    // 推荐 和 热门 一共有10个
                    var itemAlreadHave = 0;
                    if( data.history ){
                        var recs = data.history;
                        var recLen = recs.length;
                        if(recLen > 0){
                            htmlStr += '<span class="list-title">推荐搜索</span>';
                            if( recLen + data.hot.length > 10 ){
                                recLen = (recLen>5)? 5 : recLen;
                            }
                            itemAlreadHave = recLen;
                            for(var i=0; i<recLen; i++){
                                var name = recs[i].name;
                                htmlStr += '<span class="list list-rec"><a href="'+contextPath+'/pages/onsale/sale_car_list.html?keyword='+name+'&pfrom=boxsearch&recommand=box">'+name+'</a></span>';
                            }
                        }
                    }
                    if( data.hot ){
                        var hots = data.hot;
                        var hotLen = hots.length;
                        if(hotLen > 0){
                            htmlStr += '<span class="list-title">热门搜索</span>';
                            if( hotLen + data.history.length > 10 ){
                                hotLen = (hotLen > itemAlreadHave)? (10-itemAlreadHave) : hotLen;
                            }
                            for(var i=0; i<hotLen; i++){
                                var name = hots[i].name;
                                htmlStr += '<span class="list list-hot"><a href="'+contextPath+'/pages/onsale/sale_car_list.html?keyword='+name+'&pfrom=boxsearch&recommand=box">'+name+'</a></span>';
                            }
                        }
                    }
                    if(!htmlStr == ''){
                        var downList = styleDownList( $('<div class="realIndexTimeDown">') );
                        downList.html(htmlStr);
                        $('.realIndexTimeDown').remove();
                        downList.addClass('empty-suggestion');
                        $(document.body).append(downList);
                    }
                }
            }
        };


        // 事件绑定
        $element.find("input").keyup(function(e) {
            activeInput = this;
            if (e.keyCode == 40) {
                var num = $(".realIndexTimeDown .list").index( $(".realIndexTimeDown .list.hover") );
                var index = (num + 1) % $(".realIndexTimeDown .list").length;

                $(".realIndexTimeDown .list.hover").removeClass("hover");
                $(".realIndexTimeDown .list").eq(index).addClass("hover");
                $(".search-text").val($(".realIndexTimeDown .list").eq(index).find("a").html())
                return;
            }
            if (e.keyCode == 38) {
                var num = $(".realIndexTimeDown .list").index( $(".realIndexTimeDown .list.hover") );
                var index = (num - 1) % $(".realIndexTimeDown .list").length;

                $(".realIndexTimeDown .list.hover").removeClass("hover");
                $(".realIndexTimeDown .list").eq(index).addClass("hover");
                $(".search-text").val($(".realIndexTimeDown .list").eq(index).find("a").html())
                return;
            }

            var hasParam = !!(ajaxOption.url.indexOf("?") + 1);
            // 搜索词不为空, 而且不是"空推荐"填充的内容
            // var downList = $('.realIndexTimeDown');
            // if ($(this).val() && downList.length>0 && !downList.hasClass('empty-suggestion') ) {
            if ($(this).val()) {
                ajaxOption.url = ajaxOption.url.substr(0, hasParam ? (ajaxOption.url.indexOf("?")) : ajaxOption.url.length) + "?words=" + $(this).val();
                //Souche.DelayAjax.addAjax(ajaxOption, callback, 300, true, true);
                manager.addAjax(
                    ajaxOption, callback
                );
            }
            // 每次keyup时 如果为空 发送"热门搜索"请求
            else {
                hotQuery.sendReq();
            }
        });

        $element.find("input").focus(function() {
            var hasParam = !!(ajaxOption.url.indexOf("?") + 1);
            // 搜索词不为空, 而且不是"空推荐"填充的内容
            // var downList = $('.realIndexTimeDown');
            // if ($(this).val() && downList.length>0 && !downList.hasClass('empty-suggestion') ) {
            if ($(this).val()) {
                ajaxOption.url = ajaxOption.url.substr(0, hasParam ? (ajaxOption.url.indexOf("?")) : ajaxOption.url.length) + "?words=" + $(this).val();
                //Souche.DelayAjax.addAjax(ajaxOption, callback, 300, true, true);
                manager.addAjax(
                    ajaxOption, callback
                );
            }
            // 每次focus时 如果为空 发送"热门搜索"请求
            else {
                hotQuery.sendReq();
            }
        });

        $(".realIndexTimeDown .list").live("mouseenter", function() {
            $(".realIndexTimeDown .hover").removeClass("hover");
            $(this).addClass("hover");
        });

        $(".realIndexTimeDown .list").live("mouseleave", function() {
            // console.log(2);
            $(this).removeClass("hover");
        });

        $("body").click(function() {
            $(".realIndexTimeDown").remove();
        });

    }
    down.init = init;
    return down;
});