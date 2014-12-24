define(['lib/mustache'],function(Mustache){
    var config = {
        brandHistoryUrl: contextPath + '/pages/carHistroyAction/getCarHistory.json'
    };

    var _view = {
        init: function(){

        },
        showBrandHistoryTab: function(){
            $('.onsale-tab-item-brand.hidden').removeClass('hidden');
        },
        buildBrandHistory: function(historyData){
            var tmpl = $('#brand-story-tmpl').html();
            if(historyData.ages){
                for(var i=0, j=historyData.ages.length; i<j; i++ ){
                    var age = historyData.ages[i];
                    age.multiImg = ( age.imageNum > 1 );

                    age._index = i;
                }
            }
            var htmlStr = Mustache.render(tmpl, historyData);
            return htmlStr;
        }
    };

    var _data = {
        getBrandStory: function(callback){
            var param = {
                brand: config.brandCode,
                series: config.seriesCode
            };
            $.getJSON(config.brandHistoryUrl, param, callback);
        }
    };

    var brandNavPos = 0;
    var brandHeight = 0;
    var brandNavHeight = 0;

    var _event = {
        bind: function(){
            $(window).scroll(_event.brandNavFix);
        },
        brandNavFix: function(){
            brandNavPos = $(".brand-nav").offset().top;
            brandNavHeight = $(".brand-nav").height();
            brandHeight = $(".brand-wrapper").height();
            if ($(window).scrollTop() > brandNavPos + 40) {
                if ($(window).scrollTop() > brandNavPos + brandHeight - brandNavHeight - 150) {
                    $(".brand-list").css({
                        position: "absolute",
                        top: brandHeight - brandNavHeight - 100
                    })
                } else {
                    $(".brand-list").css({
                        position: "fixed",
                        top: 80
                    })
                }
            } else {
                $(".brand-list").css({
                    position: "relative",
                    top: 0
                })
            }
        }
    };


    function init(_config){
        $.extend(config, _config);

        _data.getBrandStory(function(data, status){
            if(status=='success' && data && data.hisotryDto){
                _view.showBrandHistoryTab();
                var htmlStr = _view.buildBrandHistory(data.hisotryDto);
                $('#onsale_brand .brand-wrapper').html(htmlStr);

                // 给浏览器一点构建dom树的时间
                setTimeout(function(){
                    _event.bind();
                }, 1000);
            }
        });
    }

    return {
        init: init
    }
});